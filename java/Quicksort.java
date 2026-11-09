import java.util.Arrays;

/**
 * 05 - Ordenacao com Quicksort
 *
 * Algoritmo de divisao e conquista:
 * 1. Escolhe um elemento como pivo;
 * 2. Particiona o vetor deixando a esquerda os menores que o pivo e a
 *    direita os maiores (particao de Lomuto);
 * 3. Aplica o mesmo processo recursivamente nas duas metades.
 *
 * Complexidade: O(n log n) no caso medio e O(n^2) no pior caso.
 */
public class Quicksort {

    /**
     * Troca dois elementos de posicao no vetor.
     */
    private static void trocar(int[] vetor, int i, int j) {
        int temporario = vetor[i];
        vetor[i] = vetor[j];
        vetor[j] = temporario;
    }

    /**
     * Particiona o vetor usando o ultimo elemento como pivo e devolve
     * a posicao final do pivo.
     */
    private static int particionar(int[] vetor, int inicio, int fim) {
        int pivo = vetor[fim];
        int indiceMenor = inicio - 1;

        for (int j = inicio; j < fim; j++) {
            if (vetor[j] <= pivo) {
                indiceMenor++;
                trocar(vetor, indiceMenor, j);
            }
        }

        trocar(vetor, indiceMenor + 1, fim);

        return indiceMenor + 1;
    }

    /**
     * Ordena o vetor in-place (altera o proprio vetor recebido).
     */
    public static void quicksort(int[] vetor, int inicio, int fim) {
        if (inicio < fim) {
            int posicaoPivo = particionar(vetor, inicio, fim);

            quicksort(vetor, inicio, posicaoPivo - 1);
            quicksort(vetor, posicaoPivo + 1, fim);
        }
    }

    /**
     * Versao que preserva o vetor original, retornando uma copia ordenada.
     */
    public static int[] ordenar(int[] vetor) {
        int[] copia = Arrays.copyOf(vetor, vetor.length);
        quicksort(copia, 0, copia.length - 1);

        return copia;
    }

    public static void main(String[] args) {
        int[] desordenado = { 33, 10, 55, 71, 29, 3, 18, 92, 47, 2 };

        System.out.println("=== 05 - ORDENACAO (QUICKSORT) ===");
        System.out.println("Vetor original:   " + Arrays.toString(desordenado));
        System.out.println("Vetor ordenado:   " + Arrays.toString(ordenar(desordenado)));
        System.out.println("Original intacto: " + Arrays.toString(desordenado));

        int[] comRepetidos = { 5, 1, 5, 3, 1, 9, 3 };
        System.out.println("\nCom repetidos:    " + Arrays.toString(comRepetidos));
        System.out.println("Ordenado:         " + Arrays.toString(ordenar(comRepetidos)));
    }
}
