import React, { useRef } from "react";
import { useState } from "react";
import * as XLSX from "xlsx";
import DataTable from "./DataTable";
import "../styles/FileUpload.css";

function FileUpload() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef(null);

  const REQUIRED_KEYS = ["Name", "Address", "Phone Number"];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length > 0) {
        setHeaders(jsonData[0]);
        const jsonObjects = jsonData.slice(1).map((row) => {
          return row.reduce((acc, cell, index) => {
            const key = jsonData[0][index].trim();
            acc[key] = cell;
            return acc;
          }, {})
        })
        .filter(row => {
            const hasValues = Object.values(row).some(value => value !== undefined && value !== null && value !== "");
            const hasRequiredKeys = REQUIRED_KEYS.every(key => key in row);
            return hasValues && hasRequiredKeys;
          });
        setData(jsonObjects);
        setIsUploaded(true);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleButtonClick = () => {
    console.log(fileInputRef);

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="App">
      {!isUploaded && (
        <div class="container">
          <div class="card">
            <h3>Upload Files</h3>
            <div class="drop_box">
              <header>
                <h4>Select File here</h4>
              </header>
              <p>Files Supported: XLSX</p>
              <input
                ref={fileInputRef}
                onChange={handleFileChange}
                type="file"
                hidden
                style={{ display: "none" }}
                accept=".xlsx"
                id="fileID"
              />
              <button onClick={handleButtonClick} class="btn">
                Choose File
              </button>
            </div>
          </div>
        </div>
      )}

      {isUploaded && <DataTable data={data} headers={headers} handleFileChange={handleFileChange} handleButtonClick={handleButtonClick}/>}
    </div>
  );
}

export default FileUpload;
