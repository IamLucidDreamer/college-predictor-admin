import React, { useEffect, useState } from "react";
import { Row, Col, Drawer, Tabs, TabPane, Image } from "antd";
import { Desc } from "../../components/layout/Desc";
import { DataTable } from "../../components/table/Index";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../../../appConfig/httpHelper";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export const DrawerComp = (props) => {
  const { TabPane } = Tabs;
  const [loading, setLoading] = useState(false);
  const [followUpData, setFollowUpData] = useState([]);
  console.log({ props });

  useEffect(() => {
    if (props?.data?._id) requestCaller();
  }, [props?.data?._id]);

  const handleNewFollowUp = (values) => {
    values.userId = props?.data?._id;
    axios
      .post("/user/follow-up/create", values)
      .then((res) => {
        toast.success("New Follow Successfully Created");
        requestCaller();
      })
      .catch((err) => console.log(err));
  };

  const requestCaller = () => {
    setLoading(true);
    axios
      .get(`/user/follow-up/get-all/${props?.data?._id}`)
      .then((res) => {
        setFollowUpData(res?.data?.data?.followUps);
      })
      .catch((err) => console.log(err))
      .finally(setLoading(false));
  };

  const formik = useFormik({
    initialValues: {
      description: "",
    },
    validationSchema: Yup.object({
      description: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      console.log("Hello world", values);
      handleNewFollowUp(values);
    },
  });

  const columnsNestedTable = [
    {
      key: "createdAt",
      title: "Created On",
      render: (data) => {
        return <p>{dayjs(data?.createdAt).format("YYYY-MM-DD  HH:mm")}</p>;
      },
    },
    {
      key: "updatedAt",
      title: "Updated On",
      render: (data) => {
        return dayjs(data?.updatedAt).format("YYYY-MM-DD  HH:mm");
      },
    },
    {
      key: "description",
      title: "Description",
      width: "50%",
      render: (data) => data.description,
    },
    {
      key: "counsouler",
      title: "Counsouler",
      render: (data) => data?.reviewerId?.name,
    },
  ];

  return (
    <Drawer
      title={props.title}
      width="75%"
      placement="right"
      onClose={() => props.onCloseDrawer()}
      visible={props.visible}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="" key="1">
          <form
            onSubmit={formik.handleSubmit}
            className="my-6 max-w-screen-lg mx-auto w-full lg:w-1/2"
          >
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-xl text-purple-1 m-0">
                Add New Follow Up for User
              </h1>
            </div>
            <div className="flex flex-col gap-4 mt-4">
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

              <button
                className="text-xl bg-secondary text-white p-2 rounded-xl"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
          <DataTable
            usersData={followUpData}
            columns={columnsNestedTable}
            pagination={false}
            loading={loading}
          />
        </TabPane>
      </Tabs>
    </Drawer>
  );
};
