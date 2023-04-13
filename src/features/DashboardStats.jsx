import React, { useEffect, useState } from "react";
import StatsCard from "./components/StatsCard";
import { Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import axios from "../appConfig/httpHelper";
import {
  UserOutlined,
  BankOutlined,
  EditOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

const DashboardStats = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState("");

  const dataLoader = () => {
    setLoading(true);
    axios
      .get(`/statistics/main`)
      .then((res) => {
        setStats(res.data.data);
      })
      .catch((err) => console.log(err))
      .finally(setLoading(false));
  };

  useEffect(() => {
    dataLoader();
  }, []);

  return (
    <div className="relative px-4 py-2">
      <div className="flex justify-end mr-10">
        <Button type="primary" loading={loading} onClick={() => dataLoader()}>
          <ReloadOutlined />
        </Button>
      </div>
      <div className="flex flex-wrap items-center mt-10 gap-8">
        <StatsCard
          title={"Total Users"}
          stat={stats?.userCount}
          icon={<UserOutlined style={{ fontSize: "40px" }} />}
        />
        <StatsCard
          title={"Total Colleges"}
          stat={stats?.collegeCount}
          icon={<BankOutlined style={{ fontSize: "40px" }} />}
        />
        <StatsCard
          title={"Total Counselors"}
          stat={stats?.councelorCount}
          icon={<EditOutlined style={{ fontSize: "40px" }} />}
        />
        <StatsCard
          title={"College Admins"}
          stat={stats?.collegeAdminCount}
          icon={<UserAddOutlined style={{ fontSize: "40px" }} />}
        />
      </div>
    </div>
  );
};

export default DashboardStats;
