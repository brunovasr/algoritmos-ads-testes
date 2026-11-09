/**
 * 01 - Numero primo
 *
 * Um numero inteiro positivo n e primo quando possui exatamente dois
 * divisores: 1 e ele mesmo. Por definicao, 0 e 1 nao sao primos.
 *
 * Estrategia: testamos os divisores apenas ate a raiz quadrada de n,
 * pois se n = a * b, um dos fatores sempre e menor ou igual a raiz de n.
 * Complexidade: O(raiz de n).
 */

/**
 * Informa se o numero e primo.
 *
 * Programacao defensiva: qualquer entrada que nao seja um numero inteiro
 * maior ou igual a 2 (texto, decimal, NaN, negativo, 0 ou 1) simplesmente
 * nao e um numero primo, entao a resposta e false em vez de uma excecao.
 */
function ehPrimo(numero) {
  if (!Number.isInteger(numero) || numero < 2) {
    return false;
  }

  if (numero === 2) {
    return true;
  }

  if (numero % 2 === 0) {
    return false;
  }

  for (let divisor = 3; divisor * divisor <= numero; divisor += 2) {
    if (numero % divisor === 0) {
      return false;
    }
  }

  return true;
}

/**
 * Retorna a lista de todos os primos de 2 ate o limite informado.
 *
 * Lanca TypeError se o limite nao for um numero inteiro.
 * Para limites menores que 2 a lista retornada e vazia.
 */
function primosAte(limite) {
  if (!Number.isInteger(limite)) {
    throw new TypeError('O limite deve ser um numero inteiro.');
  }

  const primos = [];

  for (let numero = 2; numero <= limite; numero += 1) {
    if (ehPrimo(numero)) {
      primos.push(numero);
    }
  }

  return primos;
}

// ----- Demonstracao -----
// Executada apenas quando o arquivo roda direto no Node (node arquivo.js ou F5).
// No navegador (interface web) este bloco e ignorado.
// Os testes automatizados ficam na pasta tests/ (rode com "npm test").
if (typeof require !== 'undefined' && require.main === module) {
  const casosDeTeste = [1, 2, 7, 9, 17, 25, 29, 100, 97];

  console.log('=== 01 - NUMERO PRIMO ===');
  casosDeTeste.forEach((numero) => {
    console.log(`${numero} e primo? ${ehPrimo(numero) ? 'SIM' : 'NAO'}`);
  });

  console.log(`\nPrimos ate 50: ${primosAte(50).join(', ')}`);
}

// Exporta as funcoes no Node. No navegador elas ficam disponiveis como globais.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ehPrimo, primosAte };
}
