import React, { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Importing Components
import Login from "../features/Login";
import { Dashboard } from "../features/dashboard/Index";
import Users from "../features/Users";
import DashboardStats from "../features/DashboardStats";
import Updates from "../features/Updates";
import Blogs from "../features/Blogs";
import Colleges from "../features/Colleges";
import Subscriber from "../features/Subscriber";
import PredictorData from "../features/PredictorData";
import PushNotifications from "../features/PushNotifications";
import Referral from "../features/Referral";

// import { Users } from "../users/Index";
// import { Approvals } from "../approvals/Index";
// import { PointsManager } from "../pointsManager/Index";
// import { Assets } from "../assetMaster/Index";

const Index = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const auth = useSelector((state) => state.user.auth);
  const token = JSON.parse(localStorage.getItem("jwt"));

  const navigate = useNavigate();
  const handleUnAuth = () => navigate("/login");

  const routesData = [
    {
      route: "dashboard",
      component: <DashboardStats />,
      isAdmin: true,
      isCounselor: false,
      isCollegeAdmin: false,
    },
    {
      route: "users",
      component: <Users />,
      isAdmin: true,
      isCounselor: true,
      isCollegeAdmin: false,
    },
    {
      route: "college",
      component: <Colleges />,
      isAdmin: true,
      isCounselor: true,
      isCollegeAdmin: true,
    },
    {
      route: "updates",
      component: <Updates />,
      isAdmin: true,
      isCounselor: false,
      isCollegeAdmin: false,
    },
    {
      route: "blogs",
      component: <Blogs />,
      isAdmin: true,
      isCounselor: false,
      isCollegeAdmin: false,
    },
    {
      route: "predictor-data",
      component: <PredictorData />,
      isAdmin: true,
      isCounselor: false,
      isCollegeAdmin: false,
    },
    {
      route: "subscribers",
      component: <Subscriber />,
      isAdmin: true,
      isCounselor: false,
      isCollegeAdmin: false,
    },
    {
      route: "push-notifications",
      component: <PushNotifications />,
      isAdmin: true,
      isCounselor: false,
      isCollegeAdmin: false,
    },
    {
      route: "referral-link",
      component: <Referral />,
      isAdmin: true,
      isCounselor: false,
      isCollegeAdmin: false,
    },
  ];

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Handling the Admin User Routes */}
      {user.role !== 1 && token && auth ? (
        <>
          <Route path="/admin" element={<Dashboard />}>
            {routesData.map((val) => {
              {
                if (
                  (user.role === 2 && val?.isCounselor) ||
                  (user.role === 3 && val?.isAdmin) ||
                  (user.role === 4 && val?.isCollegeAdmin)
                ) {
                  return <Route path={val.route} element={val.component} />;
                }
              }
            })}
          </Route>
        </>
      ) : (
        () => handleUnAuth()
      )}
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default Index;
