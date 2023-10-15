import "../styles/globals.css";
import React from "react";
import { ConfigProvider, Layout } from "antd";
import type { AppProps } from "next/app";
import theme from "../theme.confg";
import LayoutHeader from "@/components/Layout/Header";
import Loading from "@/components/Layout/Loading";
import { baseApi } from "@/baseApi";

baseApi.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider theme={theme}>
    <Layout>
      <LayoutHeader />
    </Layout>
    <Loading>
      <Component {...pageProps} />
    </Loading>
  </ConfigProvider>
);

export default App;
