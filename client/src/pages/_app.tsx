import "../styles/globals.css";
import React from "react";
import {
  Button,
  ConfigProvider,
  Layout,
  Space,
  Typography,
  Row,
  Col,
} from "antd";
import type { AppProps } from "next/app";
import theme from "../theme.confg";
import Link from "next/link";

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider theme={theme}>
    <Layout>
      <Layout.Header>
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title
              level={2}
              style={{ color: "#fff", textAlign: "center" }}
            >
              <Link href="/">BoomersHub</Link>
            </Typography.Title>
          </Col>
          <Col>
            <Row justify="end" align="middle">
              <Space>
                <Col>
                  <Typography.Title
                    level={5}
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Link href={"/"}>Find a provider</Link>
                  </Typography.Title>
                </Col>
                <Col>
                  <Button type="primary">
                    <Link href={"/provider"}>Saved Providers</Link>
                  </Button>
                </Col>
              </Space>
            </Row>
          </Col>
        </Row>
      </Layout.Header>
    </Layout>
    <Component {...pageProps} />
  </ConfigProvider>
);

export default App;
