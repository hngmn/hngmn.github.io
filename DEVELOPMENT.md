
## Overview
Project is entirely client-side, meaning the build process outputs a static site
which Github Pages serves for free. The build process boils down to two steps:
1. Webpack compiles the Typescript/React code in `/src/` to js, putting them in
   the Jekyll input dir, `/docs/`.
2. Jekyll generates the static site from `/docs/`.

## Dev Procedure

### Webpack, Java/Typescript
`nvm` for npm/node versions

```
nvm use
npm run dev
```

### Jekyll, ruby, bundle

`chruby` for managing ruby and gems

```
chruby <something>
npm run serve
```

## New Module
See commit c4b2659 for hello world commit