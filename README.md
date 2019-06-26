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
### Logs for request beginning and end
We provide an ExpressJs middleware that automatically logs when a request starts and ends. Simply import it and use it like any other middleware:
```
const { logger, expressMiddleware } = require('express-wolox-logger');

app.use(expressMiddleware({ logger }));
```
This in conjunction with the basic logs will output:
```
[2019-06-14 17:35:13.770 +0000] INFO  (17439 on my-pc.local): Started GET /logger/test with params: {}, query: {}, body: {}.
[2019-06-14 17:35:13.772 +0000] INFO  (17439 on my-pc.local): hello world
[2019-06-14 17:35:13.772 +0000] ERROR (17439 on my-pc.local): something bad happened
[2019-06-14 17:35:13.781 +0000] INFO  (17439 on my-pc.local): Ended GET /logger/test with status: 200 in 10 ms
```

### Request Ids
We also provide an ExpressJs middleware that appends a `request id` to all logs made for a single request. This is useful for better tracking logs when there are several requests going on concurrently. Again, simply import it and use it like any other middleware.
```
const { logger, expressRequestIdMiddleware } = require('express-wolox-logger');

app.use(expressRequestIdMiddleware({ logger }));
```
This, in conjunction with the basic logs will output:
```
[2019-06-14 17:35:13.772 +0000] INFO  (17439 on my-pc.local): [a2936029-9bd4-402d-ba43-a4873f228274] hello world
[2019-06-14 17:35:13.772 +0000] ERROR (17439 on my-pc.local): [a2936029-9bd4-402d-ba43-a4873f228274] something bad happened
```
####Forwarding the request Id
As a bonus, the previously mentioned request Id is taken from the `x-request-id` header if supplied, which lets said `request id` be transferred across services. You can do this by importing the `getRequestId` function and supplying it to the header when making requests.
```
const axios = require('axios'),
 { getRequestId } = require('express-wolox-logger');

axios.get(URL, { headers: { 'x-request-id': getRequestId() } });
```
This will result in the requestId being logged through your services until the request chain ends.

We used [axios](https://www.npmjs.com/package/axios) for this example but other requets packages like [request-promise](https://github.com/request/request-promise) work exactly the same way.

## Migrate from winston to express-wolox-logger
If you are wondering how to migrate from wolox express-js boostrap configuration with winston to this package refer to the [step by step migration guide](Migrate.md)

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
