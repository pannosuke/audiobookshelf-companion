# AudioBookShelf Companion 📚

A companion web application for AudioBookShelf that adds personal ratings, AI-powered recommendations, and enhanced book discovery features.

## Features

- 🌟 **Personal Ratings**: Rate your books with 5-star system and personal notes
- 🤖 **AI Recommendations**: Get personalized book suggestions based on your reading history
- 📊 **Goodreads Integration**: Automatic community ratings and book metadata
- 🔍 **Smart Discovery**: Find your next read from your library or discover new books
- 📱 **Modern Interface**: Clean, responsive web interface
- 🐳 **Docker Ready**: Easy deployment alongside your AudioBookShelf setup

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Existing AudioBookShelf installation
- Goodreads API key (optional but recommended)

### Installation

1. Clone this repository:
```bash
git clone https://github.com/pannosuke/audiobookshelf-companion.git
cd audiobookshelf-companion
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Edit `.env` with your settings:
```bash
# Path to your AudioBookShelf library
AUDIOBOOKSHELF_LIBRARY_PATH=/path/to/your/audiobookshelf/library

# Optional: Goodreads API key
GOODREADS_API_KEY=your_api_key_here

# Optional: OpenAI API key for AI recommendations
OPENAI_API_KEY=your_openai_key_here
```

4. Start the application:
```bash
docker-compose up -d
```

5. Open your browser to `http://localhost:8082`

## Architecture

- **Backend**: Node.js/Express API server (Port 8081)
- **Frontend**: React application (Port 8080)
- **Database**: SQLite for personal ratings and app data
- **External APIs**: Goodreads for ratings, OpenAI for recommendations

## Development

See [DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed development setup instructions.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features and current development status.

## Support

- 🐛 [Report a Bug](https://github.com/pannosuke/audiobookshelf-companion/issues/new?template=bug_report.md)
- ✨ [Request a Feature](https://github.com/pannosuke/audiobookshelf-companion/issues/new?template=feature_request.md)
- 💬 [Join Discussions](https://github.com/pannosuke/audiobookshelf-companion/discussions)

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- [AudioBookShelf](https://github.com/advplyr/audiobookshelf) - The amazing audiobook server this project complements
- [Goodreads](https://www.goodreads.com/) - Book ratings and metadata
- [OpenAI](https://openai.com/) - AI-powered recommendations