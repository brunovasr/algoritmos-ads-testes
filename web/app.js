/**
 * Interface web dos algoritmos.
 *
 * Cada algoritmo pode rodar em duas linguagens:
 *
 * - JavaScript: as funcoes (ehPrimo, somatorio, fibonacci, mdc, ordenar,
 *   contarInteiros...) NAO sao reescritas: elas vem dos arquivos da pasta
 *   javascript/, carregados antes deste script no index.html.
 *
 * - Java: as classes da pasta java/ sao compiladas em web/algoritmos.jar
 *   (script web/java/compilar.sh) e executadas no proprio navegador pelo
 *   CheerpJ, uma maquina virtual Java em WebAssembly. A classe PonteWeb
 *   apenas converte as entradas e chama os metodos originais.
 */
'use strict';

// ---------------------------------------------------------------------------
// Utilitarios
// ---------------------------------------------------------------------------

class ErroEntrada extends Error {}

const formatoNumero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 6 });
const formatoTempo = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const fmt = (numero) => formatoNumero.format(numero);

/** Executa a funcao e mede o tempo gasto, em milissegundos. */
function medir(funcao) {
  const inicio = performance.now();
  const valor = funcao();
  return { valor, ms: performance.now() - inicio };
}

function formatarTempo(ms) {
  return ms < 0.01 ? 'menos de 0,01 ms' : `${formatoTempo.format(ms)} ms`;
}

/** Mostra um valor do jeito que o JavaScript o escreveria. */
function formatarValor(valor) {
  if (Array.isArray(valor)) {
    return `[${valor.map(formatarValor).join(', ')}]`;
  }
  if (typeof valor === 'string') {
    return `'${valor}'`;
  }
  return String(valor);
}

/** Igual a formatarValor, mas corta listas muito longas. */
function resumirLista(lista, maximo = 200) {
  if (lista.length <= maximo) {
    return formatarValor(lista);
  }
  const inicio = lista.slice(0, maximo).map(formatarValor).join(', ');
  return `[${inicio}, … mais ${fmt(lista.length - maximo)} itens]`;
}

