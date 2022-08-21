import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Camera, useCameraDevices } from 'react-native-vision-camera'

const NewCameraView = () => {
  const devices = useCameraDevices();
  const device = devices.back
  const [permissions, setPermissions] = useState(false)

  useEffect(() => {

    (async () => {
      Camera.getCameraPermissionStatus()
      .then((authorization) => {
        if(authorization === 'authorized'){
          console.log('Authorization', authorization)
          setPermissions(true)
        }
      })
    })()
  }, [])
  
  if (device != null){
  return (
    <SafeAreaView style={{flex: 1}}>
      <Text>Camera</Text>
      <Camera
        style={{flex: 1}}
        device={device}
        isActive={true}
      />
    </SafeAreaView>
  )}
  else{
    return (<SafeAreaView>
      <Text>Loading</Text>
    </SafeAreaView>)
  }
}

export default NewCameraView

const styles = StyleSheet.create({})