# Change Log
This project adheres to [Semantic Versioning](http://semver.org/).

## 1.0.1
* Add `obfuscateBody` and `obfuscatePlaceholder` option for secure sensitive data in body.

## 1.0.0
* Add some documentation in README.
* Refactor old `index.js` in multiple files.
* Add `createLogger` function for create custom logger.
* Change [uuid](https://github.com/kelektiv/node-uuid) generator for [shortid](https://github.com/dylang/shortid), reducing ids length.
* Add options in both middlewares (`expressMiddleware` and `expressRequestIdMiddleware`) for making more configurable.
* Add `jest` tests.
* Add `eslint` configuration.

## 0.0.3
* Change namespace variable name from `ns` to `namespace` and exported it.
* Bind end log function to the middleware context to fix some inconsistencies with it's requests ids.

## 0.0.2
* Add migration guide and publish first version.

## 0.0.1
* Initial release.