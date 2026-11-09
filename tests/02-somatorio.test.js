const { somatorio, somatorioRecursivo, somatorioAte } = require('../javascript/02-somatorio');

test('o somatório de [10, 25, 3, 47, 8, 15] deve ser 108', () => {
  expect(somatorio([10, 25, 3, 47, 8, 15])).toBe(108);
});

test('o somatório aceita números negativos e decimais', () => {
  expect(somatorio([-10, 20])).toBe(10);
  expect(somatorio([0.5, 0.25])).toBeCloseTo(0.75);
});

test('o somatório de um array vazio deve ser 0', () => {
  expect(somatorio([])).toBe(0);
  expect(somatorioRecursivo([])).toBe(0);
});

test('a versão recursiva deve dar o mesmo resultado da iterativa', () => {
  const numeros = [3, 1, 4, 1, 5, 9, 2, 6];

  expect(somatorioRecursivo(numeros)).toBe(somatorio(numeros));
});

test('o somatório de 1 até 100 pela fórmula de Gauss deve ser 5050', () => {
  expect(somatorioAte(100)).toBe(5050);
});

test('a fórmula de Gauss deve coincidir com a soma de 1 até n', () => {
  const sequencia = Array.from({ length: 50 }, (_, posicao) => posicao + 1);

  expect(somatorioAte(50)).toBe(somatorio(sequencia));
});

test('o somatório até um limite menor que 1 deve ser 0', () => {
  expect(somatorioAte(0)).toBe(0);
  expect(somatorioAte(-3)).toBe(0);
});

test('entradas inválidas devem lançar TypeError', () => {
  expect(() => somatorio('1,2,3')).toThrow(TypeError);
  expect(() => somatorio([1, 'dois', 3])).toThrow('posicao 1');
  expect(() => somatorio([1, NaN])).toThrow(TypeError);
  expect(() => somatorioRecursivo(null)).toThrow(TypeError);
  expect(() => somatorioAte(2.5)).toThrow(TypeError);
});
