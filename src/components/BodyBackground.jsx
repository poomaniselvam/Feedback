// src/components/BodyBackground.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BodyBackground = () => {
  const [bodyImage, setBodyImage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBodyImage = async () => {
      try {
        const response = await axios.get('https://mediumblue-jellyfish-250677.hostingersite.com/api/navbar');
        console.log('API Response:', response.data); // Log the entire response

        const navbarData = response.data;
        
        if (Array.isArray(navbarData) && navbarData.length > 0) {
          const lastItem = navbarData[navbarData.length - 1]; // Get the last item
          
          if (lastItem.body_image) {
            setBodyImage(lastItem.body_image);
            
            // Set the body background image
            document.body.style.backgroundImage = `url("${lastItem.body_image}")`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundAttachment = 'fixed';
          } else {
            setError('No body_image found in the last item of the API response');
          }
        } else {
          setError('Invalid or empty API response');
        }
      } catch (error) {
        console.error('Error fetching body image:', error);
        setError('Error fetching body image: ' + error.message);
      }
    };

    fetchBodyImage();

    // Cleanup function to remove the background image when component unmounts
    return () => {
      document.body.style.backgroundImage = 'none';
    };
  }, []);

  // Render some debug information
  return (
    <>
      
    </>
  );
};

export default BodyBackground;