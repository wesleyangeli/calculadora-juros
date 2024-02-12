import type { NextApiRequest, NextApiResponse } from "next";

interface Data {
  ano: number;
  capital: number;
  tipo: "patrimonio" | "aportado";
}

interface RequestData {
  initialAmount: string;
  monthlyInterestRate: string;
  monthlyDeposit: string;
  numberOfMonths: string;
}

// function calcularValoresPorAno(
//   capitalInicial: number,
//   rendimentoMensal: number,
//   rendimentoAnual: number,
//   aporteMensal: number,
//   totalMeses: number
// ): Data[] {
//   const taxaAnual = rendimentoAnual / 100;
//   const taxaMensal = rendimentoMensal / 100;

//   let capitalAtual = capitalInicial;
//   const valoresPorAno: Data[] = [];

//   for (let mes = 1, ano = 1; mes <= totalMeses; mes++) {
//     capitalAtual *= 1 + taxaMensal;
//     capitalAtual += aporteMensal;

//     if (mes % 12 === 0) {
//       valoresPorAno.push({
//         ano,
//         capital: Number(capitalAtual.toFixed(2)),
//         tipo: "patrimonio",
//       });
//       valoresPorAno.push({
//         ano,
//         capital: capitalInicial + aporteMensal * (mes / 12),
//         tipo: "aportado",
//       });
//       ano++;
//     }
//   }

//   console.log(valoresPorAno);

//   return valoresPorAno;
// }

function calcularValoresPorAno(
  capitalInicial: number,
  rendimentoMensal: number,
  rendimentoAnual: number,
  aporteMensal: number,
  totalMeses: number
): any[] {
  const taxaAnual = rendimentoAnual / 100;
  const taxaMensal = rendimentoMensal / 100;

  let capitalAtual = capitalInicial;
  const valoresPorAno: any[] = [];

  for (let mes = 1, ano = 1; mes <= totalMeses; mes++) {
    capitalAtual *= 1 + taxaMensal;
    capitalAtual += aporteMensal;

    if (mes % 12 === 0) {
      valoresPorAno.push([
        `${ano.toString()}º ano`,
        Number(capitalAtual.toFixed(2)),
        capitalInicial + aporteMensal * 12 * ano, // Corrigindo o cálculo do capital inicial
      ]);
      ano++;
    }
  }

  console.log(valoresPorAno);

  return valoresPorAno;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  if (req.method === "POST") {
    const {
      initialAmount,
      monthlyInterestRate,
      monthlyDeposit,
      numberOfMonths,
    }: RequestData = req.body;

    const formatedMonthlyInterestRate = parseFloat(
      monthlyInterestRate.replace(",", ".")
    );
    const toNumberInitialAmount = parseFloat(initialAmount);
    const toNumberMonthlyInterestRate = parseFloat(
      formatedMonthlyInterestRate.toFixed(2)
    );

    const toNumberYearInterestRate = parseFloat(
      (((1 + formatedMonthlyInterestRate / 100) ** 12 - 1) * 100).toFixed(2)
    );

    const toNumberMonthlyDeposit = parseFloat(monthlyDeposit);
    const toNumberNumberOfMonths = parseInt(numberOfMonths);

    const valoresPorAno = calcularValoresPorAno(
      toNumberInitialAmount,
      toNumberMonthlyInterestRate,
      toNumberYearInterestRate,
      toNumberMonthlyDeposit,
      toNumberNumberOfMonths
    );

    res.status(200).json(valoresPorAno);
  } else {
    res.status(404).json({ message: "Não encontrado" });
  }
}
