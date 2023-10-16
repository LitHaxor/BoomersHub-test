import { baseApi } from "@/baseApi";
import ProviderView from "@/components/Drawers/ProviderView";
import MapView from "@/components/Map/MapView";
import { ProviderDto, ProviderGetDto } from "@/dto/search.dto";
import { HomeFilled, PhoneOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Drawer,
  Input,
  List,
  Popconfirm,
  Row,
  Space,
  message,
} from "antd";
import axios from "axios";
import { NextPageContext } from "next";
import React from "react";

const ProviderList = ({
  data,
}: React.PropsWithChildren<{ data: ProviderGetDto }>) => {
  const [selectedRecord, setSelectedRecord] = React.useState<ProviderDto>();
  const [providers, setProviders] = React.useState<ProviderDto[]>(
    data.providers
  );

  const baseApiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://3.101.121.140:4000/api",
  });

  const deleteOne = async (record: ProviderDto) => {
    try {
      const { data } = await baseApiClient.delete(`/providers/${record.id}`);
      const newProviders = providers.filter(
        (provider) => provider.phone !== record.phone
      );
      setProviders(newProviders);
      message.success(data.message);
    } catch (error) {
      console.log(error);
      message.error("Failed to delete provider");
    }
  };

  const loadMore = async () => {
    try {
      const query = {
        limit: "10",
        offset: providers.length.toString(),
      };

      const queryParams = new URLSearchParams(query).toString();
      const url = `/providers?${queryParams}`;
      const { data } = await baseApiClient.get<ProviderGetDto>(url, {});

      setProviders([...providers, ...data.providers]);
    } catch (error) {
      console.log(error);
      message.error("Failed to load more providers");
    }
  };

  const search = async (query: string) => {
    try {
      const { data } = await baseApiClient.get<ProviderGetDto>(
        `/providers?q=${query}`
      );
      setProviders(data.providers);
    } catch (error) {
      console.log(error);
      message.error("Failed to search providers");
    }
  };

  return (
    <Card
      title="Saved Providers"
      style={{
        margin: "10px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card
            title="Providers"
            style={{
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
              maxHeight: "80vh",
              overflow: "scroll",
            }}
          >
            <Input.Search
              placeholder="City, State, Name"
              enterButton
              onSearch={(value) => {
                search(value);
              }}
            />

            <List
              itemLayout="horizontal"
              dataSource={providers}
              loadMore={
                data.count > providers.length ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      type="primary"
                      onClick={() => {
                        loadMore();
                      }}
                    >
                      Load More
                    </Button>
                  </div>
                ) : null
              }
              renderItem={(item) => (
                <List.Item>
                  <Card
                    title={item.name}
                    extra={
                      <Button
                        type="link"
                        onClick={() => setSelectedRecord(item)}
                      >
                        View
                      </Button>
                    }
                    style={{
                      width: 500,
                      borderRadius: 10,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
                    }}
                  >
                    <Space direction="vertical">
                      <p>
                        <HomeFilled /> {item.address}
                      </p>
                      <p>
                        {item.city}, {item.country}, {item.state}, {item.zip}
                      </p>
                      <p>
                        <PhoneOutlined />
                        <a href={`tel:${item.phone}`}>{item.phone}</a>
                      </p>

                      <Space>
                        <Popconfirm
                          title="Delete saved provider?"
                          description="Are you sure to delete this provider?"
                          onConfirm={() => deleteOne(item)}
                          onCancel={() => {}}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button danger>Remove</Button>
                        </Popconfirm>
                      </Space>
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card
            title="Map"
            style={{
              borderRadius: 10,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
            }}
          >
            {providers && (
              <MapView
                defaultCenter={[
                  providers[0]?.latitude,
                  providers[0]?.longitude,
                ]}
                defaultZoom={5}
                multipleCenter={providers?.map((item) => [
                  item.latitude,
                  item.longitude,
                ])}
                height={460}
                title={null}
              />
            )}
          </Card>
        </Col>
      </Row>
      <Drawer
        title="Provider Details"
        width={600}
        onClose={() => setSelectedRecord(undefined)}
        open={!!selectedRecord}
      >
        {selectedRecord && <ProviderView selectedProvider={selectedRecord} />}
      </Drawer>
    </Card>
  );
};

export default ProviderList;

export async function getServerSideProps(context: NextPageContext) {
  try {
    const { data } = await baseApi.get<ProviderGetDto>("/providers");
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        data: [],
      },
    };
  }
}
