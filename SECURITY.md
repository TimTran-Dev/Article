# Security Policy

This document outlines security best practices, known issues, and procedures for the Front-End App project.

## Table of Contents

1. [Security Standards](#security-standards)
2. [Known Issues & Remediation](#known-issues--remediation)
3. [Secrets Management](#secrets-management)
4. [Dependency Security](#dependency-security)
5. [Code Security](#code-security)
6. [Data Protection](#data-protection)
7. [Authentication & Authorization](#authentication--authorization)
8. [Incident Reporting](#incident-reporting)
9. [Security Checklist](#security-checklist)

---

## Security Standards

This project follows:
- **OWASP Top 10** vulnerability prevention
- **NIST Cybersecurity Framework** best practices
- **CWE (Common Weakness Enumeration)** mitigation
- **PCI DSS** compliance for payment handling (if applicable)

### Responsibility

- **Developers:** Write secure code, follow standards
- **Code Reviewers:** Validate security in PRs
- **Team Lead:** Overall security oversight
- **DevOps/Security:** Infrastructure and secrets management

---

## Known Issues & Remediation

### 🔴 HIGH PRIORITY

#### Issue #1: Exposed Test Clerk Authentication Key

**Status:** ⚠️ REQUIRES IMMEDIATE ACTION

**Severity:** HIGH (Critical)  
**Affected Files:**
- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

**Problem:**
```typescript
// ❌ INSECURE: Test Clerk key is hardcoded and committed to git
export const environment = {
  clerkKey: 'pk_test_Ym9zcy1jaG93LTI0...'
};
```

**Risk:**
- Test account can be accessed by anyone with repo access
- Rate limiting can be bypassed
- User sessions can be hijacked
- Clerk usage can be abused

**Required Actions:**

1. **Immediate (TODAY):**
   ```bash
   # Rotate the test Clerk key in Clerk dashboard
   # Regenerate a new test key
   ```

2. **Update environment files:**
   ```typescript
   // ✅ SECURE: Use environment variables
   import { environment as env } from '../environment';
   
   export const environment = {
     production: false,
     apiUrl: getEnvVariable('API_URL', 'https://localhost:44345/api'),
     clerkKey: getEnvVariable('CLERK_PUBLISHABLE_KEY', ''),
   };
   
   function getEnvVariable(key: string, defaultValue: string = ''): string {
     return (window as any).__ENV__?.[key] ?? defaultValue;
   }
   ```

3. **For different environments:**

   **Development:** Create `.env.local` (git-ignored)
   ```
   CLERK_PUBLISHABLE_KEY=pk_test_YOUR_NEW_TEST_KEY
   API_URL=https://localhost:44345/api
   ```

   **Production:** Configure in deployment platform
   - Vercel: Environment variables in dashboard
   - Render: Secrets in environment variables
   - Docker: Use `--env-file` or secrets

4. **Update `.gitignore`:**
   ```
   # Environment files with secrets
   .env.local
   .env.*.local
   .env.development
   .env.production
   ```

5. **Rotate credentials:**
   ```bash
   # Clerk test key rotation
   # 1. Go to https://dashboard.clerk.com
   # 2. Select your application
   # 3. Navigate to "API Keys"
   # 4. Rotate the test publishable key
   # 5. Update all developer environments
   # 6. Commit the change (WITHOUT exposing the key)
   ```

6. **Verify in CI/CD:**
   ```yaml
   # Example GitHub Actions
   - name: Build
     env:
       CLERK_PUBLISHABLE_KEY: ${{ secrets.CLERK_PUBLISHABLE_KEY }}
       API_URL: ${{ secrets.API_URL }}
     run: pnpm build
   ```

**Deadline:** 48 hours

---

#### Issue #2: Hard-coded API URLs

**Status:** ⚠️ SHOULD BE REFACTORED

**Severity:** MEDIUM

**Affected Files:**
- `src/environments/environment.ts` - localhost API
- `src/environments/environment.prod.ts` - production API

**Problem:**
```typescript
// ❌ INFLEXIBLE: URLs are hard-coded per environment
export const environment = {
  apiUrl: 'https://localhost:44345/api'  // For dev
};

export const environment = {
  apiUrl: 'https://newsappapi-a8vf.onrender.com/api'  // For prod
};
```

**Risk:**
- Difficult to deploy to different environments
- Difficult to test against different API versions
- No flexibility for staging/QA environments
- Risk of deploying with wrong API endpoint

**Solution:**
```typescript
// ✅ FLEXIBLE: Use environment variables
export const environment = {
  production: false,
  apiUrl: getEnvVariable(
    'API_URL',
    'https://localhost:44345/api'
  )
};

function getEnvVariable(key: string, defaultValue: string): string {
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    return (window as any).__ENV__[key] ?? defaultValue;
  }
  return defaultValue;
}
```

**Deployment Examples:**

Vercel:
```yaml
# vercel.json
{
  "buildCommand": "pnpm build",
  "env": {
    "API_URL": "@api_url"
  },
  "envObjects": [
    {
      "key": "api_url",
      "value": "https://api.example.com",
      "target": ["production", "preview"]
    }
  ]
}
```

Render:
```yaml
# render.yaml
services:
  - type: web
    name: front-end-app
    envVars:
      - key: API_URL
        scope: run
```

**Deadline:** 2 weeks

---

### 🟠 MEDIUM PRIORITY

#### Issue #3: Excessive Dependency Security Overrides

**Status:** ⚠️ ONGOING MAINTENANCE

**Severity:** MEDIUM

**Problem:**
- 50+ security patch overrides in `pnpm` configuration
- Indicates transitive dependencies with vulnerabilities
- Creates ongoing maintenance burden
- Masks underlying dependency issues

**Examples:**
- `lodash` pinned to <= 4.17.23 (multiple CVEs)
- `tar` override for security patches
- `undici` version constraints for fixes
- `rollup`, `minimatch`, `yaml` patches

**Risk:**
- Unpatched vulnerabilities in transitive dependencies
- Supply chain attack vector
- Difficult to track what vulnerabilities are mitigated

**Action Items:**

1. **Audit current overrides:**
   ```bash
   pnpm audit
   pnpm audit --json | jq '.advisories'
   ```

2. **Review each override:**
   ```json
   {
     "overrides": {
       "lodash": ">=4.18.0",  // ← Why is this needed?
       "tar": "^6.2.1"         // ← Justification?
     }
   }
   ```

3. **Reduce overrides incrementally:**
   - Remove override
   - Run `pnpm audit`
   - If vulnerability found, document why override is needed
   - Only keep justified overrides

4. **Document overrides:**
   ```javascript
   // pnpm-lock.yaml comments or separate doc
   /**
    * SECURITY OVERRIDES JUSTIFICATION
    * 
    * lodash >= 4.18.0
    *   - Vulnerability: CVE-2021-23337
    *   - Affected: moment.js depends on vulnerable version
    *   - Why override: Can't upgrade moment.js yet
    *   - Review date: 2026-04-01
    */
   ```

5. **Transition plan:**
   - Remove 5 overrides per quarter
   - Upgrade dependencies that require removed overrides
   - Target: Reduce to 10 or fewer overrides

**Deadline:** Ongoing, review quarterly

---

#### Issue #4: No Input Validation

**Status:** ⚠️ REVIEW CODE

**Severity:** MEDIUM (XSS Risk)

**Problem:**
- No centralized input validation
- User input not sanitized before display
- API responses not validated against schema
- Form inputs lack format validation

**Risk:**
- Cross-Site Scripting (XSS) attacks
- SQL Injection (if user input passed to backend)
- Buffer overflow / Denial of Service

**Solution:**

1. **Create validation service:**
   ```typescript
   import { Injectable } from '@angular/core';
   
   @Injectable({ providedIn: 'root' })
   export class ValidationService {
     /**
      * Validates and sanitizes user input
      * @param input - Raw user input
      * @param type - Type of input (email, url, text, etc)
      * @returns Sanitized input or null if invalid
      */
     validateInput(input: string, type: 'email' | 'url' | 'text'): string | null {
       if (!input || typeof input !== 'string') return null;
       
       const trimmed = input.trim();
       
       switch (type) {
         case 'email':
           return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) 
             ? trimmed 
             : null;
         case 'url':
           try {
             new URL(trimmed);
             return trimmed;
           } catch {
             return null;
           }
         case 'text':
           return trimmed.length > 0 && trimmed.length <= 5000 
             ? trimmed 
             : null;
       }
     }
   }
   ```

2. **Use Angular sanitization:**
   ```typescript
   import { Component, inject } from '@angular/core';
   import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
   
   @Component({
     selector: 'app-article-display',
     template: `<div [innerHTML]="sanitizedHtml"></div>`
   })
   export class ArticleDisplayComponent {
     private readonly sanitizer = inject(DomSanitizer);
     
     htmlContent: string = '<script>alert("xss")</script><p>Safe content</p>';
     
     get sanitizedHtml(): SafeHtml {
       return this.sanitizer.sanitize(
         SecurityContext.HTML,
         this.htmlContent
       ) ?? '';
     }
   }
   ```

3. **Validate API responses:**
   ```typescript
   import { Injectable } from '@angular/core';
   
   @Injectable()
   export class ArticleService {
     private validateArticle(article: unknown): article is Article {
       if (typeof article !== 'object' || !article) return false;
       
       const a = article as any;
       return (
         typeof a.id === 'string' &&
         typeof a.title === 'string' &&
         typeof a.description === 'string'
       );
     }
     
     getArticles(): Observable<Article[]> {
       return this.http.get<unknown[]>('/api/articles').pipe(
         map(data => {
           if (!Array.isArray(data)) throw new Error('Invalid API response');
           return data.filter(this.validateArticle);
         }),
         catchError(err => throwError(() => new Error('Failed to fetch')))
       );
     }
   }
   ```

**Deadline:** 4 weeks

---

## Secrets Management

### Environment Variables

**Development:**
1. Create `.env.local` (add to `.gitignore`):
   ```
   CLERK_PUBLISHABLE_KEY=pk_test_...
   API_URL=https://localhost:44345/api
   ```

2. Load in `main.ts`:
   ```typescript
   // Load environment variables for browser
   window.__ENV__ = {
     CLERK_PUBLISHABLE_KEY: process.env['CLERK_PUBLISHABLE_KEY'],
     API_URL: process.env['API_URL']
   };
   ```

**Production:**
- Vercel: Project Settings → Environment Variables
- Render: Environment Groups
- Docker: Use `--env-file` or orchestration secrets
- Never commit secrets to git

### Sensitive Data to Never Commit

```
.env.*.local
.env
.env.production
.env.test
*.pem (private keys)
*.key (keys)
aws_credentials
api_keys
credentials.json
secrets.yml
```

### Rotating Secrets

**Clerk Keys:**
1. Go to https://dashboard.clerk.com
2. Project → API Keys
3. Rotate the publishable key
4. Update all environments
5. Remove old key references

**API Keys:**
1. Backend system → Settings
2. Generate new API key
3. Add to all environments
4. Retire old key

---

## Dependency Security

### Scanning for Vulnerabilities

```bash
# Audit current dependencies
pnpm audit

# Fix known vulnerabilities
pnpm audit --fix

# Check for outdated packages
pnpm outdated

# Update to latest
pnpm update --latest
```

### Safe Dependency Updates

```bash
# Update minor/patch versions only (safe)
pnpm update

# Update to specific version
pnpm update package-name@latest

# Review changes before committing
git diff package.json pnpm-lock.yaml
```

### Dependency Policy

- **Critical Vulnerabilities:** Fix within 24 hours
- **High Vulnerabilities:** Fix within 1 week
- **Medium Vulnerabilities:** Fix within 2 weeks
- **Low Vulnerabilities:** Fix during next sprint

### Supply Chain Security

- Use exact versions in `package.json` (no `^` or `~`)
- Verify package integrity with `pnpm integrity`
- Review package licenses (avoid GPL in closed source)
- Check package maintainers and activity

---

## Code Security

### No Hardcoded Credentials

❌ **Bad:**
```typescript
const apiKey = 'sk-abc123def456';
const password = 'admin123';
const token = 'eyJhbGciOi...';
```

✅ **Good:**
```typescript
const apiKey = process.env['API_KEY'];
const password = process.env['PASSWORD'];
const token = sessionStorage.getItem('auth_token');
```

### Prevent XSS Attacks

❌ **Bad:**
```typescript
template: `<div [innerHTML]="userInput"></div>`
```

✅ **Good:**
```typescript
import { DomSanitizer } from '@angular/platform-browser';

template: `<div [innerHTML]="sanitizer.sanitize(SecurityContext.HTML, userInput)"></div>`
```

### Prevent CSRF Attacks

- Use CSRF tokens for state-changing operations
- Angular HttpClient automatically handles CSRF for most cases
- Verify origin headers on backend

### Prevent SQL Injection

- Always use parameterized queries on backend
- Never concatenate user input into SQL
- Validate input length and format

### Prevent XXE Attacks

- Disable XML entity expansion in parsers
- Use safe XML libraries
- Validate XML structure

---

## Data Protection

### Sensitive Data Classification

| Data | Classification | Storage | Transmission |
|------|----------------|---------|--------------|
| User ID | Public | SessionStorage | HTTPS |
| User Name | Public | SessionStorage | HTTPS |
| Email | Public | SessionStorage | HTTPS |
| Auth Token | Confidential | SessionStorage (never localStorage) | HTTPS only |
| Password | Secret | Never in browser | HTTPS over SSL/TLS |
| API Keys | Secret | Backend only | HTTPS over SSL/TLS |
| PII (SSN, etc) | Confidential | Don't store in browser | HTTPS only |

### localStorage vs sessionStorage

```typescript
// ✅ Safe: SessionStorage clears when tab closes
sessionStorage.setItem('auth_token', token);

// ❌ Unsafe: localStorage persists indefinitely
localStorage.setItem('auth_token', token);

// ❌ Extremely Unsafe: Global variable
window.authToken = token;
```

### Data Retention

- Don't cache sensitive data longer than necessary
- Clear auth tokens on logout
- Clear forms after successful submission
- Remove temporary data after use

---

## Authentication & Authorization

### Clerk Integration

**Secure Configuration:**
```typescript
import { ClerkService } from '@clerk/clerk-js';

// ✅ Use publishable key (safe to expose)
const clerk = new ClerkService({
  publishableKey: environment.clerkPublishableKey
});

// ❌ Never use secret key in frontend
const secretKey = 'sk_live_...';  // WRONG! Never expose
```

### JWT Token Handling

```typescript
/**
 * Best practices for JWT handling in Angular
 */

// ✅ Store in sessionStorage (cleared on tab close)
sessionStorage.setItem('access_token', jwt);

// ✅ Include in Authorization header
headers: new HttpHeaders({
  'Authorization': `Bearer ${token}`
});

// ✅ Refresh token before expiry
const expiresAt = jwt_decode(token).exp * 1000;
if (Date.now() + 5000 > expiresAt) {
  // Refresh token before it expires
}

// ✅ Remove on logout
logout() {
  sessionStorage.removeItem('access_token');
  this.router.navigate(['/login']);
}
```

### Authorization

```typescript
// ✅ Check permissions in component
if (this.authService.hasPermission('articles:delete')) {
  // Show delete button
}

// ✅ Protect routes with guards
export const routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard]  // Checks authorization
  }
];

// ✅ Implement permission-based access
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  
  canActivate(): boolean {
    if (this.auth.hasRole('admin')) {
      return true;
    }
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
```

---

## Incident Reporting

### Security Vulnerabilities

**DO NOT** open public issues for security vulnerabilities!

**Report privately:**
1. Email: security@example.com
2. Subject: `[SECURITY] Vulnerability in Front-End App`
3. Include:
   - Vulnerability description
   - Severity (Critical/High/Medium/Low)
   - Affected component/file
   - Steps to reproduce
   - Your name and contact info (optional)

**Response Timeline:**
- **Initial Response:** Within 48 hours
- **Fix Development:** Depends on severity
- **Release:** ASAP after fix verification

### Security Updates Communication

After fixing security issues:
1. Update [SECURITY.md](#security-policy)
2. Release patch version (e.g., 1.0.1)
3. Notify users of update
4. Document mitigation for unpatched systems

---

## Security Checklist

### Development

- [ ] No hardcoded credentials
- [ ] User input validated and sanitized
- [ ] API responses validated against schema
- [ ] Errors don't leak sensitive information
- [ ] HTTPS used for all API calls
- [ ] Auth tokens in sessionStorage (not localStorage)
- [ ] Unused dependencies removed
- [ ] Dependencies scanned for vulnerabilities
- [ ] Third-party libraries audited
- [ ] NoSQL injection prevented (if applicable)
- [ ] XXE attacks prevented
- [ ] CSRF tokens implemented
- [ ] XSS protection enabled
- [ ] SQL injection prevented (backend)
- [ ] Rate limiting implemented

### Code Review

- [ ] No new hardcoded secrets
- [ ] Input validation present
- [ ] Error messages safe
- [ ] Dependencies updated safely
- [ ] Security libraries used correctly
- [ ] No dangerous functions (eval, innerHTML, etc)
- [ ] Cryptography implemented correctly

### Deployment

- [ ] Environment variables configured
- [ ] Secrets manager integrated
- [ ] HTTPS certificate valid
- [ ] Security headers set (CSP, X-Frame-Options, etc)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] WAF rules configured
- [ ] Logging/monitoring enabled
- [ ] Incident response plan ready

### Post-Deployment

- [ ] Monitor error logs for exploits
- [ ] Monitor dependency vulnerabilities
- [ ] Review access logs periodically
- [ ] Update security policies quarterly
- [ ] Security training for team
- [ ] Penetration testing scheduled (annually)

---

## Security Training

### Required Reading

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Angular Security Guide](https://angular.io/guide/security)
- [TypeScript Security](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### Security Best Practices

1. **Least Privilege:** Users only get access they need
2. **Defense in Depth:** Multiple layers of security
3. **Fail Securely:** Errors don't expose vulnerabilities
4. **Security by Default:** Secure settings enabled by default
5. **Code Review:** Security-focused peer reviews

---

## Questions?

For security questions or concerns, please reach out to:
- **Security Team:** security@example.com
- **Tech Lead:** tech-lead@example.com

---

**Last Updated:** April 2026  
**Next Review:** April 2026 (Quarterly)
