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

const Updates = () => {
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
    { updates: [], allUpdates: [] }
  );

  const { updates, allUpdates, drawerValue } = value;

  // Functions Used for Different Data
  const requestsCaller = () => {
    setActions({ loading: true });
    axios
      .get("/updates/get-all")
      .then((res) => {
        setValue({
          updates: res?.data?.data?.updates,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setActions({ loading: false }));
  };

  const getAllUpdates = () => {
    setActions({ loadingAllProducts: true });
    axios
      .get("/updates/get-all", {})
      .then((res) => {
        toast.success("Updates Data Ready for Download");
        setActions({ downloadAllUpdates: true });
        setValue({
          allUpdates: res?.data?.data?.updates,
        });
      })
      .catch((err) => console.log(err))
      .finally(setActions({ loadingAllBusiness: true }));
  };

  const handleNewUpdates = (value) => {
    setActions({ loading: true });
    const formData = new FormData();
    formData.append("imageMain", value.imageMain);
    formData.append("document", value.document);
    delete value.iamgeMain;
    delete value.document;
    formData.append("data", JSON.stringify(value));
    axios
      .post("/updates/create", formData)
      .then((res) => {
        toast.success("New Update Added Successfully.");
        requestsCaller();
        setShow(false);
      })
      .catch((err) => console.log(err))
      .finally(() => setActions({ loading: false }));
  };

  const deleteUpdate = (id) => {
    axios
      .delete(`/updates/delete/${id}`)
      .then((res) => {
        toast.success("Update Removed Successfully.");
        requestsCaller();
      })
      .catch((err) => console.log(err))
      .finally(() => setActions({ loading: false }));
  };

  const showAddNew = () => setShow(true);

  useEffect(() => requestsCaller(), []);

  // Table Column
  const columns = [
    {
      key: "title",
      title: "Title",
      render: (data) => data.title,
    },
    {
      key: "description",
      title: "Description",
      render: (data) => data.description,
    },
    {
      key: "imageMain",
      title: "ImageMain",
      render: (data) => (
        <img src={data?.imageMain} className="h-36 max-w-56 mx-auto" />
      ),
    },
    {
      key: "document",
      title: "Document",
      render: (data) =>
        data?.document ? (
          <a
            href={data?.document}
            target="_blank"
            className="py-2 px-6 text-white rounded-md bg-secondary"
          >
            View
          </a>
        ) : null,
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
          style={{...innerTableActionBtnDesign,opacity : "25%"}}
          onClick={() => {
            setActions({ drawer: true });
            setValue({ drawerValue: props?.record });
          }}
        />
        <DeleteOutlined
          title="View"
          style={innerTableActionBtnDesign}
          onClick={() => {
            deleteUpdate(props.record._id);
          }}
        />
      </div>
    );
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      console.log("Hello world");
      handleNewUpdates(values);
    },
  });

  return (
    <div className="">
      <ActionButtons
        pageTitle={"Updates"}
        showTrashButton={false}
        showTrashFunction={""}
        showReFreshButton={true}
        refreshFunction={requestsCaller}
        showExportDataButton={true}
        exportDataFunction={getAllUpdates}
        totalItems={allUpdates}
        csvName={"updates"}
        loadingItems={loadingAllUpdates}
        downloadItems={downloadAllUpdates}
        showAddNewButton={true}
        addNewFunction={showAddNew}
      />
      {show ? (
        <form
          onSubmit={formik.handleSubmit}
          className="my-6 max-w-screen-lg mx-auto"
        >
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl text-purple-1 m-0">Add New Update Type</h1>
            <button className="ml-10 mt-0 pt-0" onClick={() => setShow(false)}>
              <CloseOutlined style={{ fontSize: "20px" }} />
            </button>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <div className="">
              <input
                type="text"
                placeholder="Title of Update"
                className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full"
                {...formik.getFieldProps("title")}
              />
              {formik.touched.title && formik.errors.title ? (
                <div>{formik.errors.title}</div>
              ) : null}
            </div>
            <div className="">
              <textarea
                placeholder="Description of update"
                className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full h-40"
                {...formik.getFieldProps("description")}
              />
              {formik.touched.description && formik.errors.description ? (
                <div>{formik.errors.description}</div>
              ) : null}
            </div>
            <div className="flex items-center justify-evenly gap-4">
              <div className="">
                <h1>Main Image</h1>
                <input
                  type="file"
                  placeholder="Name of Packaging Type "
                  className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg"
                  onChange={(e) =>
                    formik.setFieldValue("imageMain", e.currentTarget.files[0])
                  }
                />
              </div>
              <div className="">
                <h1>Document</h1>
                <input
                  type="file"
                  placeholder="Name of Packaging Type "
                  className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg"
                  onChange={(e) =>
                    formik.setFieldValue("document", e.currentTarget.files[0])
                  }
                />
              </div>
            </div>
            <button
              className="text-xl bg-secondary text-white p-3 rounded-xl"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      ) : null}
      <div className="border-2 mt-5">
        <DataTable usersData={updates} columns={columns} loading={loading} />
      </div>
    </div>
  );
};

export default Updates;
