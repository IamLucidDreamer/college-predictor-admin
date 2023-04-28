import React, { useState } from "react";
import { Layout, Menu, Dropdown } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  UnorderedListOutlined,
  BankOutlined,
  FundProjectionScreenOutlined,
  FileOutlined,
  HistoryOutlined,
  FormOutlined,
  ApartmentOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/images/careerkick_logo.png";
import "./styles.css";
import { useSelector } from "react-redux";

const { Sider } = Layout;

const menuOptions = [
  {
    title: "Statistics",
    optionName: "Dashboard",
    icon: <DashboardOutlined style={{ fontSize: "18px" }} />,
    route: "/admin/dashboard",
    isAdmin: true,
    isCounselor: false,
    isCollegeAdmin: false,
  },
  {
    title: "Users",
    optionName: "Users",
    icon: <UserOutlined style={{ fontSize: "18px" }} />,
    route: "/admin/users",
    isAdmin: true,
    isCounselor: true,
    isCollegeAdmin: false,
  },
  {
    title: "Colleges",
    optionName: "colleges",
    icon: <BankOutlined style={{ fontSize: "18px" }} />,
    route: "/admin/college",
    isAdmin: true,
    isCounselor: true,
    isCollegeAdmin: false,
  },
  {
    title: "Blogs",
    optionName: "Blogs",
    icon: <FundProjectionScreenOutlined style={{ fontSize: "18px" }} />,
    route: "/admin/blogs",
    isAdmin: true,
    isCounselor: false,
    isCollegeAdmin: false,
  },
  {
    title: "Updates",
    optionName: "Updates",
    icon: <FormOutlined style={{ fontSize: "18px" }} />,
    route: "/admin/updates",
    isAdmin: true,
    isCounselor: false,
    isCollegeAdmin: false,
  },
  {
    title: "Predictor Data",
    optionName: "Predictor Data",
    icon: <FileOutlined style={{ fontSize: "18px" }} />,
    route: "/admin/predictor-data",
    isAdmin: true,
    isCounselor: false,
    isCollegeAdmin: false,
  },
  {
    title: "Subscribers",
    optionName: "Subscribers",
    icon: <MailOutlined style={{ fontSize: "18px" }} />,
    route: "/admin/subscribers",
    isAdmin: true,
    isCounselor: false,
    isCollegeAdmin: false,
  },
];

const Sidebar = ({ setTitle }) => {
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={() => setCollapsed(!collapsed)}
      style={{
        backgroundColor: "#fff",
        boxShadow: "1px 1px 6px #c1c1c1",
        zIndex: 2,
      }}
    >
      <img
        src={Logo}
        alt=""
        className={`mx-auto my-1.5 duration-300 ${collapsed ? "w-0" : "w-44"}`}
      />
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        style={{ backgroundColor: "#fff", marginTop: "10px" }}
      >
        {menuOptions.map((val, index) => {
          const key = 1
          if (
            (user.role === 2 && val?.isCounselor) ||
            (user.role === 3 && val?.isAdmin) ||
            (user.role === 4 && val?.isCollegeAdmin)
          ) {
            return (
              <Menu.Item
                key={index + 1}
                icon={val?.icon}
                style={{ fontSize: "18px", display: "flex", color: "#0a2c3c" }}
                onClick={() => {
                  navigate(val?.route);
                  setTitle(val?.title);
                }}
              >
                {val?.optionName}
              </Menu.Item>
            );
          }
        })}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
