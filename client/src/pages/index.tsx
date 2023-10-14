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
  Space,
} from "antd";
import Image from "next/image";
import { baseApi } from "@/baseApi";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home({ images }: { images: string[] }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>BoomersHub</title>
        <meta name="description" content="BoomersHub" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout.Content style={{ margin: "10px 10px" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={16}>
              <Carousel
                autoplay
                style={{
                  borderRadius: 10,
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                }}
              >
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
              <Card
                title="Find a provider"
                style={{
                  borderRadius: 10,
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                }}
              >
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
