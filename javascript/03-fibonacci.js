/**
 * 03 - Fibonacci
 *
 * Sequencia onde cada termo, a partir do terceiro, e a soma dos dois
 * anteriores: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34 ...
 *
 * F(0) = 0
 * F(1) = 1
 * F(n) = F(n - 1) + F(n - 2), para n > 1
 */

// O numero JavaScript representa inteiros com exatidao ate 2^53 - 1.
// F(78) ainda cabe nesse limite; F(79) ja nao cabe.
const POSICAO_MAXIMA_EXATA = 78;

/**
 * Valida a posicao de um termo da sequencia.
 * - TypeError: o valor nao e um numero inteiro;
 * - RangeError: o valor e negativo ou excede o limite de precisao.
 */
function validarPosicao(posicao) {
  if (!Number.isInteger(posicao)) {
    throw new TypeError('A posicao deve ser um numero inteiro.');
  }

  if (posicao < 0) {
    throw new RangeError('A posicao deve ser um numero inteiro nao negativo.');
  }

  if (posicao > POSICAO_MAXIMA_EXATA) {
    throw new RangeError(
      `A posicao maxima e ${POSICAO_MAXIMA_EXATA}; acima disso o JavaScript perde precisao.`
    );
  }
}

/**
 * Retorna os primeiros termos da sequencia, na quantidade informada.
 * Quantidade 0 resulta em array vazio. Complexidade: O(n).
 */
function fibonacciSerie(quantidade) {
  if (!Number.isInteger(quantidade)) {
    throw new TypeError('A quantidade deve ser um numero inteiro.');
  }

  if (quantidade < 0) {
    throw new RangeError('A quantidade deve ser um numero inteiro nao negativo.');
  }

  if (quantidade > POSICAO_MAXIMA_EXATA + 1) {
    throw new RangeError(
      `A quantidade maxima e ${POSICAO_MAXIMA_EXATA + 1}; acima disso o JavaScript perde precisao.`
    );
  }

  const serie = [];

  let anterior = 0;
  let atual = 1;

  for (let contador = 0; contador < quantidade; contador += 1) {
    serie.push(anterior);

    const proximo = anterior + atual;
    anterior = atual;
    atual = proximo;
  }

  return serie;
}

/**
 * Retorna o termo de posicao informada (versao iterativa).
 * Complexidade: O(n).
 */
function fibonacci(posicao) {
  validarPosicao(posicao);

  let anterior = 0;
  let atual = 1;

  for (let contador = 0; contador < posicao; contador += 1) {
    const proximo = anterior + atual;
    anterior = atual;
    atual = proximo;
  }

  return anterior;
}

/**
 * Calculo recursivo do termo. Funcao auxiliar (a validacao e feita uma
 * unica vez, antes da primeira chamada).
 */
function calcularRecursivamente(posicao) {
  if (posicao < 2) {
    return posicao;
  }

  return calcularRecursivamente(posicao - 1) + calcularRecursivamente(posicao - 2);
}

/**
 * Versao recursiva - didatica, porem ineficiente: O(2^n).
 * Com posicoes acima de ~40 a execucao leva muito tempo.
 */
function fibonacciRecursivo(posicao) {
  validarPosicao(posicao);

  return calcularRecursivamente(posicao);
}

// ----- Demonstracao -----
// Executada apenas quando o arquivo roda direto no Node (node arquivo.js ou F5).
// No navegador (interface web) este bloco e ignorado.
// Os testes automatizados ficam na pasta tests/ (rode com "npm test").
if (typeof require !== 'undefined' && require.main === module) {
  console.log('=== 03 - FIBONACCI ===');
  console.log(`Primeiros 15 termos: ${fibonacciSerie(15).join(', ')}`);
  console.log(`Termo de posicao 10 (iterativo): ${fibonacci(10)}`);
  console.log(`Termo de posicao 10 (recursivo): ${fibonacciRecursivo(10)}`);
  console.log(`Termo de posicao 30 (iterativo): ${fibonacci(30)}`);
}

// Exporta as funcoes no Node. No navegador elas ficam disponiveis como globais.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fibonacci, fibonacciSerie, fibonacciRecursivo };
}
