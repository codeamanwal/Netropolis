import img1 from './Images/img1.jpg';
import React, { useState, useEffect } from 'react';
import img2 from './Images/img2.jpeg';
import img3 from './Images/img3.jpeg';
import './Homepage.css';


const Slider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        // Increment currentIndex cyclically
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000); // Change slide every 3 seconds
  
      return () => clearInterval(intervalId); // Cleanup on unmount
    }, [images.length]);
  
    return (
      <div className="slider-container">
        <div
          className="slider"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`, // Move images horizontally
            transition: 'transform 1s ease', // Smooth transition
          }}
        >
          {images.map((image, index) => (
            <img key={index} src={image} alt={`Slide ${index + 1}`} className="slide" />
          ))}
        </div>
      </div>
    );
  };

function Homepage(){

    const image = [ img1 , img2, img3]

    return (
      <div className='homepage'>
      {/* <h1>Welcome to NetroPolis</h1>
      <h3>A platform where adventure awaits!</h3> */}
      {/* <navBar/> */}
        <div>
            <Slider images={image}/>
        </div>
      <div className='container'>
      <h2>About US :</h2>
      <p>At NetroPolis, we connect travelers with communities and foster meaningful experiences. Our mission is to create a platform where users can discover hidden gems, contribute to local initiatives, and forge lasting connections.</p>
      </div>
      <div className='container'>
        <h2>How It Works :</h2>
        <p>Sign up, browse quests, and start exploring local wonders with our platform. From thrilling adventures to community tasks, immerse yourself in diverse experiences. Elevate your journey with all-inclusive stay packages and connect with like-minded travelers through our vibrant community forums.</p>
      </div>
      </div>

    );

}

export default Homepage;