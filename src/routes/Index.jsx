import React, { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Importing Components
import Login from "../features/auth/logIn/Index";
import { Dashboard } from "../features/dashboard/Index";
import Users from "../features/EndUsers";
import DashboardStats from "../features/DashboardStats";
import Updates from "../features/Updates";
import Blogs from "../features/Blogs";
import Colleges from "../features/Colleges";

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

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Handling the Admin User Routes */}
      {user.role === 3 && token && auth ? (
        <>
          <Route path="/admin" element={<Dashboard />}>
            <Route path="dashboard" element={<DashboardStats />} />
            <Route path="users" element={<Users />} />
            <Route path="college" element={<Colleges />} />
            <Route path="updates" element={<Updates />} />
            <Route path="blogs" element={<Blogs />} />
            {/*<Route path="approvals" element={<Approvals />} />
            <Route path="pointsmanager" element={<PointsManager />} />
            <Route
              path="actualconsumptionmanager"
              element={<ActualConsumptionManager />}
            />
            <Route path="staticsmanager" element={<StaticsManager />} />
            <Route path="productmaster" element={<ProductMaster />} />
            {/* <Route path="defaultedpoint" element={<DefaultedPoints/>}/> */}
            {/* <Route path="assetmaster" element={<Assets />} /> */} */}
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
