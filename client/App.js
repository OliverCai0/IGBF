import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CameraView from './app/screens/CameraView'
import GalleryView from './app/screens/GalleryView';
import WelcomeView from './app/screens/Welcome';

export default function App() {
  const [page, setPage] = useState(0);
  const [cachedImages, setCachedImages] = useState([])

  switch(page){
    case 0:
      return(
        <WelcomeView setPage={setPage}/>
      )
    case 1:
      return (
        <CameraView setPage={setPage} 
                    setCachedImages={setCachedImages}
                    cachedImages={cachedImages}/>
      );
    case 2:
      return (
        <GalleryView setPage={setPage}
                     setCachedImages={setCachedImages}
                     cachedImages={cachedImages}/>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
