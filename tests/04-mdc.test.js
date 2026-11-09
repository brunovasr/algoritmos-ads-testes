const { mdc, mdcRecursivo, mmc } = require('../javascript/04-mdc');

test('o mdc de 48 e 18 deve ser 6', () => {
  expect(mdc(48, 18)).toBe(6);
});

test('o mdc de 270 e 192 deve ser 6 e o de 1071 e 462 deve ser 21', () => {
  expect(mdc(270, 192)).toBe(6);
  expect(mdc(1071, 462)).toBe(21);
});

test('o mdc de números primos entre si deve ser 1', () => {
  expect(mdc(17, 5)).toBe(1);
  expect(mdc(1, 1)).toBe(1);
});

test('o mdc deve ignorar o sinal e tratar o zero', () => {
  expect(mdc(-48, 18)).toBe(6);
  expect(mdc(48, -18)).toBe(6);
  expect(mdc(0, 5)).toBe(5);
  expect(mdc(5, 0)).toBe(5);
  expect(mdc(0, 0)).toBe(0);
});

test('a versão recursiva deve dar o mesmo resultado da iterativa', () => {
  const pares = [
    [48, 18],
    [270, 192],
    [1071, 462],
    [17, 5],
    [-100, 75],
    [0, 9],
  ];

  pares.forEach(([a, b]) => {
    expect(mdcRecursivo(a, b)).toBe(mdc(a, b));
  });
});

test('o mmc de 4 e 6 deve ser 12 e o de 48 e 18 deve ser 144', () => {
  expect(mmc(4, 6)).toBe(12);
  expect(mmc(48, 18)).toBe(144);
});

test('o mmc com zero deve ser 0 e o resultado nunca é negativo', () => {
  expect(mmc(0, 7)).toBe(0);
  expect(mmc(-4, 6)).toBe(12);
});

test('valores que não são inteiros devem lançar TypeError', () => {
  expect(() => mdc(4.5, 3)).toThrow(TypeError);
  expect(() => mdc('48', 18)).toThrow(TypeError);
  expect(() => mdcRecursivo(NaN, 2)).toThrow(TypeError);
  expect(() => mmc(2, Infinity)).toThrow(TypeError);
});

test('mmc grande demais para ser exato deve lançar RangeError', () => {
  expect(() => mmc(9007199254740881, 9007199254740847)).toThrow(RangeError);
});
