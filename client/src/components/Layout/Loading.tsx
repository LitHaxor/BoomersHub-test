import React from "react";
import Router from "next/router";
import { Skeleton, Space } from "antd";

const Loading: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);
  return loading ? (
    <Space direction="vertical" style={{ width: "95%", margin: "2rem" }}>
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
    </Space>
  ) : (
    children
  );
};

export default Loading;
