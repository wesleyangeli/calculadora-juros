import { useState } from "react";
import { Input, Form, Button, Card, notification, Row, Col } from "antd";
import axios from "axios";
import Chart from "react-google-charts";

const Home = () => {
  const [data, setData] = useState<any>([]);
  const [anualRate, setAnualRate] = useState("Que dá 0.0% ao ano");

  const onFinish = ({
    initialAmount,
    monthlyDeposit,
    monthlyInterestRate,
    numberOfMonths,
  }: any) => {
    try {
      const requestData = {
        initialAmount,
        monthlyInterestRate,
        monthlyDeposit,
        numberOfMonths,
      };

      axios
        .post("/api/income-calculator", requestData)
        .then((response: any) => {
          console.log("Resposta da API:", response.data);
          const newData = [["Ano", "Patrimonio", "Aportado"], ...response.data];
          setData(newData);
        })
        .catch((error) => {
          console.error("Erro:", error);
        });

      notification.info({
        message: "teste",
        description: `${initialAmount}, ${monthlyDeposit}, ${monthlyInterestRate}, ${numberOfMonths}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Falha no envio do formulário:", errorInfo);
  };

  const options = {
    isStacked: false,
    title: "Retorno no periodo",
    hAxis: {
      titleTextStyle: { color: "#333" },
      gridlines: { color: "red" },
    },
    vAxis: {
      title: "Capital",
      titleText: "teset",
      minValue: 0,
      gridlines: { color: "transparentes" },
    }, // Adiciona linhas de grade transparentes
    chartArea: { width: "65%", height: "70%" },
    colors: ["#1677FF", "#F0C30B"], // Define as cores para azul e amarelo
  };

  return (
    <Row
      gutter={[20, 10]}
      style={{ minHeight: "100vh", margin: "24px 24px" }}
      align={"middle"}
      justify={"center"}
    >
      <Col span={16}>
        <Card
          title="Calculadora de rendimentos com aportes mensais"
          style={{ margin: "auto" }}
        >
          <Form
            name="investmentForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="inline"
            initialValues={{
              initialAmount: 0,
              monthlyInterestRate: 0,
              monthlyDeposit: 0,
              numberOfMonths: 0,
            }}
            labelCol={{ span: 6 }}
          >
            <Row gutter={[10, 8]}>
              <Col xs={{ span: 24 }}>
                <Form.Item
                  label="Capital Inicial (R$)"
                  name="initialAmount"
                  rules={[
                    {
                      required: true,
                      message: "Capital Inicial é obrigatório",
                    },
                  ]}
                >
                  <Input type="text" prefix="R$" />
                </Form.Item>
              </Col>

              <Col xs={{ span: 24 }}>
                <Form.Item
                  label="Rendimento Mensal (%)"
                  name="monthlyInterestRate"
                  rules={[{ required: true, message: "Campo obrigatório" }]}
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

              <Col xs={{ span: 24 }}>
                <Form.Item
                  label="Aporte Mensal (R$)"
                  name="monthlyDeposit"
                  rules={[{ required: true, message: "Campo obrigatório" }]}
                >
                  <Input type="text" prefix="R$" />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }}>
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

      <Col span={16} style={{ padding: "20px", borderRadius: "50%" }}>
        {data && (
          <Card>
            <Chart
              chartType="SteppedAreaChart"
              data={data}
              options={options}
              width={"100%"}
              height={"400px"}
            />
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default Home;
