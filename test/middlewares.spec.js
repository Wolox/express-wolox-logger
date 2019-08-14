const http = require('http');
const request = require('supertest');
const bodyParser = require('body-parser');

const { logger, expressMiddleware, expressRequestIdMiddleware, getRequestId } = require('..');

describe('middlewares', () => {
  const chainMiddlewares = (req, res, end, middlewares) => {
    const middleware = middlewares.shift();
    if (!middlewares.length) {
      return middleware(req, res, end);
    }
    return middleware(req, res, () => chainMiddlewares(req, res, end, middlewares));
  };

  const createServer = (...middlewares) =>
    http.createServer((req, res) =>
      chainMiddlewares(
        req,
        res,
        () => {
          const id = getRequestId();
          if (id) {
            res.setHeader('x-request-id', id);
          }
          res.end();
        },
        [bodyParser.json(), ...middlewares]
      )
    );

  const testUrl = '/test_url';
  const makeRequest = (server, method = 'get') => request(server)[method](testUrl);

  describe('express middleware', () => {
    const loggerMock = jest.spyOn(logger, 'info').mockImplementation(() => {}); // eslint-disable-line
    const server = options =>
      createServer(
        expressMiddleware({
          loggerFn: logger.info,
          ...options
        })
      );

    const getLoggerCalledParams = num => loggerMock.mock.calls[num].map(JSON.stringify).join('');

    test('should log when request starts', done => {
      makeRequest(server()).end(() => {
        expect(getLoggerCalledParams(0)).toEqual(
          expect.stringMatching(/Started \/test_url GET with params:.*query:.*body.*/)
        );
        done();
      });
    });
    test('should log when request finishes', done => {
      makeRequest(server()).end(() => {
        expect(getLoggerCalledParams(1)).toEqual(
          expect.stringMatching(/Ended GET \/test_url with status: [2-5]+00 in [0-9]+ ms/)
        );
        done();
      });
    });
    test('should obfuscate full body of any endpoint', done => {
      makeRequest(server({ obfuscateBody: true }), 'post')
        .send({ secure: 'secretValue' })
        .end(() => {
          expect(getLoggerCalledParams(0)).toContain('[SECURE]');
          expect(getLoggerCalledParams(0)).not.toContain('secretValue');
          done();
        });
    });
    test('should obfuscate full body of specific endpoint', done => {
      makeRequest(server({ obfuscateBody: { [testUrl]: { POST: true } } }), 'post')
        .send({ secure: 'secretValue' })
        .end(() => {
          expect(getLoggerCalledParams(0)).toContain('[SECURE]');
          expect(getLoggerCalledParams(0)).not.toContain('secretValue');
          done();
        });
    });
  });

  describe('express id middleware', () => {
    const server = createServer(expressRequestIdMiddleware());
    test('should assign fresh requestId', done => {
      makeRequest(server).end((_, res) => {
        expect(res.header['x-request-id']).not.toBeUndefined();
        done();
      });
    });

    test('should assign requestId sent in header', done => {
      makeRequest(server)
        .set({ 'x-request-id': 1 })
        .end((_, res) => {
          expect(res.header['x-request-id']).toBe('1');
          done();
        });
    });
  });

  describe('express middleware + express id middleware', () => {
    let requestIds = [];
    jest.spyOn(logger, 'info').mockImplementation(() => {
      requestIds.push(getRequestId());
    });
    const server = createServer(expressRequestIdMiddleware(), expressMiddleware({ loggerFn: logger.info }));

    beforeEach(() => (requestIds = []));

    test('should assign requestId sent in header and log correct request id when request starts', done => {
      makeRequest(server)
        .set({ 'x-request-id': 1 })
        .end(() => {
          expect(requestIds[0]).toBe('1');
          done();
        });
    });

    test('should assign requestId sent in header and log correct request id when request finishes', done => {
      makeRequest(server)
        .set({ 'x-request-id': 2 })
        .end(() => {
          expect(requestIds[1]).toBe('2');
          done();
        });
    });

    test('should assign a random requestId and both start and end logs should have it', done => {
      makeRequest(server).end(() => {
        expect(requestIds[0]).toEqual(requestIds[1]);
        done();
      });
    });
  });
});
