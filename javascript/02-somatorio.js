/**
 * 02 - Somatorio
 *
 * Soma de um conjunto de numeros.
 * Sao apresentadas tres versoes: iterativa, recursiva e a soma de
 * 1 ate n usando a formula de Gauss: n * (n + 1) / 2.
 */

/**
 * Garante que o argumento e um array e que todos os elementos sao
 * numeros finitos. Lanca TypeError informando qual posicao e invalida.
 */
function validarListaDeNumeros(numeros) {
  if (!Array.isArray(numeros)) {
    throw new TypeError('Os dados devem ser informados em um array.');
  }

  numeros.forEach((valor, posicao) => {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError(`O elemento na posicao ${posicao} nao e um numero valido.`);
    }
  });
}

/**
 * Versao iterativa: percorre o array somando cada elemento.
 * Um array vazio resulta em 0. Complexidade: O(n).
 */
function somatorio(numeros) {
  validarListaDeNumeros(numeros);

  let soma = 0;

  for (let posicao = 0; posicao < numeros.length; posicao += 1) {
    soma += numeros[posicao];
  }

  return soma;
}

/**
 * Soma o elemento da posicao informada com o somatorio do restante.
 * Funcao auxiliar da versao recursiva (a validacao e feita uma unica vez).
 */
function somarAPartirDaPosicao(numeros, posicao) {
  if (posicao >= numeros.length) {
    return 0;
  }

  return numeros[posicao] + somarAPartirDaPosicao(numeros, posicao + 1);
}

/**
 * Versao recursiva: soma o primeiro elemento com o somatorio do restante.
 * Para arrays muito grandes (dezenas de milhares de itens) prefira a
 * versao iterativa, pois cada elemento ocupa um nivel da pilha de chamadas.
 */
function somatorioRecursivo(numeros) {
  validarListaDeNumeros(numeros);

  return somarAPartirDaPosicao(numeros, 0);
}

/**
 * Somatorio dos numeros de 1 ate o limite (formula de Gauss).
 * Para limites menores que 1 o resultado e 0.
 * Lanca TypeError se o limite nao for um numero inteiro.
 * Complexidade: O(1).
 */
function somatorioAte(limite) {
  if (!Number.isInteger(limite)) {
    throw new TypeError('O limite deve ser um numero inteiro.');
  }

  if (limite < 1) {
    return 0;
  }

  return (limite * (limite + 1)) / 2;
}

// ----- Demonstracao -----
// Executada apenas quando o arquivo roda direto no Node (node arquivo.js ou F5).
// No navegador (interface web) este bloco e ignorado.
// Os testes automatizados ficam na pasta tests/ (rode com "npm test").
if (typeof require !== 'undefined' && require.main === module) {
  const conjunto = [10, 25, 3, 47, 8, 15];

  console.log('=== 02 - SOMATORIO ===');
  console.log(`Conjunto: [${conjunto.join(', ')}]`);
  console.log(`Somatorio (iterativo): ${somatorio(conjunto)}`);
  console.log(`Somatorio (recursivo): ${somatorioRecursivo(conjunto)}`);
  console.log(`Somatorio de 1 ate 100 (Gauss): ${somatorioAte(100)}`);
}

// Exporta as funcoes no Node. No navegador elas ficam disponiveis como globais.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { somatorio, somatorioRecursivo, somatorioAte };
}
