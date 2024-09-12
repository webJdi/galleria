'use client';
import { useEffect, useState } from 'react';
import { storage } from '../firebase'; // Import storage from the initialized firebase.js file
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import {Box, Button, Typography, LinearProgress, Paper} from '@mui/material';


export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const col1 = "#2F2235";
  const col2 = "#3F3244";
  const col3 = "#60495A";
  const col4 = "#A9ACA9";
  const col5 = "#BFC3BA";
  useEffect(() => {
    const listRef = ref(storage, 'photos/'); // Path in Firebase Storage where images are stored

    // Fetch the list of images
    listAll(listRef)
      .then((res) => {
        // Fetch download URLs for all images
        const fetchUrls = res.items.map((itemRef) =>
          getDownloadURL(itemRef).then((url) => url)
        );
        return Promise.all(fetchUrls); // Wait for all URLs to be fetched
      })
      .then((urls) => {
        setPhotos(urls); // Set the array of image URLs to state
      })
      .catch((error) => {
        console.error("Error fetching photos: ", error);
      });
  }, []);

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
          href="./"
          sx={{background:col5,
            color:col1
          }}
        >
          Upload
        </Button>
        </Box>

        <Box
        width={'80vw'}
        height={'80vh'}
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
          Gallery
        </Typography>
        <Box
          bgcolor={col3}
          width={'70vw'}
          height={'60vh'}
          margin={'0 auto'}
          display={'flex'}
          justifyContent={'space-between'}
          flexDirection={'row'}
          flexWrap={'wrap'}
          overflow={'auto'}
        >  
            {photos.length > 0 ? (
                photos.map((photoUrl, index) => (
            
                <img
                key={index}
                src={photoUrl}
                alt={`Uploaded image ${index}`}
                style={{ width: '200px', height: '200px', objectFit: 'cover', margin:'1em' }}
                />
                
          ))
        ) : (
          <p>No photos found</p>
        )}
        </Box>
      </Box>
    </Box>
    
  );
}
