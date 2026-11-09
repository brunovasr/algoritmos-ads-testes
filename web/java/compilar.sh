#!/usr/bin/env bash
# Compila os algoritmos da pasta java/ junto com a PonteWeb e gera o
# web/algoritmos.jar, usado pela interface web para rodar o Java no navegador.
# Rode a partir de qualquer pasta:  bash web/java/compilar.sh
set -euo pipefail

raiz="$(cd "$(dirname "$0")/../.." && pwd)"
saida="$(mktemp -d)"
trap 'rm -rf "$saida"' EXIT

# --release 8: o CheerpJ executa bytecode do Java 8 por padrao.
javac --release 8 -Xlint:-options -encoding UTF-8 -d "$saida" "$raiz"/java/*.java "$raiz"/web/java/PonteWeb.java
jar --create --file "$raiz/web/algoritmos.jar" -C "$saida" .

echo "Gerado: web/algoritmos.jar"
