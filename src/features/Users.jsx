import React, { useEffect, useReducer } from "react";
import axios from "../appConfig/httpHelper";
import ActionButtons from "./components/actionsButtons/Index";
import { DataTable } from "./components/table/Index";
import { toast } from "react-toastify";
import { EyeOutlined } from "@ant-design/icons";
import { innerTableActionBtnDesign } from "./components/styles/innerTableActions";
import { DrawerComp } from "./components/Drawers/UserFollowUp";

const EndUsers = () => {
  // Declaring the States Required for the Working of the Component
  const [actions, setActions] = useReducer(
    (state, diff) => ({ ...state, ...diff }),
    {
      drawer: false,
      loading: false,
      pagination: 15,
      trash: false,
      loadingAllEndUser: false,
      downloadAllEndUser: false,
    }
  );

  const {
    drawer,
    loading,
    pagination,
    trash,
    loadingAllEndUser,
    downloadAllEndUser,
  } = actions;

  const [value, setValue] = useReducer(
    (state, diff) => ({ ...state, ...diff }),
    { endUsers: [], allEndUser: [], drawerValue: {} }
  );

  const { endUser, allEndUser, drawerValue } = value;

  // Functions Used for Different Data
  const requestsCaller = () => {
    setActions({ loading: true });
    axios
      .get("/user/get-all")
      .then((res) => {
        setValue({
          endUser: res.data.data,
        });
      })
      .catch((err) => console.log(err))
      .finally(setActions({ loading: false }));
  };

  const getAllEndUser = () => {
    setActions({ loadingAllProducts: true });
    axios
      .get("/user/get-all")
      .then((res) => {
        toast.success("Users Ready for Download");
        setActions({ downloadAllEndUser: true });
        setValue({
          allEndUser: res.data.data,
        });
      })
      .catch((err) => console.log(err))
      .finally(setActions({ loadingALlEndUser: true }));
  };

  useEffect(() => requestsCaller(), []);

  const onCloseDrawer = () => setActions({ drawer: false });

  // Table Column
  const columns = [
    {
      key: "name",
      title: "Name",
      render: (data) => data.name,
    },
    {
      key: "exam",
      title: "Exam",
      render: (data) => (data.examType == 1 ? "JEE" : "NEET"),
    },
    {
      key: "email",
      title: "Email",
      render: (data) => data.email,
    },
    {
      key: "state",
      title: "State",
      render: (data) => data.state,
    },
    {
      key: "phoneNumber",
      title: "Phone Number",
      render: (data) => data.phoneNumber,
    },
    {
      key: "actions",
      title: "Actions",
      render: (record) => <ColumnActions record={record} />,
    },
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
        pageTitle={"Users"}
        showReFreshButton={true}
        refreshFunction={requestsCaller}
        showExportDataButton={true}
        exportDataFunction={getAllEndUser}
        totalItems={allEndUser}
        csvName={"End Users"}
        loadingItems={loadingAllEndUser}
        downloadItems={downloadAllEndUser}
        showAddNewButton={false}
        addNewFunction={""}
      />
      <div className="border-2 mt-5">
        <DataTable usersData={endUser} columns={columns} loading={loading} />
      </div>
      <div>
        <DrawerComp
          title={"User Follow Ups"}
          visible={drawer}
          onCloseDrawer={onCloseDrawer}
          data={drawerValue}
        />
      </div>
    </div>
  );
};

export default EndUsers;
