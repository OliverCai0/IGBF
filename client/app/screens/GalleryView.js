import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView, FlatList, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { AntDesign } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { removePhoto, savePhotos } from '../redux/ducks/photos';


export default function GalleryView(props) {
    const dispatch = useDispatch();
    const images = useSelector((state) => state.photos)
    const [selectMode, setSelectMode] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [hasPermission, setHasPermission] = useState(null);
    const navigation = useNavigation()
    console.log('Gallery_images', images)
    const deleteImages = () => {
        console.log('Selected before removal', selectedImages)
        dispatch(removePhoto(selectedImages))
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
            console.log('saving element:', images[element].path)
            await MediaLibrary.saveToLibraryAsync(images[element].path);
        }
        dispatch(savePhotos(selectedImages))
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
        setSelectedImages([]);
        navigation.navigate('Camera')
    }

    const generateImage = (x) => {
      console.log(x)
      console.log(x.item.path)
        return(
            
            <View style={{ width: '50%', 
                           justifyContent: 'center', 
                           alignItems: 'center', 
                          //  backgroundColor: 'pink',
                           paddingBottom: '2%'
                           }}>
                <TouchableOpacity key={x.index} 
                                    onPress={() => 
                                    {
                                        if(selectMode){
                
                                          if(selectedImages.includes(x.index)){
                                              let temp = selectedImages.slice();
                                              temp.splice(temp.indexOf(x.index),1);
                                              setSelectedImages(temp);
                                          }
                                          else{
                                              let temp = [...selectedImages];
                                              temp.push(x.index);
                                              setSelectedImages(temp);
                                          }
                                        }
                                    }}
                                    style={(selectedImages.includes(x.index)) ? styles.selectedImageContainer 
                                        : styles.imageContainer } 
                                    >
                         <Image source={{uri : x.item.path}}
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
                              onPress={() => {navigation.navigate('SignUp')}}>
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