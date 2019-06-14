const loggerMock = jest.fn();
const namespace = require('../lib/namespace');

jest.spyOn(namespace, 'getRequestId').mockImplementation(() => 1);

jest.doMock('pino', () => () => ({
  info: loggerMock,
  levels: {
    values: {
      info: 32
    }
  }
}));
const { logger } = require('..');

const testLogger = logger();

describe('logger', () => {
  test('should call pino when logger is called', () => {
    testLogger.info('test');
    expect(loggerMock).toHaveBeenCalled();
    const msg = loggerMock.mock.calls[0][1];
    expect(msg).toBe('test');
  });
  test('should log id when requestId exists', () => {
    testLogger.info('test');
    expect(loggerMock).toHaveBeenCalled();
    const id = loggerMock.mock.calls[0][0].trim();
    expect(id).toBe('[1]');
  });
});
