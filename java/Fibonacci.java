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
public class Fibonacci {

    /**
     * Retorna os n primeiros termos da sequencia. O(n).
     */
    public static long[] fibonacciSerie(int n) {
        long[] serie = new long[n];

        long anterior = 0;
        long atual = 1;

        for (int i = 0; i < n; i++) {
            serie[i] = anterior;

            long proximo = anterior + atual;
            anterior = atual;
            atual = proximo;
        }

        return serie;
    }

    /**
     * Retorna o termo de posicao n (versao iterativa). O(n).
     */
    public static long fibonacci(int n) {
        if (n < 0) {
            throw new IllegalArgumentException("A posicao deve ser um inteiro nao negativo.");
        }

        long anterior = 0;
        long atual = 1;

        for (int i = 0; i < n; i++) {
            long proximo = anterior + atual;
            anterior = atual;
            atual = proximo;
        }

        return anterior;
    }

    /**
     * Versao recursiva - didatica, porem ineficiente: O(2^n).
     */
    public static long fibonacciRecursivo(int n) {
        if (n < 2) {
            return n;
        }

        return fibonacciRecursivo(n - 1) + fibonacciRecursivo(n - 2);
    }

    public static void main(String[] args) {
        System.out.println("=== 03 - FIBONACCI ===");

        long[] serie = fibonacciSerie(15);
        StringBuilder saida = new StringBuilder();
        for (int i = 0; i < serie.length; i++) {
            saida.append(serie[i]);
            if (i < serie.length - 1) {
                saida.append(", ");
            }
        }

        System.out.println("Primeiros 15 termos: " + saida);
        System.out.println("Termo de posicao 10 (iterativo): " + fibonacci(10));
        System.out.println("Termo de posicao 10 (recursivo): " + fibonacciRecursivo(10));
        System.out.println("Termo de posicao 30 (iterativo): " + fibonacci(30));
    }
}
