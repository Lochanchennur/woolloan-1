import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';

const Hero = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }
    
    setError('');
    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        setLoading(false);
        if (results.errors.length && results.data.length === 0) {
          setError('Failed to parse CSV. Please check the file format.');
        } else {
          onDataLoaded(results.data, file.name);
        }
      },
      error: function() {
        setLoading(false);
        setError('An error occurred while reading the file.');
      }
    });
  };

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const onFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="hero-section">
      <h1 className="text-gradient">Credit Scoring for Thin-File Users</h1>
      <p>
        Analyze large credit risk datasets instantly in your browser. Upload your Kaggle CSV
        to simulate credit scoring for populations with limited credit history.
      </p>

      <div 
        className={`glass-card file-upload-area ${isDragging ? 'active' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => document.getElementById('csv-upload').click()}
      >
        <input 
          type="file" 
          id="csv-upload" 
          accept=".csv" 
          style={{ display: 'none' }} 
          onChange={onFileInputChange}
        />
        {loading ? (
          <div style={{ color: 'var(--primary)', animation: 'pulse 1.5s infinite' }}>
            <FileText className="file-upload-icon" />
            <h3 style={{ marginTop: '1rem' }}>Parsing Dataset...</h3>
          </div>
        ) : (
          <>
            <UploadCloud className="file-upload-icon" />
            <h3>Drag & Drop your CSV dataset here</h3>
            <span style={{ color: 'var(--text-muted)' }}>or click to browse files</span>
          </>
        )}
      </div>
      
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--danger)', marginTop: '1rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Hero;
