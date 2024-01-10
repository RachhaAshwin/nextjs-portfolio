'use client'
import React from 'react';
import { MendableInPlace } from "@mendable/search"

const MyMendableSearchBar = () => {

  const mendableStyles = {
    width: '1200px', // adjust as needed
    height: '800px', // adjust as needed
  };

  const containerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', 
  };


  return (
    <div style={containerStyles}>
      <div style={mendableStyles}>
        <MendableInPlace anon_key={process.env.NEXT_PUBLIC_MENDABLE_ANON_KEY} 
          darkMode={true} 
          accentColor="#123456" 
        />
      </div>
    </div>
  );
};

export default MyMendableSearchBar;