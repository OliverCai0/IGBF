import { Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { signupUser } from '../redux/ducks/user'

const SignUpScreen = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if(Object.keys(user).length != 0){
      navigation.navigate('Camera')
    }
  }, [user])

  const handleSignUp = () => {
    dispatch(signupUser({email, password}))
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
      <Text style={{fontWeight: 'bold', fontSize: 70}}>sign up</Text>
      </View>
        <KeyboardAvoidingView style={{flex: 1}}>
            <TextInput
            placeholder='Email'
            value={email}
            onChangeText={text=> setEmail(text)}
            />
            <TextInput
            placeholder='Password'
            value={password}
            onChangeText={text=> setPassword(text)}
            secureTextEntry
            />
        </KeyboardAvoidingView>
        <View style={{flex:1}}>
        <TouchableOpacity onPress={handleSignUp}>
          <Text>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Camera')}>
          <Text>Debugging: Go To Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Gallery')}>
          <Text>Debugging: Go To Gallery</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
  container : {
    flex : 1,
    alignItems: 'center',
  }
})