import React, { useEffect, useRef, useState } from "react";
import phoneIcon from "../assets/phoneIcon.svg";
import "../styles/DataTable.css";
import mobileIcon from "../assets/mobileIcon.svg";
import Pagination from "./Pagination";
import axios from "axios";
import whatsappIcon from "../assets/whatsappIcon.png";
import SingleDataCard from "./SingleDataCard";

function DataTable({
  data,
  handleButtonClick,
  handleFileChange,
  fileInputRef,
}) {
  const isMobile = window.innerWidth <= 768;

  // console.log(isMobile);

  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState("");
  const rowsPerPage = 10;

  console.log("data inside table com", data);

  function handleWhatsappCall(phoneNumber) {
    console.log(phoneNumber);
    
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
  }

  function handlePhoneCall(phoneNumber) {
    const telUrl = `tel:${phoneNumber}`;
    window.open(telUrl);
  }

  async function handleTwilioCall(phoneNumber) {
    try {
      const response = await axios.post("http://localhost:7000/makecall", {
        to: phoneNumber,
      });

      alert(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to make the call");
    }
  }

  function handleNextPage() {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  }

  function handlePrevPage() {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  }

  const filteredData = data.filter((item) =>
    item["Address"].toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const displayData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [filter]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="table-container">
      {isMobile ? (
          <SingleDataCard data={data} handleWhatsappCall={handleWhatsappCall} handlePhoneCall={handlePhoneCall} handleTwilioCall={handleTwilioCall}/>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              gap: "80px",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Filter by address"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-input"
            />

            <input
              ref={fileInputRef}
              onChange={handleFileChange}
              type="file"
              hidden
              style={{ display: "none" }}
              accept=".xlsx"
              id="fileID"
            />
            <button
              onClick={handleUploadClick}
              style={{ height: "40px", borderRadius: "5px" }}
              className="btn-uploadNew"
            >
              Upload New
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Number</th>
                <th>Call</th>
                <th>Whatsapp</th>
                <th>Twilio</th>
              </tr>
            </thead>
            <tbody>
              {displayData?.map((item, index) => (
                <tr key={index}>
                  <td>{item["Name"]}</td>
                  <td>{item["Address"]}</td>
                  <td>{item["Phone Number"]}</td>
                  <td>
                    <img
                      onClick={() => handlePhoneCall(item["Phone Number"])}
                      className="icons"
                      width={"20px"}
                      src={phoneIcon}
                      alt={item["Name"]}
                    />
                  </td>
                  <td>
                    <img
                      onClick={() => handleWhatsappCall(item["Phone Number"])}
                      className="icons"
                      width={"35px"}
                      src={whatsappIcon}
                      alt=""
                    />
                  </td>
                  <td>
                    <img
                      onClick={() => handleTwilioCall(item["Phone Number"])}
                      className="icons"
                      width={"20px"}
                      src={mobileIcon}
                      alt=""
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            handleNextPage={handleNextPage}
            totalPages={totalPages}
            handlePrevPage={handlePrevPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}

export default DataTable;
