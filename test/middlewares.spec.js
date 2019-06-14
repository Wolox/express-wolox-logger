const http = require('http');
const request = require('supertest');

const { logger, expressMiddleware, expressRequestIdMiddleware, getRequestId } = require('..');

const testLogger = logger();

describe('middlewares', () => {
  const createServer = middleware =>
    http.createServer((req, res) => {
      middleware(req, res, () => {
        const id = getRequestId();
        if (id) {
          res.setHeader('x-request-id', id);
        }
        res.end();
      });
    });

  const testUrl = '/test_url';
  const makeRequest = server => request(server).get(testUrl);

  describe('express middleware', () => {
    const server = createServer(expressMiddleware(testLogger));
    const loggerMock = jest.spyOn(testLogger, 'info').mockImplementation(() => {}); // eslint-disable-line

    const getLoggerCalledParams = num => loggerMock.mock.calls[num].map(JSON.stringify).join('');

    test('should log when request start', done => {
      makeRequest(server).end(() => {
        expect(getLoggerCalledParams(0)).toEqual(
          expect.stringMatching(/Started \/test_url GET with params:.*query:.*body.*/)
        );
        done();
      });
    });
    test('should log when request finish', done => {
      makeRequest(server).end(() => {
        expect(getLoggerCalledParams(1)).toEqual(
          expect.stringMatching(/Ended GET \/test_url with status: [2-5]+00 in [0-9]+ ms/)
        );
        done();
      });
    });
  });

  describe('express id middleware', () => {
    const server = createServer(expressRequestIdMiddleware);
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
});
