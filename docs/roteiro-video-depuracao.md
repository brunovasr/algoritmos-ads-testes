# Roteiro do vídeo: depuração no VS Code

Arquivo escolhido: **`javascript/05-quicksort.js`**.

Ele tem três funções que chamam umas às outras (`ordenar` → `quicksort` → `particionar` →
`trocar`), recursão e variáveis que mudam a cada volta do laço, o que deixa cada ferramenta
do depurador bem visível no vídeo.

## Antes de gravar

- Abra a **pasta** `algoritmos-ads` no VS Code (File → Open Folder), não só o arquivo.
- Confira o Node com `node -v` no terminal.
- Abra `javascript/05-quicksort.js` e deixe o painel **Run and Debug** (`Ctrl+Shift+D`) aberto.
- Remova breakpoints antigos: painel Run and Debug → seção *Breakpoints* → ícone
  *Remove All Breakpoints*.
- Aumente o zoom (`Ctrl +`) para o código ficar legível na gravação.
- No gravador (ex.: Vidyard), escolha gravar **tela + câmera**, com a câmera real ligada
  (sem avatar), e selecione a janela do VS Code ou a tela inteira.

Atalhos usados:

| Tecla        | Ação                                       |
| ------------ | ------------------------------------------ |
| `F5`         | iniciar / continuar até o próximo breakpoint |
| `F10`        | step over (executa a linha sem entrar na função) |
| `F11`        | step into (entra na função chamada)       |
| `Shift+F11`  | step out (termina a função e volta a quem chamou) |
| `Shift+F5`   | parar a depuração                          |

A numeração de linhas abaixo é a do arquivo atual do repositório.

---

## 1. Executar o código passo a passo

1. Clique na margem esquerda da **linha 67** (`const desordenado = ...`) para criar um breakpoint
   (bolinha vermelha).
2. No topo do painel Run and Debug, escolha **JS: depurar arquivo atual** e aperte `F5`.
3. A execução para na linha 67, destacada em amarelo. Fale: *"o programa está pausado antes de
   executar esta linha"*.
4. Aperte `F10` algumas vezes (linhas 67 → 69 → 70) e mostre:
   - no painel **Variables**, `desordenado` aparecendo com os 10 valores;
   - no **Debug Console**, as mensagens do `console.log` surgindo a cada passo.
5. Opcional: em **Watch**, clique em `+` e adicione `desordenado.length`.
6. `Shift+F5` para parar.

## 2. Depurar uma função sem breakpoint usando step into

Aqui não pode haver nenhum breakpoint dentro das funções.

1. Remova todos os breakpoints (*Remove All Breakpoints*).
2. Escolha a configuração **JS: depurar arquivo atual (parar na primeira linha)** e aperte `F5`.
   O depurador para no começo do arquivo sem precisar de breakpoint.
3. Use `F10` até chegar na **linha 71** (`ordenar(desordenado)`).
4. Aperte `F11`: o cursor entra em `ordenar`, **linha 60**, que não tem breakpoint.
5. `F11` de novo: entra em `quicksort`, **linha 45 ou 46**. Mostre em **Variables** que `inicio = 0`
   e `fim = 9`.
6. `F10` até a **linha 47** e `F11`: entra em `particionar`, **linha 27**.
7. Mostre o painel **Call Stack**: `particionar` ← `quicksort` ← `ordenar` ← arquivo principal.
8. Aperte `F10` algumas vezes dentro do laço e mostre `j`, `pivo` e `indiceMenor` mudando.
9. `Shift+F11` para sair de `particionar` e voltar ao `quicksort`.
10. `Shift+F5` para parar.

## 3. Modificar variáveis com o Debug Console

1. Coloque um breakpoint na **linha 69** (`console.log('=== 05 ...')`).
2. Escolha **JS: depurar arquivo atual** e aperte `F5`. A linha 67 já foi executada, então
   `desordenado` existe.
3. Abra o **Debug Console** (`Ctrl+Shift+Y`) e digite, apertando Enter a cada linha:

   ```js
   desordenado
   desordenado[0] = 999
   desordenado.push(-5)
   desordenado
   ```

   O console mostra o array antes e depois da mudança.
4. Aperte `F5` para continuar. A saída agora mostra `999` e `-5` no array original e no
   array ordenado, provando que a alteração feita na depuração valeu para a execução.
5. Extra para falar no vídeo: dentro de `particionar`, variáveis `let` como `indiceMenor` também
   podem receber novo valor pelo console (`indiceMenor = 0`). Já `pivo` é `const` e o console
   recusa a atribuição.
6. `Shift+F5` para parar.

## 4. Criar um breakpoint condicional

1. Remova os outros breakpoints.
2. Clique com o botão direito na margem da **linha 31** (`if (array[j] <= pivo)`) e escolha
   **Add Conditional Breakpoint...**
3. Mantenha o tipo **Expression**, digite a condição e aperte Enter:

   ```js
   array[j] > 50
   ```

   O breakpoint aparece com um sinal de igual no meio da bolinha.
4. Escolha **JS: depurar arquivo atual** e aperte `F5`.
5. A execução só para quando o valor analisado é maior que 50. Em **Variables**, mostre `j` e,
   no Debug Console, digite `array[j]` para confirmar (ex.: 55, 71, 92).
6. Aperte `F5` algumas vezes: o laço passa direto pelos valores menores sem parar.
7. Extra: clique com o botão direito no breakpoint → **Edit Breakpoint** → troque para
   **Hit Count** e digite `3` (para só na terceira vez que passar pela linha).
8. `Shift+F5` para parar.

---

## Encerramento sugerido

Mostre rapidamente a interface web (`web/index.html`) rodando o Quicksort com a mesma lista e
diga que ela chama as mesmas funções que acabaram de ser depuradas.

Depois de gravar, copie o link do vídeo e cole na seção **Vídeo da depuração** do `README.md`.
