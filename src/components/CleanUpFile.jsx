import React, { useRef, useState } from 'react';
import "../styles/CleanUpFile.css";
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

function CleanUpFile() {
  const fileInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]); // State to store the data
  const [headers, setHeaders] = useState([]); // State to store headers
  const [inputs, setInputs] = useState([
    { name: '', value: 'Name' , placeholder: 'Enter header that has the list of Names'},
    { name: '', value: 'Address',  placeholder: 'Enter header that has the list of Addresses' },
    { name: '', value: 'Phone Number',  placeholder: 'Enter header that has the list of Mobile Numbers' },
  ]);
  const navigate = useNavigate()

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

      setData(jsonData.slice(1)); // Store the data (excluding headers)
      setHeaders(jsonData[0]); // Store headers
      setIsOpen(true); // Open modal
      e.target.value = null; // Reset the file input
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
  };

  const resetInputs = () => {
    setInputs([
      { name: '', value: 'Name' },
      { name: '', value: 'Address' },
      { name: '', value: 'Phone Number' },
    ]);
    setHeaders([]); // Reset headers
  };

  const handleInputChange = (index, event) => {
    const newInputs = [...inputs];
    newInputs[index].name = event.target.value;
    setInputs(newInputs);
  };

  const handleProcessData = () => {
    const newHeaders = [...headers]; // Create a copy of the headers

    // Create a mapping of old headers to new headers
    const headerMapping = {};

    inputs.forEach(input => {
      const headerIndex = headers.indexOf(input.name);
      if (headerIndex !== -1) {
        headerMapping[input.name] = input.value; // Map old header to new header
        newHeaders[headerIndex] = input.value; // Update header
      }
    });

    // Update the data based on the header mapping
    const updatedData = data.map(row => {
      const updatedRow = [...row]; // Copy the row
      Object.keys(headerMapping).forEach(oldHeader => {
        const newHeader = headerMapping[oldHeader];
        const oldHeaderIndex = headers.indexOf(oldHeader);
        if (oldHeaderIndex !== -1) {
          updatedRow[newHeaders.indexOf(newHeader)] = row[oldHeaderIndex]; // Preserve data
        }
      });
      return updatedRow;
    });

    // Create a new workbook and add the updated data
    const newData = [newHeaders, ...updatedData]; // Combine updated headers with data
    const worksheet = XLSX.utils.aoa_to_sheet(newData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Updated Data");

    // Generate a file download
    XLSX.writeFile(workbook, "Updated_Data.xlsx");

    setHeaders(newHeaders); // Set updated headers
    console.log(headers);
    
    closeModal(); // Close modal after processing
  };

  function handleProceedButton(){
    navigate('/table')
  }

  return (
    <div>
      <div style={{display:'flex', flexDirection:'column', marginTop:'40px'}} className="container">
        <div className="card">
          <h3>Clean Your Data</h3>
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
              Clean Up Data
            </button>
          </div>
        </div>
        <button 
          className='btn' 
          onClick={handleProceedButton}
          style={{marginTop:'50px'}}
        >
          Proceed to Upload the Cleanedup Data
        </button>
      </div>
      
      {isOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
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
    </div>
  );
}

export default CleanUpFile;
