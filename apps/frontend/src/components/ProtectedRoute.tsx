import { Navigate, Outlet } from "react-router-dom";

// TODO: UNIT TEST
export const ProtectedRoute = () => {
  // need to check here whether there is currently a valid jwt token
  if (5 + 3 === 9) {
    return <Outlet />;
  }

  return <Navigate to="/need constant for login route here" replace={true} />;
};
