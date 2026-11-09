/**
 * 06 - Contagem
 *
 * Dado um conjunto com N dados de entrada, contar quantos valores
 * inteiros existem nesse conjunto, do primeiro dado (inclusive)
 * ate o dado N (inclusive).
 *
 * Sao apresentadas duas leituras do enunciado:
 *  a) contarInteiros  - percorre as N posicoes e conta quantos valores
 *     sao numeros inteiros;
 *  b) contarNoIntervalo - conta quantos valores estao dentro do
 *     intervalo numerico [primeiro valor, N].
 *
 * Complexidade: O(n) em ambas.
 */

/**
 * Garante que os dados foram informados em um array.
 * Os elementos podem ser de qualquer tipo: os que nao forem numeros
 * inteiros simplesmente nao entram na contagem.
 */
function validarConjuntoDeDados(dados) {
  if (!Array.isArray(dados)) {
    throw new TypeError('Os dados devem ser informados em um array.');
  }
}

/**
 * (a) Conta quantos valores inteiros existem da posicao 1 ate a posicao N.
 * Textos, decimais, NaN e outros tipos sao ignorados.
 */
function contarInteiros(dados) {
  validarConjuntoDeDados(dados);

  let quantidade = 0;

  for (let posicao = 0; posicao < dados.length; posicao += 1) {
    if (Number.isInteger(dados[posicao])) {
      quantidade += 1;
    }
  }

  return quantidade;
}

/**
 * (b) Conta quantos valores inteiros do conjunto estao no intervalo
 * fechado entre o primeiro dado e o valor N informado.
 *
 * - Lanca TypeError se os dados nao forem um array ou se N nao for um
 *   numero finito;
 * - Se o conjunto for vazio, ou se o primeiro dado nao for um numero,
 *   nao existe intervalo definido e o resultado e 0.
 */
function contarNoIntervalo(dados, n) {
  validarConjuntoDeDados(dados);

  if (typeof n !== 'number' || !Number.isFinite(n)) {
    throw new TypeError('O valor N deve ser um numero finito.');
  }

  const primeiro = dados[0];

  if (dados.length === 0 || typeof primeiro !== 'number') {
    return 0;
  }

  const limiteInferior = Math.min(primeiro, n);
  const limiteSuperior = Math.max(primeiro, n);

  let quantidade = 0;

  for (let posicao = 0; posicao < dados.length; posicao += 1) {
    const valor = dados[posicao];

    if (Number.isInteger(valor) && valor >= limiteInferior && valor <= limiteSuperior) {
      quantidade += 1;
    }
  }

  return quantidade;
}

// ----- Demonstracao -----
// Executada apenas quando o arquivo roda direto no Node (node arquivo.js ou F5).
// No navegador (interface web) este bloco e ignorado.
// Os testes automatizados ficam na pasta tests/ (rode com "npm test").
if (typeof require !== 'undefined' && require.main === module) {
  const conjuntoDeDados = [4, 7.5, 12, 9, 'texto', 20, 3, 15.2, 18, 25];

  console.log('=== 06 - CONTAGEM ===');
  console.log(`Conjunto de dados: [${conjuntoDeDados.join(', ')}]`);
  console.log(`Total de elementos (N): ${conjuntoDeDados.length}`);
  console.log(`(a) Valores inteiros no conjunto: ${contarInteiros(conjuntoDeDados)}`);

  const n = 20;
  console.log(
    `(b) Inteiros entre o primeiro dado (${conjuntoDeDados[0]}) e N (${n}): ` +
      `${contarNoIntervalo(conjuntoDeDados, n)}`
  );
}

// Exporta as funcoes no Node. No navegador elas ficam disponiveis como globais.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { contarInteiros, contarNoIntervalo };
}