function escapar(texto) {
  const trocas = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(texto).replace(/[&<>"']/g, (caractere) => trocas[caractere]);
}

// ---------------------------------------------------------------------------
// Leitura e validacao das entradas
// ---------------------------------------------------------------------------

const PADRAO_INTEIRO = /^-?\d+$/;
const PADRAO_NUMERO = /^-?\d+(\.\d+)?$/;

function lerInteiro(texto, campo) {
  const valor = texto.trim();
  if (!PADRAO_INTEIRO.test(valor)) {
    throw new ErroEntrada(`${campo.rotulo}: informe um número inteiro, sem pontos ou vírgulas.`);
  }
  const numero = Number(valor);
  if (numero < campo.min || numero > campo.max) {
    throw new ErroEntrada(
      `${campo.rotulo}: use um valor entre ${fmt(campo.min)} e ${fmt(campo.max)}.`
    );
  }
  return numero;
}

function lerNumero(texto, campo) {
  const valor = texto.trim();
  if (!PADRAO_NUMERO.test(valor)) {
    throw new ErroEntrada(`${campo.rotulo}: informe um número. Use ponto para decimais.`);
  }
  return Number(valor);
}

function separarItens(texto, campo) {
  const itens = texto
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter((item) => item !== '');

  if (itens.length === 0) {
    throw new ErroEntrada(`${campo.rotulo}: informe pelo menos um valor.`);
  }
  if (itens.length > campo.max) {
    throw new ErroEntrada(`${campo.rotulo}: use no máximo ${fmt(campo.max)} valores.`);
  }
  return itens;
}

function lerListaNumeros(texto, campo) {
  return separarItens(texto, campo).map((item) => {
    if (!PADRAO_NUMERO.test(item)) {
      throw new ErroEntrada(
        `${campo.rotulo}: "${item}" não é um número. Separe os valores por vírgula ` +
          'e use ponto para decimais.'
      );
    }
    return Number(item);
  });
}

/** Lista que aceita textos: o que parece numero vira numero, o resto fica texto. */
function lerListaMista(texto, campo) {
  return separarItens(texto, campo).map((item) => (PADRAO_NUMERO.test(item) ? Number(item) : item));
}

/** Lista de inteiros de 32 bits, para os vetores int[] do Java. */
function lerListaInteiros(texto, campo) {
  return separarItens(texto, campo).map((item) => {
    if (!PADRAO_INTEIRO.test(item)) {
      throw new ErroEntrada(
        `${campo.rotulo}: "${item}" não é um número inteiro. No Java o vetor é int[], ` +
          'então use só inteiros separados por vírgula.'
      );
    }
    const numero = Number(item);
    if (numero < INT_MIN || numero > INT_MAX) {
      throw new ErroEntrada(
        `${campo.rotulo}: ${fmt(numero)} não cabe em um int (de ${fmt(INT_MIN)} a ${fmt(INT_MAX)}).`
      );
    }
    return numero;
  });
}

const LEITORES = {
  inteiro: lerInteiro,
  numero: lerNumero,
  lista: lerListaNumeros,
  listaInteiros: lerListaInteiros,
  mista: lerListaMista,
};

// ---------------------------------------------------------------------------
// Linguagens e execucao em Java (CheerpJ)
// ---------------------------------------------------------------------------

const INT_MIN = -2147483648;
const INT_MAX = 2147483647;

/** No CheerpJ cada chamada Java custa mais que no JavaScript puro; 32 ainda roda rapido. */
const LIMITE_RECURSIVO_JAVA = 32;

const LINGUAGENS = {
  javascript: { nome: 'JavaScript', pasta: 'javascript/' },
  java: { nome: 'Java', pasta: 'java/' },
};

const URL_CHEERPJ = 'https://cjrtnc.leaningtech.com/4.3/loader.js';
const CHAVE_LINGUAGEM = 'algoritmos-ads:linguagem';

function lerLinguagemSalva() {
  const daUrl = new URLSearchParams(window.location.search).get('linguagem');
  if (daUrl && LINGUAGENS[daUrl]) {
    return daUrl;
  }
  try {
    const salva = window.localStorage.getItem(CHAVE_LINGUAGEM);
    return LINGUAGENS[salva] ? salva : 'javascript';
  } catch {
    return 'javascript';
  }
}

function salvarLinguagem(linguagem) {
  try {
    window.localStorage.setItem(CHAVE_LINGUAGEM, linguagem);
  } catch {
    // Sem armazenamento (aba anonima, por exemplo): a escolha vale so nesta visita.
  }
}

let linguagemAtual = lerLinguagemSalva();

function carregarScript(url) {
  return new Promise((resolver, rejeitar) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolver;
    script.onerror = () => rejeitar(new Error('não foi possível baixar o CheerpJ. Verifique a conexão.'));
    document.head.appendChild(script);
  });
}

/**
 * Carrega o CheerpJ e o web/algoritmos.jar uma unica vez e devolve a
 * classe PonteWeb, cujos metodos estaticos chamam os algoritmos em Java.
 */
const motorJava = {
  promessa: null,
  pronto: false,

  carregar() {
    if (!this.promessa) {
      atualizarStatusJava('carregando');
      this.promessa = (async () => {
        if (typeof window.cheerpjInit !== 'function') {
          await carregarScript(URL_CHEERPJ);
        }
        await window.cheerpjInit({ status: 'none' });
        // O CheerpJ enxerga a raiz do site em /app/.
        const caminhoJar = `/app${new URL('algoritmos.jar', window.location.href).pathname}`;
        const biblioteca = await window.cheerpjRunLibrary(caminhoJar);
        return await biblioteca.PonteWeb;
      })();

      this.promessa.then(
        () => {
          this.pronto = true;
          atualizarStatusJava('pronto');
        },
        (erro) => {
          this.promessa = null;
          atualizarStatusJava('erro', erro);
        }
      );
    }
    return this.promessa;
  },
};

/**
 * Chama um metodo da PonteWeb. A resposta vem como "nanossegundos|valor|...".
 * Devolve o tempo em milissegundos e as partes do valor, ainda como texto.
 */
async function chamarJava(ponte, metodo, ...argumentos) {
  const resposta = String(await ponte[metodo](...argumentos));
  const [nanos, ...partes] = resposta.split('|');
  return { ms: Number(nanos) / 1e6, partes };
}

/** Le a mensagem de uma excecao vinda do Java (ou de um erro comum do JavaScript). */
async function mensagemDoErro(erro) {
  try {
    if (erro && typeof erro.getMessage === 'function') {
      const mensagem = await erro.getMessage();
      if (mensagem) {
        return String(mensagem);
      }
      return String(await erro.toString());
    }
  } catch {
    // segue para a mensagem generica abaixo
  }
  return erro && erro.message ? erro.message : String(erro);
}

/** Formata um long do Java (que chega como texto) sem perder precisao. */
function fmtLong(texto) {
  return formatoNumero.format(BigInt(texto));
}

/** Mostra um vetor do Java como o Arrays.toString faria, cortando listas longas. */
function vetorJavaTexto(csv, maximo = 200) {
  const itens = csv === '' ? [] : csv.split(',');
  if (itens.length <= maximo) {
    return `[${itens.join(', ')}]`;
  }
  return `[${itens.slice(0, maximo).join(', ')}, … mais ${fmt(itens.length - maximo)} itens]`;
}

/** Escreve um vetor como literal do Java para mostrar a chamada: new int[] {1, 2, …}. */
function literalJava(tipo, lista, maximo = 6) {
  const itens = lista.slice(0, maximo).map(String);
  if (lista.length > maximo) {
    itens.push('…');
  }
  return `new ${tipo}[] {${itens.join(', ')}}`;
}

/** Mostra um String do Java entre aspas duplas, cortando textos muito longos. */
function stringJava(texto, maximo = 200) {
  const itens = texto === '' ? [] : texto.split(', ');
  if (itens.length <= maximo) {
    return `"${texto}"`;
  }
  return `"${itens.slice(0, maximo).join(', ')}, …" (mais ${fmt(itens.length - maximo)} itens)`;
}

// ---------------------------------------------------------------------------
// Visualizacoes extras
// ---------------------------------------------------------------------------

function desenharBarras(titulo, valores) {
  const menor = Math.min(...valores);
  const maior = Math.max(...valores);
  const faixa = maior - menor || 1;

  const barras = valores
    .map((valor) => {
      const altura = 8 + ((valor - menor) / faixa) * 92;
      return `<span class="barra" style="height:${altura}%" title="${escapar(fmt(valor))}"></span>`;
    })
    .join('');

  return `
    <figure class="barras">
      <div class="barras-area" aria-hidden="true">${barras}</div>
      <figcaption>${escapar(titulo)}</figcaption>
    </figure>`;
}

function tabelaEuclides(a, b) {
  const passos = [];
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    passos.push([x, y, x % y]);
    const resto = x % y;
    x = y;
    y = resto;
  }

  if (passos.length === 0) {
    return '';
  }

  const linhas = passos
    .map(
      ([pa, pb, resto], i) => `
        <tr${i === passos.length - 1 ? ' class="final"' : ''}>
          <td>${i + 1}</td><td>${fmt(pa)}</td><td>${fmt(pb)}</td><td>${fmt(resto)}</td>
        </tr>`
    )
    .join('');

  return `
    <div class="tabela-rolagem">
      <table class="tabela">
        <caption>Passos do Algoritmo de Euclides: o MDC é o último divisor antes do resto zero.</caption>
        <thead><tr><th scope="col">Passo</th><th scope="col">a</th><th scope="col">b</th><th scope="col">a mod b</th></tr></thead>
        <tbody>${linhas}</tbody>
      </table>
    </div>`;
}

