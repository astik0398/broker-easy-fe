import React, { useRef, useState } from "react";
import "../styles/CleanUpFile.css";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import DataTable from "./DataTable";

function CleanUpFile() {
  const fileInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]); 
  const [headers, setHeaders] = useState([]); 
  const [inputs, setInputs] = useState([
    {
      name: "",
      value: "Name",
      placeholder: "Enter header that has the list of Names",
    },
    {
      name: "",
      value: "Address",
      placeholder: "Enter header that has the list of Addresses",
    },
    {
      name: "",
      value: "Phone Number",
      placeholder: "Enter header that has the list of Mobile Numbers",
    },
  ]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const REQUIRED_KEYS = ["Name", "Address", "Phone Number"];
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded / event.total) * 100);
        setUploadPercentage(percentage); 
      }
    };

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      if (jsonData.length > 0) {
        const headers = jsonData[0];
        setHeaders(headers);
  
        // Convert to an array of objects
        const jsonObjects = jsonData.slice(1).map((row) => {
          return row.reduce((acc, cell, index) => {
            const key = typeof jsonData[0][index] === 'string' ? jsonData[0][index].trim() : jsonData[0][index];
            if (key) acc[key] = cell;
            return acc;
          }, {});
        });
  
        setData(jsonObjects);
      }
  
      setIsOpen(true);
      e.target.value = null;
    };
  
    reader.readAsArrayBuffer(file);
  };  

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    resetInputs();
    setUploadPercentage(0)
  };

  const resetInputs = () => {
    setInputs([
      { name: "", value: "Name" },
      { name: "", value: "Address" },
      { name: "", value: "Phone Number" },
    ]);
    setHeaders([]); 
  };

  const handleInputChange = (index, event) => {
    const newInputs = [...inputs];
    newInputs[index].name = event.target.value;
    setInputs(newInputs);
  };

  const handleProcessData = () => {
    const newHeaders = [...headers];
    const updatedData = [];

    const headerMapping = {};

    inputs.forEach((input) => {
      const headerIndex = headers.indexOf(input.name);
      if (headerIndex !== -1) {
        headerMapping[input.name] = input.value;
        newHeaders[headerIndex] = input.value;
      }
    });

    // Update the data based on the header mapping
    data.forEach((row) => {
      const updatedRow = {};
      Object.keys(headerMapping).forEach((oldHeader) => {
        const newHeader = headerMapping[oldHeader];
        updatedRow[newHeader] = row[oldHeader];
      });
      updatedData.push(updatedRow);
    });

    // Below commented line is for donwloading the new xlsx file

    // const finalData = [
    //   newHeaders,
    //   ...updatedData.map((row) =>
    //     newHeaders.map((header) => row[header] || "")
    //   ),
    // ]; // Combine updated headers with data
    // const worksheet = XLSX.utils.aoa_to_sheet(finalData);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, "Updated Data");

    // // Generate a file download
    // XLSX.writeFile(workbook, "Updated_Data.xlsx");

    // console.log("Final Data for Download: ", updatedData); // Debugging line
    setHeaders(newHeaders); // Set updated headers
    setData(updatedData); // Set the updated data to state
    // console.log("headers--->", headers);
    // console.log("allDatatas--->", data);

    closeModal(); // Close modal after processing
    setIsUploaded(true);
  };

  // console.log("updadata-->", data);

  return (
    <div>
      {!isUploaded && (
        <div
          style={{ display: "flex", flexDirection: "column" }}
          className="container"
        >
          <div className="card">
            <h3>Upload Your File</h3>
            <div className="drop_box">
              <header>
                <h4>Select File here</h4>
              </header>
              <p>Files Supported: XLSX</p>
              <input
                ref={fileInputRef}
                onChange={handleFileChange}
                type="file"
                hidden
                accept=".xlsx"
                id="fileID"
              />
              <button onClick={handleButtonClick} className="cleanup-btn">
                Choose File
              </button>
            </div>
          </div>
          {/* <button
          className='btn'
          onClick={handleProceedButton}
          style={{ marginTop: '50px' }}
        >
          Proceed to Upload the Cleaned Data
        </button> */}

{uploadPercentage > 0 && (
  <div style={{ width: '42%', background: '#e0e0e0', borderRadius: '5px', marginTop: '10px' }}>
    <div
      style={{
        width: `${uploadPercentage}%`,
        background: '#3dd42f',
        height: '4px',
        borderRadius: '5px',
        transition: 'width 0.5s'
      }}
    />
  </div>
)}
        </div>
      )}

      {isOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <div className="modal-inputs">
              {inputs.map((input, index) => (
                <div key={index} className="input-row">
                  <input
                    type="text"
                    value={input.name}
                    onChange={(e) => handleInputChange(index, e)}
                    className="header-input"
                    placeholder={input.placeholder}
                  />
                  <input
                    type="text"
                    value={input.value}
                    readOnly
                    className="header-input"
                  />
                </div>
              ))}
            </div>
            <button onClick={handleProcessData} className="btn">
              Process Data
            </button>
          </div>
        </div>
      )}

      {isUploaded && <DataTable data={data} headers={headers} handleButtonClick={handleButtonClick} fileInputRef={fileInputRef}/>}
    </div>
  );
}

export default CleanUpFile;
