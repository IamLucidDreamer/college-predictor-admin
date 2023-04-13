import React from "react";
import { Layout } from "antd";

import { Outlet } from "react-router-dom";

import "./styles/index.css";
import { HeaderElement } from "../components/layout/Header";
import Sidebar from "../components/sidebar/Sidebar";
import { useState } from "react";

const { Content } = Layout;

export const Dashboard = () => {
  const [pageTitle, setPageTitle] = useState("Statistics");

  const setTitle = (title) => {
    setPageTitle(title);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar setTitle={setTitle} />
      <Layout className="site-layout">
        <HeaderElement title={pageTitle} />
        <Content style={{ padding: "8px 24px", backgroundColor: "#f0f0f0" }}>
          {/* For Managing Component Change within the Nested Routes Outlet is used*/}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
