import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaCog } from "react-icons/fa";
import { Link } from 'react-router-dom';

const RatingTable = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const ratingRef = useRef();

    useEffect(() => {
        axios.get('https://mediumblue-jellyfish-250677.hostingersite.com/api/rating')
            .then(response => {
                setData(response.data.data);
                setFilteredData(response.data.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    }, []);

    const handleSearch = (event) => {
        const rating = event.target.value.toLowerCase();
        const filtered = data.filter(item => 
            item.rating.toString().toLowerCase().includes(rating)
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to the first page after search
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationButtons = () => {
        const pageNumbers = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 3; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                pageNumbers.push(currentPage - 1);
                pageNumbers.push(currentPage);
                pageNumbers.push(currentPage + 1);
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers.map((number, index) => (
            <button 
                key={index}
                onClick={() => number !== '...' && handlePageClick(number)}
                className={`btn ${currentPage === number ? 'btn-primary' : 'btn-secondary'} mx-1`}
                disabled={number === '...'}
            >
                {number}
            </button>
        ));
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ratings");
        XLSX.writeFile(workbook, "ratings_data.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Ratings Data", 20, 10);
        doc.autoTable({
            head: [['ID', 'Name', 'Mobile', 'Email', 'Rating', 'Question1', 'Question2', 'Comment']],
            body: filteredData.map(item => [
                item.id, item.Name, item.Mobile, item.email, item.rating, item.question1, item.question2, item.comment,
            ]),
        });
        doc.save("ratings_data.pdf");
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="container mt-4">
               <div className="card my-3">
  <div className="card-header">
    Customization Options
  </div>
  <div className="card-body">
    <div className="d-flex justify-content-center justify-content-lg-around justify-content-md-around flex-wrap">
      <Link to="/header" className="btn btn-light shadow mb-3 mr-3">
        <FaCog /> Custom Navbar
      </Link>
      <Link to="/question" className="btn btn-light shadow mb-3 mr-3">
        <i className="bi bi-question"></i> Custom Questions
      </Link>
      <Link to="/background" className="btn btn-light shadow mb-3 mr-3">
       <i className="bi bi-palette-fill"></i> Custom Bg Color
      </Link>
      <Link to="/admin" className="btn btn-light shadow mb-3">
       <i className="bi bi-envelope-at-fill"></i> Custom Email
      </Link>
    </div>
  </div>
</div>


            <div className="card">
  <div className="card-header">
    Data Export and Table
  </div>
  <div className="card-body">
    {/* Search Input and Export Buttons */}
    <div className="row mb-3">
      <div className="col-md-4">
        <input 
          type="text" 
          className="form-control" 
          ref={ratingRef} 
          placeholder="Enter rating (e.g., '4')" 
          onChange={handleSearch} 
        />
      </div>
      <div className="col-md-8 my-4 my-lg-0 text-right">
       <div className=' d-flex justify-content-around'>
         <CSVLink 
          data={filteredData} 
          filename={"ratings_data.csv"} 
          className="btn btn-success mr-3 shadow-sm d-block"
        >
          <FaFileCsv /> CSV
        </CSVLink>
        <button 
          onClick={exportToExcel} 
          className="btn btn-primary mr-3 shadow-sm d-block"
        >
          <FaFileExcel /> Excel
        </button>
        <button 
          onClick={exportToPDF} 
          className="btn btn-danger shadow-sm d-block"
        >
          <FaFilePdf /> PDF
        </button>
       </div>
      </div>
    </div>

    {/* Table */}
    <div className="table-responsive">
      <table className="table table-bordered table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Rating</th>
            <th>Question1</th>
            <th>Question2</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.Name}</td>
              <td>{item.Mobile}</td>
              <td>{item.email}</td>
              <td>{item.rating}</td>
              <td>{item.question1}</td>
              <td>{item.question2}</td>
              <td>{item.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Pagination Controls */}
  <div className="card-footer d-flex justify-content-between align-items-center">
    <button 
      onClick={handlePrevPage} 
      className="btn btn-secondary" 
      disabled={currentPage === 1}
    >
      Previous
    </button>
    <div>{renderPaginationButtons()}</div>
    <button 
      onClick={handleNextPage} 
      className="btn btn-secondary" 
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
</div>

        </div>
    );
};

export default RatingTable;
