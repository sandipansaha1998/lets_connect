import React, { useRef, useEffect } from "react";
import { useAuthContext } from "../../../hooks";
import moment from "moment";
import Avatar from "@mui/material/Avatar";

const ChatsPanel = ({ chats }) => {
  const auth = useAuthContext();
  const messageRef = useRef();
  useEffect(() => {
    if (messageRef.current) {
      console.log(messageRef.current.offsetHeight);
      messageRef.current.scroll({
        top: messageRef.current.offsetHeight,
      });
    }
  }, [chats]);
  return (
    <div
      className=" d-flex flex-column col-12 gap-1 pb-5  "
      style={{
        height: "80vh",
        overflowX: "hidden !important",
        overflowY: "scroll",
      }}
      ref={messageRef}
    >
      {chats.map((chat) => {
        let isSenderCurrentUser = chat.sender._id === auth.user.id;
        return (
          <div className="d-flex  gap-1 my-1 ">
            {!isSenderCurrentUser && <Avatar>{chat.sender.name[0]}</Avatar>}
            <div
              style={{ borderRadius: "5px", background: "lightgray" }}
              className={`d-flex me-2 p-2 ${
                isSenderCurrentUser
                  ? "ms-auto bg-success text-light "
                  : "align-self-start"
              }`}
            >
              <div
                className={`d-flex flex-column ${
                  isSenderCurrentUser
                    ? "align-items-end text-light"
                    : "align-items-start text-dark"
                }`}
              >
                {!isSenderCurrentUser && (
                  <span
                    style={{ fontFamily: "sans-serif", fontSize: "0.8rem" }}
                  >
                    {chat.sender.name}
                  </span>
                )}
                {!isSenderCurrentUser && (
                  <span className="col-10 my-1 border border-dark"></span>
                )}
                <span className="text-start ">{chat.content}</span>
                <span style={{ fontSize: "0.8rem" }}>
                  {moment(chat.createdAt).format("h:mm a")}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatsPanel;
