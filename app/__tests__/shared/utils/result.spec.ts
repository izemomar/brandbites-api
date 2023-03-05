import { Result } from '@shared/utils/Result';

describe('result class', () => {
  it('should be instantiable', () => {
    const result = new Result({
      success: true
    });
    expect(result).toBeInstanceOf(Result);
  });

  it('should throw an InvalidOperationException if we provide invalid options', () => {
    expect(
      () =>
        new Result({
          success: true,
          value: 'value',
          error: 'error'
        })
    ).toThrowError();
  });

  it('should throw an InvalidOperationException if we try to get the value of a failed result', () => {
    const result = new Result({
      success: false,
      error: 'error'
    });
    expect(() => result.value).toThrowError();
  });

  it('should throw an InvalidOperationException if we try to get the error of a successful result', () => {
    const result = new Result({
      success: true,
      value: 'value'
    });
    expect(() => result.error).toThrowError();
  });

  it('should return the value if the operation succeeded', () => {
    const result = new Result({
      success: true,
      value: 'value'
    });

    expect(result.value).toBe('value');
    expect(result.isSuccess).toBeTruthy();
    expect(result.isFailure).toBeFalsy();
  });

  it('should return the error if the operation failed', () => {
    const result = new Result({
      success: false,
      error: 'error'
    });

    expect(result.error).toBe('error');
    expect(result.isFailure).toBeTruthy();
    expect(result.isSuccess).toBeFalsy();
  });

  it('should create a new Result object indicating a successful operation', () => {
    const result = Result.succeed('value');
    expect(result.value).toBe('value');
    expect(result.isSuccess).toBeTruthy();
    expect(result.isFailure).toBeFalsy();
  });

  it('should create a new Result object indicating a failed operation', () => {
    const result = Result.fail('error');
    expect(result.error).toBe('error');
    expect(result.isFailure).toBeTruthy();
    expect(result.isSuccess).toBeFalsy();
  });

  it('should be able to combine multiple results', () => {
    const results = [
      Result.succeed('value1'),
      Result.succeed('value2'),
      Result.fail('error1'),
      Result.succeed('value3'),
      Result.fail('error2')
    ];

    const result = Result.combineResults(results);
    expect(result.isFailure).toBeTruthy();
    expect(result.error).toBe('error1');
  });
});
