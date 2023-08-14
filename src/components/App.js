import "../styles/App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "../hooks";

import Home from "../pages/Home";
import { Loader } from "./Loader";
import { Auth } from "../pages";
import { useEffect } from "react";
function PrivateRoute({ children }) {
  const auth = useAuthContext();
  // Auth contains the user context
  // If no user redirect to login
  if (auth.user) {
    return children;
  } else return <Navigate to="/auth" />;
}

function App() {
  const navigate = useNavigate();
  const auth = useAuthContext();

  useEffect(() => {
    // Checks if token has expired
    if (auth.error === "Authentication Expired") {
      auth.logout();
      navigate("/auth");
      return;
    }
    // Reseting Error Hook on App render
    auth.catchError(null);
  }, []);
  if (auth.loading) {
    return <Loader />;
  }
  return (
    <div className="App">
      <ToastContainer />
      <Routes>
        {/* Main Layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
        </Route>
        {/* Authorization  */}
        <Route exact path="/auth" element={<Auth />} />
      </Routes>
    </div>
  );
}

export default App;
