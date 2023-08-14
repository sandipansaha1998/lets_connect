import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

import { useAuthContext, useProvideAuth } from "../hooks";
import CentralPanel from "../components/Home/CentralPanel";
import RoomPanel from "../components/Home/RoomPanel";
import RightPanel from "../components/Home/RightPanel";
import { getAllRooms } from "../api";
import { notify } from "../components/Notification";

const Home = () => {
  const auth = useAuthContext();
  const { loading, setLoading } = useProvideAuth();
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [privateTextReciever, setPrivateTextReciever] = useState(null);

  useEffect(() => {
    setLoading(true);
    let fetchAllRooms = async () => {
      let response = await getAllRooms();
      if (response.success) {
        setRooms(response.data.rooms);
      } else {
        notify().error("Rooms could not be fetched");
      }
      setLoading(false);
    };
    fetchAllRooms();
  }, []);

  return (
    <>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center "
          style={{ height: "100vh" }}
        >
          {" "}
          <CircularProgress />
        </div>
      ) : (
        <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
          <RoomPanel
            rooms={rooms}
            setSelectedRoom={setSelectedRoom}
            isChatLoading={isChatLoading}
            setIsChatLoading={setIsChatLoading}
            selectedRoom={selectedRoom}
          />
          {/* Midpanel */}
          <CentralPanel
            rooms={rooms}
            setRooms={setRooms}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
            isChatLoading={isChatLoading}
            setIsChatLoading={setIsChatLoading}
          />
          {/* RightPanel */}
          <RightPanel user={auth.user} />
        </div>
      )}
    </>
  );
};

export default Home;
