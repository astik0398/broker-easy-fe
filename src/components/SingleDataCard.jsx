import React, { useState, useEffect, useRef } from 'react';
import '../styles/SingleDataCard.css';
import callIcon from '../assets/phoneIcon.svg';
import whatsapp from '../assets/whatsappIcon.png';

function SingleDataCard({ data, handleWhatsappCall, handlePhoneCall, handleTwilioCall }) {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const [visibleData, setVisibleData] = useState([]);
    const [filter, setFilter] = useState('');
    const tableRef = useRef(null); 

    useEffect(() => {
        const loadMoreData = () => {
            const nextItems = data.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
            setVisibleData(prev => [...prev, ...nextItems]);
        };

        loadMoreData();
    }, [currentPage, data]);

    useEffect(() => {
        const handleScroll = () => {
            if (tableRef.current) {
                const { scrollTop, clientHeight, scrollHeight } = tableRef.current;
                if (scrollTop + clientHeight >= scrollHeight - 5) {
                    if ((currentPage + 1) * itemsPerPage < data.length) {
                        setCurrentPage(prev => prev + 1);
                    }
                }
            }
        };

        const tableElement = tableRef.current;
        if (tableElement) {
            tableElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (tableElement) {
                tableElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, [currentPage, data]);

    const filteredData = visibleData.filter(item => {
      const hasRequiredFields = item.Name && item.Address && item['Phone Number'];
      return hasRequiredFields && item.Address.toLowerCase().includes(filter.toLowerCase());
  });

    return (
        <div className="data-table" ref={tableRef} style={{ overflowY: 'auto', maxHeight: '720px' }}>
            <input
                type="text"
                placeholder="Filter by address"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-input"
            />
            <table style={{border:'1px solid red'}}>
                <thead>
                    <tr>
                        <th>Details</th>
                        <th>Phone Number</th>
                        <th>Call</th>
                        <th>Whatsapp</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) => (
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
        </div>
    );
}

export default SingleDataCard;
