import React, { useEffect, useReducer, useState } from "react";
import axios from "../appConfig/httpHelper";
import ActionButtons from "./components/actionsButtons/Index";
import { DataTable } from "./components/table/Index";
import { toast } from "react-toastify";
import { CloseOutlined, EyeOutlined } from "@ant-design/icons";
import { innerTableActionBtnDesign } from "./components/styles/innerTableActions";
import { DrawerComp } from "./components/Drawers/UserFollowUp";
import { useFormik } from "formik";
import * as Yup from "yup";
import { State } from "country-state-city";

const EXAM_TYPE = ["NEET", "AYUSH"];

const PredictorData = () => {
  const [show, setShow] = useState(false);

  // Declaring the States Required for the Working of the Component
  const [actions, setActions] = useReducer(
    (state, diff) => ({ ...state, ...diff }),
    {
      drawer: false,
      loading: false,
      pagination: 15,
      trash: false,
      loadingAllNeetData: false,
      downloadAllNeetData: false,
    }
  );

  const {
    drawer,
    loading,
    pagination,
    trash,
    loadingAllNeetData,
    downloadAllNeetData,
  } = actions;

  const [value, setValue] = useReducer(
    (state, diff) => ({ ...state, ...diff }),
    { neetData: [], allNeetData: [], drawerValue: {} }
  );

  const { neetData, allNeetData, drawerValue } = value;

  // Functions Used for Different Data
  const requestsCaller = () => {
    setActions({ loading: true });
    axios
      .get("/neet/get-all?limit=100000")
      .then((res) => {
        setValue({
          neetData: res.data.data?.neetData,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setActions({ loading: false }));
  };

  const getAllNeetData = () => {
    setActions({ loadingAllNeetData: true });
    axios
      .get("/neet/get-all?limit=100000")
      .then((res) => {
        toast.success("Predictor Data Ready for Download");
        setActions({ downloadAllNeetData: true });
        setValue({
          allNeetData: res.data.data?.neetData,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setActions({ loadingAllNeetData: false }));
  };

  const handleNewData = (value) => {
    setActions({ loading: true });
    const formData = new FormData();
    formData.append("file", value.file);
    formData.append(
      "examType",
      `${value.examType}/${value.counsellingCategory}`
    );
    if (value.examType === "NEET") {
      axios
        .post("/neet/bulk-upload", formData)
        .then((res) => {
          toast.success("New Data Added Successfully.");
          setShow(false);
          requestsCaller();
        })
        .catch((err) => console.log(err))
        .finally(() => setActions({ loading: false }));
    } else if (value.examType === "AYUSH") {
      toast.warning("Database Checks not complete for this Exam Type");
      setActions({ loading: false });
    } else {
      toast.error("Invalide Exam Type");
      setActions({ loading: false });
    }
  };

  useEffect(() => requestsCaller(), []);

  const showAddNew = () => setShow(true);

  const onCloseDrawer = () => setActions({ drawer: false });

  // Table Column
  const columns = [
    {
      key: "examType",
      title: "Counselling Type",
      render: (data) => (
        <div className="bg-red-200 text-center">{data?.examType}</div>
      ),
    },
    {
      key: "course",
      title: "Course",
      render: (data) => data?.course,
    },
    {
      key: "round",
      title: "Round",
      render: (data) => data?.round,
    },
    {
      key: "allottedPH",
      title: "Allotted PH ",
      render: (data) => data?.allottedPH,
    },
    {
      key: "quota",
      title: "Quota",
      render: (data) => data?.quota,
    },
    {
      key: "allottedCategory",
      title: "Allotted Category",
      render: (data) => data?.allottedCategory,
    },
    {
      key: "instituteName",
      title: "Institute Name",
      render: (data) => data?.instituteName,
    },
    {
      key: "instituteType",
      title: "Institute Type",
      render: (data) => (data?.instituteType ? data?.instituteType : "--"),
    },
    {
      key: "examCategory",
      title: "Exam Category",
      render: (data) => (data?.examCategory ? data?.examCategory : "--"),
    },
    {
      key: "year",
      title: "Year",
      render: (data) => (data?.year ? data?.year : "--"),
    },
    {
      key: "openingRank",
      title: "Opening Rank",
      render: (data) => data?.openingRank,
    },
    {
      key: "closingRank",
      title: "Closing Rank",
      render: (data) => data?.closingRank,
    },
    {
      key: "actions",
      title: "Actions",
      render: (record) => <ColumnActions record={record} />,
    },
  ];

  const ColumnActions = (props) => {
    return (
      <div className="flex justify-around opacity-25">
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

  const formik = useFormik({
    initialValues: {
      examType: "",
      counsellingCategory: "",
    },
    validationSchema: Yup.object({
      examType: Yup.string().required("Required"),
      counsellingCategory: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      handleNewData(values);
    },
  });

  return (
    <div className="">
      <ActionButtons
        pageTitle={"Predictor Data"}
        showReFreshButton={true}
        refreshFunction={requestsCaller}
        showExportDataButton={true}
        exportDataFunction={getAllNeetData}
        totalItems={allNeetData}
        csvName={"predictorData"}
        loadingItems={loadingAllNeetData}
        downloadItems={downloadAllNeetData}
        showAddNewButton={true}
        addNewFunction={showAddNew}
      />
      {show ? (
        <form className="my-6 max-w-screen-lg mx-auto">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl text-purple-1 m-0">
              Add New Predictor Data
            </h1>
            <button className="ml-10 mt-0 pt-0" onClick={() => setShow(false)}>
              <CloseOutlined style={{ fontSize: "20px" }} />
            </button>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <div className="">
              <div className="">
                <select
                  className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full"
                  {...formik.getFieldProps("examType")}
                >
                  <option disabled value="">
                    Choose Exam Type
                  </option>
                  {EXAM_TYPE.map((val) => {
                    return <option value={val}>{val}</option>;
                  })}
                </select>
              </div>
              {formik.touched.examType && formik.errors.examType ? (
                <div className="text-red-500">{formik.errors.examType}</div>
              ) : null}
              <div className="mt-4">
                <select
                  className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full"
                  {...formik.getFieldProps("counsellingCategory")}
                >
                  <option disabled value="">
                    Choose Counselling Category
                  </option>
                  <option value="All India">All India</option>
                  {State.getStatesOfCountry("IN").map((item) => {
                    return <option value={item.name}>{item.name}</option>;
                  })}
                </select>
              </div>
              {formik.touched.counsellingCategory &&
              formik.errors.counsellingCategory ? (
                <div className="text-red-500">
                  {formik.errors.counsellingCategory}
                </div>
              ) : null}
              <h1 className="my-2 font-semibold">New Data</h1>
              <input
                type="file"
                placeholder="Name of Packaging Type "
                className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg my-2"
                onChange={(e) => {
                  e.preventDefault();
                  console.log(e.currentTarget.files[0]);
                  formik.setFieldValue("file", e.currentTarget.files[0]);
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
            className="text-xl bg-secondary text-white p-3 rounded-xl w-full"
          >
            Submit
          </button>
        </form>
      ) : null}
      <div className="border-2 mt-5">
        <DataTable usersData={neetData} columns={columns} loading={loading} />
      </div>
      <div>
        {/* <DrawerComp
          title={"User Follow Ups"}
          visible={drawer}
          onCloseDrawer={onCloseDrawer}
          data={drawerValue}
        /> */}
      </div>
    </div>
  );
};

export default PredictorData;
