import React, { useEffect, useState } from "react";
import StatsCard from "./components/StatsCard";
import { Button } from "antd";
import {
  PlusSquareOutlined,
  ReloadOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import axios from "../appConfig/httpHelper";
import {
  UserOutlined,
  BankOutlined,
  EditOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { DataTable } from "./components/table/Index";

const DashboardStats = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState("");
  const [counsellorData, setCounsellorData] = useState([]);

  const dataLoader = () => {
    setLoading(true);
    axios
      .get(`/statistics/main`)
      .then((res) => {
        setStats(res.data.data);
      })
      .catch((err) => console.log(err));
    axios
      .get(`/statistics/counsellor/calls`)
      .then((res) => {
        setCounsellorData(res?.data?.data);
      })
      .catch((err) => console.log(err))
    setLoading(false)
  };

  useEffect(() => {
    dataLoader();
  }, []);

  // Table Column
  const columns = [
    {
      key: "name",
      title: "Name",
      render: (data) => data?.reviewer?.name,
    },
    {
      key: "phoneNumber",
      title: "Phone Number",
      render: (data) => data?.reviewer?.phoneNumber,
    },
    {
      key: "email",
      title: "Email",
      render: (data) => data?.reviewer?.email,
    },
    {
      key: "totalReviewedUsers",
      title: "Total Counselled Students",
      render: (data) => data?.totalReviewedUsers,
    },

  ];

  return (
    <div className="relative px-4 py-2">
      <div className="flex justify-end mr-10">
        <Button type="primary" loading={loading} onClick={() => dataLoader()}>
          <ReloadOutlined />
        </Button>
      </div>
      <div className="mt-8">
        <div class="w-full lg:w-1/2 rounded-lg shadow-lg overflow-hidden bg-white mx-auto">
          <div class="p-8 flex items-center justify-center gap-4">
            <div class="p-3 rounded-full text-primary bg-primary bg-opacity-10 mr-8">
              <UserOutlined style={{ fontSize: "80px" }} />
            </div>
            <div>
              <p class="text-3xl font-medium text-secondary mb-1">
                Total Users
              </p>
              <p class="text-6xl font-semibold text-secondary mb-0">
                {stats?.userCount?.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center my-10 gap-8 justify-center">
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
        <StatsCard
          title={"Total Updates"}
          stat={stats?.totalUpdatesCount}
          icon={<PlusSquareOutlined style={{ fontSize: "40px" }} />}
        />
        <StatsCard
          title={"Total Blogs"}
          stat={stats?.totalBlogsCount}
          icon={<SnippetsOutlined style={{ fontSize: "40px" }} />}
        />
      </div>
      <div>
        <h1 className="text-2xl text-center">Counsellor Call Details</h1>
        <DataTable
          usersData={counsellorData}
          columns={columns}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DashboardStats;
