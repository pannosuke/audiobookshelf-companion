const fs = require('fs').promises;
const path = require('path');
const db = require('../database/connection');
const logger = require('../utils/logger');

class LibraryScanner {
  constructor() {
    this.libraryPath = process.env.AUDIOBOOKSHELF_LIBRARY_PATH || '/audiobooks';
    this.isScanning = false;
    this.currentScanId = null;
  }

  /**
   * Start a full library scan
   */
  async scanLibrary(scanType = 'manual') {
    if (this.isScanning) {
      throw new Error('Library scan already in progress');
    }

    logger.info('Starting library scan', { scanType });
    
    // Create scan record
    const [scanId] = await db('scan_history').insert({
      scan_type: scanType,
      status: 'running',
      started_at: new Date()
    });

    this.isScanning = true;
    this.currentScanId = scanId;

    try {
      const results = await this._performScan();
      
      // Update scan record with results
      await db('scan_history').where({ id: scanId }).update({
        status: 'completed',
        completed_at: new Date(),
        books_found: results.booksFound,
        books_added: results.booksAdded,
        books_updated: results.booksUpdated,
        books_removed: results.booksRemoved,
        scan_results: JSON.stringify(results)
      });

      logger.info('Library scan completed', results);
      return results;

    } catch (error) {
      // Update scan record with error
      await db('scan_history').where({ id: scanId }).update({
        status: 'failed',
        completed_at: new Date(),
        error_message: error.message
      });

      logger.error('Library scan failed', error);
      throw error;

    } finally {
      this.isScanning = false;
      this.currentScanId = null;
    }
  }

  /**
   * Check if library exists and is accessible
   */
  async validateLibraryPath() {
    try {
      const stats = await fs.stat(this.libraryPath);
      if (!stats.isDirectory()) {
        throw new Error('Library path is not a directory');
      }
      return true;
    } catch (error) {
      logger.error('Library path validation failed', { path: this.libraryPath, error: error.message });
      return false;
    }
  }

  /**
   * Perform the actual scanning
   */
  async _performScan() {
    const results = {
      booksFound: 0,
      booksAdded: 0,
      booksUpdated: 0,
      booksRemoved: 0,
      errors: []
    };

    try {
      // Read all author directories
      const authorDirs = await this._getDirectories(this.libraryPath);
      
      for (const authorDir of authorDirs) {
        const authorPath = path.join(this.libraryPath, authorDir);
        
        try {
          // Skip hidden directories and system files
          if (authorDir.startsWith('.') || authorDir.startsWith('_')) {
            continue;
          }

          logger.debug(`Scanning author: ${authorDir}`);
          
          // Get all book directories for this author
          const bookDirs = await this._getDirectories(authorPath);
          
          for (const bookDir of bookDirs) {
            if (bookDir.startsWith('.') || bookDir.startsWith('_')) {
              continue;
            }

            const bookPath = path.join(authorPath, bookDir);
            
            try {
              const bookData = await this._scanBookDirectory(bookPath, authorDir, bookDir);
              if (bookData) {
                results.booksFound++;
                
                const existingBook = await this._findExistingBook(bookData);
                if (existingBook) {
                  await this._updateBook(existingBook.id, bookData);
                  results.booksUpdated++;
                } else {
                  await this._addNewBook(bookData);
                  results.booksAdded++;
                }
              }
            } catch (bookError) {
              logger.warn(`Failed to scan book: ${bookPath}`, bookError);
              results.errors.push({
                path: bookPath,
                error: bookError.message
              });
            }
          }
          
        } catch (authorError) {
          logger.warn(`Failed to scan author: ${authorPath}`, authorError);
          results.errors.push({
            path: authorPath,
            error: authorError.message
          });
        }
      }

      return results;

    } catch (error) {
      logger.error('Library scan failed', error);
      throw error;
    }
  }

