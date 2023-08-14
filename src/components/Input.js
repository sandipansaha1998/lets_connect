import React from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
const Input = ({
  name,
  label,
  handleChange,
  autoFocus,
  type,
  handleShowPassword,
  value,
}) => (
  <div>
    <TextField
      className="col-12"
      name={name}
      onChange={handleChange}
      variant="standard"
      required
      label={label}
      autoFocus={autoFocus}
      type={type}
      InputProps={
        name === "password"
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword}>
                    {type === "password" ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : undefined
      }
      value={value}
    />
  </div>
);
export default Input;
