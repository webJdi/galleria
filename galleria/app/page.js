"use client";

import { useState } from "react";
import { storage, db } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import {Box, Button} from '@mui/material';

export default function UploadPhoto() {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoURL, setPhotoURL] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const storageRef = ref(storage, `photos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setPhotoURL(downloadURL);

        // Save the photo URL to Firestore
        try {
          await addDoc(collection(db, "photos"), {
            url: downloadURL,
            createdAt: new Date(),
          });
          console.log("Photo URL saved to Firestore");
        } catch (error) {
          console.error("Error saving to Firestore:", error);
        }
      }
    );
  };

  const col1 = "#"
  const col2 = "#"
  const col3 = "#"
  const col4 = "#"
  const col5 = "#"

  return (
    <Box
      width={'100vw'}
      height={'100vh'}
      bgcolor={col1}
    >

    </Box>
    <div>
      <h2>Upload Photo</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <div>Upload Progress: {uploadProgress}%</div>
      {photoURL && <img src={photoURL} alt="Uploaded" style={{ width: "300px" }} />}
    </div>
  );
}
