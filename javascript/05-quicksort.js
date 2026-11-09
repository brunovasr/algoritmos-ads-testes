/**
 * 05 - Ordenacao com Quicksort
 *
 * Algoritmo de divisao e conquista:
 * 1. Escolhe um elemento como pivo;
 * 2. Particiona o array deixando a esquerda os menores que o pivo e a
 *    direita os maiores (particao de Lomuto);
 * 3. Aplica o mesmo processo recursivamente nas duas metades.
 *
 * Complexidade: O(n log n) no caso medio e O(n^2) no pior caso.
 */

/**
 * Garante que o argumento e um array e que todos os elementos sao
 * numeros finitos (NaN e Infinity quebrariam as comparacoes).
 */
function validarListaParaOrdenacao(array) {
  if (!Array.isArray(array)) {
    throw new TypeError('Os dados devem ser informados em um array.');
  }

  array.forEach((valor, posicao) => {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError(`O elemento na posicao ${posicao} nao e um numero valido.`);
    }
  });
}

/**
 * Troca dois elementos de posicao no array.
 */
function trocar(array, posicaoA, posicaoB) {
  const temporario = array[posicaoA];
  array[posicaoA] = array[posicaoB];
  array[posicaoB] = temporario;
}

/**
 * Particiona o trecho [inicio, fim] do array usando o ultimo elemento
 * como pivo e devolve a posicao final do pivo.
 * Lanca RangeError se o trecho estiver fora dos limites do array.
 */
function particionar(array, inicio, fim) {
  if (!Number.isInteger(inicio) || !Number.isInteger(fim) || inicio < 0 || fim >= array.length) {
    throw new RangeError('O trecho informado esta fora dos limites do array.');
  }

  const pivo = array[fim];
  let indiceMenor = inicio - 1;

  for (let posicao = inicio; posicao < fim; posicao += 1) {
    if (array[posicao] <= pivo) {
      indiceMenor += 1;
      trocar(array, indiceMenor, posicao);
    }
  }

  trocar(array, indiceMenor + 1, fim);

  return indiceMenor + 1;
}

/**
 * Ordena o trecho [inicio, fim] do array de forma recursiva.
 * Funcao auxiliar (a validacao e feita uma unica vez, em quicksort).
 */
function ordenarTrecho(array, inicio, fim) {
  if (inicio < fim) {
    const posicaoPivo = particionar(array, inicio, fim);

    ordenarTrecho(array, inicio, posicaoPivo - 1);
    ordenarTrecho(array, posicaoPivo + 1, fim);
  }
}

/**
 * Ordena o array em ordem crescente, in-place (altera o proprio array
 * recebido) e o devolve. Lanca TypeError se a entrada for invalida.
 */
function quicksort(array) {
  validarListaParaOrdenacao(array);

  ordenarTrecho(array, 0, array.length - 1);

  return array;
}

/**
 * Versao que preserva o array original, retornando uma copia ordenada.
 */
function ordenar(array) {
  validarListaParaOrdenacao(array);

  return quicksort([...array]);
}

// ----- Demonstracao -----
// Executada apenas quando o arquivo roda direto no Node (node arquivo.js ou F5).
// No navegador (interface web) este bloco e ignorado.
// Os testes automatizados ficam na pasta tests/ (rode com "npm test").
if (typeof require !== 'undefined' && require.main === module) {
  const desordenado = [33, 10, 55, 71, 29, 3, 18, 92, 47, 2];

  console.log('=== 05 - ORDENACAO (QUICKSORT) ===');
  console.log(`Array original:  [${desordenado.join(', ')}]`);
  console.log(`Array ordenado:  [${ordenar(desordenado).join(', ')}]`);
  console.log(`Original intacto:[${desordenado.join(', ')}]`);

  const comRepetidos = [5, 1, 5, 3, 1, 9, 3];
  console.log(`\nCom repetidos:   [${comRepetidos.join(', ')}]`);
  console.log(`Ordenado:        [${ordenar(comRepetidos).join(', ')}]`);
}

// Exporta as funcoes no Node. No navegador elas ficam disponiveis como globais.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { quicksort, ordenar, particionar };
}
