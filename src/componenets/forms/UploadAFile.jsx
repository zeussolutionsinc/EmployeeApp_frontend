
import React, { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';

const AzureFileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const sasToken = "sv=2022-11-02&ss=bf&srt=sco&sp=rwdlaciytfx&se=2024-05-01T18:08:21Z&st=2024-05-01T05:08:21Z&spr=https&sig=K8lJdjrnlrtY1%2FTUH%2B3uhTLFpgkv1oH3I0JG%2BlY9aac%3D"; 
    const containerName = "h1b-resume";
    const storageAccountName = "h1bform";
    const blobServiceClient = new BlobServiceClient(
      `https://${storageAccountName}.blob.core.windows.net?${sasToken}`
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    try {
      const blobClient = containerClient.getBlockBlobClient(file.name);
      const options = { blobHTTPHeaders: { blobContentType: file.type } };
      await blobClient.uploadData(file, options);
      setUploadStatus('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Failed to upload file.');
    }
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload} disabled={!file}>
        Upload File
      </button>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default AzureFileUpload;
