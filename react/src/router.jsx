import { Navigate, createBrowserRouter, useLocation } from "react-router-dom";
import Login from "./views/Login.jsx";
import NotFound from "./views/NotFound.jsx";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Signup from "./views/Signup.jsx";
import Home from "./views/Home.jsx";
import Favourite from "./views/Favourite.jsx";
import UserForm from "./views/UserForm.jsx";
import Users from "./views/Users.jsx";
import VerifyEmail from "./views/EmailVerifyView/VerifyEmail.jsx";
import { useStateContext } from "./context/ContextProvider.jsx";
import VerifySuccess from "./views/EmailVerifyView/VerifySuccess.jsx";
import VerifyPending from "./views/EmailVerifyView/VerifyPending.jsx";
import VerifyLayout from "./components/VerifyLayout.jsx";

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
        path: "/verify",
        element: <VerifyEmail />,
      },
      
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
