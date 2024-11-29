import React from "react";
// import { useEffect } from 'react';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import "./App.css";
import Posts, { loader as postsLoader } from "./routes/Posts";
import NewPost, { action as newPostAction } from "./routes/NewPost";
import PostDetails, { loader as postDetailsLoader } from "./routes/PostDetails";
import { CallbackPage } from "./pages/callback-page";
import { Auth0ProviderWithNavigate } from "./auth0-provider-with-navigate";
import { AuthenticationGuard } from "./components/authentication-guard";
import RootLayout from "./routes/RootLayout";
import H1bLanding from "./components/h1b/H1bLandingPage";
import DashboardV3 from "./components/timesheet/DashboardV3";
import AdminPage from "./components/admin/AdminPage";
import EmployeeSignup, {
  action as employeeSignupAction,
} from "./components/singup/employee_signup";
import HomePage from "./pages/HomePage";
import SuperAdmin from "./components/SuperAdmin";
import { AuthProvider } from "./AuthContext";

// // Function to check if the user is authenticated
// const isAuthenticated = () => {
//   return localStorage.getItem('isAuthenticated') === 'true';
// };

// AuthGuard component to protect routes
// const AuthGuard = ({ children }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//       if (!isAuthenticated()) {
//           navigate('/'); // Redirect to landing page if not authenticated
//       }
//   }, [navigate]);

//   return isAuthenticated() ? children : null;
// };

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Auth0ProviderWithNavigate />}>
      <Route path="/" element={<RootLayout />}>
        <Route
          path="/signup"
          element={<EmployeeSignup />}
          action={employeeSignupAction}
        />
        <Route
          path="/home"
          element={<AuthenticationGuard component={HomePage} />}
        />{" "}
        {/* Protected HomePage route */}
        <Route
          path="/posts"
          element={<AuthenticationGuard component={Posts} />}
          loader={postsLoader}
        >
          <Route
            path="create-post"
            element={<AuthenticationGuard component={NewPost} />}
            action={newPostAction}
          ></Route>
          <Route
            path=":postId"
            element={<PostDetails />}
            loader={postDetailsLoader}
          ></Route>
        </Route>
        <Route
          path="/callback"
          element={<AuthenticationGuard component={CallbackPage} />}
        ></Route>
        <Route
          path="/timesheet"
          element={<AuthenticationGuard component={DashboardV3} />}
        ></Route>
        <Route
          path="/h1bform"
          element={<AuthenticationGuard component={H1bLanding} />}
        ></Route>
        <Route
          path="/admin"
          element={<AuthenticationGuard component={AdminPage} />}
        ></Route>
        <Route
          path="/superadmin"
          element={<AuthenticationGuard component={SuperAdmin} />}
        ></Route>
      </Route>
    </Route>
  )
);

function Main() {
  return (
    <AuthProvider>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </AuthProvider>
  );
}

export default Main;
