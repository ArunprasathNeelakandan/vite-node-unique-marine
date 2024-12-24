import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getImageByNumber } from "../../Services/api.js";
import ShowImage from "../Show Image/showImage.jsx";
import Loader from "../Loader/loader.jsx"
import "./home.css";

function Home() {
    const [serialNumber, setSerialNumber] = useState("");
  const [filePath, setFilePath] = useState(null);
  const [apiStatus,setApiStatus] = useState('inutial')

  const handleInputChange = (e) => {
    setSerialNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!serialNumber) {
      toast.warn("Please enter a serial number.");
      return;
    }
    setApiStatus('loading')
    const data = await getImageByNumber(serialNumber);
    data.file_path ? (setFilePath(data.file_path),setApiStatus('finish')) : (toast.error(data),setApiStatus('finish'));
  };

  const assignFilePath = (value) => {
    setFilePath(value);
  };

  return (
    <div className="home-bg">
      {apiStatus === 'loading' ? (<Loader/>): null}
      <form onSubmit={handleSubmit} className="search-container">
        <img src="\Uniquemarine-Logo.png" className="logo" />
        <div className="input-container">
          <label htmlFor="serialnumber">CERTIFICATE SERIAL NUMBER</label>
          <input type="text" className="input-item" placeholder="XX/XXXX/XX" onChange={handleInputChange} id='serialnumber' value={serialNumber} />
        </div>
        <button className="view-btn" type="submit">VIEW</button>
      </form>
      {filePath && (
        <ShowImage filePath={filePath} assignFilePath={assignFilePath} />
      )}
      <ToastContainer
        position="top-center"
        style={{
          top: "50%",
          zIndex: 9999,
        }}
        />
    </div>
  );
}

export default Home;
