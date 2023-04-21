import React, { useEffect, useState } from "react";
import Logo from "../../../assets/images/logo_white.png";
import bgImage from "../../../assets/images/auth_bg_mobile.png";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../store/actions/user";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Spin } from "antd";

const Login = () => {
  const user = useSelector((state) => state.user);
  const auth = useSelector((state) => state.user.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token && auth && user.role === 2) {
      navigate("/admin/users");
    }
    if (token && auth && user.role === 3) {
      navigate("/admin/dashboard");
    }
    if (token && auth && user.role === 4) {
      navigate("/admin/college");
    }
  }, [user]);

  const handleLogin = (loginValue) => {
    dispatch(login(loginValue));
  };

  // Login Form Handling
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().min(8, "Too short").required("Required"),
    }),
    onSubmit: (values) => {
      setLoader(true);
      handleLogin(values);
      setTimeout(() => setLoader(false), 3000);
    },
  });

  return (
    <div
      className="bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <img src={Logo} className="w-60 mx-auto fixed top-2 left-2" alt="" />
      <div className="min-h-screen bg-gradient-to-tl from-primary to-transparent flex items-center justify-end">
        <div className="w-11/12 sm:w-9/12 md:w-2/3 lg:w-1/3 bg-white rounded-3xl shadow-xl px-6 py-8 mx-auto">
          <Spin spinning={loader}>
            <h1 className="text-3xl font-bold text-secondary pt-3 text-left">
              Welcome Back
            </h1>
            <h1 className="text-base font-normal text-secondary text-left">
              Please Enter your Email and Password
            </h1>
            <form className="" onSubmit={formik.handleSubmit}>
              <div className="my-5 flex flex-col">
                <input
                  placeholder="Email"
                  type="email"
                  className="p-3 text-xl text-secondary rounded-xl border-2 border-secondary border-opacity-50 focus:outline-secondary"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500"> {formik.errors.email}</div>
                ) : null}
              </div>
              <div className="my-5 flex flex-col">
                <input
                  placeholder="Password"
                  type="password"
                  className="p-3 text-xl text-secondary rounded-xl border-2 border-secondary border-opacity-50 focus:outline-secondary"
                  {...formik.getFieldProps("password")}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500">{formik.errors.password}</div>
                ) : null}
              </div>
              <div className="flex pb-5 items-center justify-between">
                <button
                  type="submit"
                  className="w-48 py-3 px-6 bg-secondary border-2 border-secondary focus:outline-none rounded-2xl text-xl text-left text-white font-bold group duration-500 flex justify-evenly items-center"
                >
                  LogIn
                  <ArrowRightOutlined className="group-hover:translate-x-1.5 duration-500" />
                </button>
                {/* <Link
                  to="/"
                  className="underline hover:text-secondary text-lg font-bold"
                >
                  Forgot Password ?
                </Link> */}
              </div>
            </form>
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default Login;
