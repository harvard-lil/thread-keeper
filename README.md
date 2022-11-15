# archive.social
> 🚧 Work In Progress

---

## Summary
- [Dependencies](#dependencies)
- [Local development](#local-development)

---

## Dependencies

### Runtimes
- [Node.js](https://nodejs.org/) 18+
- [Python](https://www.python.org/) 3.9+.

### Browsers
- Google Chrome _(`npx playwright install --force chrome` may be used)_.

### Python dependencies
- ⚠️ For now: Python dependencies are installed at machine level, as a post-install step of `npm install`.

### Known Debian / Ubuntu packages
```
curl bash gcc g++ python3 python3-pip python3-dev zlib1g zlib1g-dev libjpeg-dev libssl-dev libffi-dev ghostscript poppler-utils
```

Node may be sourced from [Nodesource](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions).

### For development on Mac OS
A `brewfile` is available. Run `brew bundle` to install machine-level dependencies that can be provided by [homebrew](https://brew.sh/).

[☝️ Back to summary](#summary)

---

## Local development

> 🚧 WIP

```bash
brew bundle # (Mac OS only) - See Linux dependencies above.
npm install 
npx playwright install chrome
npm run generate-local-cert # Will generate a certificate for self-signing PDFs
npm run dev
```
