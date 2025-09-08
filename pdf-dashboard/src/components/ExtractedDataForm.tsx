import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiX, FiTrash2 } from 'react-icons/fi';
import './ExtractedData.css';
import { 
  getExtractedDataById, 
  updateExtractedData, 
  createExtractedData,
  type ExtractedData 
} from '../services/api';

interface ExtractedDataFormProps {
  initialData?: Omit<ExtractedData, '_id' | 'createdAt' | 'updatedAt'>;
  isEditing?: boolean;
}

const ExtractedDataForm: React.FC<ExtractedDataFormProps> = ({ 
  initialData, 
  isEditing = false 
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<ExtractedData, '_id' | 'createdAt' | 'updatedAt'>>(
    initialData || {
      title: '',
      summary: '',
      keyPoints: [''],
      originalText: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      metadata: {
        model: '',
        timestamp: new Date().toISOString(),
        charactersProcessed: 0
      }
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await getExtractedDataById(id);
          if (response.success && response.data) {
            setFormData({
              title: response.data.title,
              summary: response.data.summary,
              keyPoints: [...response.data.keyPoints, ''],
              originalText: response.data.originalText,
              author: response.data.author || '',
              date: response.data.date ? (typeof response.data.date === 'string' 
                ? response.data.date 
                : new Date(response.data.date).toISOString().split('T')[0]) 
                : new Date().toISOString().split('T')[0],
              metadata: response.data.metadata || {
                model: '',
                timestamp: new Date().toISOString(),
                charactersProcessed: 0
              }
            });
          } else {
            setError(response.error || 'Failed to load data');
          }
        } catch (err) {
          setError('An error occurred while loading data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleKeyPointChange = (index: number, value: string) => {
    const newKeyPoints = [...formData.keyPoints];
    newKeyPoints[index] = value;
    
    // Remove empty key points except the last one
    const filteredKeyPoints = newKeyPoints.filter((kp, i) => kp.trim() !== '' || i === newKeyPoints.length - 1);
    
    // If all key points are filled, add a new empty one
    if (filteredKeyPoints[filteredKeyPoints.length - 1] !== '') {
      filteredKeyPoints.push('');
    }
    
    setFormData(prev => ({
      ...prev,
      keyPoints: filteredKeyPoints
    }));
  };

  const removeKeyPoint = (index: number) => {
    const newKeyPoints = formData.keyPoints.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      keyPoints: newKeyPoints.length > 0 ? newKeyPoints : ['']
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Remove empty key points before submitting
      const dataToSubmit = {
        ...formData,
        keyPoints: formData.keyPoints.filter(kp => kp.trim() !== '')
      };

      let response;
      if (isEditing && id) {
        response = await updateExtractedData(id, dataToSubmit);
      } else {
        response = await createExtractedData(dataToSubmit);
      }

      if (response.success) {
        navigate('/extracted-data');
      } else {
        setError(response.error || 'Failed to save data');
      }
    } catch (err) {
      setError('An error occurred while saving data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="extracted-data-form">
      <div className="form-header">
        <h2>{isEditing ? 'Edit Extracted Data' : 'New Extracted Data'}</h2>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          <FiX /> Cancel
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="summary">Summary *</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label>Key Points</label>
          {formData.keyPoints.map((point, index) => (
            <div key={index} className="key-point-input">
              <input
                type="text"
                value={point}
                onChange={(e) => handleKeyPointChange(index, e.target.value)}
                placeholder="Enter a key point"
              />
              {index < formData.keyPoints.length - 1 && (
                <button 
                  type="button" 
                  className="btn-icon danger"
                  onClick={() => removeKeyPoint(index)}
                  title="Remove key point"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date as string}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            <FiSave /> {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExtractedDataForm;
