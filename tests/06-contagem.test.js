const { contarInteiros, contarNoIntervalo } = require('../javascript/06-contagem');

const conjuntoMisto = [4, 7.5, 12, 9, 'texto', 20, 3, 15.2, 18, 25];

test('deve contar apenas os valores inteiros do conjunto', () => {
  expect(contarInteiros(conjuntoMisto)).toBe(7);
});

test('conjunto só com inteiros conta todos os elementos', () => {
  expect(contarInteiros([1, 2, 3, 4, 5])).toBe(5);
});

test('decimais, textos, NaN e outros tipos não são contados como inteiros', () => {
  expect(contarInteiros([1.5, '2', NaN, null, undefined, true])).toBe(0);
});

test('conjunto vazio deve resultar em 0', () => {
  expect(contarInteiros([])).toBe(0);
  expect(contarNoIntervalo([], 10)).toBe(0);
});

test('deve contar os inteiros entre o primeiro dado e N (inclusive)', () => {
  // primeiro dado = 4, N = 20 -> intervalo [4, 20]: 4, 12, 9, 20, 18
  expect(contarNoIntervalo(conjuntoMisto, 20)).toBe(5);
});

test('o intervalo funciona também quando N é menor que o primeiro dado', () => {
  // primeiro dado = 10, N = 2 -> intervalo [2, 10]: 10, 5, 2
  expect(contarNoIntervalo([10, 5, 2, 20], 2)).toBe(3);
});

test('os extremos do intervalo são incluídos', () => {
  expect(contarNoIntervalo([5, 5, 10], 10)).toBe(3);
});

test('se o primeiro dado não é número, não há intervalo e o resultado é 0', () => {
  expect(contarNoIntervalo(['texto', 5, 10], 20)).toBe(0);
});

test('dados que não são um array devem lançar TypeError', () => {
  expect(() => contarInteiros('1,2,3')).toThrow(TypeError);
  expect(() => contarInteiros(undefined)).toThrow(TypeError);
  expect(() => contarNoIntervalo(null, 10)).toThrow(TypeError);
});

test('N inválido deve lançar TypeError', () => {
  expect(() => contarNoIntervalo([1, 2, 3], '10')).toThrow(TypeError);
  expect(() => contarNoIntervalo([1, 2, 3], NaN)).toThrow(TypeError);
  expect(() => contarNoIntervalo([1, 2, 3])).toThrow(TypeError);
});
