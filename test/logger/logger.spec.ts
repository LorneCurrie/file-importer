import { Logger } from '../../src/logger';

describe('instantiate object', () => {
  it('should return a valid Logger Object', () => {
    const logger = Logger.getInstance()
    expect(typeof logger).toBe('object');
    expect(logger).toBeInstanceOf(Logger);
  })
})
