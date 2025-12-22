# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in ICS-Risk Framework, please report it responsibly:

**DO NOT** open a public issue for security vulnerabilities.

Instead, please contact:
- **Email**: [Create a private security advisory on GitHub]
- **GitHub**: Use the "Security" tab to report privately

## What to Include

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

## Response Time

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity

## Security Considerations

### Data Privacy

ICS-Risk operates 100% offline:
- No data is sent to external servers
- All processing happens in the browser
- localStorage is used for local persistence only

### Vulnerability Database

The vulnerability database is:
- Compiled from public sources (NVD, ICS-CERT)
- Used for educational and research purposes only
- Not real-time (updated manually)
- Not a substitute for professional security audits

### Limitations

ICS-Risk is a **research and educational tool**:
- Not certified for critical infrastructure
- Should not replace professional security assessments
- Vulnerability data may be incomplete or outdated
- Risk scores are estimates, not guarantees

## Best Practices for Users

1. **Verify Results**: Cross-reference with official sources
2. **Update Regularly**: Check for new releases
3. **Professional Assessment**: Use alongside professional audits
4. **Data Sensitivity**: Even though offline, treat assessment data as confidential
5. **Network Isolation**: Run on air-gapped systems for sensitive assessments

## Disclosure Policy

When a vulnerability is fixed:
1. Security advisory published on GitHub
2. CVE requested if applicable
3. Credit given to reporter (if desired)
4. Release notes include security fixes

## Dependencies

We actively monitor security advisories for:
- Next.js
- React
- TypeScript
- All npm packages

Run `npm audit` regularly to check for vulnerabilities.

---

**Security is a shared responsibility. Thank you for helping keep ICS-Risk secure!**
