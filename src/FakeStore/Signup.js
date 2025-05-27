import React,{useState,useEffect} from 'react'
import { View,Text, StyleSheet } from 'react-native'
import MyTextinput from './ReusableComp/MyTextInput'
import Mybutton from './ReusableComp/Mybutton'
const Signup =() => {
  const[email,setEmail] = useState('')
  return (
    <View style={styles.container}>
      <Text style={{fontSize:40,color:'blue'}}>Signup Page</Text>
      <MyTextinput placeholder='Enter the email'/>
      <MyTextinput placeholder='Enter the UserName'/>
      <MyTextinput placeholder='Enter the Password'/>
      <MyTextinput placeholder='Enter the FirstName'/>
      <MyTextinput placeholder='Enter the LastName'/>
      <MyTextinput placeholder='Enter the Address'/>
      <MyTextinput placeholder='Enter the Phone no'/>
      <Mybutton title='Signup'/>
    </View>
  )
}

export default Signup;

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  }
})
