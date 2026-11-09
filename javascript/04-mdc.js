/**
 * 04 - Maximo divisor comum (MDC)
 *
 * O MDC de dois inteiros a e b e o maior inteiro que divide a e b.
 * Utilizamos o Algoritmo de Euclides: mdc(a, b) = mdc(b, a % b),
 * ate que o resto seja zero. Complexidade: O(log(min(a, b))).
 */

/**
 * Garante que os dois valores sao numeros inteiros.
 * Lanca TypeError caso contrario (texto, decimal, NaN, Infinity...).
 */
function validarInteiros(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new TypeError('Os dois valores devem ser numeros inteiros.');
  }
}

/**
 * Versao iterativa do Algoritmo de Euclides.
 * O sinal dos valores e ignorado e mdc(0, 0) e 0.
 */
function mdc(a, b) {
  validarInteiros(a, b);

  let dividendo = Math.abs(a);
  let divisor = Math.abs(b);

  while (divisor !== 0) {
    const resto = dividendo % divisor;
    dividendo = divisor;
    divisor = resto;
  }

  return dividendo;
}

/**
 * Versao recursiva do Algoritmo de Euclides.
 */
function mdcRecursivo(a, b) {
  validarInteiros(a, b);

  if (b === 0) {
    return Math.abs(a);
  }

  return mdcRecursivo(b, a % b);
}

/**
 * Minimo multiplo comum, obtido a partir do MDC.
 * Se algum dos valores for 0, o resultado e 0.
 * Lanca RangeError se o resultado nao puder ser representado com exatidao.
 */
function mmc(a, b) {
  validarInteiros(a, b);

  if (a === 0 || b === 0) {
    return 0;
  }

  // Dividir antes de multiplicar evita estouro desnecessario.
  const multiplo = Math.abs((a / mdc(a, b)) * b);

  if (!Number.isSafeInteger(multiplo)) {
    throw new RangeError('O MMC e grande demais para ser representado com exatidao.');
  }

  return multiplo;
}

// ----- Demonstracao -----
// Executada apenas quando o arquivo roda direto no Node (node arquivo.js ou F5).
// No navegador (interface web) este bloco e ignorado.
// Os testes automatizados ficam na pasta tests/ (rode com "npm test").
if (typeof require !== 'undefined' && require.main === module) {
  const pares = [
    [48, 18],
    [270, 192],
    [1071, 462],
    [17, 5],
    [100, 75],
  ];

  console.log('=== 04 - MAXIMO DIVISOR COMUM ===');
  pares.forEach(([a, b]) => {
    console.log(`mdc(${a}, ${b}) = ${mdc(a, b)}  |  mmc(${a}, ${b}) = ${mmc(a, b)}`);
  });

  console.log(`\nVersao recursiva: mdc(270, 192) = ${mdcRecursivo(270, 192)}`);
}

// Exporta as funcoes no Node. No navegador elas ficam disponiveis como globais.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { mdc, mdcRecursivo, mmc };
}
