/**
 * Ponte entre a interface web e os algoritmos em Java.
 *
 * A interface roda o Java dentro do navegador com o CheerpJ (uma JVM em
 * WebAssembly) e chama os metodos estaticos desta classe. Nenhum algoritmo
 * e reescrito aqui: cada metodo apenas converte a entrada, chama a classe
 * original da pasta java/ e mede o tempo com System.nanoTime().
 *
 * Toda resposta e um texto no formato "nanossegundos|valor", para que a
 * conversao entre Java e JavaScript fique simples e sem perda de precisao
 * (um long do Java nao cabe inteiro em um number do JavaScript).
 *
 * Vetores sao enviados e devolvidos como texto separado por virgulas.
 *
 * Para gerar o web/algoritmos.jar, rode web/java/compilar.sh.
 */
public class PonteWeb {

    private static final String SEPARADOR = "|";

    // ----- Conversoes -----

    private static int[] lerInteiros(String texto) {
        String[] partes = texto.split(",");
        int[] numeros = new int[partes.length];
        for (int i = 0; i < partes.length; i++) {
            numeros[i] = Integer.parseInt(partes[i].trim());
        }
        return numeros;
    }

    private static double[] lerReais(String texto) {
        String[] partes = texto.split(",");
        double[] numeros = new double[partes.length];
        for (int i = 0; i < partes.length; i++) {
            numeros[i] = Double.parseDouble(partes[i].trim());
        }
        return numeros;
    }

    private static String juntar(int[] vetor) {
        StringBuilder texto = new StringBuilder();
        for (int i = 0; i < vetor.length; i++) {
            if (i > 0) {
                texto.append(',');
            }
            texto.append(vetor[i]);
        }
        return texto.toString();
    }

    private static String juntar(long[] vetor) {
        StringBuilder texto = new StringBuilder();
        for (int i = 0; i < vetor.length; i++) {
            if (i > 0) {
                texto.append(',');
            }
            texto.append(vetor[i]);
        }
        return texto.toString();
    }

    private static String resposta(long inicio, Object valor) {
        long gasto = System.nanoTime() - inicio;
        return gasto + SEPARADOR + valor;
    }

    // ----- 01 - Numero primo -----

    public static String ehPrimo(int n) {
        long inicio = System.nanoTime();
        boolean valor = NumeroPrimo.ehPrimo(n);
        return resposta(inicio, valor);
    }

    public static String primosAte(int limite) {
        long inicio = System.nanoTime();
        String valor = NumeroPrimo.primosAte(limite);
        return resposta(inicio, valor);
    }

    // ----- 02 - Somatorio -----

    public static String somatorio(String numeros) {
        int[] vetor = lerInteiros(numeros);
        long inicio = System.nanoTime();
        long valor = Somatorio.somatorio(vetor);
        return resposta(inicio, valor);
    }

    public static String somatorioRecursivo(String numeros) {
        int[] vetor = lerInteiros(numeros);
        long inicio = System.nanoTime();
        long valor = Somatorio.somatorioRecursivo(vetor, 0);
        return resposta(inicio, valor);
    }

    public static String somatorioAte(int n) {
        long inicio = System.nanoTime();
        long valor = Somatorio.somatorioAte(n);
        return resposta(inicio, valor);
    }

    /** Monta o vetor {1, 2, ..., n} e soma um por um, para conferir a formula de Gauss. */
    public static String somatorioSequencia(int n) {
        int[] vetor = new int[n];
        for (int i = 0; i < n; i++) {
            vetor[i] = i + 1;
        }
        long inicio = System.nanoTime();
        long valor = Somatorio.somatorio(vetor);
        return resposta(inicio, valor);
    }

    // ----- 03 - Fibonacci -----

    public static String fibonacci(int n) {
        long inicio = System.nanoTime();
        long valor = Fibonacci.fibonacci(n);
        return resposta(inicio, valor);
    }

    public static String fibonacciRecursivo(int n) {
        long inicio = System.nanoTime();
        long valor = Fibonacci.fibonacciRecursivo(n);
        return resposta(inicio, valor);
    }

    public static String fibonacciSerie(int n) {
        long inicio = System.nanoTime();
        long[] valor = Fibonacci.fibonacciSerie(n);
        long gasto = System.nanoTime() - inicio;
        return gasto + SEPARADOR + juntar(valor);
    }

    // ----- 04 - MDC -----

    public static String mdc(int a, int b) {
        long inicio = System.nanoTime();
        int valor = Mdc.mdc(a, b);
        return resposta(inicio, valor);
    }

    public static String mdcRecursivo(int a, int b) {
        long inicio = System.nanoTime();
        int valor = Mdc.mdcRecursivo(a, b);
        return resposta(inicio, valor);
    }

    public static String mmc(int a, int b) {
        long inicio = System.nanoTime();
        long valor = Mdc.mmc(a, b);
        return resposta(inicio, valor);
    }

    // ----- 05 - Quicksort -----

    /** Devolve "nanossegundos|vetor ordenado|vetor original apos a chamada". */
    public static String ordenar(String numeros) {
        int[] vetor = lerInteiros(numeros);
        long inicio = System.nanoTime();
        int[] ordenado = Quicksort.ordenar(vetor);
        long gasto = System.nanoTime() - inicio;
        return gasto + SEPARADOR + juntar(ordenado) + SEPARADOR + juntar(vetor);
    }

    // ----- 06 - Contagem -----

    public static String contarInteiros(String dados) {
        double[] vetor = lerReais(dados);
        long inicio = System.nanoTime();
        int valor = Contagem.contarInteiros(vetor);
        return resposta(inicio, valor);
    }

    public static String contarNoIntervalo(String dados, double n) {
        double[] vetor = lerReais(dados);
        long inicio = System.nanoTime();
        int valor = Contagem.contarNoIntervalo(vetor, n);
        return resposta(inicio, valor);
    }

    /** Usado so para conferir a compilacao: java PonteWeb */
    public static void main(String[] args) {
        System.out.println(ehPrimo(97));
        System.out.println(somatorio("10, 25, 3, 47, 8, 15"));
        System.out.println(fibonacciSerie(10));
        System.out.println(mdc(48, 18) + "  " + mmc(48, 18));
        System.out.println(ordenar("33, 10, 55, 2"));
        System.out.println(contarNoIntervalo("4, 7.5, 12, 9, 20", 20));
    }
}
