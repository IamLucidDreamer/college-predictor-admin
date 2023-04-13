import React, { useEffect, useReducer, useState } from "react";
import axios from "../appConfig/httpHelper";
import ActionButtons from "./components/actionsButtons/Index";
import { DataTable } from "./components/table/Index";
import { Tag } from "antd";
import { toast } from "react-toastify";
import { EyeOutlined, CloseOutlined } from "@ant-design/icons";
import { innerTableActionBtnDesign } from "./components/styles/innerTableActions";
import { useFormik } from "formik";
import * as Yup from "yup";

const Colleges = () => {
  const [show, setShow] = useState(false);

  // Declaring the States Required for the Working of the Component
  const [actions, setActions] = useReducer(
    (state, diff) => ({ ...state, ...diff }),
    {
      drawer: false,
      loading: false,
      pagination: 15,
      trash: false,
      loadingAllCollege: false,
      downloadAllCollege: false,
    }
  );

  const {
    drawer,
    loading,
    pagination,
    trash,
    loadingAllCollege,
    downloadAllCollege,
  } = actions;

  const [value, setValue] = useReducer(
    (state, diff) => ({ ...state, ...diff }),
    { college: [], allCollege: [] }
  );

  const { college, allCollege, drawerValue } = value;

  // Functions Used for Different Data
  const requestsCaller = () => {
    setActions({ loading: true });
    axios
      .get("/college/get-all")
      .then((res) => {
        setValue({
          college: res?.data?.data?.College,
        });
      })
      .catch((err) => console.log(err))
      .finally(setActions({ loading: false }));
  };

  const getAllCollege = () => {
    setActions({ loadingAllProducts: true });
    axios
      .get("/college/get-all", {})
      .then((res) => {
        toast.success("Business Users Ready for Download");
        setActions({ downloadAllCollege: true });
        setValue({
          allCollege: res?.data?.data?.college,
        });
      })
      .catch((err) => console.log(err))
      .finally(setActions({ loadingAllBusiness: true }));
  };

  const handleNewCollege = (value) => {
    console.log(value);
    const formData = new FormData();
    formData.append("collegeIcon", value.collegeIcon);
    formData.append("collegeCover", value.collegeCover);
    delete value.collegeIcon;
    delete value.collegeCover;
    formData.append("data", JSON.stringify(value));
    console.log(formData, "hiD");
    axios
      .post("/college/create", formData)
      .then((res) => {
        toast.success("New Update Added Successfully.");
        requestsCaller();
        setShow(false);
      })
      .catch((err) => console.log(err))
      .finally(setActions({ loadingAllBusiness: true }));
  };

  const showAddNew = () => setShow(true);

  useEffect(() => requestsCaller(), []);

  const columns = [
    {
      title: "College Name",
      dataIndex: "collegeName",
      key: "collegeName",
    },
    {
      title: "College Type",
      dataIndex: "collegeType",
      key: "collegeType",
    },
    {
      title: "College Tag",
      dataIndex: "collegeTag",
      key: "collegeTag",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Established Year",
      dataIndex: "estYear",
      key: "estYear",
    },
    {
      title: "Courses Offered",
      dataIndex: "coursesOffered",
      key: "coursesOffered",
      render: (courses) => (
        <>
          {courses.map((course) => (
            <Tag key={course}>{course}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Ranking",
      dataIndex: "ranking",
      key: "ranking",
    },
    {
      title: "Hotness Score",
      dataIndex: "hotnessScore",
      key: "hotnessScore",
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      render: (website) => (
        <a href={website} target="_blank" rel="noopener noreferrer">
          {website}
        </a>
      ),
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
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

  const formik = useFormik({
    initialValues: {
      collegeName: "",
      collegeType: "",
      collegeTag: "",
      estYear: "",
      city: "",
      state: "",
      website: "",
      contactNumber: "",
      contactEmail: "",
      ranking: "",
      hostnessScore: "",
    },
    validationSchema: Yup.object({
      // title: Yup.string().required("Required"),
      // description: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      handleNewCollege(values);
    },
  });

  return (
    <div className="">
      <ActionButtons
        pageTitle={"College"}
        showTrashButton={false}
        showTrashFunction={""}
        showReFreshButton={true}
        refreshFunction={requestsCaller}
        showExportDataButton={true}
        exportDataFunction={getAllCollege}
        totalItems={allCollege}
        csvName={"College"}
        loadingItems={loadingAllCollege}
        downloadItems={downloadAllCollege}
        showAddNewButton={true}
        addNewFunction={showAddNew}
      />
      {show ? (
        <form
          onSubmit={formik.handleSubmit}
          className="my-6 max-w-screen-lg mx-auto"
        >
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl text-purple-1 m-0">Add New College</h1>
            <button className="ml-10 mt-0 pt-0" onClick={() => setShow(false)}>
              <CloseOutlined style={{ fontSize: "20px" }} />
            </button>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <div className="">
              <input
                type="text"
                placeholder="College Name"
                className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full"
                {...formik.getFieldProps("collegeName")}
              />
              {formik.touched.collegeName && formik.errors.collegeName ? (
                <div>{formik.errors.collegeName}</div>
              ) : null}
            </div>
            <div className="">
              <input
                type="text"
                placeholder="college Tag"
                className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full "
                {...formik.getFieldProps("collegeTag")}
              />
              {formik.touched.collegeTag && formik.errors.collegeTag ? (
                <div>{formik.errors.collegeTag}</div>
              ) : null}
            </div>
            <div className="">
              <input
                type="text"
                placeholder="College Type"
                className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full "
                {...formik.getFieldProps("collegeType")}
              />
              {formik.touched.collegeType && formik.errors.collegeType ? (
                <div>{formik.errors.collegeType}</div>
              ) : null}
            </div>
            <div className="">
              <input
                type="text"
                placeholder="Contact Email"
                className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full "
                {...formik.getFieldProps("contactEmail")}
              />
              {formik.touched.contactEmail && formik.errors.contactEmail ? (
                <div>{formik.errors.contactEmail}</div>
              ) : null}
            </div>
            <div className="">
              <input
                type="text"
                placeholder="Contact Number"
                className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full "
                {...formik.getFieldProps("contactNumber")}
              />
              {formik.touched.contactNumber && formik.errors.contactNumber ? (
                <div>{formik.errors.contactNumber}</div>
              ) : null}
            </div>
            <div className="">
              <input
                type="text"
                placeholder="Establise Year"
                className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full "
                {...formik.getFieldProps("estYear")}
              />
              {formik.touched.estYear && formik.errors.estYear ? (
                <div>{formik.errors.estYear}</div>
              ) : null}
            </div>
            <div className="">
              <input
                type="text"
                placeholder="City"
                className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full "
                {...formik.getFieldProps("city")}
              />
              {formik.touched.city && formik.errors.city ? (
                <div>{formik.errors.city}</div>
              ) : null}
            </div>
            <div className="">
              <input
                type="text"
                placeholder="State"
                className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full "
                {...formik.getFieldProps("state")}
              />
              {formik.touched.state && formik.errors.state ? (
                <div>{formik.errors.state}</div>
              ) : null}
            </div>
            <div className="">
              <input
                type="text"
                placeholder="Hotness Score"
                className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full "
                {...formik.getFieldProps("hotnessScore")}
              />
              {formik.touched.hostnessScore && formik.errors.hostnessScore ? (
                <div>{formik.errors.hostnessScore}</div>
              ) : null}
            </div>
            <div className="">
              <input
                type="text"
                placeholder="Ranking"
                className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full "
                {...formik.getFieldProps("ranking")}
              />
              {formik.touched.ranking && formik.errors.ranking ? (
                <div>{formik.errors.ranking}</div>
              ) : null}
            </div>
            <div className="flex items-center justify-evenly gap-4">
              <div className="">
                <h1>College Icon</h1>
                <input
                  type="file"
                  placeholder="Name of Packaging Type "
                  className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg"
                  onChange={(e) =>
                    formik.setFieldValue(
                      "collegeIcon",
                      e.currentTarget.files[0]
                    )
                  }
                />
              </div>
              <div className="">
                <h1>Cover Image</h1>
                <input
                  type="file"
                  placeholder="Name of Packaging Type "
                  className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg"
                  onChange={(e) =>
                    formik.setFieldValue(
                      "collegeCover",
                      e.currentTarget.files[0]
                    )
                  }
                />
              </div>
            </div>
            <button
              className="ml-10 text-xl bg-secondary text-white p-3 rounded-xl"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      ) : null}
      <div className="border-2 mt-5">
        <DataTable usersData={college} columns={columns} loading={loading} />
      </div>
    </div>
  );
};

export default Colleges;
