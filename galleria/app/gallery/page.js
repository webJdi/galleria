'use client';
import { useEffect, useState } from 'react';
import { storage } from '../firebase'; // Import storage from the initialized firebase.js file
import { ref, listAll, getDownloadURL } from 'firebase/storage';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);

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
    <div>
      <h2>Gallery</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {photos.length > 0 ? (
          photos.map((photoUrl, index) => (
            <img
              key={index}
              src={photoUrl}
              alt={`Uploaded image ${index}`}
              style={{ width: '200px', height: '200px', objectFit: 'cover' }}
            />
          ))
        ) : (
          <p>No photos found</p>
        )}
      </div>
    </div>
  );
}
