import { useState } from "react";
import { Input, Form, Button, Card, notification, Row, Col } from "antd";
import Chart from "react-google-charts";

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
        capitalInicial + aporteMensal * 12 * ano,
      ]);
      ano++;
    }
  }

  console.log(valoresPorAno);

  return valoresPorAno;
}

const Home = () => {
  const [data, setData] = useState<any>(null);
  const [anualRate, setAnualRate] = useState("Que dá 0.0% ao ano");

  const onFinish = ({
    initialAmount,
    monthlyDeposit,
    monthlyInterestRate,
    numberOfMonths,
  }: any) => {
    try {
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

      const newData = [["Ano", "Patrimonio", "Aportado"], ...valoresPorAno];
      setData(newData);

      notification.success({
        message: "Sucesso!",
        style: { width: "190px" },
        placement: "bottomLeft",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Falha no envio do formulário:", errorInfo);
  };

  const handleLegendClick = (legend: any) => {
    const columnIndex = legend.row;
    const newData = [...data];

    for (let i = 1; i < newData.length; i++) {
      newData[i][columnIndex] =
        newData[i][columnIndex] === null ? data[i][columnIndex] : null;
    }

    setData(newData);
  };

  const options = {
    isStacked: false,
    title: "Retorno no periodo",
    legend: { position: "bottom", style: { padding: "20px" } },
    hAxis: {
      titleTextStyle: { color: "#333" },
      gridlines: { color: "red" },
      format: "decimal",
    },
    vAxis: {
      minValue: 0,
      gridlines: { color: "transparentes" },
    },
    chartArea: { width: "80%", height: "70%" },
    colors: ["#1677FF", "#F0C30B"],
  };

  return (
    <Row
      gutter={[8, 8]}
      style={{ minHeight: "100vh" }}
      align={"middle"}
      justify={"center"}
    >
      <Col xs={22} sm={22} md={22} lg={16} xl={16}>
        <Card title="Calculadora de rendimentos com aportes mensais">
          <Form
            name="investmentForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="horizontal"
            initialValues={{
              initialAmount: "0",
              monthlyInterestRate: "0,8",
              monthlyDeposit: "50",
              numberOfMonths: "360",
            }}
            labelCol={{ span: 6 }}
          >
            <Row gutter={[8, 0]}>
              <Col xs={24}>
                <Form.Item label="Capital Inicial (R$)" name="initialAmount">
                  <Input type="text" prefix="R$" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  label="Rendimento Mensal (%)"
                  name="monthlyInterestRate"
                  rules={[
                    { required: true, message: "Campo obrigatório" },
                    {
                      min: 0.0001,
                      message: "Rendimento mensal não pode ser zero.",
                    },
                  ]}
                  extra={anualRate}
                >
                  <Input
                    suffix="%"
                    onChange={(e) => {
                      const monthlyInterestRate = e.target.value;
                      const formatedMonthlyInterestRate =
                        Number(monthlyInterestRate.replace(",", ".")) / 100;
                      if (formatedMonthlyInterestRate >= 0) {
                        const anualInterestRate =
                          ((1 + formatedMonthlyInterestRate) ** 12 - 1) * 100;

                        setAnualRate(
                          `Que dá ${parseFloat(
                            anualInterestRate.toFixed(2)
                          )}% ao ano`
                        );
                      }
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  label="Aporte Mensal (R$)"
                  name="monthlyDeposit"
                  required
                  rules={[
                    { required: true, message: "Campo obrigatório" },
                    {
                      min: 0.0001,
                      message: "Rendimento mensal não pode ser zero.",
                    },
                  ]}
                >
                  <Input prefix="R$" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Total de Meses"
                  name="numberOfMonths"
                  rules={[{ required: true, message: "Campo obrigatório" }]}
                >
                  <Input type="text" />
                </Form.Item>
              </Col>
              <Row justify={"end"}>
                <Col span={24}>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Calcular
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Row>
          </Form>
        </Card>
      </Col>

      <Col xs={22} sm={22} md={22} lg={16} xl={16}>
        {data && (
          <Card>
            <Chart
              chartType="SteppedAreaChart"
              data={data}
              options={options}
              width={"100%"}
              height={"400px"}
              chartEvents={[
                {
                  eventName: "select",
                  callback: ({ chartWrapper }) => {
                    const chart = chartWrapper.getChart();
                    const selection = chart.getSelection();
                    if (selection.length === 1) {
                      const legend = selection[0];
                      if (legend.row !== null) {
                        handleLegendClick(legend);
                      }
                    }
                  },
                },
              ]}
            />
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default Home;
