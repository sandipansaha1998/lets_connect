import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";

// Displays list of users
const RightPanel = ({ user, users }) => {
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
        <h3 className="bg-light text-dark mt-3">Users</h3>
        <div className="d-flex flex-column gap-2">
          {users.map((u) => {
            return (
              <div className="d-flex border p-2">
                <Avatar>{u.name[0]}</Avatar>
                <div className="d-flex flex-column  container text-end">
                  <span className="">{u.name}</span>
                  <span className="">{u.phone}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
