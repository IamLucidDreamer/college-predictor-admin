import React, { useEffect, useReducer, useState } from "react";
import axios from "../appConfig/httpHelper";
import ActionButtons from "./components/actionsButtons/Index";
import { DataTable } from "./components/table/Index";
import { Tag } from "antd";
import { toast } from "react-toastify";
import { EyeOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { innerTableActionBtnDesign } from "./components/styles/innerTableActions";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { State, City } from "country-state-city";

const COLLEGE_TYPE = ["Government", "Private", "Others"];
const COLLEGE_TAG = [
  "AIIMS",
  "JIPMER",
  "Government Medical College",
  "State Quota",
  "Central Institute",
  "Deemed College",
  "ESIC",
  "Government Aided",
];
const COLLEGE_COURSES = [
  "MBBS",
  "BDS",
  "BAMS",
  "BHMS",
  "BSMS",
  "BUMS",
  "Others",
];

const Colleges = () => {
  const [show, setShow] = useState(false);
  const [collegeNameData, setCollegeNameData] = useState([]);

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

  const getCollegeName = () => {
    axios
      .post("/neet-dropdown", { instituteName: [] })
      .then((res) => {
        const newObject = res?.data?.data;
        newObject.instituteName = newObject.filter(
          (item, index) => newObject.indexOf(item) === index
        );
        setCollegeNameData(newObject);
      })
      .catch((err) => console.log(err))
      .finally(setActions({ loading: false }));
  };

  // Functions Used for Different Data
  const requestsCaller = () => {
    setActions({ loading: true });
    axios
      .get("/college/get-all?limit=10000&skip=0")
      .then((res) => {
        setValue({
          college: res?.data?.data?.College,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setActions({ loading: false }));
  };

  const getAllCollege = () => {
    setActions({ loadingAllProducts: true });
    axios
      .get("/college/get-all", {})
      .then((res) => {
        toast.success("Colleges Users Ready for Download");
        setActions({ downloadAllCollege: true });
        setValue({
          allCollege: res?.data?.data?.college,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setActions({ loadingAllBusiness: false }));
  };

  const handleNewCollege = (value) => {
    setActions({ loading: true });
    const formData = new FormData();
    formData.append("collegeIcon", value.collegeIcon);
    formData.append("collegeCover", value.collegeCover);
    value.campusPhotos.map((item, index) => {
      formData.append(`campusPhotos${index}`, item);
    });
    delete value.collegeIcon;
    delete value.collegeCover;
    formData.append("data", JSON.stringify(value));
    axios
      .post("/college/create", formData)
      .then((res) => {
        toast.success("New Update Added Successfully.");
        requestsCaller();
        setShow(false);
      })
      .catch((err) => console.log(err))
      .finally(() => setActions({ loading: false }));
  };

  const deleteCollege = (id) => {
    axios
      .delete(`/college/delete/${id}`)
      .then((res) => {
        toast.success("College Removed Successfully.");
        requestsCaller();
      })
      .catch((err) => console.log(err))
      .finally(() => setActions({ loading: false }));
  };

  const showAddNew = () => setShow(true);

  useEffect(() => {
    getCollegeName();
    requestsCaller();
  }, []);

  const columns = [
    {
      title: "College Name",
      dataIndex: "collegeName",
      key: "collegeName",
    },
    {
      title: "Display Name",
      dataIndex: "displayName",
      key: "displayName",
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
            <Tag key={course.value}>{course.value}</Tag>
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
          style={{ ...innerTableActionBtnDesign, opacity: "25%" }}
          onClick={() => {
            setActions({ drawer: true });
            setValue({ drawerValue: props?.record });
          }}
        />
        <DeleteOutlined
          title="View"
          style={innerTableActionBtnDesign}
          onClick={() => {
            deleteCollege(props.record._id);
          }}
        />
      </div>
    );
  };

  const AddNewCollege = () => {
    const [stateCode, setStateCode] = useState();

    const formik = useFormik({
      initialValues: {
        displayName: "",
        collegeName: "",
        collegeType: "",
        collegeTag: "",
        coursesOffered: [],
        estYear: "",
        state: "",
        city: "",
        address: "",
        website: "",
        contactNumber: "",
        contactEmail: "",
        ranking: "",
        hostnessScore: "",
        applicationLink: "",
        tutionFees: "",
        hostelFees: "",
        campusPhotos: [],
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
            <Select
              value={{
                value: formik.values.collegeName,
                label: formik.values.collegeName,
              }}
              placeholder={`Select College Name`}
              options={collegeNameData?.map((value) => {
                return {
                  value: value?.instituteName,
                  label: value?.instituteName,
                };
              })}
              onChange={(e) => {
                formik.setFieldValue("collegeName", e.value);
              }}
            />
            {formik.touched.collegeName && formik.errors.collegeName ? (
              <div>{formik.errors.collegeName}</div>
            ) : null}
          </div>
          <div className="">
            <input
              type="text"
              placeholder="College Display Name"
              className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full "
              {...formik.getFieldProps("displayName")}
            />
            {formik.touched.displayName && formik.errors.displayName ? (
              <div>{formik.errors.displayName}</div>
            ) : null}
          </div>
          <div className="">
            <select
              className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full"
              {...formik.getFieldProps("collegeType")}
            >
              <option disabled value="">
                Choose College Type
              </option>
              {COLLEGE_TYPE.map((val) => {
                return (
                  <option key={val} value={val}>
                    {val}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="">
            <select
              className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full"
              {...formik.getFieldProps("collegeTag")}
            >
              <option disabled value="">
                Choose College Tag
              </option>
              {COLLEGE_TAG.map((val) => {
                return (
                  <option key={val} value={val}>
                    {val}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="">
            <Select
              isMulti
              value={formik.values.coursesOffered}
              placeholder={`Select Courses Offered`}
              options={COLLEGE_COURSES?.map((value) => {
                return {
                  value: value,
                  label: value,
                };
              })}
              onChange={(e) => {
                formik.setFieldValue("coursesOffered", e);
              }}
            />
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
              placeholder="Website"
              className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full "
              {...formik.getFieldProps("website")}
            />
            {formik.touched.website && formik.errors.website ? (
              <div>{formik.errors.website}</div>
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
            <select
              placeholder="State Name"
              className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full"
              {...formik.getFieldProps("state")}
              onChange={(e) => {
                formik.setFieldValue("state", e.target.value);
                setStateCode(
                  State.getStatesOfCountry("IN").find((val) => {
                    if (val.name === e.target.value) return val;
                  })
                );
              }}
            >
              <option value="" disabled>
                Select State
              </option>
              {State.getStatesOfCountry("IN").map((item) => {
                return <option value={item.name}>{item.name}</option>;
              })}
            </select>
          </div>
          <div className="">
            <select
              placeholder="City Name"
              className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full "
              {...formik.getFieldProps("city")}
            >
              <option value="" disabled>
                Select City
              </option>
              {City.getCitiesOfState("IN", stateCode?.isoCode).map((item) => (
                <option value={item.name}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className="">
            <input
              type="text"
              placeholder="Address"
              className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full "
              {...formik.getFieldProps("address")}
            />
            {formik.touched.address && formik.errors.address ? (
              <div>{formik.errors.address}</div>
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
          <div className="">
            <input
              type="text"
              placeholder="Application Link"
              className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full "
              {...formik.getFieldProps("applicationLink")}
            />
            {formik.touched.applicationLink && formik.errors.applicationLink ? (
              <div>{formik.errors.applicationLink}</div>
            ) : null}
          </div>
          <div className="">
            <input
              type="text"
              placeholder="Tution Fees"
              className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full "
              {...formik.getFieldProps("tutionFees")}
            />
            {formik.touched.tutionFees && formik.errors.tutionFees ? (
              <div>{formik.errors.tutionFees}</div>
            ) : null}
          </div>
          <div className="">
            <input
              type="text"
              placeholder="Hostel Fees"
              className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full "
              {...formik.getFieldProps("hostelFees")}
            />
            {formik.touched.hostelFees && formik.errors.hostelFees ? (
              <div>{formik.errors.hostelFees}</div>
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
                  formik.setFieldValue("collegeIcon", e.currentTarget.files[0])
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
                  formik.setFieldValue("collegeCover", e.currentTarget.files[0])
                }
              />
            </div>
            <div className="">
              <h1>Campus Photos</h1>
              <input
                type="file"
                multiple
                placeholder="Name of Packaging Type "
                className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg"
                onChange={(e) =>
                  // formik.setFieldValue("campusPhotos", e.currentTarget.files[0])
                  formik.setFieldValue("campusPhotos", [
                    ...formik.values.campusPhotos,
                    e.target.files[0],
                  ])
                }
              />
              <div className="mt-2 flex gap-3">
                {formik.values.campusPhotos &&
                  formik.values.campusPhotos.map((item) => (
                    <img
                      key={item.name}
                      src={URL.createObjectURL(item)}
                      alt={item.name}
                      style={{ width: 50, height: 50 }}
                    />
                  ))}
              </div>
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
    );
  };

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
      {show ? <AddNewCollege /> : null}
      <div className="border-2 mt-5">
        <DataTable usersData={college} columns={columns} loading={loading} />
      </div>
    </div>
  );
};

export default Colleges;
