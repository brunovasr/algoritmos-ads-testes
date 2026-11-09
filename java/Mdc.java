/**
 * 04 - Maximo divisor comum (MDC)
 *
 * O MDC de dois inteiros a e b e o maior inteiro que divide a e b.
 * Utilizamos o Algoritmo de Euclides: mdc(a, b) = mdc(b, a % b),
 * ate que o resto seja zero. Complexidade: O(log(min(a, b))).
 */
public class Mdc {

    /**
     * Versao iterativa do Algoritmo de Euclides.
     */
    public static int mdc(int a, int b) {
        int x = Math.abs(a);
        int y = Math.abs(b);

        while (y != 0) {
            int resto = x % y;
            x = y;
            y = resto;
        }

        return x;
    }

    /**
     * Versao recursiva do Algoritmo de Euclides.
     */
    public static int mdcRecursivo(int a, int b) {
        if (b == 0) {
            return Math.abs(a);
        }

        return mdcRecursivo(b, a % b);
    }

    /**
     * Minimo multiplo comum, obtido a partir do MDC.
     */
    public static long mmc(int a, int b) {
        if (a == 0 || b == 0) {
            return 0;
        }

        return Math.abs((long) a * b) / mdc(a, b);
    }

    public static void main(String[] args) {
        int[][] pares = { { 48, 18 }, { 270, 192 }, { 1071, 462 }, { 17, 5 }, { 100, 75 } };

        System.out.println("=== 04 - MAXIMO DIVISOR COMUM ===");
        for (int[] par : pares) {
            int a = par[0];
            int b = par[1];
            System.out.println("mdc(" + a + ", " + b + ") = " + mdc(a, b)
                    + "  |  mmc(" + a + ", " + b + ") = " + mmc(a, b));
        }

        System.out.println("\nVersao recursiva: mdc(270, 192) = " + mdcRecursivo(270, 192));
    }
}
