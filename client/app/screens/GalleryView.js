import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from 'react-native';

export default function GalleryView(props) {
    let debugProps = () => {
        for(let i = 0; i < props.cachedImages.length; i ++){
            console.log(props.cachedImages[i].uri);
            }
        props.setPage(1);
    }
    return(
        <View style={styles.container}>
            <SafeAreaView style={styles.safeAreaView}></SafeAreaView>
            <View style={styles.galleryContainer}>
                    {props.cachedImages.map(x =>
                    <View key={x.uri} style={styles.imageContainer}>
                    <Image source={{ uri: "data:image/jpg;base64," + x.base64 }}
                        style={{width: 50 * 3, height: 80 * 3}}/>
                    </View>
                    )}
            </View>
            <TouchableOpacity style={styles.container} onPress={debugProps }>
                <Text>Go Back For Now</Text>
            </TouchableOpacity>
            <SafeAreaView style={styles.safeAreaView}></SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
    },
    camera: {
      flex: 10,
    },
    commandBar: {
      flexDirection: 'row',
      flex: 1,
      alignSelf: 'flex-end',
      justifyContent: 'center',
    },
    buttonContainer: {
      flex: 1,
      backgroundColor: 'black',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      flex: 1,
      alignItems: 'center',
    },
    galleryContainer: {
        flex:1,
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '50%',
    },
    safeAreaView:{
      backgroundColor: 'white',
    },
    text: {
      fontSize: 18,
      color: 'white',
      flex: 1,
      textAlign: 'center',
    },
    topBar: {
      flex: 1,
    }
  });