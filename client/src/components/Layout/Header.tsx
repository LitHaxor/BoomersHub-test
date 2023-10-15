import React from "react";
import { Button, Layout, Space, Typography, Row, Col } from "antd";
import Link from "next/link";

const LayoutHeader = () => {
  return (
    <Layout.Header>
      <Row justify="space-between" align="middle">
        <Col>
          <Button type="link">
            <Typography.Title
              level={2}
              style={{ color: "#fff", textAlign: "center" }}
            >
              <Link href="/">BoomersHub</Link>
            </Typography.Title>
          </Button>
        </Col>
        <Col>
          <Row justify="end" align="middle">
            <Space>
              <Col>
                <Button type="link">
                  <Link href={"/"}>Find a provider</Link>
                </Button>
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
  );
};

export default LayoutHeader;
