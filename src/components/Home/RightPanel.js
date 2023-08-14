import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
const RightPanel = ({ user }) => {
  return (
    <div className=" col-2 p-2" style={{ height: "100vh" }}>
      <div className="bg-dark text-light p-2 d-flex flex-column  justify-content-center ">
        <div>
          <Badge
            color="success"
            variant="dot"
            overlap="circular"
            badgeContent=" "
          >
            <AccountCircleIcon size="large" />
          </Badge>
        </div>

        <span>{user.name}</span>
        <span> {user.phone}</span>
      </div>
    </div>
  );
};

export default RightPanel;
