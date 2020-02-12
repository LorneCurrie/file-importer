import { getCsvFileBuffer } from '../../src/csv-json'

describe('getCsvFileBuffer', () => {
  const object = [
    {
      foo: 'bar1',
      bar: 'foo1'
    }, {
      foo: 'bar2',
      bar: 'foo2'
    }, {
      foo: 'bar3',
      bar: 'foo4'
    }
  ];

  it('should return a Buffer', async () => {
    const res = await getCsvFileBuffer(object);
    expect(res).toBeInstanceOf(Buffer);
  });

  it('should throw a error id the body is missing', async () => {
    try {
      const res = await getCsvFileBuffer(null);
      fail('should throw a error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('Error converting json to CSV, no object to convert');
    }
  })
});
