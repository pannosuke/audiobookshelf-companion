# Contributing to AudioBookShelf Companion

Thank you for your interest in contributing to AudioBookShelf Companion! This guide will help you get started.

## 🤝 Ways to Contribute

- 🐛 **Report Bugs**: Found something broken? Let us know!
- ✨ **Suggest Features**: Have an idea for improvement? Share it!
- 📝 **Improve Documentation**: Help make our docs clearer
- 💻 **Submit Code**: Fix bugs or implement new features
- 🧪 **Test**: Help us test new features and releases

## 🚀 Getting Started

### 1. Fork & Clone
```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/audiobookshelf-companion.git
cd audiobookshelf-companion
```

### 2. Set Up Development Environment
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit with your settings
vim .env.local
```

### 3. Start Development Server
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:backend  # Port 8081
npm run dev:frontend # Port 8080
```

## 📋 Development Workflow

### Branch Naming Convention
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
type(scope): description

feat(api): add Goodreads integration
fix(ui): resolve rating display issue
docs(readme): update installation instructions
```

### Pull Request Process
1. Create feature branch from `main`
2. Make your changes
3. Add tests if applicable
4. Update documentation
5. Submit PR with clear description
6. Address review feedback

## 🐛 Bug Reports

When reporting bugs, please include:

**Environment:**
- OS and version
- Docker version
- AudioBookShelf version
- Browser (if UI issue)

**Steps to Reproduce:**
1. Step one
2. Step two
3. See error

**Expected vs Actual Behavior:**
- What you expected to happen
- What actually happened

**Additional Context:**
- Screenshots if helpful
- Error logs
- Any workarounds you found

Use our [Bug Report Template](https://github.com/pannosuke/audiobookshelf-companion/issues/new?template=bug_report.md).

## ✨ Feature Requests

For feature requests, please provide:

**Problem Description:**
What problem does this solve?

**Proposed Solution:**
How should this work?

**Alternatives Considered:**
What other approaches did you consider?

**Additional Context:**
- Mockups or examples
- Similar features in other apps
- How this fits the project goals

Use our [Feature Request Template](https://github.com/pannosuke/audiobookshelf-companion/issues/new?template=feature_request.md).

## 💻 Code Standards

### TypeScript/JavaScript
- Use TypeScript for new code
- Follow ESLint configuration
- Use Prettier for formatting
- Add JSDoc comments for public APIs

### React Components
- Use functional components with hooks
- Implement proper error boundaries
- Follow accessibility guidelines
- Use meaningful component names

### API Design
- RESTful endpoints where appropriate
- Consistent error handling
- Proper HTTP status codes
- Comprehensive OpenAPI documentation

### Database
- Use migrations for schema changes
- Include rollback scripts
- Document complex queries
- Follow naming conventions

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- user.test.js

# Watch mode for development
npm run test:watch
```

### Writing Tests
- Unit tests for utilities and services
- Integration tests for API endpoints
- Component tests for React components
- End-to-end tests for critical user flows

### Test Structure
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something specific', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

## 📚 Documentation

### Code Documentation
- Comment complex logic
- Document API endpoints
- Include usage examples
- Keep README updated

### User Documentation
- Installation instructions
- Configuration guides
- Troubleshooting tips
- Feature explanations

## 🎯 Project Goals

Keep these goals in mind when contributing:

1. **Complement, Don't Replace**: Enhance AudioBookShelf, don't duplicate
2. **User-Friendly**: Non-technical users should find it easy to use
3. **Privacy-First**: Personal data stays local
4. **Performance**: Fast and responsive
5. **Reliability**: Stable and well-tested

## 📞 Getting Help

- 💬 [GitHub Discussions](https://github.com/pannosuke/audiobookshelf-companion/discussions)
- 🐛 [GitHub Issues](https://github.com/pannosuke/audiobookshelf-companion/issues)
- 📧 Email: [your-email] (for sensitive matters)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes for significant contributions
- Optional contributors page in the app

---

**Thank you for helping make AudioBookShelf Companion better!** 🎉