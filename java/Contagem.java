import java.util.Arrays;

/**
 * 06 - Contagem
 *
 * Dado um conjunto com N dados de entrada, contar quantos valores
 * inteiros existem nesse conjunto, do primeiro dado (inclusive)
 * ate o dado N (inclusive).
 *
 * Sao apresentadas duas leituras do enunciado:
 *  a) contarInteiros    - percorre as N posicoes e conta quantos valores
 *     sao numeros inteiros (aqui usamos double para permitir valores
 *     fracionarios no conjunto de entrada);
 *  b) contarNoIntervalo - conta quantos valores estao dentro do
 *     intervalo numerico [primeiro valor, N].
 *
 * Complexidade: O(n) em ambas.
 */
public class Contagem {

    /**
     * Verifica se um valor real representa um numero inteiro.
     */
    private static boolean ehInteiro(double valor) {
        return valor == Math.floor(valor) && !Double.isInfinite(valor);
    }

    /**
     * (a) Conta quantos valores inteiros existem da posicao 1 ate a posicao N.
     */
    public static int contarInteiros(double[] dados) {
        int quantidade = 0;

        for (int i = 0; i < dados.length; i++) {
            if (ehInteiro(dados[i])) {
                quantidade++;
            }
        }

        return quantidade;
    }

    /**
     * (b) Conta quantos valores inteiros do conjunto estao no intervalo
     * fechado entre o primeiro dado e o valor N informado.
     */
    public static int contarNoIntervalo(double[] dados, double n) {
        if (dados.length == 0) {
            return 0;
        }

        double primeiro = dados[0];
        double limiteInferior = Math.min(primeiro, n);
        double limiteSuperior = Math.max(primeiro, n);

        int quantidade = 0;

        for (int i = 0; i < dados.length; i++) {
            double valor = dados[i];

            if (ehInteiro(valor) && valor >= limiteInferior && valor <= limiteSuperior) {
                quantidade++;
            }
        }

        return quantidade;
    }

    public static void main(String[] args) {
        double[] conjuntoDeDados = { 4, 7.5, 12, 9, 20, 3, 15.2, 18, 25 };

        System.out.println("=== 06 - CONTAGEM ===");
        System.out.println("Conjunto de dados: " + Arrays.toString(conjuntoDeDados));
        System.out.println("Total de elementos (N): " + conjuntoDeDados.length);
        System.out.println("(a) Valores inteiros no conjunto: " + contarInteiros(conjuntoDeDados));

        double n = 20;
        System.out.println("(b) Inteiros entre o primeiro dado (" + conjuntoDeDados[0]
                + ") e N (" + n + "): " + contarNoIntervalo(conjuntoDeDados, n));
    }
}
