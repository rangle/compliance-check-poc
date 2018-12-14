# Stripe Compliance Check PoC

JavaScript solution to Stripe compliance interview

(assumes familiarity with yarn or npm)

## Commands/Setup

- Installation can be done with a `yarn install` or an `npm install`
- Unit tests are run with a `yarn test:unit` or `npm run test:unit`, unit tests produce a coverage artifact
- `yarn test:unit:w` or `npm run test:unit:w` will run the unit tests in watch mode
- e2e test are run with a `yarn test:e2e` or `npm run test:e2e`
- To debug e2e tests set the environment variable `debug` to any truthy value
- `yarn test` or `npm run test` will run the unit tests, and then the e2e tests. Useful for CI.
- Builds can be produced with a `yarn build`, which produces a distributable `npm` package which can be consumed as a library or as a CLI tool

## Library Usage

The library can be consumed as an npm package and exposes two methods:

- `checkCompliance`, which takes a JavaScript object to validate
- `submitDocument`, which takes a JavaScript object to validate and check against state

## CLI Usage

The CLI program can be run (after building) with one of two commands:

- `./compliance-check check /path/to/input.json`. The CLI program outputs the JSON results in the format:

```json
{
  "compliant": true,
  "requirements": []
}
```

- `./compliance-check submit /path/to/input.json`. The CLI program uses the flatfile `.compliance-db.json` to store state. Output is in the following format:

```json
{
  "compliant": true,
  "requirements": [],
  "past_due": []
}
```

## Notes

- Assumes that requirements must be in the same order as the given test cases
- "Database" (flat file) is not safe for production for many, many reasons
