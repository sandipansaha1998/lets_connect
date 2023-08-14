import { Avatar, Button, Paper, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import React, { useEffect, useState } from "react";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

import { notify } from "../components/Notification";
import { signup } from "../api";
import { useAuthContext } from "../hooks";

const Auth = () => {
  const navigate = useNavigate();
  // Context hook for user functionalities
  const auth = useAuthContext();

  // Initial form data
  const initialState = {
    phone: "",
    name: "",
    password: "",
    confirmPassword: "",
  };
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.user) {
      console.log(auth);
      navigate("/");
      return;
    }
  }, []);
  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const switchMode = () => {
    setFormData(initialState);
    setIsSignUp(!isSignUp);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isSignUp) {
      // User Registration

      // Checks Phone Number Format
      if (
        formData.phone.length !== 10 ||
        !/^\+?[0-9]+(?:[-\s][0-9]+)*$/.test(formData.phone)
      ) {
        notify().error("Invalid Phone number");
        setLoading(false);
        return;
      }
      // Checks Password validity
      if (formData.password.length < 6) {
        notify().error("Password minimum 6 characters");
        setLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        notify().error("Passwords donot match");
        setLoading(false);
        return;
      }

      let response = await signup(formData);
      if (response.success) {
        notify().success("Successful Sign up");
        switchMode();
      } else {
        console.log(response.message);
        notify().error(response.message);
      }
      setLoading(false);
    } else {
      // User Login
      console.log("Auth.js");
      const response = await auth.login(formData);
      console.log(response);
      if (!response) {
        notify().success("Welcome");
        navigate("/");
      } else {
        notify().error(response.message);
      }
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="col-10 col-md-7 col-lg-5 mx-auto">
      <Paper className="text-center p-4">
        <Avatar className="mx-auto mb-2">
          <LockIcon />
        </Avatar>
        <Typography variant="h5">{isSignUp ? "Sign up" : "Login"}</Typography>
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-column gap-2 p-1">
            {/* Phone Number */}
            <Input
              name="phone"
              label="Phone Number"
              handleChange={handleChange}
              autoFocus
              type="text"
              required
              value={formData.phone}
            />
            {/* Name : for registration */}
            {isSignUp && (
              <>
                <Input
                  name="name"
                  label="Name"
                  handleChange={handleChange}
                  value={formData.name}
                />
              </>
            )}
            {/* Password */}
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              handleShowPassword={handleShowPassword}
              type={showPassword ? "text" : "password"}
              value={formData.password}
            />
            {/* Confirm Password : for registration */}
            {isSignUp && (
              <Input
                name="confirmPassword"
                label="Confirm Password"
                handleChange={handleChange}
                type="text"
              />
            )}
            <input
              type="submit"
              className="btn btn-primary col-4 mt-4 mx-auto"
              variant="contained"
              value={
                isSignUp
                  ? loading
                    ? "Signing..."
                    : "Sign up"
                  : loading
                  ? "Logging..."
                  : "Login"
              }
              disabled={loading ? true : false}
            />
          </div>
        </form>
        <Button className="text-end mt-2 " onClick={switchMode}>
          <u className=" ">
            {isSignUp
              ? "Already have an Account? Login"
              : "Don't have an account ? Sign up "}
          </u>
        </Button>
      </Paper>
    </div>
  );
};

export default Auth;
