import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, FlatList, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { findDOMNode } from 'react-dom';

export default function GalleryView(props) {
    const images = props.cachedImages.slice()
    const [selectedImages, setSelectedImages] = useState([]);
    const [hasPermission, setHasPermission] = useState(null);
    let debugProps = () => {
        for(let i = 0; i < props.cachedImages.length; i ++){
            console.log(props.cachedImages[i].uri);
            }
        props.setPage(1);
    }

    const deleteImages = () => {
        for (let index = 0; index < selectedImages.length; index++) {
            const element = selectedImages[index];
            let temp = props.cachedImages;
            temp.splice(temp.findIndex((x) => x.uri == element), 1);
            props.setCachedImages(temp);
        }
        Alert.alert(
            "Deleted Images from Cache",
            "Keep going lol",
            [
              {
                text: "Sure thing man"
              },
            ],
            {
              cancelable: true,
              onDismiss: () =>
                Alert.alert(
                  "This alert was dismissed by tapping outside of the alert dialog."
                ),
            }
          )
        setSelectedImages([])
    }

    const save = async () => {
        console.log('triggered')
        for (let index = 0; index < selectedImages.length; index++) {
            const element = selectedImages[index];
            await MediaLibrary.saveToLibraryAsync(element);
        }
        Alert.alert(
            "Saved to Library",
            "Have a nice day!",
            [
              {
                text: "Whatever you say"
              },
            ],
            {
              cancelable: true,
              onDismiss: () =>
                Alert.alert(
                  "This alert was dismissed by tapping outside of the alert dialog."
                ),
            }
          )
        console.log('continued');
        props.setCachedImages([]);
        setSelectedImages([]);
        props.setPage(1);
    }

    const generateImage = (x) => {
        return(
            
            <View style={{ width: '50%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink'}}>
                <TouchableOpacity key={x.item.uri} 
                                    onPress={() => 
                                    {
                                        console.log('Selected Before',selectedImages);
                                        if(selectedImages.includes(x.item.uri)){
                                            let temp = selectedImages.slice();
                                            temp.splice(temp.indexOf(x.item.uri),1);
                                            setSelectedImages(temp);
                                        }
                                        else{
                                            let temp = [...selectedImages];
                                            temp.push(x.item.uri);
                                            setSelectedImages(temp);
                                        }
                                    }}
                                    style={(selectedImages.includes(x.item.uri)) ? styles.selectedImageContainer 
                                        : styles.imageContainer } 
                                    >
                         <Image source={{ uri: "data:image/jpg;base64," + x.item.base64 }}
                             style={{width: 50 * 3, height: 80 * 3}}/>
                </TouchableOpacity>
            </View>
        )
    }

    useEffect(() => {
        (async () => {
          const { status } = await MediaLibrary.getPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);
    
    
    return(
        <View style={styles.container}>
            <SafeAreaView style={styles.safeAreaView}></SafeAreaView>
            <View style={{height: '10%', backgroundColor: 'white'}}>
                <View style={{alignSelf: 'flex-start'}}>
                    <Text style={{fontSize: 50}}>IGBF</Text>
                </View>
            </View>
            {/* <View style={styles.galleryContainer}>
                    {props.cachedImages.map(x => generateImage(x))}
            </View> */}
            <TouchableOpacity style={{height: '10%', backgroundColor: 'red'}} onPress={debugProps }>
                <Text>Go Back For Now</Text>
            </TouchableOpacity>
            <FlatList
                data={images}
                renderItem={generateImage}
                keyExtractor={(item) => item.uri}
                numColumns={2}
                columnWrapperStyle={{justifyContent: 'space-between'}}
            />
            <View style={{backgroundColor: 'black', height: '10%', flexDirection: 'row'}}>
                <TouchableOpacity onPress={deleteImages} style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                    <Text>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={save}style={{flex: 1, backgroundColor: 'blue', alignItems: 'center', justifyContent: 'center'}}>
                    <Text>Save</Text>
                </TouchableOpacity>
            </View>
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
        borderColor : "#FF01A3",
        borderWidth : 0,
    },
    selectedImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor : "#FF01A3",
        borderWidth : 5,
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
        backgroundColor: 'black',
        flexDirection: 'row',
    }
  });