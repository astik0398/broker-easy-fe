import React, { useState, useEffect, useRef } from 'react';
import '../styles/SingleDataCard.css';
import callIcon from '../assets/phoneIcon.svg';
import whatsapp from '../assets/whatsappIcon.png';
import Pagination from './Pagination';

function SingleDataCard({ data, handleWhatsappCall, handlePhoneCall, handleTwilioCall }) {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const [filter, setFilter] = useState('');
    const tableRef = useRef(null); 

    function handleNextPage() {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
      }
    
      function handlePrevPage() {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
      }
     
    const filteredData = data.filter(item => {
      const hasRequiredFields = item.Name && item.Address && item['Phone Number'];
      return hasRequiredFields && item.Address.toLowerCase().includes(filter.toLowerCase());
  });

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const displayedData = filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className="data-table" ref={tableRef} >
            <input
                type="text"
                placeholder="Filter by address"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-input"
            />
            <table>
                <thead>
                    <tr>
                        <th>Details</th>
                        <th>Phone Number</th>
                        <th>Call</th>
                        <th>Whatsapp</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedData.map((item, index) => (
                        <tr key={index}>
                            <td><div className='details-div'>{item['Name']} <br /> {item['Address']}</div></td>
                            <td>{item['Phone Number']}</td>
                            <td style={{textAlign:'center'}}>
                                <img width={'23px'} src={callIcon} onClick={() => handlePhoneCall(item['Phone Number'])} />
                            </td>
                            <td style={{textAlign:'center'}}>
                            <img width={'30px'} src={whatsapp} onClick={() => handleWhatsappCall(item['Phone Number'])} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination
            currentPage={currentPage}
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            totalPages={totalPages}
            showJumptoInput= {false}
            />
        </div>
    );
}

export default SingleDataCard;
