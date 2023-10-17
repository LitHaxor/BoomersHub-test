import { ProviderDto } from "@/dto/search.dto";
import { Col, Divider, Row, Space, Typography } from "antd";
import React from "react";
import MapView from "../Map/MapView";
import {
  BankOutlined,
  HeatMapOutlined,
  HomeOutlined,
  PhoneOutlined,
} from "@ant-design/icons";

interface ProviderViewProps {
  selectedProvider: ProviderDto;
}

const ProviderView = ({ selectedProvider }: ProviderViewProps) => {
  return (
    <Space direction="vertical">
      <Row>
        <Col span={24}>
          <Typography.Title level={2}>{selectedProvider.name}</Typography.Title>
          <Typography.Paragraph>
            Type: {selectedProvider.type}
          </Typography.Paragraph>
          <Divider />
        </Col>
        <Col span={24}>
          <MapView
            height={300}
            defaultCenter={[
              selectedProvider.latitude,
              selectedProvider.longitude,
            ]}
            defaultZoom={11}
          />
        </Col>
        <Divider />
        <Col span={24}>
          <Typography.Title level={3}>Address</Typography.Title>
          <Typography.Paragraph>
            <Space>
              <HomeOutlined />
              <span>{selectedProvider.address}</span>
            </Space>
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Space>
              <HeatMapOutlined />
              <span>
                {selectedProvider.city}, {selectedProvider.state},{" "}
                {selectedProvider.zip}
              </span>
            </Space>
          </Typography.Paragraph>
          <Divider />
          <Typography.Title level={3}>Capacity</Typography.Title>
          <Typography.Paragraph>
            <Space>
              <BankOutlined />
              <span>Bed Capacity: {selectedProvider.capacity}</span>
            </Space>
          </Typography.Paragraph>

          <Typography.Title level={3}>Phone</Typography.Title>
          <Typography.Paragraph>
            <Space>
              <PhoneOutlined />
              <a href={`tel:${selectedProvider.phone}`}>
                {selectedProvider.phone}
              </a>
            </Space>
          </Typography.Paragraph>

          {selectedProvider.link && (
            <Space direction="vertical">
              <Typography.Title level={3}>Website</Typography.Title>

              <Typography.Link href={selectedProvider.link}>
                visit website
              </Typography.Link>
            </Space>
          )}
        </Col>
      </Row>
    </Space>
  );
};

export default ProviderView;
