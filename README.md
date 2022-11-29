# thread-keeper 📚

High-fidelity capture of Twitter threads as sealed PDFs @ [social.perma.cc](https://social.perma.cc). 

[![](github.png)](https://social.perma.cc)

An experiment of the [Harvard Library Innovation Lab](https://lil.law.harvard.edu).

> 🚧 Experimental - Prototype. 
> Early release to be consolidated. 

---

## Summary
- [Dependencies](#dependencies)
- [Local development](#local-development)
- [Dev CLI](#dev-cli)
- [Code docs](/docs)

---

## Dependencies

### Runtimes
- [Node.js](https://nodejs.org/) 18+
- [Python](https://www.python.org/) 3.9+

### Browsers
- Google Chrome _(`npx playwright install --force chrome` may be used)_.

### Python dependencies
- ⚠️ For now: Python dependencies are installed at machine level, as a post-install step of `npm install`.

### Known Ubuntu packages
```
curl bash gcc g++ python3 python3-pip python3-dev zlib1g zlib1g-dev libjpeg-dev libssl-dev libffi-dev ghostscript poppler-utils
```

- ⚠️ On Linux, this project is only compatible with Ubuntu at the time, because it uses Playwright + Chrome.
- Node may be sourced from [Nodesource](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions).

### For development on Mac OS
A `brewfile` is available. Run `brew bundle` to install machine-level dependencies that can be provided by [homebrew](https://brew.sh/).

[☝️ Back to summary](#summary)

---

## Local development

### Getting started
Run the following commands to initialize the project and start the development server. 

```bash
brew bundle # (Mac OS only) - See Linux dependencies above.
npm install # To install npm packages
npx playwright install chrome # To ensure Playwright has a version of Chrome to talk to
npm run generate-dev-cert # Will generate a certificate for self-signing PDFs. For testing purposes only.
npm run dev # Starts the development server on port 3000
```

### Certificates history

The _"Signatures Verification Page"_ page lists the certificates that were used for signing PDFs with the app. You may provide that history by creating two files under `/data`:
- `signing-certs-history.json` 
- `timestamping-certs-history.json` 

Expected format:

```json
[
  {
    "from": "2022-11-18 13:07:56 UTC",
    "to": "present",
    "domain": "domain.ext",
    "info": "https://...",
    "cert": "https://..."
  },
  ...
]
```

[☝️ Back to summary](#summary)

---

## Dev CLI

### start
```bash
npm run start
```

Starts the app's server on port 3000 with warning-level logs.

### dev
```bash
npm run dev
```

Starts the app's server on port 3000 with info-level logs. Watches for file changes.

### generate-dev-cert
```bash
npm run generate-dev-cert
```

Generate a `certs/cert.pem` and `certs/key.pem` for local development purposes. 

### docgen
```bash
npm run docgen
```

Generates JSDoc-based code documentation under `/docs`.

### test
```bash
npm run test
```

Runs the test suite. Requires test fixtures _(see `fixtures` folder)_.

> ⚠️ At the moment, this codebase only features a very limited set of high-level integration tests.

[☝️ Back to summary](#summary)

