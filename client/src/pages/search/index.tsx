import { baseApi } from "@/baseApi";
import { ProviderDto } from "@/dto/search.dto";
import { NextPageContext } from "next";
import React from "react";
import {
  Button,
  Card,
  Col,
  Drawer,
  Layout,
  Row,
  Space,
  Table,
  message,
} from "antd";
import { ColumnsType } from "antd/es/table";
import Head from "next/head";
import ProviderView from "@/components/Drawers/ProviderView";

const SearchProvider = ({
  data,
  query,
  state,
}: {
  data: ProviderDto[];
  query: string;
  state: string;
}) => {
  const [selectedRecord, setSelectedRecord] = React.useState<ProviderDto>();
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const [providers, setProviders] = React.useState<ProviderDto[]>(data);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const singleSave = async (record: ProviderDto) => {
    try {
      const { data } = await baseApi.post("/providers", record);
      const newProviders = providers.map((provider) => {
        if (provider.phone === record.phone) {
          return { ...provider, isSaved: true };
        }
        return provider;
      });
      message.success(data.message);
      setProviders(newProviders);
    } catch (error) {
      console.log(error);
      message.error("Failed to save provider");
    }
  };

  const columns: ColumnsType<ProviderDto> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Zip",
      dataIndex: "zip",
      key: "zip",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        return (
          <Space>
            {!record.isSaved && (
              <Button onClick={() => singleSave(record)} type="primary">
                Save
              </Button>
            )}
            <Button
              onClick={() => {
                setSelectedRecord(record);
              }}
              type="dashed"
            >
              View
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Head>
        <title>BoomersHub - Search</title>
      </Head>
      <Layout.Content style={{ padding: "10px" }}>
        <Card
          title={`Showing results for "${query}" in ${state}`}
          style={{ borderRadius: 10, boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }}
        >
          <Table
            columns={columns}
            dataSource={providers}
            rowKey={(record) => record.phone}
            rowSelection={rowSelection}
            footer={() => (
              <Row justify="center">
                <Space>
                  <Col>
                    <Button type="primary">View Saved Providers</Button>
                  </Col>
                  {selectedRowKeys.length > 0 && (
                    <Col>
                      <Button danger>Save Selected Providers</Button>
                    </Col>
                  )}
                </Space>
              </Row>
            )}
          />
        </Card>
      </Layout.Content>
      <Drawer
        title="Provider Details"
        width={600}
        placement="right"
        closable={true}
        onClose={() => setSelectedRecord(undefined)}
        open={!!selectedRecord}
      >
        {selectedRecord && <ProviderView selectedProvider={selectedRecord} />}
      </Drawer>
    </>
  );
};

export default SearchProvider;

export async function getServerSideProps(context: NextPageContext) {
  try {
    const { query } = context;
    const { data } = await baseApi.post<ProviderDto[]>("/search", {
      query: query.q,
      type: query.state,
    });

    return {
      props: {
        data,
        query: query.q,
        state: query.state,
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