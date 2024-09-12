"use client";

import { useState } from "react";
import { storage, db } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import {Box, Button, Typography, LinearProgress} from '@mui/material';


function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}


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

  const col1 = "#2F2235";
  const col2 = "#3F3244";
  const col3 = "#60495A";
  const col4 = "#A9ACA9";
  const col5 = "#BFC3BA";

  return (
    <Box
      width={'100vw'}
      height={'100vh'}
      bgcolor={col1}
      display={'flex'}
      justifyContent={'center'}
      alignContent={'center'}
      flexDirection={'column'}
    >
      <Typography
        variant="h2"
        textAlign={'center'}
      >
        Galleria
      </Typography>
      <Box
      position={'fixed'}
      top={'2vh'}
      right={'2vh'}
      >
          <Button
          href="/gallery"
          sx={{background:col5,
            color:col1
          }}
        >
          Gallery
        </Button>
      </Box>
      
      <Box
        width={'80vw'}
        height={'60vh'}
        margin={'0 auto'}
        bgcolor={col2}
        display={'flex'}
        flexDirection={'column'}
        padding={'2em'}
      >
        <Typography
          variant={'h4'}
          color={'col5'}
          textAlign={'center'}
          margin={'1em'}
        >
          Share your photos
        </Typography>
        <Box
          bgcolor={col3}
          width={'50vw'}
          height={'40vh'}
          margin={'0 auto'}
          display={'flex'}
          justifyContent={'space-between'}
          flexDirection={'column'}
        >
        <input type="file" onChange={handleFileChange} margin='1em'/>
        <Box
          width={'10vw'}
          margin={'1em auto'}
        >
        <Button
          size="small"

          variant="contained"
          onClick={handleUpload}
          margin={'1em auto'}
          sx={{background:col2,
            '&:hover':
            {
              background:col4,
              color:col1
            }
          }}
        >
          Upload
        </Button>
        </Box>
        <LinearProgressWithLabel value={uploadProgress} />
        </Box>
        
        
        <Box>
        
        </Box>

        
      </Box>
    </Box>
  );
}
