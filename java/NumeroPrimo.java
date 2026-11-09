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
public class NumeroPrimo {

    public static boolean ehPrimo(int n) {
        if (n < 2) {
            return false;
        }

        if (n == 2) {
            return true;
        }

        if (n % 2 == 0) {
            return false;
        }

        for (int divisor = 3; (long) divisor * divisor <= n; divisor += 2) {
            if (n % divisor == 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * Imprime todos os primos de 2 ate o limite informado.
     */
    public static String primosAte(int limite) {
        StringBuilder primos = new StringBuilder();

        for (int numero = 2; numero <= limite; numero++) {
            if (ehPrimo(numero)) {
                if (primos.length() > 0) {
                    primos.append(", ");
                }
                primos.append(numero);
            }
        }

        return primos.toString();
    }

    public static void main(String[] args) {
        int[] casosDeTeste = { 1, 2, 7, 9, 17, 25, 29, 100, 97 };

        System.out.println("=== 01 - NUMERO PRIMO ===");
        for (int numero : casosDeTeste) {
            System.out.println(numero + " e primo? " + (ehPrimo(numero) ? "SIM" : "NAO"));
        }

        System.out.println("\nPrimos ate 50: " + primosAte(50));
    }
}
