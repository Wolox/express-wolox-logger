const namespace = require('../lib/namespace');

const metadataSpy = jest.spyOn(namespace, 'getLogMetadata');
const processSpy = jest.spyOn(process.stdout, 'write');

const { logger } = require('..');

const loggerSpy = jest.spyOn(logger, 'info');

describe('logger', () => {
  beforeEach(() => {
    processSpy.mockClear();
    metadataSpy.mockClear();
  });
  test('should call pino when logger is called', () => {
    logger.info('test');
    expect(loggerSpy).toHaveBeenCalled();
    const msg = loggerSpy.mock.calls[0][0];
    expect(msg).toBe('test');
  });
  test('should log id when requestId exists', () => {
    metadataSpy.mockImplementation(() => ({ requestId: '1' }));
    logger.info('test');
    expect(loggerSpy).toHaveBeenCalled();
    const rawLog = process.stdout.write.mock.calls[0][0];
    const { requestId } = JSON.parse(rawLog);
    expect(requestId).toBe('1');
  });
  test('should log metadata in each log', () => {
    const mockedMetadata = { metadata_1: 'metadata_1', metadata_2: 'metadata_2' };
    metadataSpy.mockImplementation(() => ({ ...mockedMetadata }));
    const times = [...new Array(10)];
    times.forEach((_, i) => logger.info(`test ${i}`));
    expect(loggerSpy).toHaveBeenCalledTimes(times.length);
    process.stdout.write.mock.calls.forEach(call => {
      const rawLog = call[0];
      const parsedLog = JSON.parse(rawLog);
      expect(parsedLog).toEqual(expect.objectContaining(mockedMetadata));
    });
  });
});
