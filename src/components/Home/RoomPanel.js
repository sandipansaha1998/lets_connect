import React from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import styled from "@emotion/styled";

const Container = styled.div`
  :hover {
    background-color: black;
    color: white;
  }
`;
// Displays room list
const RoomPanel = ({ rooms, setSelectedRoom, selectedRoom }) => {
  return (
    <div
      className="d-flex flex-column col-2 border border-right p-2"
      style={{ height: "100vh" }}
    >
      <div className="fw-bold fs-3 mx-auto">
        <GroupsIcon className="fs-1 " /> Rooms
      </div>
      <div className="mt-3 ">
        {rooms.map((room) => {
          return (
            <Container
              className={`cursor-pointer border my-2 ${
                room._id === selectedRoom?._id && "bg-dark text-light"
              }`}
              onClick={() => {
                setSelectedRoom(room);
              }}
            >
              {room.name}
            </Container>
          );
        })}
      </div>
      <Container className="fs-5 mt-auto">Logout</Container>
    </div>
  );
};

export default RoomPanel;
