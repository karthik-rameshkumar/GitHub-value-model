# GitHub Engineering System Success Playbook (ESSP) Dashboard

A comprehensive dashboard application that aligns with GitHub's Engineering System Success Playbook, providing insights and metrics to help engineering teams measure and improve their development practices.

## Overview

The ESSP Dashboard is a modern web application built with React, TypeScript, and D3.js on the frontend, powered by a Node.js backend with PostgreSQL database. It provides visualization and analytics for engineering metrics defined in GitHub's Engineering System Success Playbook.

## Features

- **Engineering Metrics Visualization**: Interactive dashboards displaying key engineering metrics
- **Team Performance Analytics**: Track team velocity, quality, and delivery metrics
- **Historical Trend Analysis**: Compare performance over time periods
- **Customizable Dashboards**: Configure views based on team needs
- **Real-time Data Updates**: Live updates of engineering metrics

## Tech Stack

### Frontend
- React 18+ with TypeScript
- D3.js for data visualization
- Material-UI for component library
- Redux Toolkit for state management

### Backend
- Node.js 18+ with Express
- TypeScript for type safety
- PostgreSQL 14+ for data persistence
- Redis 7+ for caching
- Jest for testing

### Infrastructure
- Docker and Docker Compose for local development
- GitHub Actions for CI/CD
- ESLint and Prettier for code quality

## Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Git

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/karthik-rameshkumar/GitHub-value-model.git
cd GitHub-value-model
```

2. Start the development environment:
```bash
docker compose up -d
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
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

5. Open your browser to `http://localhost:3000`

## Project Structure

```
essp-dashboard/
├── frontend/          # React + TypeScript + D3.js
├── backend/           # Node.js + Express + TypeScript
├── database/          # PostgreSQL schemas and migrations
├── docs/              # Documentation
├── docker/            # Docker configurations
├── scripts/           # Utility scripts
└── tests/             # Integration and E2E tests
```

## Documentation

- [Architecture Guide](docs/architecture.md)
- [API Specification](docs/api-specification.md)
- [Deployment Guide](docs/deployment-guide.md)
- [Contributing Guidelines](CONTRIBUTING.md)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Health Check

The application provides health check endpoints:
- Backend: `http://localhost:3001/health`
- Database: `http://localhost:3001/health/db`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or support, please open an issue in this repository.
