import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

const Operations = () => {
  const getToken = useSelector(state => state)
  console.log('Token aa gaya',getToken)
  const [data, setData] = useState([])
 
  useEffect(() => {
    getDataUsingSimpleGetCall()
  }, [])
  const getValue = AsyncStorage.getItem('tokenId')
  console.log('getValue',getValue)
  const getDataUsingSimpleGetCall = async () => {
    await axios
      .get('https://fakestoreapi.com/products')
      .then(function (response) {
        // handle success
        // alert(JSON.stringify(response.data));
        // console.log(response.data.map(v =>v.category))
        // console.log(response.data)
       
        setData(response.data)
      })
      .catch(function (error) {
        // handle errors
        console.log(error.message);
      })
      .finally(function () {
        // always executed
        console.log('Finally called');
      });
  };

  const deleteProduct = async (id) => {
    console.log('ID', id)
    await axios
      .delete(`https://fakestoreapi.com/products/${id}`, {
        method: "DELETE"
      })
      .then(function (response) {

        // console.log('DELETE', response.data)
        let modifyData = [...data]
        const newData = modifyData.filter((val,i) =>{
          return val.id !== response.data.id
        })
         console.log('data aa gaya',newData)
        setData(newData)
      })
      .catch(function (error) {
        // handle errors
        console.log(error.message);
      })
      .finally(function () {
        // always executed
        console.log('Finally called');
      });
  
  }



  const addProduct = () => {
    axios
      .post('https://fakestoreapi.com/products', {
        title: 'test product',
        price: 13.5,
        description: 'lorem ipsum set',
        image: 'https://i.pravatar.cc',
        category: 'electronic'
      })
      .then(function (response) {
        // handle success
        // alert(JSON.stringify(response.data));
        console.log(response.data)
        let addnewData = [...data,response.data]
       
        setData(addnewData)
      })
      .catch(function (error) {
        // handle error
        alert(error.message);
      });
  };

  const updateProduct = async(id) => {
   await axios
      .patch(`https://fakestoreapi.com/products/${id}`, {
        title: 'test product',
        price: 13.5,
        description: 'lorem ipsum set',
        image: 'https://i.pravatar.cc',
        category: 'elec'
      })
      .then(function (response) {
        // console.log('\\\\\\',response.data)
       let newData = [...data]
      const existingIndex = newData.findIndex(v => v.id === response.data.id)
      if(existingIndex === -1){
        newData.push(response.data)
      }else{
        newData[existingIndex] = response.data
      }
    //  console.log('new Data',newData)
     setData(newData)
      })
      .catch(function (error) {
        // handle error
        alert(error.message);
      });
  };
  const ItemView = ({ item }) => {
    return (
      <>
        <View style={styles.mainContr}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Image source={{ uri: item.image }} style={{ width: 80, height: 100 }} />
              <Text style={{ color: '#000', }}>
                {item.category}
              </Text>
              <Text style={{ color: 'red' }}>
                {item.id}
              </Text>
            </View>
            <View >
              <Text style={{ color: '#000' }}>{item.title ? item.title.slice(0, 25) + '...' : item.title}</Text>
              <Text>{item.description ? item.description.slice(0, 80) + '...' : item.description}</Text>
              <Text style={{ color: '#000' }}>Price :{item.price}</Text>
              <Text > Rating:{item?.rating?.rate}</Text>
            </View>

          </View>

          <View style={{ alignSelf: 'flex-end' }}>
            <TouchableOpacity onPress={() => deleteProduct(item.id)}>
              <Text style={{ color: 'green' }}>DELETE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addProduct}>
              <Text style={{ color: 'red' }}>ADD</Text>
            </TouchableOpacity>
           <TouchableOpacity onPress={() => updateProduct(item.id)}>
              <Text style={{ color: 'blue' }}>UPDATE</Text>
            </TouchableOpacity> 
          </View>
        </View>
      </>
    );
  };


  return (

    <View style={styles.container}>
        <TouchableOpacity style={{width:80,height:30,alignItems:'center',justifyContent:'center',backgroundColor:'blue',marginTop:10}}>
         <Text style={{color:"#ffffff"}}>Logout</Text>
        </TouchableOpacity>
      <FlatList
        data={data}
        renderItem={ItemView}
        // keyExtractor={(item, index) => index.toString()}
        keyExtractor={(item, index) => item.id}
      />
    </View>

  )
};

export default Operations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 5
  },
  mainContr: {
    width: '100%',
    height: 230,
    alignSelf: 'center',
    backgroundColor: 'pink',
    marginTop: 30,
    padding: 10
  }
})














