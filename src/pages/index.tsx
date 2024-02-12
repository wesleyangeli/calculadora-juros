import { useEffect, useState } from "react";
import { Layout, Input, Form, Button, Card, notification } from "antd";
import handler from "./api/income-calculator";
import axios from "axios";

const { Sider, Content } = Layout;

const Home = () => {
  const [form] = Form.useForm();
  const [result, setResult] = useState({ patrimonio: [], aportado: [] });
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
          setResult(response.data);
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

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "150px", textAlign: "center" }}>
        <Card
          title="Calculadora de rendimentos com aportes mensais"
          style={{ margin: "auto" }}
        >
          <Form
            form={form}
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
          >
            <Form.Item
              label="Capital Inicial (R$)"
              name="initialAmount"
              rules={[
                { required: true, message: "Capital Inicial é obrigatório" },
              ]}
            >
              <Input type="text" prefix="R$" />
            </Form.Item>

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
                  const formatedMonthlyInterestRate = Number(
                    monthlyInterestRate.replace(",", ".")
                  );
                  if (formatedMonthlyInterestRate >= 0) {
                    const anualInterestRate = formatedMonthlyInterestRate * 12;
                    setAnualRate(
                      `Que dá ${anualInterestRate.toFixed(2)}% ao ano`
                    );
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              label="Aporte Mensal (R$)"
              name="monthlyDeposit"
              rules={[{ required: true, message: "Campo obrigatório" }]}
            >
              <Input type="text" prefix="R$" />
            </Form.Item>

            <Form.Item
              label="Total de Meses"
              name="numberOfMonths"
              rules={[{ required: true, message: "Campo obrigatório" }]}
            >
              <Input type="text" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Calcular
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>

      <Layout>
        <Content style={{ padding: "20px", color: "black" }}>
          {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
