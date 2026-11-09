const { fibonacci, fibonacciSerie, fibonacciRecursivo } = require('../javascript/03-fibonacci');

test('os 10 primeiros números da contagem de fibonacci devem ser os corretos', () => {
  expect(fibonacciSerie(10)).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
});

test('os 2 primeiros números da contagem de fibonacci devem ser 0 e 1', () => {
  expect(fibonacciSerie(2)).toEqual([0, 1]);
});

test('a série com 0 termos é vazia e com 1 termo é [0]', () => {
  expect(fibonacciSerie(0)).toEqual([]);
  expect(fibonacciSerie(1)).toEqual([0]);
});

test('os termos das posições 0, 1, 2, 10 e 30 devem ser os corretos', () => {
  expect(fibonacci(0)).toBe(0);
  expect(fibonacci(1)).toBe(1);
  expect(fibonacci(2)).toBe(1);
  expect(fibonacci(10)).toBe(55);
  expect(fibonacci(30)).toBe(832040);
});

test('a versão recursiva deve dar o mesmo resultado da iterativa', () => {
  for (let posicao = 0; posicao <= 15; posicao += 1) {
    expect(fibonacciRecursivo(posicao)).toBe(fibonacci(posicao));
  }
});

test('a posição 78 ainda é calculada com exatidão', () => {
  expect(fibonacci(78)).toBe(8944394323791464);
  expect(Number.isSafeInteger(fibonacci(78))).toBe(true);
});

test('posição negativa deve lançar RangeError', () => {
  expect(() => fibonacci(-1)).toThrow(RangeError);
  expect(() => fibonacci(-1)).toThrow('inteiro nao negativo');
  expect(() => fibonacciRecursivo(-3)).toThrow(RangeError);
  expect(() => fibonacciSerie(-2)).toThrow(RangeError);
});

test('posição que não é inteira deve lançar TypeError', () => {
  expect(() => fibonacci(2.5)).toThrow(TypeError);
  expect(() => fibonacci('10')).toThrow(TypeError);
  expect(() => fibonacci(NaN)).toThrow(TypeError);
  expect(() => fibonacciSerie(undefined)).toThrow(TypeError);
});

test('posição acima do limite de precisão deve lançar RangeError', () => {
  expect(() => fibonacci(79)).toThrow(RangeError);
  expect(() => fibonacciSerie(80)).toThrow(RangeError);
});
