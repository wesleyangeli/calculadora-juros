# Calculadora de rendimentos com aportes mensais

## Descrição

Um projeto para calcular rendimentos financeiros com aportes mensais.

Calculadora de Juros Compostos
Com essa ferramenta você pode calcular juros compostos com aporte mensal e consegue literalmente visualizar "o poder dos juros compostos" e simular diferentes cenários, com diferentes rentabilidades mensais e diferente valores de aportes recorrentes.

Você pode "brincar" com as diferentes variáveis do tripé: taxa de retorno, tempo e montante investido para, assim, criar seu plano de liberdade financeira e definir quanto deve investir por mês.

Fórmula Básica
A fórmula geral para calcular o montante final (M) é:

```bash
M = P(1 + r)^n + Aporte * [((1 + r)^n - 1) / r]
```

Onde:

- P é o capital inicial.
- r é a taxa de juros por período.
- n é o número total de períodos.

Aporte é o valor dos aportes mensais.

Fórmula para Excel e Google Sheets
Para aplicar esta fórmula no Excel ou Planilhas do Google, você pode usar a seguinte função:

```bash
=P*(1+r)^n + Aporte * (((1+r)^n-1)/r)
```

É importante substituir P, r, n e Aporte pelos valores correspondentes em sua planilha. No Excel e no Google Sheets, a taxa de juros (r) deve ser expressa em formato decimal (por exemplo, 5% deve ser inserido como 0.05).

Exemplo
Suponha que você tenha um capital inicial de R$1.000, uma taxa de juros de 5% ao ano, aportes mensais de R$100, e você quer calcular o valor acumulado após 10 anos. A fórmula ficaria:

```bash
=1000*(1+0.05)^10 + 100 * (((1+0.05)^10-1)/0.05)
```

## Instalação

Para instalar as dependências do projeto, execute o seguinte comando:

```bash
npm install
```

Para iniciar o projeto em modo DEV:

```bash
npm run dev
```

Por padrão a rota do projeto está apontando para a porta 3000

```bash
http://localhost:3000
```
