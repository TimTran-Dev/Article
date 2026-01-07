# Front-End App

An Angular 21 front-end application using **pnpm**, **Vitest**, **ESLint**, **Prettier**, and **Husky**. This project enforces consistent code style, automated testing, code coverage, and version control.

![CI](https://github.com/TimTran-Dev/Article/actions/workflows/build-and-test.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)

---

## Table of Contents:

- [Project Setup](#project-setup)
- [Available Scripts](#available-scripts)
- [Branching & PR Guidelines](#branching--pr-guidelines)
- [Versioning](#versioning)
- [Code Quality](#code-quality)
- [Testing](#testing)
- [Security](#security)
- [Contributing](#contributing)

---

## Project Setup:

Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd front-end-app
pnpm install
```

---

## Start development server:

```bash
pnpm start
```

## Build the application:

```bash
pnpm build
```

## Watch for development changes:

```bash
pnpm watch
```

---

## Branching & Pull Request Guidelines

To maintain a consistent workflow and ensure proper versioning, please follow these branching and PR rules:

### Branch Naming

- **Feature branches**:

Example: `feature/user-auth`

- **Hotfix branches**:

Example: `hotfix/login-bug`

- **Protected branches**:
- `main`
- `feature/*`
- `hotfix/*`

### Pull Request Requirements

1. PRs **must be created from a feature or hotfix branch**.
2. Each PR **must include a version bump** in `version.json` (or `package.json` if applicable).  
   Use the script:

```bash
pnpm increment-version {major|minor|patch}
```
