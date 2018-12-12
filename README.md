# Stripe Compliance Check PoC

JavaScript solution to Stripe compliance interview

(assumes familiarity with yarn or npm)

## Commands/Setup

- Installation can be done with a `yarn install` or an `npm install`
- Unit tests are run with a `yarn test:unit` or `npm run test:unit`, unit tests produce a coverage artifact
- `yarn test:unit:w` or `npm run test:unit:w` will run the unit tests in watch mode
- e2e test are run with a `yarn test:e2e` or `npm run test:e2e`
- Builds can be produced with a `yarn build`, which produces a distributable `npm` package which can be consumed as a library or as a CLI tool

## Library Usage

The library can be consumed as an npm package and exposes one method: `checkCompliance`, which takes a JavaScript object to validate

## CLI Usage

The CLI program can be run (after building) with `./compliance-check /path/to/input.json`. The CLI program outputs the JSON results in the format:

```json
{
  "compliant": true,
  "requirements": []
}
```
