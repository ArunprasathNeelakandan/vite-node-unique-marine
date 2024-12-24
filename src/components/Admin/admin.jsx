import {useState,useEffect,useRef} from 'react'
import { getImages, deleteFile,uploadFile, getImageByNumber } from "../../Services/api";
import Cookies from 'js-cookie';
import Loader from '../Loader/loader'
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ShowImage from '../Show Image/showImage'
import { ToastContainer, toast } from "react-toastify";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useNavigate } from "react-router-dom";
import "./admin.css";

function Admin() {
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchSerialNumber, setSearchSerialNumber] = useState("");
  const [triggerFetchData, setTriggerFetchData] = useState(false);
  const [apiStatus,setApiStatus] = useState('initual')

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const itemsPerPage = 10;

  const fetchImages = async () => {
    setApiStatus('loading')
    const data = await getImages(currentPage, itemsPerPage);
    data.images ? (setImages(data.images),setApiStatus('finish')) : (toast.error(data),setApiStatus('finish'));
  };

  const logout = () => {
    Cookies.remove(process.env.JWT_COOKIE_NMAE);
    navigate("/login", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !serialNumber)
      return toast.warn("Please provide both an ID and a file.");
    setApiStatus('loading')
    const formData = new FormData();
    formData.append("file", file);
    formData.append("serialNumber", serialNumber);

    const response = await uploadFile(formData);
    if (response.success) {
      toast.success("File uploaded successfully!");
      fileInputRef.current.value = "";
      setTriggerFetchData(!triggerFetchData);
      setSerialNumber("");
      setFile(null);
      setApiStatus('finish')
    } else {
      setApiStatus('finish')
      toast.error(response.message);
    }
    
  };

  const assignFilePath = (value) => {
    setFilePath(value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!searchSerialNumber) {
      toast.warn("Please enter a serial number.");
      return;
    }
    setApiStatus('loading')
    const data = await getImageByNumber(searchSerialNumber);
    data.file_path ? (setFilePath(data.file_path),setApiStatus('finish')) : (setApiStatus('finish'),toast.error(data));
  };

  const handleConfirm = (serialNumber) => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div
          style={{
            background: '#282c34',
            padding: '20px',
            borderRadius: '10px',
            color: '#fff',
            textAlign: 'center',
            height: 'auto'
          }}
        >
          <h1 style={{ fontSize: '24px' }}>Are you sure?</h1>
          <p style={{ margin: '20px 0' }}>You want to delete this file?</p>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <button
              style={{
                background: 'green',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
              }}
              onClick={() => {
                handleDelete(serialNumber);
                onClose();
              }}
            >
              Yes
            </button>
            <button
              style={{
                background: 'red',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
              }}
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      ),
      overlayClassName: 'overlay'
    });

  };

  const handleDelete = async (serialNumber) => {
    const data = await deleteFile(serialNumber);
    data.success
      ? (toast.success(data.message), fetchImages())
      : toast.error(data);
  };

  useEffect(() => {
    fetchImages();
  }, [triggerFetchData, currentPage]);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const nextPage = () => {
    if (images.length === itemsPerPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const isNextDisabled = images.length < itemsPerPage;
  const isPrevDisabled = currentPage === 1;

  const renderLogoContainer = () => {
    return (
      <>
        <div className="search-logo-container">
          <img src="/Uniquemarine-Logo.png" className="admin-logo" />
          <form onSubmit={handleSearchSubmit} className="search-wrapper">
            <input
              type="text"
              className="admin-search-input"
              placeholder="Serial number..."
              value={searchSerialNumber}
              onChange={(e)=>{setSearchSerialNumber(e.target.value)}}
            />
            <button className="admin-search-btn" type='submit'>🔍</button>
          </form>
          <button className="logout-btn" onClick={logout}>LOG OUT</button>
        </div>
      </>
    );
  };

  const renderAddFormContainer = () => {
    return(
        <form onSubmit={handleSubmit} className="add-form-container">  
          <label>CERTIFICATE NUMBER</label>
          <input type="text" className="admin-add-input" 
          placeholder="XX/XXXX/XXXX..." onChange={(e) => setSerialNumber(e.target.value)}
          value={serialNumber}
          />
          <input type="file" className="file-input" onChange={(e) => setFile(e.target.files[0])}
                ref={fileInputRef}/>
          <button className="admin-add-btn" type='submit'>ADD</button>
        </form>
    )
  }

  const renderTable = () => {
    return(
      <div className="table-wrapper">
        <table className='table-container'>
        <thead>
            <tr>
              <th>Serial Number</th>
              <th>Date</th>
              <th>View</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className='table-body'>
          {images.map((each, index) => (
              <tr key={index}>
                <td>{each.serial_number}</td>
                <td>{each.serial_number_add_time.split("T")[0]}</td>
                <td><button className="admin-view-btn" onClick={() => { setFilePath(each.file_path) }}>View</button></td>
                <td><button onClick={() => {
                  handleConfirm(each.serial_number);
                }} className="delete-btn">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
    )
  }

  const renderNavigation = () => {
    return(
      <div className="navigate-btn-container">
          <button className="arrow-btn" id="left" onClick={prevPage} disabled={isPrevDisabled}>
            <FaArrowLeft/>
          </button>
          <h1>{currentPage}</h1>
          <button className="arrow-btn" id="right" onClick={nextPage} disabled={isNextDisabled}>
            <FaArrowRight/>
          </button>
        </div>
    )
  }

  

  return (
    <>
      <div className="admin-bg">
        {apiStatus === 'loading' ? (<Loader/>): null}
        {renderLogoContainer()}
        {renderAddFormContainer()}
        {renderTable()}
        {renderNavigation()}  
      </div>
      <ToastContainer
        position="top-center"
        style={{
          top: "50%",
          zIndex: 9999,
        }}   
      />
      {
        filePath && (<ShowImage filePath={filePath} assignFilePath={assignFilePath} />)
      }
    </>
  );
}

export default Admin;
