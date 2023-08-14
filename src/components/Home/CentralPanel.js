import React, { useEffect, useState } from "react";
import Navbar from "./CentralPanel/Navbar";
import SendIcon from "@mui/icons-material/Send";
import { useAuthContext } from "../../hooks";
import CircularProgress from "@mui/material/CircularProgress";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  createRoom,
  getMessages,
  getPrivateChats,
  sendMessage,
} from "../../api";
import { notify } from "../Notification";
import ChatsPanel from "./CentralPanel/ChatsPanel";
import LinearProgress from "@mui/material/LinearProgress";
import { socketManager, socket, connectionManager } from "../../socket";

const CentralPanel = ({
  rooms,
  setRooms,
  selectedRoom,
  setSelectedRoom,
  isChatLoading,
  setIsChatLoading,
  privateTextReciever,
  setPrivateTextReciever,
}) => {
  const auth = useAuthContext();

  const [isChatMode, setisChatMode] = useState(true);
  const [textContent, setTextContent] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(true);
  const [chats, setChats] = useState(null);

  useEffect(() => {
    // Initializes socket connection and adds listner for real time chat updates
    let connectSocket = () => {
      connectionManager(socket).connect();
      console.log("Connection Attempted");
      socketManager.addListener(
        "broadcast_message",
        ({ conversation_id, message }) => {
          if (selectedRoom && conversation_id === selectedRoom._id) {
            setChats([...chats, message]);
          }
        }
      );
    };
    if (chats) connectSocket();
  }, [chats, selectedRoom]);
  useEffect(() => {
    // Retrieving chats for the selected conversation
    let getChats = async (conversation_id) => {
      setIsChatLoading(true);
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
    return () => {
      socketManager.removeListener("broadcast_message");
    };
  }, [selectedRoom]);

  // Handles text input change
  const handleTextInputChange = (e) => {
    if (e.target.value[0] === "/") setisChatMode(false);
    else setisChatMode(true);
    setTextContent(e.target.value);
  };

  // handles button submision
  const handleSubmitAction = async (e) => {
    let code = e.keyCode ? e.keyCode : e.which;
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
          }
          setTextContent("/");
        } else if (textContent.trim().match(/^\/private (\w+)$/)) {
          // To be implemented
          // Private message
          // let receiver_number = textContent.split(" ")[1];
          // let privateChats = await getPrivateChats({ receiver_number });
        } else if (textContent.trim() === "/leave") {
          // Leave a room
          setSelectedRoom(null);
          setTextContent("/");
        } else if (textContent.trim() === "/help") {
          setShowHelp(true);
        } else {
          notify().error("Invalid Command");
        }
      } else {
        //  Sends message to room
        if (textContent === "") return;
        // setIsChatLoading(true);
        setIsMessageSent(false);
        let newMessage = await sendMessage({
          content: textContent,
          conversation_id: selectedRoom._id,
          isRoom: true,
        }).then((response) => {
          if (!response.success) notify().error("Failed to send");
          else {
            return response.data;
          }
        });
        console.log(newMessage);
        setIsMessageSent(true);
        setChats([...chats, newMessage.message]);
        // console.log(newMessage);
        // console.log(socket);
        socket.emit("message", newMessage);
        setTextContent("");
        // setIsChatLoading(false);
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
            placeholder="Enter your message here or press / to enter terminal mode"
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
              (!isMessageSent ? (
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
      <Modal
        show={showHelp}
        onHide={() => {
          setShowHelp(false);
        }}
      >
        {/* Help Modal */}
        <Modal.Header closeButton>
          <Modal.Title>Manual</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column gap-3">
          <div>
            <span className="bg-dark text-light p-1">/create _room_name_</span>
            <span> create room</span>
          </div>
          <div>
            <span className="bg-dark text-light p-1">/leave</span>
            <span> leave room</span>
          </div>
          <div>
            <span className="bg-dark text-light p-1">/help</span>
            <span> displays manual</span>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default CentralPanel;
