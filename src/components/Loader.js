import Spinner from "react-bootstrap/Spinner";
//Loader
export const Loader = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
      }}
      className="d-flex justify-content-center align-items-center"
    >
      {" "}
      <Spinner
        animation="border"
        style={{ width: `55px`, height: `55px` }}
        className=""
      />
    </div>
  );
};
