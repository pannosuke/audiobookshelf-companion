# AudioBookShelf Companion - Deployment Guide

## Quick Start

1. **Clone and configure:**
```bash
git clone https://github.com/pannosuke/audiobookshelf-companion.git
cd audiobookshelf-companion
cp .env.example .env
```

2. **Edit `.env` file:**
```bash
# REQUIRED: Path to your AudioBookShelf library
AUDIOBOOKSHELF_LIBRARY_PATH=/path/to/your/audiobookshelf/library

# OPTIONAL: API keys for enhanced features
GOODREADS_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

3. **Run with Docker:**
```bash
docker-compose up -d
```

4. **Access the app:**
- Production: http://localhost:8082
- Development frontend: http://localhost:8080
- Development backend: http://localhost:8081

## Development Mode

```bash
# Run both frontend and backend in development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Or run individually:
cd backend && npm install && npm run dev
cd frontend && npm install && npm start
```

## Production Deployment

### Option 1: Docker Compose (Recommended)
```bash
docker-compose up -d audiobookshelf-companion
```

### Option 2: Single Container
```bash
docker build -t audiobookshelf-companion .
docker run -d \
  -p 8082:8082 \
  -v "/path/to/your/audiobookshelf/library:/audiobooks:ro" \
  -v "./data:/data" \
  --name audiobookshelf-companion \
  audiobookshelf-companion
```

## Integration with AudioBookShelf

Add this to your existing AudioBookShelf docker-compose.yml:

```yaml
services:
  audiobookshelf:
    # Your existing AudioBookShelf config
    ...

  audiobookshelf-companion:
    image: audiobookshelf-companion:latest
    ports:
      - "8082:8082"
    volumes:
      - "${AUDIOBOOKSHELF_LIBRARY_PATH}:/audiobooks:ro"
      - "./companion-data:/data"
    environment:
      - AUDIOBOOKSHELF_LIBRARY_PATH=/audiobooks
    depends_on:
      - audiobookshelf
    restart: unless-stopped
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `AUDIOBOOKSHELF_LIBRARY_PATH` | Required | Path to AudioBookShelf library |
| `PRODUCTION_PORT` | 8082 | Port for production server |
| `GOODREADS_API_KEY` | Optional | For book ratings/metadata |
| `OPENAI_API_KEY` | Optional | For AI recommendations |
| `DATABASE_PATH` | /data/companion.db | SQLite database location |
| `LOG_LEVEL` | info | Logging level |

### Data Persistence

The following directories should be mounted as volumes:
- `/data` - Database and logs
- `/audiobooks` - Your AudioBookShelf library (read-only)

## Troubleshooting

### Library Not Found
- Verify `AUDIOBOOKSHELF_LIBRARY_PATH` points to correct directory
- Ensure directory is accessible from container
- Check file permissions

### Permission Issues
```bash
# Fix data directory permissions
sudo chown -R 1001:1001 ./data
```

### View Logs
```bash
# Docker Compose
docker-compose logs audiobookshelf-companion

# Docker
docker logs audiobookshelf-companion
```

## Health Checks

- Health endpoint: `http://localhost:8082/health`
- API documentation: `http://localhost:8082/api`

## Updating

```bash
git pull origin main
docker-compose pull
docker-compose up -d
```