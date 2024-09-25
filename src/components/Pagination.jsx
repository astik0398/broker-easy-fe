import React, { useState } from 'react'
import '../styles/Pagination.css'

function Pagination({currentPage, handleNextPage, totalPages, handlePrevPage, setCurrentPage}) {

    const [jumpPage, setJumpPage] = useState('');

    function handleJumpToPage(e){

        const pageNumber = Number(e.target.value);
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber - 1); 
        }
        setJumpPage(e.target.value);
    }
    
    return (
        <div className="pagination-container">
           <div>
           <button className="pagination-button" onClick={handlePrevPage} disabled={currentPage === 0}>PREV</button>
            <span className="pagination-text">Page {currentPage + 1} of {totalPages}</span>
            <button className="pagination-button" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>NEXT</button>
           </div>
           <div>
            <input type="number" placeholder='Jump to page' className="jumtopage-input" value={jumpPage} onChange={handleJumpToPage} 
            />
           </div>
        </div>
    );
}

export default Pagination