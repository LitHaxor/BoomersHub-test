import axios from "axios";
import { ProviderDto } from "@/dto/search.dto";
import { NextPageContext } from "next";
import React, { useEffect } from "react";
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
import Link from "next/link";
import { baseApi } from "@/baseApi";

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

  const baseApiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://3.101.121.140:4000/api",
  });

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const singleSave = async (record: ProviderDto) => {
    try {
      const { data } = await baseApiClient.post("/providers", record);
      const newProviders = providers.map((provider) => {
        const unqID = `${provider.name}-${provider.phone}-${provider.address}`;
        const recordID = `${record.name}-${record.phone}-${record.address}`;
        if (unqID === recordID) {
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

  const bulkSave = async () => {
    try {
      const selectedRecords = providers.filter(
        (provider) =>
          selectedRowKeys.includes(provider.phone) && !provider.isSaved
      );

      const { data, status } = await baseApiClient.post("/providers/bulk", {
        providers: selectedRecords,
      });

      if (status === 201) {
        const newProviders = providers.map((provider) => {
          if (selectedRowKeys.includes(provider.phone)) {
            return { ...provider, isSaved: true };
          }
          return provider;
        });
        message.success(data.message);
        setProviders(newProviders);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to save providers");
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
      title: "Code",
      dataIndex: "code",
      key: "code",
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

  const resultText = () => {
    if (providers.length === 0) {
      return `No results found for "${query}" in ${state}`;
    }

    return `Found ${providers.length} results for "${query}" in ${state}`;
  };

  return (
    <>
      <Head>
        <title>{`Boomershub- Search for ${query}`}</title>
        <meta
          name="description"
          content={`Search for ${query} in ${state} on Boomershub`}
        />
      </Head>
      <Layout.Content style={{ padding: "10px" }}>
        <Card
          title={resultText()}
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
                    <Button type="primary">
                      <Link href={"/provider"}>Saved Providers</Link>
                    </Button>
                  </Col>
                  {selectedRowKeys.length > 0 && (
                    <Col>
                      <Button onClick={() => bulkSave()} danger>
                        Save Selected Providers
                      </Button>
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
  const { query } = context;

  try {
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
        query: query.q,
        state: query.state,
      },
    };
  }
}
