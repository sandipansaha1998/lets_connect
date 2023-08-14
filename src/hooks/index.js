import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import {
  setItemLocalStorage,
  LOCALSTORAGE_TOKEN_KEY,
  getItemFromLocalStorage,
  removeItemFromLocalStorage,
} from "../utils";
import { login as userLogin } from "../api";
import jwt_decode from "jwt-decode";

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Checks Local Storage for JWT to authenticate requests
    const userToken = getItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
    if (userToken) {
      const userDecoded = jwt_decode(userToken);
      // Checking validity of JSON web token
      if (userDecoded.exp > Date.now()) setUser(userDecoded);
      else setError("Authentication Expired");
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    let response = await userLogin(email, password);
    if (!response)
      return {
        success: false,
        message: "Server is down",
      };
    try {
      if (response.success) {
        // Decodes the user
        const userDecoded = jwt_decode(response.data.token);
        console.log(userDecoded);
        // Sets the user
        setUser(userDecoded);
        // Sets the JWT in the local storage for further usage
        setItemLocalStorage(
          LOCALSTORAGE_TOKEN_KEY,
          response.data.token ? response.data.token : null
        );
        setError(null);
        console.log("Returning From hook");
      } else {
        return {
          success: false,
          message: response.message,
        };
      }
    } catch (e) {}
  };

  const logout = async () => {
    // Resets User to null and removes the JWT from localstorage
    setUser(null);
    removeItemFromLocalStorage(LOCALSTORAGE_TOKEN_KEY);
    setError(null);
  };

  const catchError = async (error) => {
    // Catches Internal server Error and JWT expiration Error
    setError(error);
    return;
  };

  return {
    user,
    login,
    logout,
    loading,
    setLoading,
    error,
    catchError,
  };
};

export const useLoading = (initialState) => {
  return useState(initialState);
};
