
import HashLoader from "react-spinners/HashLoader";
import "./loader.css";

function Loader() {
  return (
    <div className="loader-bg overlay">
      <div className="spinner-container">
        < HashLoader color="#E00125" loading={true} size={50} speedMultiplier={1} />
      </div>
    </div>
  );
}

export default Loader;
