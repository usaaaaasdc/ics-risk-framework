# Contributing to ICS-Risk Framework

Thank you for considering contributing to ICS-Risk! This document provides guidelines for contributing to the project.

## Code of Conduct

Be respectful, professional, and inclusive in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. Include detailed steps to reproduce
3. Provide system information (browser, OS)
4. Include screenshots if applicable

### Suggesting Features

1. Check existing feature requests
2. Explain the use case clearly
3. Describe how it would benefit users
4. Consider the academic/research context

### Submitting Code

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Follow the code style (TypeScript, React best practices)
4. Add multi-language support for new features
5. Test thoroughly
6. Commit with clear messages: `git commit -m "Add: feature description"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/ics-risk-framework.git

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Code Style

- Use TypeScript for type safety
- Follow React hooks best practices
- Use functional components
- Keep components small and focused
- Add comments for complex logic
- Include copyright header in new files

## Multi-Language Support

All user-facing text must be translatable:

```typescript
// Good
<h1>{t.title}</h1>

// Bad
<h1>Security Assessment</h1>
```

Add translations to `lib/i18n/translations.ts` for all three languages (Arabic, English, German).

## Testing

- Test on Chrome, Firefox, and Safari
- Test RTL (Arabic) and LTR (English, German) layouts
- Verify offline functionality
- Check responsive design on mobile

## Vulnerability Database

When adding CVEs:

1. Use official sources (NVD, ICS-CERT)
2. Include proper citations
3. Add translations for all languages
4. Follow the existing JSON structure

## Documentation

- Update README.md for new features
- Add JSDoc comments to functions
- Update user guide if needed
- Include examples for complex features

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Open an issue or reach out to the maintainer.

---

**Thank you for contributing to industrial cybersecurity!**
