import React, { useEffect, useState } from "react";
import Navbar from "./CentralPanel/Navbar";
import SendIcon from "@mui/icons-material/Send";
import { useAuthContext } from "../../hooks";
import CircularProgress from "@mui/material/CircularProgress";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { createRoom, getMessages, sendMessage } from "../../api";
import { notify } from "../Notification";
import ChatsPanel from "./CentralPanel/ChatsPanel";
import LinearProgress from "@mui/material/LinearProgress";

const CentralPanel = ({
  rooms,
  setRooms,
  selectedRoom,
  setSelectedRoom,
  isChatLoading,
  setIsChatLoading,
}) => {
  const auth = useAuthContext();

  const [isChatMode, setisChatMode] = useState(true);
  const [textContent, setTextContent] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [chats, setChats] = useState([]);
  useEffect(() => {
    let getChats = async (conversation_id) => {
      let response = await getMessages(selectedRoom?._id);
      setIsChatLoading(false);

      if (response.success) {
        setChats(response.data);
      } else {
        notify().error("Failed to fetch chat");
      }
    };
    if (selectedRoom) {
      setIsChatLoading(true);
      getChats();
    } else {
      setChats([]);
    }
  }, [selectedRoom]);

  const handleTextInputChange = (e) => {
    if (e.target.value[0] === "/") setisChatMode(false);
    else setisChatMode(true);
    setTextContent(e.target.value);
  };

  const handleSubmitAction = async (e) => {
    let code = e.keyCode ? e.keyCode : e.which;
    console.log(e);
    if (code === 13 || e.type === "click") {
      if (!isChatMode) {
        // Handles Command:
        //Create room
        if (textContent.trim().match(/^\/create (\w+)$/)) {
          let user_id = auth.user.id;
          let roomName = textContent.split(" ")[1];
          setIsChatLoading(true);
          let response = await createRoom({
            user_id,
            isRoom: true,
            room_name: roomName,
          });
          if (response.success) {
            setRooms((room) => {
              return [...room, response.data.newRoom];
            });
          } else notify().error("Room could not be created");
          setIsChatLoading(false);
          setTextContent("/");
          return;
        } else if (textContent.trim().match(/^\/join (\w+)$/)) {
          // Join  a room
          let roomName = textContent.split(" ")[1];
          let getRoom = rooms.filter((room) => {
            if (room.name === roomName) return true;
            return false;
          });
          if (getRoom.length === 0)
            return notify().error(`${roomName} does not exsist`);
          else {
            setSelectedRoom(getRoom[0]);
            setIsChatLoading(true);
          }
          setTextContent("/");
          // Leave a room
        } else if (textContent.trim() === "/leave") {
          setSelectedRoom(null);
          setTextContent("/");
        } else if (textContent.trim() === "/help") {
          setShowHelp(true);
        } else if (textContent.trim() === "/hide-help") {
          setShowHelp(false);
        } else {
          notify().error("Invalid Command");
        }
      } else {
        //  Sends message to room
        if (textContent === "") return;
        setIsChatLoading(true);
        sendMessage({
          content: textContent,
          conversation_id: selectedRoom._id,
          isRoom: true,
        }).then((response) => {
          if (!response.success) notify().error("Failed to send");
        });
        setTextContent("");
        setIsChatLoading(false);
      }
    }
  };

  return (
    <div
      className="border-end  border-2 col-8 d-flex flex-column p-2  "
      style={{
        height: "90vh",
        marginTop: "10vh",
      }}
    >
      <Navbar />
      <h4 className="fw-bold text-start">
        {!selectedRoom
          ? "No room selected Select a room"
          : `Room : ${selectedRoom.name.toUpperCase()}`}
      </h4>
      {isChatLoading && (
        <div className="col-10 mx-auto">
          <h3>Loading Chats...</h3>
          <LinearProgress />
        </div>
      )}

      {!isChatLoading && <ChatsPanel chats={chats} />}

      <div
        className=" fixed-bottom  mt-auto d-flex flex-column col-8 mx-auto p-1"
        style={{ height: "10vh" }}
      >
        <div className="d-flex mt-auto">
          <input
            type="text"
            className={`col-11 ${!isChatMode && "bg-dark text-light"} `}
            style={(isChatLoading && { opacity: 0.5 }, { marginRight: "4px" })}
            placeholder="Enter your message here"
            onKeyDown={handleSubmitAction}
            onChange={handleTextInputChange}
            disabled={isChatLoading ? true : false}
            value={textContent}
          />

          <button
            onClick={handleSubmitAction}
            className={`col-1 btn ${
              isChatMode ? "btn-primary" : "btn-dark"
            } p-1`}
            disabled={isChatLoading ? true : false}
          >
            {isChatMode &&
              (isChatLoading ? (
                <CircularProgress fontSize="small" className="text-light" />
              ) : (
                <SendIcon />
              ))}
            {!isChatMode &&
              (isChatLoading ? (
                <CircularProgress fontSize="small" className="text-light" />
              ) : (
                <KeyboardReturnIcon />
              ))}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CentralPanel;
