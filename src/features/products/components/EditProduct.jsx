import React from "react";
import { Select } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "../../../appConfig/httpHelper";
import { toast } from "react-toastify";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

export function EditProduct(props) {
  const user = useSelector((state) => state.user);
  const uom = useSelector((state) => state.statics.uom);
  const packagingType = useSelector((state) => state.statics.packagingType);

  //Create Products Error With Points providing String in place of number
  const formik = useFormik({
    initialValues: {
      points: props.data.points,
    },
    validationSchema: Yup.object({
      points: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      handleEditProduct(values);
    },
  });

  const handleEditProduct = (values) => {
    const token = JSON.parse(localStorage.getItem("jwt"));
    axios
      .put(`/product/update-points/${props.data.id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success(res.data.message);
        props.back();
      })
      .catch((err) => {});
  };

  return (
    <div className="m-2">
      <button
        className="text-purple-1 p-2 text-base"
        onClick={() => {
          props.back();
        }}
      >
        <ArrowLeftOutlined style={{ fontSize: 22 }} />
      </button>
      <h1 className="text-purple-1 text-center text-3xl font-bold">
        Edit Product
      </h1>
      <div className="shadow-lg rounded-3xl">
        <div className="bg-white p-3 rounded-3xl">
          <form className="" onSubmit={formik.handleSubmit}>
            <div className="flex my-5">
              <h1 className="text-xl text-purple-1">
                Industry Type :
                <span className="text-xl text-purple-1 font-bold">
                  {" "}
                  {props.data.industryType}
                </span>
              </h1>
            </div>
            <div className="flex items-center justify-between">
              <div className="my-5 flex flex-col w-5/12">
                <h1 className="p-3 text-xl text-purple-1 rounded-xl border-2 border-purple-1 border-opacity-50 focus:outline-purple-11">
                  {props.data.title}
                </h1>
              </div>
              <div className="my-5 flex flex-col w-5/12">
                <h1 className="p-3 text-xl text-purple-1 rounded-xl border-2 border-purple-1 border-opacity-50 focus:outline-purple-11">
                  {props.data.description}
                </h1>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="my-5 flex flex-col w-5/12">
                <h1 className="p-3 text-xl text-purple-1 rounded-xl border-2 border-purple-1 border-opacity-50 focus:outline-purple-11">
                  {props.data.packagingType.map((data) => (
                    <span className="px-2">{data}</span>
                  ))}
                </h1>
              </div>
              <div className="my-5 flex flex-col w-5/12">
                <h1 className="p-3 text-xl text-purple-1 rounded-xl border-2 border-purple-1 border-opacity-50 focus:outline-purple-11">
                  {props.data.uom}
                </h1>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="my-5 flex flex-col w-5/12">
                <input
                  type="number"
                  min='0'
                  placeholder={`Units Required / ${formik.values.uom}`}
                  className="p-3 text-xl text-purple-1 rounded-xl border-2 border-purple-1 border-opacity-50 focus:outline-purple-11"
                  {...formik.getFieldProps("points")}
                />
                {formik.touched.points && formik.errors.points ? (
                  <div>{formik.errors.points}</div>
                ) : null}
              </div>
              <div className="my-5 flex flex-col w-5/12">
                <h1 className="p-3 text-xl text-purple-1 rounded-xl border-2 border-purple-1 border-opacity-50 focus:outline-purple-11">
                  {props.data.photo}
                </h1>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 my-5 bg-purple-1 border-2 border-purple-1 focus:outline-none rounded-2xl text-xl text-left text-white font-bold group duration-500 flex justify-evenly items-center hover:shadow-lg shadow-purple-1"
            >
              Edit Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
