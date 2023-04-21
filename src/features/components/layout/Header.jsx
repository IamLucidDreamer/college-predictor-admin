import React, { useEffect, useState } from "react";
import { Layout, Menu, Dropdown, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { UserOutlined, DownOutlined, BellOutlined } from "@ant-design/icons";
import { logout } from "../../../store/actions/user";
import axios from "../../../appConfig/httpHelper";

export const HeaderElement = ({ title }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [showNotification, setShowNotification] = useState(false);
  // const [notification, setNotification] = useState(true);
  // const [notificationData, setNotificationData] = useState([]);

  const { Header } = Layout;

  const DropDownMenu = () => (
    <Menu>
      {/* <Menu.Item key="1">User Profile</Menu.Item> */}
      <Menu.Item key="2" onClick={() => dispatch(logout())}>
        LogOut
      </Menu.Item>
    </Menu>
  );

  // const getNotifications = () => {
  //   const token = JSON.parse(localStorage.getItem("jwt"));
  //   axios
  //     .get(`/notification`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res.data);
  //       setNotificationData(res.data.data);
  //     })
  //     .catch((err) => console.log(err));
  // };

  // useEffect(() => getNotifications(), []);

  // const Notification = () => (
  //   <Modal
  //     title="Notifications"
  //     style={{ top: 80, right: 20, position: "absolute" }}
  //     visible={showNotification}
  //     closable={true}
  //     cancelButtonProps={{ style: { display: "none" } }}
  //     okButtonProps={{ style: { display: "none" } }}
  //     onCancel={() => {
  //       setShowNotification(false);
  //       setNotification(false);
  //     }}
  //   >
  //     <button className="text-blue-700 underline hover:no-underline">
  //       Mark All Read
  //     </button>
  //     {notificationData.map((data) => (
  //       <div className="bg-slate-100 my-1 pt-2 px-2 rounded">
  //         <h1 className="m-0 text-lg text-purple-1">{data?.text}</h1>
  //         <h1 className="text-right">{`${data?.date}/${data?.month}/${data?.year}`}</h1>
  //       </div>
  //     ))}
  //   </Modal>
  // );

  return (
    <Header
      style={{
        paddingLeft: "35px",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 1,
        boxShadow: "0px 1px 8px #c1c1c1",
      }}
    >
      <h1 className="text-purple-1 text-xl m-0">
        {(user.role === 2 && "Counsellor") ||
          (user.role === 3 && "Admin") ||
          (user.role === 4 && "College Admin")}{" "}
        Dashboard / {title}
      </h1>
      <div className="flex items-center justify-center">
        <Dropdown overlay={DropDownMenu} className="cursor-pointer">
          <div className="flex items-center">
            <h1 className="text-purple-1 text-base pr-3 m-0">{user.name}</h1>

            <div className="">
              <UserOutlined
                style={{
                  backgroundColor: "#fff",
                  fontSize: 28,
                  borderRadius: 14,
                }}
              />
              <DownOutlined style={{ color: "#419b01", paddingLeft: 8 }} />
            </div>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};
