import React,{useEffect} from "react";
import {useWindowDimensions as window,AppState, View} from 'react-native'
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IdleTimeOutHandler = (props) =>{
    let timer = undefined;
    const events = ['onPress','scroll','load','keydown']

    const eventHandler = (eventType) =>{
       AsyncStorage.setItem('lastInteractionTime',moment())
       if(timer){
        startTimer();
     }
    };

    useEffect(()=>{
        addEvents();
        
        return (()=>{
            
            removeEvents();
        })
    },[])

    const startTimer=()=>{
        
        timer=setTimeout(()=>{
            
            let lastInteractionTime=AsyncStorage.getItem('lastInteractionTime')
            const diff = moment.duration(moment().diff(moment(lastInteractionTime)));
            let timeOutInterval=props.timeOutInterval?props.timeOutInterval:60000;
            
            if(diff._milliseconds<timeOutInterval){
                startTimer();
            }
        },props.timeOutInterval?props.timeOutInterval:60000)
        
        
    }

   const addEvents = () =>{
     events.forEach(eventName =>{
        AppState.addEventListener(eventName, eventHandler)
     })

     startTimer();
   };

   const removeEvents = () =>{
    events.forEach(eventName =>{
        AppState.removeEventListner(eventName,eventHandler)
    })
   };

   return(
        <View>

        </View>
   )


}

export default IdleTimeOutHandler;