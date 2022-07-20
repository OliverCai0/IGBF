import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, FlatList, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { AntDesign } from '@expo/vector-icons'; 


export default function GalleryView(props) {
    const images = props.cachedImages.slice()
    const [selectMode, setSelectMode] = useState(false);
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
            
            <View style={{ width: '50%', 
                           justifyContent: 'center', 
                           alignItems: 'center', 
                          //  backgroundColor: 'pink',
                           paddingBottom: '2%'
                           }}>
                <TouchableOpacity key={x.item.uri} 
                                    onPress={() => 
                                    {
                                        if(selectMode){
                                          // console.log('Selected Before',selectedImages);
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
            <View style={{height: '8%',  
                          justifyContent: 'space-between', 
                          flexDirection: 'row',
                          }}>
                <TouchableOpacity style={{paddingLeft: '2%', 
                              backgroundColor: 'white',
                              justifyContent: 'center'}}
                              onPress={() => {props.setPage(0)}}>
                    <Text style={{fontSize: 50, fontWeight: 'bold'}}>IGBF</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor: 'white',
                              justifyContent: 'center',
                              paddingRight: '2%'}}
                              onPress={() => {
                                setSelectMode(!selectMode);
                              }}>
                  <AntDesign name="checkcircleo" size={40} color={selectMode ? "#FF01A3" : 'black'} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={images}
                renderItem={generateImage}
                keyExtractor={(item) => item.uri}
                numColumns={2}
                columnWrapperStyle={{justifyContent: 'space-between'}}
            />
            <View style={{ 
                          height: '8%', 
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                          alignItems: 'center'}}>
                <TouchableOpacity onPress={deleteImages} 
                                  style={{
                                          backgroundColor: 'white', 
                                          alignItems: 'center', 
                                          justifyContent: 'center',
                                          borderColor: 'black',
                                          borderWidth: 2,
                                          height: '75%',
                                          width: '40%'}}>
                    <Text style={{
                      fontWeight: 'bold',
                      fontSize: 20
                    }}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={save}
                                  style={{
                                    backgroundColor: 'white', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    borderColor: 'black',
                                    borderWidth: 2,
                                    height: '75%',
                                    width: '40%',
                                    backgroundColor: "#FF01A3"
                                    }}
                                          >
                    <Text style={{
                      fontWeight: 'bold',
                      fontSize: 20
                    }}>Save</Text>
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