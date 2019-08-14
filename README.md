# Express Wolox Logger

ExpressJS logger that wraps [pino](https://github.com/pinojs/pino) with additional features like middlewares for unique request ids and automatic logging of request beginnings and endings.

## Basic Usage
```
const { logger } = require('express-wolox-logger');

logger.info('hello world');
logger.error('something bad happened');
```
This will output:
```
[2019-06-14 17:35:13.772 +0000] INFO  (17439 on my-pc.local): hello world
[2019-06-14 17:35:13.772 +0000] ERROR (17439 on my-pc.local): something bad happened
```

## Advanced Usage

The exported `createLogger` function takes one optional argument,
[`configuration`](#configuration) and
returns a `logger instance`.

<a id=configuration></a>
### `configuration` (Object)

#### `options` (Object)
Default (pino): `{
  prettyPrint: {
    translateTime: true,
    colorize: false
  }
}`

Options for logger instance, check documentation of each package for more details ([pino](https://github.com/pinojs/pino/blob/master/docs/api.md#options))

#### `loggerOption` (String)
Default : `'pino'`

Package used as logger, available options are: `['pino']`

### Example
```
const { createLogger } = require('express-wolox-logger');

const logger = createLogger({ 
    loggerOption: 'pino',
    options: {
        customLevels: {
            foo: 35
        },
        useOnlyCustomLevels: true,
        level: 'foo'
    } 
})

logger.foo('hello world');
```

# Middlewares
## Logs for request beginning and end
We provide an ExpressJs middleware that automatically logs when a request starts and ends. Simply import it and use it like any other middleware.

### Basic Usage
```
const { logger, expressMiddleware } = require('express-wolox-logger');

app.use(expressMiddleware({ loggerFn: logger.info }));
```
This in conjunction with the basic logs will output:
```
[2019-06-14 17:35:13.770 +0000] INFO  (17439 on my-pc.local): Started GET /logger/test with params: {}, query: {}, body: {}.
[2019-06-14 17:35:13.772 +0000] INFO  (17439 on my-pc.local): hello world
[2019-06-14 17:35:13.772 +0000] ERROR (17439 on my-pc.local): something bad happened
[2019-06-14 17:35:13.781 +0000] INFO  (17439 on my-pc.local): Ended GET /logger/test with status: 200 in 10 ms
```

### Advanced Usage
The exported `expressRequestIdMiddleware` function takes one argument, [`options`](#optionsStartEnd) and returns a `middleware`.

<a id=optionsStartEnd></a>
#### `options` (Object)

##### `loggerFn` (Function)
Logger function used for start and end log actions.

##### `obfuscatePlaceholder` (String)
Default: [SECURE]

String to replace obfuscated body.

##### `obfuscateBody` (Object|Boolean)
Default: true

Options for obfuscate body of request, could be a boolean (true or false) that applies to all requests or a object to an specific endpoint and method.

#### Example
```
{
  obfuscateBody: {
    '/some_url': { // this should be a regex of url to obfuscate
      POST: true // method to obfuscate
    }
  }
}
```


### Obfuscating body of specific request
```
const { logger, expressMiddleware } = require('express-wolox-logger');

app.use(expressMiddleware({ loggerFn: logger.info, obfuscatePlaceholder: '[SECRET]', obfuscateBody: { '/secure': { POST: true } } }));
```
This in conjunction with the basic logs will output:
```
[2019-06-14 17:35:13.770 +0000] INFO  (17439 on my-pc.local): Started POST /secure with params: {}, query: {}, body: [SECRET].
[2019-06-14 17:35:13.772 +0000] INFO  (17439 on my-pc.local): hello world
[2019-06-14 17:35:13.781 +0000] INFO  (17439 on my-pc.local): Ended POST /secure with status: 200 in 10 ms
[2019-06-14 17:35:13.770 +0000] INFO  (17439 on my-pc.local): Started GET /secure with params: {}, query: {}, body: {}.
[2019-06-14 17:35:13.772 +0000] INFO  (17439 on my-pc.local): hello world
[2019-06-14 17:35:13.781 +0000] INFO  (17439 on my-pc.local): Ended GET /secure with status: 200 in 10 ms
```

### Obfuscating body of all requests
```
const { logger, expressMiddleware } = require('express-wolox-logger');

app.use(expressMiddleware({ loggerFn: logger.info, obfuscatePlaceholder: '[SECRET]', obfuscateBody: true }));
```
This in conjunction with the basic logs will output:
```
[2019-06-14 17:35:13.770 +0000] INFO  (17439 on my-pc.local): Started POST /secure with params: {}, query: {}, body: [SECRET].
[2019-06-14 17:35:13.772 +0000] INFO  (17439 on my-pc.local): hello world
[2019-06-14 17:35:13.781 +0000] INFO  (17439 on my-pc.local): Ended POST /secure with status: 200 in 10 ms
[2019-06-14 17:35:13.770 +0000] INFO  (17439 on my-pc.local): Started GET /secure with params: {}, query: {}, body: [SECRET].
[2019-06-14 17:35:13.772 +0000] INFO  (17439 on my-pc.local): hello world
[2019-06-14 17:35:13.781 +0000] INFO  (17439 on my-pc.local): Ended GET /secure with status: 200 in 10 ms
```



## Request Ids
We also provide an ExpressJs middleware that appends a `request id` to all logs made for a single request. This is useful for better tracking logs when there are several requests going on concurrently. Again, simply import it and use it like any other middleware.

### Basic Usage
```
const { expressRequestIdMiddleware } = require('express-wolox-logger');

app.use(expressRequestIdMiddleware());
```
This, in conjunction with the basic logs will output:
```
[2019-06-14 17:35:13.772 +0000] INFO  (17439 on my-pc.local): [GNc7JovB7] hello world
[2019-06-14 17:35:13.772 +0000] ERROR (17439 on my-pc.local): [GNc7JovB7] something bad happened
```
Note, that if you are using [Sequelize](http://docs.sequelizejs.com/), you need to configure it to use the logger's CLS namespace, otherwise the `requests ids` will not persist through `sequelize` promises. The same may apply to other frameworks.

For `sequelize`, just set the namespace before creating a new `sequelize` instance:
```
const Sequelize = require('sequelize');
const { namespace } = require('express-wolox-logger');

Sequelize.useCLS(namespace);
const sequelize = new Sequelize(...);
```

### Advanced Usage
The exported `expressRequestIdMiddleware` function takes one optional argument, [`options`](#options) and returns a `middleware`.

<a id=options></a>
#### `options` (Object)

##### `headerName` (String)
Default: `x-request-id`

Header from where the id is taken

##### `idGenerator` (Function)
Default: [shortid.generate](https://github.com/dylang/shortid#usage)

Function used for generate ids in each request.

### Example
```
const uuid = require('uuid');
const { expressRequestIdMiddleware } = require('express-wolox-logger');

app.use(expressRequestIdMiddleware({ headerName: 'id', idGenerator: uuid }));
```
This, in conjunction with the basic logs will output:
```
[2019-06-14 17:35:13.772 +0000] INFO  (17439 on my-pc.local): [a2936029-9bd4-402d-ba43-a4873f228274] hello world
[2019-06-14 17:35:13.772 +0000] ERROR (17439 on my-pc.local): [a2936029-9bd4-402d-ba43-a4873f228274] something bad happened
```

### Forwarding the request Id
As a bonus, the previously mentioned request id is taken from the `x-request-id` header if supplied, which lets said `request id` be transferred across services. You can do this by importing the `getRequestId` function and supplying it to the header when making requests.
```
const axios = require('axios'),
 { getRequestId } = require('express-wolox-logger');

axios.get(URL, { headers: { 'x-request-id': getRequestId() } });
```
This will result in the requestId being logged through your services until the request chain ends.

We used [axios](https://www.npmjs.com/package/axios) for this example but other requets packages like [request-promise](https://github.com/request/request-promise) work exactly the same way.

## Migrate from winston to express-wolox-logger
If you are wondering how to migrate from wolox express-js boostrap configuration with winston to this package refer to the [step by step migration guide](Migrate.md)


## Upgrade
If you are wondering how to upgrade to a major version check [this upgrade guide](UPGRADING.md)

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Run the tests (`npm test`)
4. Commit your changes (`git commit -am 'Add some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create new Pull Request

## About

This project is maintained by [Wolox](https://github.com/wolox) and it was written by [Wolox](http://www.wolox.com.ar).

![Wolox](https://raw.githubusercontent.com/Wolox/press-kit/master/logos/logo_banner.png)

## License

**express-wolox-logger** is available under the MIT [license](LICENSE.md).

    Copyright (c) 2019 Wolox

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
