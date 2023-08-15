import { useFormik } from "formik";
import React, { useReducer } from "react";
import * as Yup from "yup";
import axios from "../appConfig/httpHelper";
import { toast } from "react-toastify";

const PushNotifications = () => {
  const [actions, setActions] = useReducer(
    (state, diff) => ({ ...state, ...diff }),
    {
      drawer: false,
      loading: false,
      pagination: 15,
      trash: false,
      loadingAllBlogs: false,
      downloadAllBlogs: false,
    }
  );

  const {
    drawer,
    loading,
    pagination,
    trash,
    loadingAllBlogs,
    downloadAllBlogs,
  } = actions;

  const handleNewNotification = (value, actions) => {
    setActions({ loading: true });
    axios
      .post("/notification/expo-notifcation", value)
      .then((res) => {
        toast.success(
          "New Notification Sent Successfully. It will take 1 to 30 min to show on deivces depending on the server Load."
        );
        actions.resetForm();
      })
      .catch((err) => console.log(err))
      .finally(() => setActions({ loading: false }));
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Required")
        .max(40, "Title Should not be more than 40 characters."),
      description: Yup.string()
        .required("Required")
        .max(200, "Title Should not be more than 200 characters."),
    }),
    onSubmit: (values, actions) => {
      handleNewNotification(values, actions);
    },
  });

  return (
    <div className="max-w-screen-lg mx-auto">
      <form
        onSubmit={formik.handleSubmit}
        className="my-6 max-w-screen-lg mx-auto"
      >
        <div className="flex flex-col gap-4 mt-4">
          <div className="">
            <input
              type="text"
              placeholder="Title of the Notification"
              className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full"
              {...formik.getFieldProps("title")}
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="text-red-500">{formik.errors.title}</div>
            ) : null}
          </div>
          <div className="">
            <textarea
              placeholder="Description of the Notification"
              className="border-2 border-purple-1 px-2 py-3 bg-purple-1 bg-opacity-5 rounded-lg w-full h-40"
              {...formik.getFieldProps("description")}
            />
            {formik.touched.description && formik.errors.description ? (
              <div className="text-red-500">{formik.errors.description}</div>
            ) : null}
          </div>
          <button
            className="text-xl bg-secondary text-white p-3 rounded-xl"
            type="submit"
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </form>
      <h1 className="text-center text-xl font-semibold">
        Warning : It's suggested to send 2 to 4 push Notifications daily as more
        can mark this as a spam and can be annoying to the users leading them
        to uninstall the app.
      </h1>
    </div>
  );
};

export default PushNotifications;
