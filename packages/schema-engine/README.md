# Scope of this project

Provide a way to validate given json documents against the pre defined json schemas. Exports both the validator and the types of the schemas that are supported.

## Tooling

In order for this package to be used by an esm module as well as in cjs world, we are using the [tsup](https://tsup.egoist.dev) library. Furthermore the provided validator is based on [ajv](https://ajv.js.org).
