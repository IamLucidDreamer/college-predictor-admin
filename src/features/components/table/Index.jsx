import React from "react";
import { Table } from "antd";
import "./styles/tableStyles.css";

export const DataTable = ({
  columns,
  usersData = [],
  loading,
  differUserRows,
  rowSelection,
  differRows,
  pagination,
}) => {
  return (
    <div className="shadow-lg">
      <Table
        columns={columns}
        dataSource={usersData}
        pagination={true}
        loading={loading}
      />
    </div>
  );
};
