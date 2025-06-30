# Contributing to ESSP Dashboard

We love your input! We want to make contributing to the GitHub Engineering System Success Playbook Dashboard as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Setup

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### Local Development

1. Clone your fork of the repository:
```bash
git clone https://github.com/YOUR_USERNAME/GitHub-value-model.git
cd GitHub-value-model
```

2. Start the development environment:
```bash
docker-compose up -d
```

3. Install dependencies:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

4. Start the development servers:
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm start
```

## Code Style

We use ESLint and Prettier to maintain consistent code style:

- ESLint for code quality and error prevention
- Prettier for code formatting
- TypeScript for type safety

Run the linter before committing:
```bash
npm run lint
npm run format
```

## Testing

We use Jest for unit testing and Cypress for end-to-end testing:

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## Documentation

- Update documentation for any new features or API changes
- Use JSDoc comments for functions and components
- Keep README.md up to date

## Git Workflow

### Branch Naming

- `feature/feature-name` for new features
- `bugfix/bug-description` for bug fixes
- `hotfix/critical-fix` for critical fixes
- `docs/documentation-update` for documentation updates

### Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(dashboard): add metric visualization component
fix(api): resolve database connection timeout
docs(readme): update installation instructions
```

## Issue Reporting

When filing an issue, make sure to answer these questions:

1. What version of the application are you using?
2. What operating system and processor architecture are you using?
3. What did you do?
4. What did you expect to see?
5. What did you see instead?

Use the issue templates provided in the repository.

## Feature Requests

Feature requests are welcome! Please provide:

1. A clear and descriptive title
2. A detailed description of the proposed feature
3. Use cases for the feature
4. Any alternative solutions you've considered

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Don't hesitate to ask! You can:

- Open an issue with the `question` label
- Reach out to the maintainers
- Join our discussions

Thank you for contributing! 🎉