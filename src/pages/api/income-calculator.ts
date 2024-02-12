import type { NextApiRequest, NextApiResponse } from "next";

interface Data {
  patrimonio: number[];
  aportado: number[];
  message?: string;
}

interface RequestData {
  initialAmount: string;
  monthlyInterestRate: string;
  monthlyDeposit: string;
  numberOfMonths: string;
}

function calcularValoresPorAno(
  capitalInicial: number,
  rendimentoMensal: number,
  rendimentoAnual: number,
  aporteMensal: number,
  totalMeses: number
): { patrimonio: number[]; aportado: number[] } {
  const taxaAnual = rendimentoAnual / 100;
  const taxaMensal = Math.pow(1 + taxaAnual, 1 / 12) - 1;

  let capitalAtual = capitalInicial;
  let anos = 0;
  const valoresAno: number[] = [];

  for (let mes = 1; mes <= totalMeses; mes++) {
    capitalAtual *= 1 + taxaMensal;
    capitalAtual += aporteMensal;

    if (mes % 12 === 0) {
      anos++;
      valoresAno.push(Number(capitalAtual.toFixed(2)));
    }
  }

  let totalAportadoAno = capitalInicial;
  const valoresAportadosPorAno: number[] = [];

  for (let mes = 1; mes <= totalMeses; mes++) {
    capitalAtual += aporteMensal;
    totalAportadoAno += aporteMensal;

    if (mes % 12 === 0) {
      valoresAportadosPorAno.push(totalAportadoAno);
    }
  }

  return { patrimonio: valoresAno, aportado: valoresAportadosPorAno };
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
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
      (formatedMonthlyInterestRate * 12).toFixed(2)
    );
    const toNumberMonthlyDeposit = parseFloat(monthlyDeposit);
    const toNumberNumberOfMonths = parseInt(numberOfMonths);

    console.log(
      toNumberInitialAmount,
      toNumberMonthlyInterestRate,
      toNumberYearInterestRate,
      toNumberMonthlyDeposit,
      toNumberNumberOfMonths
    );

    const { patrimonio, aportado } = calcularValoresPorAno(
      toNumberInitialAmount,
      toNumberMonthlyInterestRate,
      toNumberYearInterestRate,
      toNumberMonthlyDeposit,
      toNumberNumberOfMonths
    );

    res.status(200).json({ patrimonio, aportado });
  } else {
    res
      .status(404)
      .json({ patrimonio: [], aportado: [], message: "Não encontrado" });
  }
}
