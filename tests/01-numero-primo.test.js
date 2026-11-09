const { ehPrimo, primosAte } = require('../javascript/01-numero-primo');

test('os números 2, 3, 17 e 97 devem ser primos', () => {
  expect(ehPrimo(2)).toBe(true);
  expect(ehPrimo(3)).toBe(true);
  expect(ehPrimo(17)).toBe(true);
  expect(ehPrimo(97)).toBe(true);
});

test('os números 4, 9, 25 e 100 não devem ser primos', () => {
  expect(ehPrimo(4)).toBe(false);
  expect(ehPrimo(9)).toBe(false);
  expect(ehPrimo(25)).toBe(false);
  expect(ehPrimo(100)).toBe(false);
});

test('0, 1 e números negativos não são primos', () => {
  expect(ehPrimo(0)).toBe(false);
  expect(ehPrimo(1)).toBe(false);
  expect(ehPrimo(-7)).toBe(false);
});

test('entradas que não são inteiros (decimal, texto, NaN) não são primos', () => {
  expect(ehPrimo(7.5)).toBe(false);
  expect(ehPrimo('7')).toBe(false);
  expect(ehPrimo(NaN)).toBe(false);
  expect(ehPrimo(undefined)).toBe(false);
});

test('os primos até 30 devem ser os corretos', () => {
  expect(primosAte(30)).toEqual([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]);
});

test('não existem primos até um limite menor que 2', () => {
  expect(primosAte(1)).toEqual([]);
  expect(primosAte(-5)).toEqual([]);
});

test('primosAte deve lançar TypeError quando o limite não é inteiro', () => {
  expect(() => primosAte(10.5)).toThrow(TypeError);
  expect(() => primosAte('10')).toThrow(TypeError);
});
