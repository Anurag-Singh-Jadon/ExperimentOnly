import { useNavigation } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Pressable, } from 'react-native'
import MyTextinput from './ReusableComp/MyTextInput'
import Mybutton from './ReusableComp/Mybutton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
const Login = () => {
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [getToken, setGetToken] = useState('')
    const [error, setError] = useState('')
    const navigation = useNavigation()
    const dispatch = useDispatch();
    const getState = useSelector(state => state.token)
    console.log('getState', getState)
    useEffect(() => {
        saveToken()
    }, [])
    const loginHandler = async () => {
        console.log('start Login')
        await axios({
            url: 'https://fakestoreapi.com/auth/login',
            method: 'POST',
            data: {
                username: userName,
                password: password
            }
        }).then(res => {
            // console.log('res',res.data.token)
            dispatch({type :res.data.token})
            // setGetToken(res.data.token)
            setUserName('')
            setPassword('')
            setTimeout(() => {
                navigation.navigate('Operations')
            }, 1000)
        })
    }

    const saveToken = async () => {
        try {
            await AsyncStorage.setItem('tokenId', getToken)
            console.log('Token Save Successfully')
        } catch (e) {
            console.log(e)
        }

    }
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 40, color: 'blue' }}>Login Page</Text>
            <MyTextinput placeholder='UserName' value={userName} onChangeText={(value) => setUserName(value)} />
            <MyTextinput placeholder='Password' value={password} onChangeText={(value) => setPassword(value)} />
            <Mybutton title='Login' customClick={() => loginHandler()} />
            <Pressable onPress={() => navigation.navigate('Signup')}>
                <Text style={{ color: 'blue' }}>Don't have account then signin to create the accouont</Text>
            </Pressable>
        </View>
    )
}

export default Login;
// mor_2314
// 83r5^_

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    
    },

})
