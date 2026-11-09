const { quicksort, ordenar, particionar } = require('../javascript/05-quicksort');

test('um array desordenado deve ficar em ordem crescente', () => {
  expect(quicksort([5, 4, 3, 1])).toEqual([1, 3, 4, 5]);
  expect(quicksort([33, 10, 55, 71, 29, 3, 18, 92, 47, 2])).toEqual([
    2, 3, 10, 18, 29, 33, 47, 55, 71, 92,
  ]);
});

test('valores repetidos, negativos e decimais devem ser ordenados corretamente', () => {
  expect(quicksort([5, 1, 5, 3, 1, 9, 3])).toEqual([1, 1, 3, 3, 5, 5, 9]);
  expect(quicksort([3, -1, 0, -7, 2.5])).toEqual([-7, -1, 0, 2.5, 3]);
});

test('array vazio, com um elemento ou já ordenado não deve mudar', () => {
  expect(quicksort([])).toEqual([]);
  expect(quicksort([42])).toEqual([42]);
  expect(quicksort([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  expect(quicksort([4, 3, 2, 1])).toEqual([1, 2, 3, 4]);
});

test('quicksort altera o próprio array recebido (in-place)', () => {
  const original = [3, 1, 2];
  const resultado = quicksort(original);

  expect(resultado).toBe(original);
  expect(original).toEqual([1, 2, 3]);
});

test('ordenar devolve uma cópia ordenada e preserva o array original', () => {
  const original = [100, 4, 3, 150];
  const ordenado = ordenar(original);

  expect(ordenado).toEqual([3, 4, 100, 150]);
  expect(original).toEqual([100, 4, 3, 150]);
});

test('o resultado deve ser igual ao de Array.sort em 200 números aleatórios', () => {
  const sorteados = Array.from({ length: 200 }, (_, posicao) => ((posicao * 7919) % 1000) - 500);
  const esperado = [...sorteados].sort((a, b) => a - b);

  expect(ordenar(sorteados)).toEqual(esperado);
});

test('particionar deve deixar o pivô na posição final', () => {
  const array = [3, 8, 1, 5];
  const posicaoPivo = particionar(array, 0, array.length - 1);

  expect(posicaoPivo).toBe(2);
  expect(array[posicaoPivo]).toBe(5);
});

test('entradas inválidas devem lançar TypeError', () => {
  expect(() => quicksort('3,1,2')).toThrow(TypeError);
  expect(() => ordenar(undefined)).toThrow(TypeError);
  expect(() => ordenar([3, 'a', 1])).toThrow('posicao 1');
  expect(() => ordenar([2, NaN, 1])).toThrow(TypeError);
});

test('particionar com trecho fora dos limites deve lançar RangeError', () => {
  expect(() => particionar([1, 2, 3], 0, 3)).toThrow(RangeError);
  expect(() => particionar([1, 2, 3], -1, 2)).toThrow(RangeError);
});
