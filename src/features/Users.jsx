import React, { useEffect, useReducer, useState } from "react";
import axios from "../appConfig/httpHelper";
import ActionButtons from "./components/actionsButtons/Index";
import { DataTable } from "./components/table/Index";
import { toast } from "react-toastify";
import { EyeOutlined, PhoneOutlined, SearchOutlined } from "@ant-design/icons";
import { innerTableActionBtnDesign } from "./components/styles/innerTableActions";
import { DrawerComp } from "./components/Drawers/UserFollowUp";
import { Button, Input } from "antd";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const EndUsers = () => {
  const user = useSelector((state) => state?.user);

  const [showGetAll, setShowGetAll] = useState(1);
  let searchInput;

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
      .get(
        `/user/get-all?isAdmin=${
          user?.role === 3 ? 1 : ""
        }&getAll=${showGetAll}`
      )
      .then((res) => {
        setValue({
          endUser: res.data.data,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setActions({ loading: false }));
  };

  const getAllEndUser = () => {
    setActions({ loadingAllProducts: true });
    axios
      .get(`/user/get-all?getAll=${showGetAll}`)
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

  useEffect(() => requestsCaller(), [showGetAll]);

  const onCloseDrawer = () => setActions({ drawer: false });

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <div>
          <button
            type="button"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginRight: 8 }}
          >
            Search
          </button>
          <button
            onClick={() => handleReset(clearFilters)}
            style={{ marginRight: 8 }}
          >
            Reset
          </button>
        </div>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined className="text-xl bg-primary p-1 rounded-full" style={{ color: filtered ? "#ffffff" : "#ffffff" }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  // Table Column
  const columns = [
    {
      key: "name",
      title: "Name",
      render: (data) => data.name,
      ...getColumnSearchProps('name'),
    },
    {
      key: "registeredOn",
      title: "Registered On",
      render: (data) => (
        <h1>{dayjs(data?.createdAt).format("YYYY-MM-DD  HH:mm")}</h1>
      ),
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
      ...getColumnSearchProps('email'),
    },
    {
      key: "city",
      title: "City",
      render: (data) => data.city,
      ...getColumnSearchProps('city'),
    },
    {
      key: "state",
      title: "State",
      render: (data) => data.state,
      ...getColumnSearchProps('state'),
    },
    {
      key: "tenthMarks",
      title: "10th Marks",
      render: (data) => data.tenthMarks,
    },
    {
      key: "twelthMarks",
      title: "12th Marks",
      render: (data) => data.twelthMarks,
    },
    {
      key: "medicalMarks",
      title: "NEET Marks",
      render: (data) => data.medicalMarks,
    },
    {
      key: "course",
      title: "Course Interested",
      render: (data) => data.course,
      ...getColumnSearchProps('course'),
    },
    {
      key: "address",
      title: "Address",
      render: (data) => data.address,
    },
    {
      key: "dateOfBirth",
      title: "(DOB)",
      render: (data) => data.dateOfBirth,
    },
    {
      key: "phoneNumber",
      title: "Phone",
      render: (data) => data.phoneNumber,
      ...getColumnSearchProps('phoneNumber'),
    },
    {
      key: "actions",
      title: "Actions",
      render: (record) => <ColumnActions record={record} />,
    },
  ];

  const handleFollowUp = (data) => {
    setActions({ loading: true });
    axios
      .post(`/user/follow-up/create/${data?._id}`)
      .then((res) => {
        requestsCaller();
      })
      .catch((err) => {
        console.log(err);
        toast.warning(err?.response?.data?.error);
      })
      .finally(() => setActions({ loading: false }));
  };

  const ColumnActions = (props) => {
    return (
      <div className="flex justify-around">
        {!props?.record?.reviewerId && showGetAll === 1 && user?.role === 2 && (
          <PhoneOutlined
            style={innerTableActionBtnDesign}
            onClick={() => {
              console.log(props?.record);
              handleFollowUp(props?.record);
            }}
          />
        )}
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
        showExportDataButton={user?.role === 3 ? true : false}
        exportDataFunction={getAllEndUser}
        totalItems={allEndUser}
        csvName={"End Users"}
        loadingItems={loadingAllEndUser}
        downloadItems={downloadAllEndUser}
        showAddNewButton={false}
        addNewFunction={""}
      />
      {user?.role === 2 && (
        <div className="flex gap-4 mt-2">
          <Button type="primary" onClick={() => setShowGetAll(1)}>
            Show All
          </Button>
          <Button type="primary" onClick={() => setShowGetAll(2)}>
            Show Mine
          </Button>
        </div>
      )}
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
