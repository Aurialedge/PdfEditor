import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiSearch, FiPlus } from 'react-icons/fi';
import { getAllExtractedData, deleteExtractedData, type ExtractedData } from '../services/api';
import './ExtractedData.css';

const ExtractedDataList: React.FC = () => {
  const [data, setData] = useState<ExtractedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllExtractedData(currentPage, limit, searchTerm);
      
      if (response.success && response.data) {
        setData(response.data.data || []);
        setTotalPages(response.data.pagination?.pages || 1);
      } else {
        setError(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const response = await deleteExtractedData(id);
      if (response.success) {
        fetchData(); // Refresh the list
      } else {
        setError('Failed to delete item');
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchData();
  };

  if (loading && data.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="extracted-data-list">
      <div className="list-header">
        <h2>Extracted Data</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/ai-extract')}
        >
          <FiPlus /> New Extraction
        </button>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search extracted data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </form>

      {data.length === 0 ? (
        <div className="no-data">No extracted data found</div>
      ) : (
        <>
          <div className="data-grid">
            {data.map((item) => (
              <div key={item._id} className="data-card">
                <h3>{item.title}</h3>
                <p className="summary">{item.summary}</p>
                {item.keyPoints && item.keyPoints.length > 0 && (
                  <div className="key-points">
                    <h4>Key Points:</h4>
                    <ul>
                      {item.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="card-footer">
                  <span className="date">
                    {new Date(item.createdAt || '').toLocaleDateString()}
                  </span>
                  <div className="actions">
                    <button 
                      className="btn-icon"
                      onClick={() => item._id && navigate(`/edit/${item._id}`)}
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      className="btn-icon danger"
                      onClick={() => item._id && handleDelete(item._id)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExtractedDataList;
