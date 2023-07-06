import { Navigate, createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import VerifyLayout from "./components/VerifyLayout.jsx";
import VerifyPending from "./views/EmailVerifyView/VerifyPending.jsx";
import VerifySuccess from "./views/EmailVerifyView/VerifySuccess.jsx";
import Favourite from "./views/Favourite.jsx";
import Home from "./views/Home.jsx";
import Login from "./views/Login.jsx";
import Signup from "./views/Signup.jsx";
import UserForm from "./views/UserForm.jsx";
import Users from "./views/Users.jsx";
import ForgetPassword from "./views/ForgetPassword.jsx";
import RecoverPassword from "./views/RecoverPassword.jsx";

// Website routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
          path: '/',
          element: <Navigate to="/home" />
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/favourite",
        element: <Favourite />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/users/new",
        element: <UserForm key="userCreate" />,
      },
      {
        path: "/users/:id",
        element: <UserForm key="userUpdate" />,
      },
    ],
  },
  {
    path: "/",
    element: <VerifyLayout/>,
    children: [
      {
        path: "/verify-pending",
        element: <VerifyPending />,
      },
      {
        path: "/verify-success",
        element: <VerifySuccess />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "/change-password",
        element: <RecoverPassword />,
      },
      {
        path: "*",
        element: <Login />,
      },
      
    ],
  },
]);

export default router;
