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
  pagination = true,
}) => {
  return (
    <div className="shadow-lg">
      <Table
        columns={columns}
        dataSource={usersData}
        pagination={pagination}
        loading={loading}
      />
    </div>
  );
};