function fichasContagem(dados, n) {
  const primeiro = dados[0];
  const inferior = Math.min(primeiro, n);
  const superior = Math.max(primeiro, n);

  const fichas = dados
    .map((valor) => {
      let classe = 'ficha-fora';
      let descricao = 'não é inteiro';
      if (Number.isInteger(valor)) {
        const dentro = valor >= inferior && valor <= superior;
        classe = dentro ? 'ficha-intervalo' : 'ficha-inteiro';
        descricao = dentro ? 'inteiro dentro do intervalo' : 'inteiro fora do intervalo';
      }
      return `<li class="${classe}" title="${descricao}">${escapar(formatarValor(valor))}</li>`;
    })
    .join('');

  return `
    <ul class="fichas" aria-label="Classificação de cada valor">${fichas}</ul>
    <ul class="legenda">
      <li><span class="amostra ficha-intervalo"></span>inteiro, conta em (a) e (b)</li>
      <li><span class="amostra ficha-inteiro"></span>inteiro, conta só em (a)</li>
      <li><span class="amostra ficha-fora"></span>não é inteiro</li>
    </ul>`;
}

function listaAleatoria() {
  const tamanho = 12;
  const valores = Array.from({ length: tamanho }, () => 1 + Math.floor(Math.random() * 99));
  return valores.join(', ');
}

// ---------------------------------------------------------------------------
// Catalogo dos algoritmos
// Cada operacao le seus campos, chama as funcoes originais e devolve:
//   { resumo, linhas: [{ chamada, valor, ms }], nota?, extra? }
// ---------------------------------------------------------------------------

