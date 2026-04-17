# Front-End App

Angular 21 news and content management platform with article discovery, bookmarking, episode streaming, and user authentication.

[![Build and Test](https://github.com/TimTran-Dev/Article/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/TimTran-Dev/Article/actions/workflows/ci.yml)
![Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)

## What It Does

📰 Article discovery, search & filtering • ❤️ Bookmarking & library • 🔐 Clerk authentication • 📺 Episodes & segments • 🎨 Theme management • ♿ Accessible

## Tech Stack

Angular 21 • TypeScript 5.9 (strict) • Vite • Vitest (85% coverage) • Tailwind CSS • Clerk • ESLint + Prettier

## Build & Development

**Requirements:** Node.js 20+ & pnpm 10+

```bash
pnpm install           # Install dependencies
pnpm start             # Dev server (http://localhost:4200)
pnpm test -- --run     # Run tests
pnpm build             # Production build
```

**Code quality checks:**

```bash
pnpm lint && pnpm format:check && pnpm test -- --run
```

## Contributing

**Branch names:** `feature/X`, `hotfix/X`

**Pull Request Process:**

1. Fork and create branch from `main`
2. Make changes with tests
3. Run: `pnpm lint && pnpm format:check && pnpm test -- --run && pnpm build`
4. Bump version: `pnpm increment-version {patch|minor|major}`
5. Open PR (1 approval required)

## License

MIT - see [LICENSE](LICENSE)

---

Version: [version.json](version.json)

## Testing

- **Framework:** Vitest 4.0 with jsdom
- **Coverage:** 85% minimum required
- **Mocks:** Factory functions in `src/app/Mocks/`

Run tests with: `pnpm test -- --run` or `pnpm test` (watch mode)

**Best Practices:**

1. Use mocks from `src/app/Mocks/` for services
2. Test components and services independently
3. Use Arrange-Act-Assert structure
4. Write descriptive test names
5. Proper TestBed setup and cleanup
