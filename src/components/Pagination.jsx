import React from 'react'
import '../styles/Pagination.css'

function Pagination({currentPage, handleNextPage, totalPages, handlePrevPage}) {
    return (
        <div className="pagination-container">
            <button className="pagination-button" onClick={handlePrevPage} disabled={currentPage === 0}>PREV</button>
            <span className="pagination-text">Page {currentPage + 1} of {totalPages}</span>
            <button className="pagination-button" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>NEXT</button>
        </div>
    );
}

export default Pagination