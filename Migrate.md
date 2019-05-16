## Migrate from winston to express-wolox-logger

If you need to migrate from wolox express-js boostrap configuration with winston to this package follow the following steps:

1. Remove your winston dependencies
2. Run `npm i express-wolox-logger`
3. Go to `app/logger/index.js` and replace the whole file for:
```
const { logger } = require('express-wolox-logger');

module.exports = logger;
```
### Optionals
If you want to use the new requestMiddleware provided by this package instead of morgan's middleware follow the following steps:

4. Remove your morgan dependencies
5. Go to `app.js` 
6. Add the following line at the very start of the file:
```
const { expressMiddleware, expressRequestIdMiddleware } = require('express-wolox-logger');
```
7. Find where you have the following code (or something very similar):
```
  if (!config.isTesting) {
    morgan.token('req-params', req => JSON.stringify(req.params));
    app.use(
      morgan(
        '[:date[clf]] :remote-addr - Request ":method :url" with params: :req-params. Response status: :status. Elapsed time: :response-time'
      )
    );
  }
```
and replace it with:
```
  app.use(expressRequestIdMiddleware);

  if (!config.isTesting) {
    app.use(expressMiddleware);
  }
```
