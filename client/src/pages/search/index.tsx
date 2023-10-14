import { baseApi } from "@/baseApi";
import { SearchDto } from "@/dto/search.dto";
import { NextPageContext } from "next";
import React from "react";
import { Button, Drawer, Layout, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";

const SearchProvider = ({ data }: { data: SearchDto[] }) => {
  const [selectedRecord, setSelectedRecord] = React.useState<SearchDto>();

  const columns: ColumnsType<SearchDto> = [
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
            <Button
              onClick={() => {
                baseApi.post("/property", record);
              }}
              type="primary"
            >
              Save
            </Button>
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
      <Layout.Header>
        <Space>
          <Button type="primary">Save Selected</Button>
          <Button color="#">Show Saved</Button>
        </Space>
      </Layout.Header>

      <Layout.Content>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record.phone}
        />
      </Layout.Content>

      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={() => setSelectedRecord(undefined)}
        visible={!!selectedRecord}
      ></Drawer>
    </>
  );
};

export default SearchProvider;

export async function getServerSideProps(context: NextPageContext) {
  try {
    const { query } = context;
    const { data } = await baseApi.post<SearchDto[]>("/search", {
      query: query.q,
      type: query.state,
    });

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
