import React, { useEffect, useReducer, useState } from "react";
import axios from "../appConfig/httpHelper";
import ActionButtons from "./components/actionsButtons/Index";
import { DataTable } from "./components/table/Index";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EyeOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { innerTableActionBtnDesign } from "./components/styles/innerTableActions";
import { useFormik } from "formik";
import * as Yup from "yup";

const Referral = () => {
  const [show, setShow] = useState(false);

  // Declaring the States Required for the Working of the Component
  const [actions, setActions] = useReducer(
    (state, diff) => ({ ...state, ...diff }),
    {
      drawer: false,
      loading: false,
      pagination: 15,
      trash: false,
      loadingAllUpdates: false,
      downloadAllUpdates: false,
    }
  );

  const {
    drawer,
    loading,
    pagination,
    trash,
    loadingAllUpdates,
    downloadAllUpdates,
  } = actions;

  const [value, setValue] = useReducer(
    (state, diff) => ({ ...state, ...diff }),
    { referrals: [], allUpdates: [] }
  );

  const { referrals, allUpdates, drawerValue } = value;


  // Functions Used for Different Data
  const requestsCaller = () => {
    setActions({ loading: true });
    axios
      .get("/statistics/referral")
      .then((res) => {
        setValue({
          referrals: res?.data?.data,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setActions({ loading: false }));
  };

  useEffect(() => requestsCaller(), []);

  const columns = [
    {
      key: "name",
      title: "Name",
      render: (data) => data?.ownerDetails[0]?.name,
    },
    {
      key: "phoneNumber",
      title: "Phone Number",
      render: (data) => data?.ownerDetails[0]?.phoneNumber,
    },
    {
      key: "email",
      title: "Email",
      render: (data) => data?.ownerDetails[0]?.email,
    },
    {
      key: "totalReferradUsers",
      title: "Total Referrals",
      render: (data) => data?.count,
    },

  ];

  return (
      <div>
        <h1 className="text-2xl text-center">Referral Details</h1>
        <DataTable
          usersData={referrals}
          columns={columns}
          loading={loading}
        />
      </div>
  );
};

export default Referral;
