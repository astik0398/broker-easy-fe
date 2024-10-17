import React, { useEffect, useRef, useState } from "react";
import phoneIcon from "../assets/phoneIcon.svg";
import "../styles/DataTable.css";
import mobileIcon from "../assets/mobileIcon.svg";
import Pagination from "./Pagination";
import axios from "axios";
import whatsappIcon from "../assets/whatsappIcon.png";
import SingleDataCard from "./SingleDataCard";
import SingleUserModal from "./SingleUserModal";

function DataTable({
  data,
  handleButtonClick,
  handleFileChange,
  fileInputRef,
}) {
  // const isMobile = window.innerWidth <= 768;

  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState("");
  const [isModelOpen, setIsModalOpen] = useState(false)
  const [singleUserDetail, setSingleUserDetail] = useState({})
  const rowsPerPage = 10;

  function handleWhatsappCall(phoneNumber) {
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

  const filteredData = data?.filter((item) => {
    const address = item["Address"];
    return typeof address === 'string' && address.toLowerCase().includes(filter?.toLowerCase());
  });
  

  const validData = filteredData?.filter(
    (item) => item["Name"] && item["Address"] && item["Phone Number"]
  );

  const totalPages = Math.ceil(validData?.length / rowsPerPage);

  const displayData = validData?.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [filter]);

  // const handleUploadClick = () => {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.click();
  //   }
  // };

  function handleOpenModal(item){
    setIsModalOpen(true)
    setSingleUserDetail(item)
  }

  function handleCloseModal(){
    setIsModalOpen(false)
  }

  return (
    <div className="table-container">
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
            {/* <button
              onClick={handleUploadClick}
              style={{ height: "40px", borderRadius: "5px" }}
              className="btn-uploadNew"
            >
              Upload New
            </button> */}
          </div>

          <table>
    <thead>
        <tr>
            <th className="name-header">Name</th> {/* Name header for desktop */}
            <th className="address-header">Address</th> {/* Address header for desktop */}
            <th>Number</th>
            <th>Call</th>
            <th>Whatsapp</th>
            <th className="twilio-column">Twilio</th>
        </tr>
    </thead>
    <tbody>
        {displayData?.map((item, index) => (
            <tr key={index}>
                <td onClick={()=> handleOpenModal(item)} className="details-cell">
                    <div className="details-name">{item["Name"]}</div>
                    <div className="details-address">{item["Address"]}</div> {/* Stacked on mobile */}
                </td>
                <td className="address-column">{item["Address"]}</td> {/* Separate column for desktop */}
                <td>
    {typeof item['Phone Number'] === 'string'
        ? item['Phone Number'].split(',').map((number, idx) => (
            <div key={idx}>{number.trim()}</div>
        ))
        : <div>{item['Phone Number']}</div>
    }
</td>
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
                <td className="twilio-column">
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
      
      {isModelOpen && <SingleUserModal handlePhoneCall={handlePhoneCall} handleWhatsappCall={handleWhatsappCall} singleUserDetail={singleUserDetail} handleCloseModal={handleCloseModal}/>}
    </div>
  );
}

export default DataTable;