  /**
   * Scan a single book directory for metadata
   */
  async _scanBookDirectory(bookPath, authorName, bookDirName) {
    const files = await fs.readdir(bookPath);
    
    // Look for metadata.json file (AudioBookShelf standard)
    const metadataFile = files.find(file => file === 'metadata.json');
    let metadata = {};
    
    if (metadataFile) {
      try {
        const metadataContent = await fs.readFile(path.join(bookPath, metadataFile), 'utf8');
        metadata = JSON.parse(metadataContent);
      } catch (error) {
        logger.warn(`Failed to parse metadata.json in ${bookPath}`, error);
      }
    }

    // Look for audio files
    const audioFiles = files.filter(file => 
      /\.(m4b|mp3|m4a|aac|ogg|flac)$/i.test(file)
    );

    // Look for cover image
    const coverFiles = files.filter(file => 
      /^(cover|folder)\.(jpg|jpeg|png|webp)$/i.test(file) || file === 'cover.jpg'
    );

    // Look for ebook files
    const ebookFiles = files.filter(file => 
      /\.(epub|pdf|mobi|azw3)$/i.test(file)
    );

    if (audioFiles.length === 0) {
      logger.debug(`No audio files found in ${bookPath}`);
      return null;
    }

    // Build book data
    const bookData = {
      audiobookshelf_id: this._generateBookId(bookPath),
      title: metadata.title || bookDirName,
      subtitle: metadata.subtitle || null,
      author_name: metadata.author || authorName,
      description: metadata.description || metadata.summary || null,
      isbn: metadata.isbn || null,
      asin: metadata.asin || null,
      language: metadata.language || 'en',
      publisher: metadata.publisher || null,
      published_date: metadata.publishedYear ? new Date(`${metadata.publishedYear}-01-01`) : null,
      duration_seconds: metadata.duration || 0,
      format: this._detectFormat(audioFiles),
      cover_image_path: coverFiles.length > 0 ? path.join(bookPath, coverFiles[0]) : null,
      file_path: bookPath,
      series_name: metadata.series || null,
      series_sequence: metadata.sequence || null,
      is_series: !!(metadata.series),
      genres: metadata.genres || [],
      last_scanned: new Date()
    };

    return bookData;
  }

  /**
   * Get directories in a path
   */
  async _getDirectories(dirPath) {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    return items
      .filter(item => item.isDirectory())
      .map(item => item.name);
  }

  /**
   * Generate a unique ID for a book based on its path
   */
  _generateBookId(bookPath) {
    // Use relative path from library root as ID
    const relativePath = path.relative(this.libraryPath, bookPath);
    return Buffer.from(relativePath).toString('base64');
  }

  /**
   * Detect audio format from files
   */
  _detectFormat(audioFiles) {
    if (audioFiles.some(file => file.endsWith('.m4b'))) return 'm4b';
    if (audioFiles.some(file => file.endsWith('.mp3'))) return 'mp3';
    if (audioFiles.some(file => file.endsWith('.m4a'))) return 'm4a';
    if (audioFiles.some(file => file.endsWith('.flac'))) return 'flac';
    return 'unknown';
  }

  /**
   * Find existing book by ID or path
   */
  async _findExistingBook(bookData) {
    return await db('books')
      .where({ audiobookshelf_id: bookData.audiobookshelf_id })
      .first();
  }

  /**
   * Add new book to database
   */
  async _addNewBook(bookData) {
    const trx = await db.transaction();
    
    try {
      // Find or create author
      let author = await trx('authors').where({ name: bookData.author_name }).first();
      if (!author) {
        const [authorId] = await trx('authors').insert({
          name: bookData.author_name
        });
        author = { id: authorId };
      }

      // Insert book
      const bookInsert = { ...bookData };
      delete bookInsert.author_name;
      delete bookInsert.genres;
      bookInsert.author_id = author.id;

      const [bookId] = await trx('books').insert(bookInsert);

      // Handle genres
      if (bookData.genres && bookData.genres.length > 0) {
        for (const genreName of bookData.genres) {
          let genre = await trx('genres').where({ name: genreName }).first();
          if (!genre) {
            const [genreId] = await trx('genres').insert({ name: genreName });
            genre = { id: genreId };
          }

          await trx('book_genres').insert({
            book_id: bookId,
            genre_id: genre.id
          });
        }
      }

      await trx.commit();
      logger.debug(`Added new book: ${bookData.title} by ${bookData.author_name}`);
      
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  /**
   * Update existing book
   */
  async _updateBook(bookId, bookData) {
    const updateData = { ...bookData };
    delete updateData.author_name;
    delete updateData.genres;
    
    await db('books').where({ id: bookId }).update(updateData);
    logger.debug(`Updated book: ${bookData.title}`);
  }

  /**
   * Get scan status
   */
  getScanStatus() {
    return {
      isScanning: this.isScanning,
      currentScanId: this.currentScanId
    };
  }
}

module.exports = new LibraryScanner();