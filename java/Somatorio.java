/**
 * 02 - Somatorio
 *
 * Soma de um conjunto de numeros.
 * Sao apresentadas tres versoes: iterativa, recursiva e a soma de
 * 1 ate n usando a formula de Gauss: n * (n + 1) / 2.
 */
public class Somatorio {

    /**
     * Versao iterativa: percorre o vetor somando cada elemento. O(n).
     */
    public static long somatorio(int[] numeros) {
        long soma = 0;

        for (int i = 0; i < numeros.length; i++) {
            soma += numeros[i];
        }

        return soma;
    }

    /**
     * Versao recursiva: soma o primeiro elemento com o somatorio do restante.
     */
    public static long somatorioRecursivo(int[] numeros, int indice) {
        if (indice >= numeros.length) {
            return 0;
        }

        return numeros[indice] + somatorioRecursivo(numeros, indice + 1);
    }

    /**
     * Somatorio dos numeros de 1 ate n (formula de Gauss). O(1).
     */
    public static long somatorioAte(int n) {
        if (n < 1) {
            return 0;
        }

        return ((long) n * (n + 1)) / 2;
    }

    public static void main(String[] args) {
        int[] conjunto = { 10, 25, 3, 47, 8, 15 };

        System.out.println("=== 02 - SOMATORIO ===");
        System.out.print("Conjunto: [");
        for (int i = 0; i < conjunto.length; i++) {
            System.out.print(conjunto[i] + (i < conjunto.length - 1 ? ", " : ""));
        }
        System.out.println("]");

        System.out.println("Somatorio (iterativo): " + somatorio(conjunto));
        System.out.println("Somatorio (recursivo): " + somatorioRecursivo(conjunto, 0));
        System.out.println("Somatorio de 1 ate 100 (Gauss): " + somatorioAte(100));
    }
}
