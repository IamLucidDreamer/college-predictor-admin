import React, { useEffect, useReducer, useState } from "react";
import axios from "../appConfig/httpHelper";
import ActionButtons from "./components/actionsButtons/Index";
import { DataTable } from "./components/table/Index";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EyeOutlined, CloseOutlined } from "@ant-design/icons";
import { innerTableActionBtnDesign } from "./components/styles/innerTableActions";
import { useFormik } from "formik";
import * as Yup from "yup";

const Subscriber = () => {
  const [show, setShow] = useState(false);

  // Declaring the States Required for the Working of the Component
  const [actions, setActions] = useReducer(
    (state, diff) => ({ ...state, ...diff }),
    {
      drawer: false,
      loading: false,
      pagination: 15,
      trash: false,
      loadingAllSubscriber: false,
      downloadAllSubscriber: false,
    }
  );

  const {
    drawer,
    loading,
    pagination,
    trash,
    loadingAllSubscriber,
    downloadAllSubscriber,
  } = actions;

  const [value, setValue] = useReducer(
    (state, diff) => ({ ...state, ...diff }),
    { subscriber: [], allSubscriber: [] }
  );

  const { subscriber, allSubscriber, drawerValue } = value;

  // Functions Used for Different Data
  const requestsCaller = () => {
    setActions({ loading: true });
    axios
      .get("/subscriber/get-all")
      .then((res) => {
        setValue({
          subscriber: res?.data?.data?.subscribers,
        });
      })
      .catch((err) => console.log(err))
      .finally(setActions({ loading: false }));
  };

  const getAllSubscriber = () => {
    setActions({ loadingAllProducts: true });
    axios
      .get("/subscriber/get-all", {})
      .then((res) => {
        toast.success("Business Users Ready for Download");
        setActions({ downloadAllSubscriber: true });
        setValue({
          allSubscriber: res?.data?.data?.subscribers,
        });
      })
      .catch((err) => console.log(err))
      .finally(setActions({ loadingAllBusiness: true }));
  };

  useEffect(() => requestsCaller(), []);

  // Table Column
  const columns = [
    {
      key: "_id",
      title: "Id",
      render: (data) => data._id,
    },
    {
      key: "email",
      title: "Email",
      render: (data) => data.email,
    },
    {
      key: "createdAt",
      title: "Registered On",
      render: (data) => data.createdAt,
    },
    // {
    //   key: "actions",
    //   title: "Actions",
    //   render: (record) => <ColumnActions record={record} />,
    // },
  ];

  const ColumnActions = (props) => {
    return (
      <div className="flex justify-around">
        <EyeOutlined
          title="View"
          style={innerTableActionBtnDesign}
          onClick={() => {
            setActions({ drawer: true });
            setValue({ drawerValue: props?.record });
          }}
        />
      </div>
    );
  };

  return (
    <div className="">
      <ActionButtons
        pageTitle={"Subscriber"}
        showTrashButton={false}
        showTrashFunction={""}
        showReFreshButton={true}
        refreshFunction={requestsCaller}
        showExportDataButton={true}
        exportDataFunction={getAllSubscriber}
        totalItems={allSubscriber}
        csvName={"subscriber"}
        loadingItems={loadingAllSubscriber}
        downloadItems={downloadAllSubscriber}
        showAddNewButton={false}
        addNewFunction={""}
      />
      <div className="border-2 mt-5">
        <DataTable usersData={subscriber} columns={columns} loading={loading} />
      </div>
    </div>
  );
};

export default Subscriber;