const ALGORITMOS = [
  {
    id: 'primo',
    numero: '01',
    titulo: 'Número primo',
    arquivo: '01-numero-primo.js',
    arquivoJava: 'NumeroPrimo.java',
    complexidade: 'O(√n)',
    descricao:
      'Um inteiro maior que 1 é primo quando só é divisível por 1 e por ele mesmo. ' +
      'A verificação descarta os pares e testa divisores ímpares até a raiz quadrada do número.',
    operacoes: [
      {
        titulo: 'Verificar um número',
        botao: 'Verificar',
        campos: [
          {
            nome: 'n',
            rotulo: 'Número',
            tipo: 'inteiro',
            valor: '97',
            min: -1e15,
            max: 1e15,
            java: {
              min: INT_MIN,
              max: INT_MAX,
              dica: 'No Java o parâmetro é int: de -2.147.483.648 a 2.147.483.647.',
            },
          },
        ],
        executar({ n }) {
          const r = medir(() => ehPrimo(n));
          return {
            resumo: r.valor ? `${fmt(n)} é primo.` : `${fmt(n)} não é primo.`,
            linhas: [{ chamada: `ehPrimo(${n})`, ...r }],
          };
        },
        async executarJava(ponte, { n }) {
          const r = await chamarJava(ponte, 'ehPrimo', n);
          const primo = r.partes[0] === 'true';
          return {
            resumo: primo ? `${fmt(n)} é primo.` : `${fmt(n)} não é primo.`,
            linhas: [{ chamada: `NumeroPrimo.ehPrimo(${n})`, texto: r.partes[0], ms: r.ms }],
          };
        },
      },
      {
        titulo: 'Listar os primos até um limite',
        botao: 'Listar primos',
        campos: [
          { nome: 'limite', rotulo: 'Limite', tipo: 'inteiro', valor: '50', min: 2, max: 200000 },
        ],
        executar({ limite }) {
          const r = medir(() => primosAte(limite));
          return {
            resumo: `Há ${fmt(r.valor.length)} números primos entre 2 e ${fmt(limite)}.`,
            linhas: [{ chamada: `primosAte(${limite})`, ...r }],
          };
        },
        async executarJava(ponte, { limite }) {
          // Em Java, primosAte devolve um String com os primos separados por ", ".
          const r = await chamarJava(ponte, 'primosAte', limite);
          const texto = r.partes.join('|');
          const quantidade = texto === '' ? 0 : texto.split(', ').length;
          return {
            resumo: `Há ${fmt(quantidade)} números primos entre 2 e ${fmt(limite)}.`,
            linhas: [{ chamada: `NumeroPrimo.primosAte(${limite})`, texto: stringJava(texto), ms: r.ms }],
            nota: 'Na versão Java, primosAte devolve um String, e não um vetor.',
          };
        },
      },
    ],
  },
  {
    id: 'somatorio',
    numero: '02',
    titulo: 'Somatório',
    arquivo: '02-somatorio.js',
    arquivoJava: 'Somatorio.java',
    complexidade: 'O(n) iterativo e recursivo, O(1) com Gauss',
    descricao:
      'Soma de um conjunto de números. A mesma lista passa pela versão iterativa e pela ' +
      'recursiva; a soma de 1 até n usa a fórmula de Gauss, n × (n + 1) / 2.',
    operacoes: [
      {
        titulo: 'Somar um conjunto',
        botao: 'Somar',
        campos: [
          {
            nome: 'numeros',
            rotulo: 'Números',
            tipo: 'lista',
            valor: '10, 25, 3, 47, 8, 15',
            max: 5000,
            dica: 'Separe por vírgula. Use ponto para decimais.',
            largo: true,
            java: {
              tipo: 'listaInteiros',
              max: 2000,
              dica: 'Separe por vírgula. No Java o vetor é int[], então só inteiros.',
            },
          },
        ],
        async executarJava(ponte, { numeros }) {
          const csv = numeros.join(',');
          const iterativo = await chamarJava(ponte, 'somatorio', csv);
          const recursivo = await chamarJava(ponte, 'somatorioRecursivo', csv);
          const literal = literalJava('int', numeros);
          return {
            resumo: `A soma dos ${fmt(numeros.length)} valores é ${fmtLong(iterativo.partes[0])}.`,
            linhas: [
              { chamada: `Somatorio.somatorio(${literal})`, texto: iterativo.partes[0], ms: iterativo.ms },
              {
                chamada: `Somatorio.somatorioRecursivo(${literal}, 0)`,
                texto: recursivo.partes[0],
                ms: recursivo.ms,
              },
            ],
          };
        },
        executar({ numeros }) {
          const iterativo = medir(() => somatorio(numeros));
          const recursivo = medir(() => somatorioRecursivo(numeros));
          const lista = resumirLista(numeros, 6);
          return {
            resumo: `A soma dos ${fmt(numeros.length)} valores é ${fmt(iterativo.valor)}.`,
            linhas: [
              { chamada: `somatorio(${lista})`, ...iterativo },
              { chamada: `somatorioRecursivo(${lista})`, ...recursivo },
            ],
          };
        },
      },
      {
        titulo: 'Somar de 1 até n (fórmula de Gauss)',
        botao: 'Calcular',
        campos: [
          { nome: 'n', rotulo: 'n', tipo: 'inteiro', valor: '100', min: 0, max: 100000000 },
        ],
        executar({ n }) {
          const gauss = medir(() => somatorioAte(n));
          const linhas = [{ chamada: `somatorioAte(${n})`, ...gauss }];
          let nota;

          if (n <= 1000000) {
            const sequencia = Array.from({ length: n }, (_, i) => i + 1);
            linhas.push({
              chamada: `somatorio([1, 2, …, ${n}])`,
              ...medir(() => somatorio(sequencia)),
            });
            nota = 'A segunda linha confere o resultado somando um por um. Compare os tempos.';
          } else {
            nota = 'A conferência somando um por um só roda até n = 1.000.000.';
          }

          return { resumo: `1 + 2 + … + ${fmt(n)} = ${fmt(gauss.valor)}`, linhas, nota };
        },
        async executarJava(ponte, { n }) {
          const gauss = await chamarJava(ponte, 'somatorioAte', n);
          const linhas = [{ chamada: `Somatorio.somatorioAte(${n})`, texto: gauss.partes[0], ms: gauss.ms }];
          let nota;

          if (n <= 1000000) {
            const conferencia = await chamarJava(ponte, 'somatorioSequencia', n);
            linhas.push({
              chamada: `Somatorio.somatorio(new int[] {1, 2, …, ${n}})`,
              texto: conferencia.partes[0],
              ms: conferencia.ms,
            });
            nota = 'A segunda linha confere o resultado somando um por um. Compare os tempos.';
          } else {
            nota = 'A conferência somando um por um só roda até n = 1.000.000.';
          }

          return { resumo: `1 + 2 + … + ${fmt(n)} = ${fmtLong(gauss.partes[0])}`, linhas, nota };
        },
      },
    ],
  },
  {
    id: 'fibonacci',
    numero: '03',
    titulo: 'Fibonacci',
    arquivo: '03-fibonacci.js',
    arquivoJava: 'Fibonacci.java',
    complexidade: 'O(n) iterativo, O(2ⁿ) recursivo',
    descricao:
      'Cada termo, a partir do terceiro, é a soma dos dois anteriores: 0, 1, 1, 2, 3, 5, 8… ' +
      'Rode as duas versões com o mesmo n e compare o tempo.',
    operacoes: [
      {
        titulo: 'Termo da posição n',
        botao: 'Calcular termo',
        campos: [
          {
            nome: 'n',
            rotulo: 'Posição',
            tipo: 'inteiro',
            valor: '25',
            min: 0,
            max: 78,
            dica: 'De 0 a 78, limite de precisão dos números no JavaScript.',
            java: { max: 92, dica: 'De 0 a 92, limite do tipo long no Java.' },
          },
        ],
        async executarJava(ponte, { n }) {
          const iterativo = await chamarJava(ponte, 'fibonacci', n);
          const linhas = [{ chamada: `Fibonacci.fibonacci(${n})`, texto: iterativo.partes[0], ms: iterativo.ms }];
          let nota;

          if (n <= LIMITE_RECURSIVO_JAVA) {
            const recursivo = await chamarJava(ponte, 'fibonacciRecursivo', n);
            linhas.push({
              chamada: `Fibonacci.fibonacciRecursivo(${n})`,
              texto: recursivo.partes[0],
              ms: recursivo.ms,
            });
          } else {
            nota =
              `A versão recursiva só roda até a posição ${LIMITE_RECURSIVO_JAVA}. Acima disso o ` +
              'número de chamadas explode e a página travaria.';
          }

          return { resumo: `F(${n}) = ${fmtLong(iterativo.partes[0])}`, linhas, nota };
        },
        executar({ n }) {
          const iterativo = medir(() => fibonacci(n));
          const linhas = [{ chamada: `fibonacci(${n})`, ...iterativo }];
          let nota;

          if (n <= 35) {
            linhas.push({ chamada: `fibonacciRecursivo(${n})`, ...medir(() => fibonacciRecursivo(n)) });
          } else {
            nota =
              'A versão recursiva só roda até a posição 35. Acima disso o número de chamadas ' +
              'explode e a página travaria.';
          }

          return { resumo: `F(${n}) = ${fmt(iterativo.valor)}`, linhas, nota };
        },
      },
      {
        titulo: 'Primeiros n termos',
        botao: 'Gerar sequência',
        campos: [
          {
            nome: 'n',
            rotulo: 'Quantidade',
            tipo: 'inteiro',
            valor: '15',
            min: 1,
            max: 79,
            java: { max: 93 },
          },
        ],
        async executarJava(ponte, { n }) {
          const r = await chamarJava(ponte, 'fibonacciSerie', n);
          const termos = r.partes[0].split(',');
          return {
            resumo: `Os ${fmt(n)} primeiros termos vão de 0 até ${fmtLong(termos[termos.length - 1])}.`,
            linhas: [{ chamada: `Fibonacci.fibonacciSerie(${n})`, texto: vetorJavaTexto(r.partes[0]), ms: r.ms }],
          };
        },
        executar({ n }) {
          const r = medir(() => fibonacciSerie(n));
          return {
            resumo: `Os ${fmt(n)} primeiros termos vão de 0 até ${fmt(r.valor[r.valor.length - 1])}.`,
            linhas: [{ chamada: `fibonacciSerie(${n})`, ...r }],
          };
        },
      },
    ],
  },
  {
    id: 'mdc',
    numero: '04',
    titulo: 'Máximo divisor comum',
    arquivo: '04-mdc.js',
    arquivoJava: 'Mdc.java',
    complexidade: 'O(log(min(a, b)))',
    descricao:
      'O Algoritmo de Euclides troca o par (a, b) por (b, a mod b) até o resto ser zero. ' +
      'O MMC sai do MDC: |a × b| / mdc(a, b).',
    operacoes: [
      {
        titulo: 'MDC e MMC de dois números',
        botao: 'Calcular',
        campos: [
          { nome: 'a', rotulo: 'a', tipo: 'inteiro', valor: '48', min: -10000000, max: 10000000 },
          { nome: 'b', rotulo: 'b', tipo: 'inteiro', valor: '18', min: -10000000, max: 10000000 },
        ],
        executar({ a, b }) {
          const iterativo = medir(() => mdc(a, b));
          const recursivo = medir(() => mdcRecursivo(a, b));
          const multiplo = medir(() => mmc(a, b));
          return {
            resumo: `O MDC de ${fmt(a)} e ${fmt(b)} é ${fmt(iterativo.valor)} e o MMC é ${fmt(multiplo.valor)}.`,
            linhas: [
              { chamada: `mdc(${a}, ${b})`, ...iterativo },
              { chamada: `mdcRecursivo(${a}, ${b})`, ...recursivo },
              { chamada: `mmc(${a}, ${b})`, ...multiplo },
            ],
            extra: tabelaEuclides(a, b),
          };
        },
        async executarJava(ponte, { a, b }) {
          const iterativo = await chamarJava(ponte, 'mdc', a, b);
          const recursivo = await chamarJava(ponte, 'mdcRecursivo', a, b);
          const multiplo = await chamarJava(ponte, 'mmc', a, b);
          return {
            resumo:
              `O MDC de ${fmt(a)} e ${fmt(b)} é ${fmtLong(iterativo.partes[0])} ` +
              `e o MMC é ${fmtLong(multiplo.partes[0])}.`,
            linhas: [
              { chamada: `Mdc.mdc(${a}, ${b})`, texto: iterativo.partes[0], ms: iterativo.ms },
              { chamada: `Mdc.mdcRecursivo(${a}, ${b})`, texto: recursivo.partes[0], ms: recursivo.ms },
              { chamada: `Mdc.mmc(${a}, ${b})`, texto: multiplo.partes[0], ms: multiplo.ms },
            ],
            extra: tabelaEuclides(a, b),
          };
        },
      },
    ],
  },
  {
    id: 'quicksort',
    numero: '05',
    titulo: 'Ordenação com Quicksort',
    arquivo: '05-quicksort.js',
    arquivoJava: 'Quicksort.java',
    complexidade: 'O(n log n) no caso médio, O(n²) no pior caso',
    descricao:
      'Escolhe o último elemento como pivô, deixa os menores à esquerda e os maiores à direita ' +
      'e repete nas duas metades. A função ordenar() devolve uma cópia e preserva a lista original.',
    operacoes: [
      {
        titulo: 'Ordenar uma lista',
        botao: 'Ordenar',
        campos: [
          {
            nome: 'lista',
            rotulo: 'Lista',
            tipo: 'lista',
            valor: '33, 10, 55, 71, 29, 3, 18, 92, 47, 2',
            max: 2000,
            dica: 'Separe por vírgula. Aceita negativos e decimais.',
            largo: true,
            sortear: listaAleatoria,
            java: {
              tipo: 'listaInteiros',
              dica: 'Separe por vírgula. No Java o vetor é int[]: aceita negativos, mas não decimais.',
            },
          },
        ],
        async executarJava(ponte, { lista }) {
          const r = await chamarJava(ponte, 'ordenar', lista.join(','));
          const [ordenadoCsv, originalCsv] = r.partes;
          const ordenado = ordenadoCsv.split(',').map(Number);
          const graficos =
            lista.length <= 60
              ? `<div class="par-barras">${desenharBarras('Antes', lista)}${desenharBarras('Depois', ordenado)}</div>`
              : '';

          return {
            resumo: `${fmt(lista.length)} valores em ordem crescente.`,
            linhas: [
              { chamada: `Quicksort.ordenar(${literalJava('int', lista)})`, texto: vetorJavaTexto(ordenadoCsv), ms: r.ms },
              { chamada: 'vetor original após a chamada', texto: vetorJavaTexto(originalCsv) },
            ],
            extra: graficos,
          };
        },
        executar({ lista }) {
          const r = medir(() => ordenar(lista));
          const graficos =
            lista.length <= 60
              ? `<div class="par-barras">${desenharBarras('Antes', lista)}${desenharBarras('Depois', r.valor)}</div>`
              : '';

          return {
            resumo: `${fmt(lista.length)} valores em ordem crescente.`,
            linhas: [
              { chamada: `ordenar(${resumirLista(lista, 6)})`, ...r },
              { chamada: 'lista original após a chamada', valor: lista },
            ],
            extra: graficos,
          };
        },
      },
    ],
  },
  {
    id: 'contagem',
    numero: '06',
    titulo: 'Contagem',
    arquivo: '06-contagem.js',
    arquivoJava: 'Contagem.java',
    complexidade: 'O(n)',
    descricao:
      'Conta os valores inteiros de um conjunto com N dados. (a) conta todos os inteiros; ' +
      '(b) conta só os inteiros entre o primeiro dado e o valor N informado.',
    operacoes: [
      {
        titulo: 'Contar inteiros do conjunto',
        botao: 'Contar',
        campos: [
          {
            nome: 'dados',
            rotulo: 'Dados',
            tipo: 'mista',
            valor: '4, 7.5, 12, 9, texto, 20, 3, 15.2, 18, 25',
            max: 5000,
            dica: 'Separe por vírgula. Pode misturar textos e decimais.',
            largo: true,
            java: {
              tipo: 'lista',
              valor: '4, 7.5, 12, 9, 20, 3, 15.2, 18, 25',
              dica: 'Separe por vírgula e use ponto para decimais. No Java o vetor é double[], então textos não entram.',
            },
          },
          { nome: 'n', rotulo: 'N', tipo: 'numero', valor: '20' },
        ],
        async executarJava(ponte, { dados, n }) {
          const csv = dados.join(',');
          const a = await chamarJava(ponte, 'contarInteiros', csv);
          const b = await chamarJava(ponte, 'contarNoIntervalo', csv, n);
          const literal = literalJava('double', dados, 4);
          return {
            resumo:
              `${fmtLong(a.partes[0])} dos ${fmt(dados.length)} dados são inteiros; ` +
              `${fmtLong(b.partes[0])} deles estão entre ${fmt(dados[0])} e ${fmt(n)}.`,
            linhas: [
              { chamada: `Contagem.contarInteiros(${literal})`, texto: a.partes[0], ms: a.ms },
              { chamada: `Contagem.contarNoIntervalo(${literal}, ${n})`, texto: b.partes[0], ms: b.ms },
            ],
            extra: fichasContagem(dados, n),
          };
        },
        executar({ dados, n }) {
          const a = medir(() => contarInteiros(dados));
          const b = medir(() => contarNoIntervalo(dados, n));
          const lista = resumirLista(dados, 4);
          const primeiroEhNumero = typeof dados[0] === 'number';

          return {
            resumo:
              `${fmt(a.valor)} dos ${fmt(dados.length)} dados são inteiros` +
              (primeiroEhNumero
                ? `; ${fmt(b.valor)} deles estão entre ${fmt(dados[0])} e ${fmt(n)}.`
                : '.'),
            linhas: [
              { chamada: `contarInteiros(${lista})`, ...a },
              { chamada: `contarNoIntervalo(${lista}, ${n})`, ...b },
            ],
            nota: primeiroEhNumero
              ? undefined
              : 'O primeiro dado não é um número, então o intervalo de (b) fica indefinido e a contagem dá 0.',
            extra: primeiroEhNumero ? fichasContagem(dados, n) : '',
          };
        },
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Renderizacao
// ---------------------------------------------------------------------------

const elementoLista = document.getElementById('lista-algoritmos');
const elementoPainel = document.getElementById('painel');

function renderizarIndice(idAtual) {
  elementoLista.innerHTML = ALGORITMOS.map(
    (alg) => `
      <li>
        <a href="#${alg.id}" class="item-indice"${alg.id === idAtual ? ' aria-current="page"' : ''}>
          <span class="item-numero">${alg.numero}</span>
          <span class="item-titulo"><span>${escapar(alg.titulo)}</span></span>
        </a>
      </li>`
  ).join('');
}

/** Aplica as diferencas do campo na linguagem atual (tipo, limites, dica...). */
function campoNaLinguagem(campo) {
  return linguagemAtual === 'java' && campo.java ? { ...campo, ...campo.java } : campo;
}

function renderizarCampo(campo, indiceOperacao) {
  const id = `campo-${indiceOperacao}-${campo.nome}`;
  const modoTeclado = campo.tipo === 'inteiro' ? 'numeric' : campo.tipo === 'numero' ? 'decimal' : 'text';
  const dica = campo.dica ? `<span class="dica" id="${id}-dica">${escapar(campo.dica)}</span>` : '';
  const sortear = campo.sortear
    ? `<button type="button" class="botao-secundario" data-sortear="${campo.nome}">Sortear valores</button>`
    : '';

  return `
    <div class="campo${campo.largo ? ' campo-largo' : ''}">
      <label for="${id}">${escapar(campo.rotulo)}</label>
      <div class="campo-linha">
        <input id="${id}" name="${campo.nome}" type="text" inputmode="${modoTeclado}"
          value="${escapar(campo.valor)}" autocomplete="off" spellcheck="false"
          ${campo.dica ? `aria-describedby="${id}-dica"` : ''}>
        ${sortear}
      </div>
      ${dica}
    </div>`;
}

function renderizarPainel(alg) {
  const operacoes = alg.operacoes
    .map(
      (op, i) => `
      <form class="operacao" data-operacao="${i}" novalidate>
        <h3>${escapar(op.titulo)}</h3>
        <div class="campos">
          ${op.campos.map((campo) => renderizarCampo(campoNaLinguagem(campo), i)).join('')}
          <button type="submit" class="botao">${escapar(op.botao)}</button>
        </div>
        <output class="resultado" aria-live="polite">
          <p class="vazio">O resultado aparece aqui.</p>
        </output>
      </form>`
    )
    .join('');

  elementoPainel.innerHTML = `
    <article>
      <header class="painel-cabecalho">
        <span class="painel-numero" aria-hidden="true">${alg.numero}</span>
        <div>
          <h2>${escapar(alg.titulo)}</h2>
          <p class="descricao">${escapar(alg.descricao)}</p>
        </div>
      </header>
      <dl class="ficha-tecnica">
        <div><dt>Complexidade</dt><dd>${escapar(alg.complexidade)}</dd></div>
        <div><dt>Arquivo</dt><dd><code>${escapar(caminhoArquivo(alg))}</code></dd></div>
        <div><dt>Execução</dt><dd>${escapar(descricaoExecucao())}</dd></div>
      </dl>
      ${operacoes}
    </article>`;

  elementoPainel.querySelectorAll('form.operacao').forEach((form) => {
    const operacao = alg.operacoes[Number(form.dataset.operacao)];

    form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      executarOperacao(form, operacao);
    });

    form.querySelectorAll('[data-sortear]').forEach((botao) => {
      const campo = operacao.campos.find((c) => c.nome === botao.dataset.sortear);
      botao.addEventListener('click', () => {
        form.elements[campo.nome].value = campo.sortear();
        executarOperacao(form, operacao);
      });
    });
  });
}

function caminhoArquivo(alg) {
  return linguagemAtual === 'java' ? `java/${alg.arquivoJava}` : `javascript/${alg.arquivo}`;
}

function descricaoExecucao() {
  return linguagemAtual === 'java'
    ? 'Java 8 no navegador via CheerpJ; tempo medido com System.nanoTime()'
    : 'JavaScript do navegador; tempo medido com performance.now()';
}

function mostrarErro(saida, mensagem) {
  const paragrafo = document.createElement('p');
  paragrafo.className = 'erro';
  paragrafo.setAttribute('role', 'alert');
  paragrafo.textContent = mensagem;
  saida.replaceChildren(paragrafo);
}

async function executarOperacao(form, operacao) {
  const saida = form.querySelector('output');
  const botao = form.querySelector('button[type="submit"]');
  const linguagem = linguagemAtual;

  let valores;
  try {
    valores = {};
    operacao.campos.map(campoNaLinguagem).forEach((campo) => {
      valores[campo.nome] = LEITORES[campo.tipo](form.elements[campo.nome].value, campo);
    });
  } catch (erro) {
    mostrarErro(saida, erro instanceof ErroEntrada ? erro.message : `A execução falhou: ${erro.message}`);
    return;
  }

  if (linguagem === 'javascript') {
    try {
      saida.innerHTML = renderizarResultado(operacao.executar(valores));
    } catch (erro) {
      mostrarErro(saida, `A execução falhou: ${erro.message}`);
    }
    return;
  }

  // Java: roda de forma assincrona, pela JVM do CheerpJ.
  botao.disabled = true;
  const aviso = document.createElement('p');
  aviso.className = 'vazio';
  aviso.textContent = motorJava.pronto
    ? 'Executando em Java…'
    : 'Iniciando a máquina virtual Java no navegador. Na primeira vez isso leva alguns segundos…';
  saida.replaceChildren(aviso);

  try {
    const ponte = await motorJava.carregar();
    const resultado = await operacao.executarJava(ponte, valores);
    saida.innerHTML = renderizarResultado(resultado);
  } catch (erro) {
    mostrarErro(saida, `A execução em Java falhou: ${await mensagemDoErro(erro)}`);
  } finally {
    botao.disabled = false;
  }
}

function valorExibido(valor) {
  return Array.isArray(valor) ? resumirLista(valor) : formatarValor(valor);
}

function renderizarResultado({ resumo, linhas, nota, extra }) {
  const itens = linhas
    .map(
      (linha) => `
      <li>
        <code class="chamada">${escapar(linha.chamada)}</code>
        <span class="seta">${linha.ms === undefined ? 'continua' : 'retorna'}</span>
        <code class="retorno">${escapar(linha.texto ?? valorExibido(linha.valor))}</code>
        ${linha.ms === undefined ? '' : `<span class="tempo">${formatarTempo(linha.ms)}</span>`}
      </li>`
    )
    .join('');

  return `
    <p class="resumo"><mark>${escapar(resumo)}</mark></p>
    <ul class="chamadas">${itens}</ul>
    ${nota ? `<p class="nota">${escapar(nota)}</p>` : ''}
    ${extra || ''}`;
}

// ---------------------------------------------------------------------------
// Navegacao pelo endereco (#primo, #fibonacci...)
// ---------------------------------------------------------------------------

function abrirPelaUrl(focar) {
  const id = window.location.hash.slice(1);
  const alg = ALGORITMOS.find((item) => item.id === id) || ALGORITMOS[0];

  renderizarIndice(alg.id);
  renderizarPainel(alg);
  document.title = `${alg.titulo} | Algoritmos ADS`;

  if (focar) {
    elementoPainel.focus({ preventScroll: true });
    if (window.matchMedia('(max-width: 760px)').matches) {
      elementoPainel.scrollIntoView({ block: 'start' });
    }
  }
}

// ---------------------------------------------------------------------------
// Seletor de linguagem (JavaScript ou Java)
// ---------------------------------------------------------------------------

const elementoStatusJava = document.getElementById('status-java');

function atualizarStatusJava(estado, erro) {
  if (linguagemAtual !== 'java') {
    elementoStatusJava.hidden = true;
    return;
  }

  const textos = {
    carregando: 'Carregando a máquina virtual Java (CheerpJ). Na primeira vez leva alguns segundos…',
    pronto: 'Java pronto: as classes da pasta java/ rodam no navegador, sem servidor.',
  };

  elementoStatusJava.hidden = false;
  elementoStatusJava.dataset.estado = estado;
  elementoStatusJava.textContent =
    estado === 'erro'
      ? `Não foi possível iniciar o Java: ${erro && erro.message ? erro.message : erro}`
      : textos[estado];
}

function aplicarLinguagem(linguagem) {
  linguagemAtual = linguagem;
  const info = LINGUAGENS[linguagem];

  document.getElementById('titulo-linguagem').textContent = info.nome;
  document.getElementById('pasta-linguagem').textContent = info.pasta;
  document.querySelectorAll('input[name="linguagem"]').forEach((opcao) => {
    opcao.checked = opcao.value === linguagem;
  });

  if (linguagem === 'java') {
    atualizarStatusJava(motorJava.pronto ? 'pronto' : 'carregando');
    // Comeca a baixar a JVM ja na escolha, para a primeira execucao ser mais rapida.
    motorJava.carregar().catch(() => {});
  } else {
    atualizarStatusJava();
  }
}

document.querySelectorAll('input[name="linguagem"]').forEach((opcao) => {
  opcao.addEventListener('change', () => {
    if (!opcao.checked) {
      return;
    }
    salvarLinguagem(opcao.value);
    aplicarLinguagem(opcao.value);
    abrirPelaUrl(false);
  });
});

window.addEventListener('hashchange', () => abrirPelaUrl(true));
aplicarLinguagem(linguagemAtual);
abrirPelaUrl(false);
