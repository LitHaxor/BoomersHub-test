import {
  Card,
  Carousel,
  Typography,
  Layout,
  Form,
  Button,
  Input,
  Grid,
  Row,
  Col,
  Select,
} from "antd";
import Image from "next/image";
import { baseApi } from "@/baseApi";
import { useRouter } from "next/router";

export default function Home({ images }: { images: string[] }) {
  const router = useRouter();

  return (
    <>
      <main>
        <Layout.Header>
          <Typography.Title
            level={2}
            style={{ color: "#fff", textAlign: "center" }}
          >
            Boomersclub
          </Typography.Title>
        </Layout.Header>

        <Layout.Content style={{ marginTop: "5px" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={16}>
              <Carousel autoplay>
                {images.map((image) => (
                  <div
                    key={image}
                    style={{
                      height: "100%",
                      display: "flex",
                    }}
                  >
                    <Image
                      src={image}
                      alt="Picture of the author"
                      width={1000}
                      height={500}
                    />
                  </div>
                ))}
              </Carousel>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Form
                  initialValues={{
                    state: "TEXAS",
                    q: "",
                  }}
                  onFinish={(values) => {
                    router.push(`/search?q=${values.q}&state=${values.state}`);
                  }}
                >
                  <Form.Item name="q" label="Search">
                    <Input placeholder="Search provider" />
                  </Form.Item>
                  <Form.Item name="state" label="State">
                    <Select>
                      <Select.Option value="TEXAS">Texas</Select.Option>
                      <Select.Option value="FLORIDA">Florida</Select.Option>
                    </Select>
                  </Form.Item>
                  <Button type="primary" htmlType="submit">
                    Search
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Layout.Content>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const { data } = await baseApi.get("/images");
    return {
      props: {
        images: data,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        images: [],
      },
    };
  }
}
