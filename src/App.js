import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', department: '' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [blobUrl, setBlobUrl] = useState('');

  const handleSubmit = async (e) => {
    console.log(`REACT_APP_API_LOCAL_BASE_URL: ${process.env.REACT_APP_API_LOCAL_BASE_URL}`);
    e.preventDefault();
    if (!file) return alert("Please upload a profile picture");
      
    setFile(file);
    setUploading(true);
    
      // Form data ensures proper boundary formatting for multipart streams
      const fileData = new FormData();
      fileData.append('file', file);
      console.log('file: '+file);
    
      try 
      {
        axios.defaults.baseURL = process.env.REACT_APP_API_LOCAL_BASE_URL;

        const response = await axios.post(`employee/uploadfile`, 
          fileData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
        }
      );

        const uploadUrl = await response.data.url;
        console.log('uploadUrl: '+uploadUrl);
        
        if(response.status !== 200) 
          throw new Error('Upload process failed on the backend server.');

      setBlobUrl(uploadUrl);

      // Step 3: Send employee payload to .NET API
      await axios.post(`employee`, {
        ...formData,
        imageUrl: uploadUrl
      });

      alert('Employee onboarded successfully!');
    } 
    catch (err) {
      console.error(err);
      alert('Error during registration.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px', maxWidth: '400px' }}>
      <input type="text" placeholder="Name" onChange={e => setFormData({...formData, name: e.target.value})} required /><br/><br/>
      <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required /><br/><br/>
      <input type="text" placeholder="Department" onChange={e => setFormData({...formData, department: e.target.value})} required /><br/><br/>
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} required /><br/><br/>
      <button type="submit">Onboard Employee</button>
    </form>
  );
}

export default App;