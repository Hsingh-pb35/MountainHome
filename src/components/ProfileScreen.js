import React, {Component,useState } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  Animated,
  TextInput,
  Easing,
  Alert,
  target,
  Button,
  Platform,
} from 'react-native';

import UserInput from './UserInput';
import ButtonSubmit from './ButtonSubmit';
import SignupSection from './SignupSection';
//  import FlashMsgScreen from './FlashMsgScreen';
import NewFlashMessage from "react-native-flash-message";
import usernameImg from '../images/username.png';
import passwordImg from '../images/password.png';
import eyeImg from '../images/eye_black.png';
import spinner from '../images/loading.gif';
import {Actions, ActionConst} from 'react-native-router-flux';

import { showMessage, hideMessage } from "react-native-flash-message";
import Constant from './Constant';
import Wallpaper from './Wallpaper';
import Logo from './Logo';
import AsyncStorage from '@react-native-community/async-storage';
import { Value } from 'react-native-reanimated';
import phoneImg from '../images/phone.png';
//import Textarea from 'react-native-textarea';
import adressImg from '../images/adressicon.png';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView } from 'react-native-gesture-handler';
import logoImg from '../images/small-logo.png';
import emailImg from '../images/email.png';
import NetInfo from "@react-native-community/netinfo";
import OfflineData from "./OfflineData"

const MARGIN = 40;

export default class ProfileScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
      isLoading: false,
      //Id:'',
      firstName:'',
      lastName: '',
      phoneNumber:'',
      id:'',
      email:'',
      Status:'',
      username:'',
      address:'',
      
    };
//login user Id get
AsyncStorage.getItem("id").then((value) => {
  this.setState({
     id : value
    })
    this._GetUserData();
});

    this._GetUserData = this._GetUserData.bind(this);
    this.showPass = this.showPass.bind(this);
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
    this._onPressCancel=this._onPressCancel.bind(this);
    this.CancelbuttonAnimated = new Animated.Value(0);
    
  }

  showPass() {
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false});
  }
  _onBlur() {
    this.setState({hasFocus: false});
    }

  _onFocus() {
    this.setState({hasFocus: true});
    }

  _getULColor(hasFocus) {
    //console.error(hasFocus);
    return (hasFocus === true) ? 'green' : 'lightgray';
  }
  _onPress() { 
    NetInfo.fetch().then(state => 
      {

      //validation 
    if(this.state.firstName.trim() == "")
    {
      
      showMessage({
        message: 
        "Please enter First Name",
        type: "danger",
      });
      return;
    }
    if(this.state.lastName.trim() == "")
    {
      showMessage({
        message: 
        "Please enter Last Name",
        type: "danger",
      });
      return;
    }
    if(this.state.phoneNumber.trim() == "")
    {
      showMessage({
        message: 
        "Please enter Phone Number",
        type: "danger",
      });
      return;
    }


    //reg = /^[0-9]+$/;
    // let reg = /^[0]?[6789]\d{9}$/;
    let reg = /^[0]?[123456789]\d{9,14}$/;
    if (reg.test(this.state.phoneNumber) === false) {
      showMessage({
        message: 
        "Please enter valid Phone Number",
        type: "danger",
      });
      return;
    }
     
    if(this.state.address.trim() == "")
    {
      showMessage({
        message: 
        "Please enter Address",
        type: "danger",
      });
      return;
    }
 

    if (state.isConnected) 
    {

    if (this.state.isLoading) return;

    this.setState({isLoading: true});
    Animated.timing(this.buttonAnimated, {
      useNativeDriver: false,
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();
 //API Post
    fetch(Constant.API_URL + "users/updateuser", {
      method: 'Put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id:Number(this.state.id), 
        firstName:this.state.firstName,
        lastName:this.state.lastName,
        phoneNumber:this.state.phoneNumber,
        email:this.state.email,
        Status:1,
        address:this.state.address
        //username:this.state.username,
      })
      })
      .then((response) =>{ 
        const statusCode = response.status;
        const result = response.json();
        return Promise.all([statusCode, result]);
       })
      .then(([res, result]) => {
        if(result=='success')
        {
          this.setState({isLoading: false});
          this.buttonAnimated.setValue(0);
          this.growAnimated.setValue(0);
          Actions.indexScreen();
        }
        else
        {
          showMessage({
            message: result.message,
            type: "danger",
          });
          
          this.setState({isLoading: false});
          this.buttonAnimated.setValue(0);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    } 
    else
    {
          showMessage({
              message: 
              OfflineData.offlineMessage,
              type: "danger",
            });
            return;
          }
    });
  }


//cancel button function
_onPressCancel() { 
  Actions.indexScreen();
  }

  _onGrow() {
    Animated.timing(this.growAnimated, {
      useNativeDriver: false,
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();
  }


  _GetUserData() {
    NetInfo.fetch().then(state => 
      {
        if (state.isConnected) 
        {

          var id=this.state.id;
          fetch(Constant.API_URL + "users/getuser?id="+id,{
          method: 'GET',
          })
          .then((response) =>{ 
            
            //console.log(response.status);
            const statusCode = response.status;
            const result = response.json();
            return Promise.all([statusCode, result]);
          })
          .then(([res, result]) => {

            //console.log(result);
            this.setState({
              firstName: result.firstName,
              lastName: result.lastName,
              phoneNumber: result.phoneNumber,
              email:result.email,
              Status:result.Status,
              username:result.username,
              address:result.address,
            })
          }).catch(function(error) {
            console.log('Error: ' + error.message);
            showMessage({
              message: OfflineData.errorMessage,
              type: OfflineData.syncMsgType,
              duration: OfflineData.syncMsgDuration,
              position: OfflineData.syncMsgPosition,
            });
        }.bind(this));
    } 
    else
    {
          showMessage({
              message: 
              OfflineData.offlineMessage,
              type: "danger",
            });
            return;
          }
    });

  }


  render() {
   

    const changeWidth = this.buttonAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [DEVICE_WIDTH - MARGIN, MARGIN],
    });

    const changeWidthCancel = this.CancelbuttonAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [DEVICE_WIDTH - MARGIN, MARGIN],
    });

    const changeScale = this.growAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, MARGIN],
    });
  
  

    return (
      <Wallpaper>
      {/* <InputScrollView> */}
     <KeyboardAwareScrollView>
     <ScrollView style={{ flex: 1, margin:4 }} bounces={false}>
     <View style={styles.container}>
         <KeyboardAvoidingView behavior="padding" style={{top:12}}>

         <View style={styles.inputWrapper}>
      <View style={{marginTop:10}}>
          <Text style={{ marginHorizontal: 20, fontWeight:"bold"}}>FIRST NAME</Text>
        </View>
      <Image source={usernameImg} style={styles.inlineImg} />
        <TextInput 
          onBlur={ () => this._onBlur() }
          onFocus={ () => this._onFocus() }
          underlineColorAndroid={this._getULColor(this.state.hasFocus)}
              style={styles.input}
              source={usernameImg}
               placeholder="Enter First Name"
               autoCapitalize={'none'}
               returnKeyType={'done'}
               autoCorrect={false}
               //onChangeText={text=>this.setState({ firstName: text })}
               onChangeText={text => {
                this.setState({
                  firstName: text.replace(/[^A-Za-z ]/gi, ''),
                });
                }}
                value = {this.state.firstName}
                autoCapitalize = {'words'}
               />
        </View>

        <View style={styles.inputWrapper}>
        <View style={{marginTop:10}}>
          <Text style={{ marginHorizontal: 20, fontWeight:"bold"}}>LAST NAME</Text>
        </View>
       <Image source={usernameImg} style={styles.inlineImg} />
       <TextInput 
         onBlur={ () => this._onBlur() }
         onFocus={ () => this._onFocus() }
         underlineColorAndroid={this._getULColor(this.state.hasFocus)}
             style={styles.input}
             source={usernameImg}
              placeholder="Enter Last Name"
              autoCapitalize={'none'}
              returnKeyType={'done'}
              autoCorrect={false}
              //onChangeText = {text=>this.setState({ lastName: text })}
              onChangeText={text => {
                this.setState({
                  lastName: text.replace(/[^A-Za-z ]/gi, ''),
                  });
                }}
                value = {this.state.lastName}
                autoCapitalize = {'words'}
              />
       </View>

        <View style={styles.inputWrapper}>
        <View style={{marginTop:10}}>
          <Text style={{ marginHorizontal: 20, fontWeight:"bold"}}>PHONE NUMBER</Text>
        </View>
        <Image source={phoneImg} style={styles.inlineImg} />
        <TextInput 
          onBlur={ () => this._onBlur() }
          onFocus={ () => this._onFocus() }
          underlineColorAndroid={this._getULColor(this.state.hasFocus)}
              style={styles.input}
              source={phoneImg}
               placeholder="Enter Phone Number"
               autoCapitalize={'none'}
               returnKeyType={'done'}
               autoCorrect={false}
               value={this.state.phoneNumber}
               //onChangeText = {text=>this.setState({ phoneNumber: text })}
               keyboardType="numeric"
               onChangeText={text => {
                this.setState({
                  phoneNumber: text.replace(/[^0-9]/g, ''),
                });
                }}
               />
        </View>
      
        <View style={styles.inputWrapper}>
        <View style={{marginTop:10}}>
          <Text style={{ marginHorizontal: 20, fontWeight:"bold"}}>Address</Text>
        </View>
        <Image source={adressImg} style={styles.inlineImg} />
        <TextInput 
          onBlur={ () => this._onBlur() }
          onFocus={ () => this._onFocus() }
          underlineColorAndroid={this._getULColor(this.state.hasFocus)}
          style={styles.input}
              source={phoneImg}
               placeholder="Enter New Address"
               autoCapitalize={'none'}
               returnKeyType={'done'}
               autoCorrect={false}
               value={this.state.address}
               //multiline
               onChangeText = {text=>this.setState({ address: text })}
               />
        </View>
 
     </KeyboardAvoidingView>
     <View style={{ flexDirection:"row", alignItems:"center",justifyContent: 'center', marginTop:DEVICE_HEIGHT*0.05}}>

<View style={styles.containerSubmit}>

  <Animated.View style={{width: DEVICE_WIDTH*0.4}}>
    <TouchableOpacity
      style={styles.button}
      onPress={this._onPress}
      activeOpacity={1}>
      {this.state.isLoading ? (
        <Image source={spinner} style={styles.image} />
      ) : (
        <Text style={styles.text}>SUBMIT</Text>
      )}
    </TouchableOpacity>
    <Animated.View
      style={[styles.circle, {transform: [{scale: changeScale}]}]}
    />
  </Animated.View>
  </View>
  <View style={styles.containerCancel}>
  <Animated.View style={{width: DEVICE_WIDTH*0.4}}>
    <TouchableOpacity
      style={styles.Cancelbutton}
      onPress={this._onPressCancel}
      activeOpacity={1}>
      <Text style={styles.textCancel}>CANCEL</Text>
    </TouchableOpacity>
  </Animated.View>

</View>
</View>

     </View>
     </ScrollView>
     </KeyboardAwareScrollView>
     {/* </InputScrollView> */}
     </Wallpaper>
  
   );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //top:DEVICE_HEIGHT*0.20,
  },
header:{
padding:10
},
  containerSubmit: {
    alignItems: 'center',
    justifyContent: 'flex-start',
   margin:5
  
  },
  containerCancel: {
   //flex: DEVICE_HEIGHT*4,
    //top: DEVICE_HEIGHT*0.2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin:5
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4b9445',
    height: MARGIN,
    borderRadius: 10,
    zIndex: 100,
  },
  header:{
    //backgroundColor: "#DCDCDC",
    marginBottom:10
  },
  headerContent:{
    padding:10,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    marginBottom:10,
  },
  Cancelbutton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    height: MARGIN,
    borderRadius: 10,
    zIndex: 100,
  },

  circle: {
    height: MARGIN,
    width: MARGIN,
    marginTop: -MARGIN,
    borderWidth: 1,
    borderColor: '#4b9445',
    borderRadius: 100,
    alignSelf: 'center',
    zIndex: 99,
    backgroundColor: '#4b9445',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
   // backgroundColor: 'lightgrey',
    paddingBottom: 50
  },
  text: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  textCancel: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  image: {
    width: 24,
    height: 24,
  },
  input: {
  backgroundColor: 'rgba(255, 255, 255, 0.4)',
  width: DEVICE_WIDTH - 40,
  height: 44,
  marginHorizontal: 20,
  paddingRight: 45,
  //borderRadius: 20,
  color: '#000000',
  //borderColor: '#999999',
  //borderWidth: 1,
  borderBottomWidth: (Platform.OS === 'ios') ? 1 : 0,
  borderBottomColor:(Platform.OS === 'ios') ? 'gray' : 'transparent',
},
  // input: {
  //   backgroundColor: 'rgba(255, 255, 255, 0.4)',
  //   width: DEVICE_WIDTH - 40,
  //   height: 40,
  //   marginHorizontal: 20,
  //   paddingLeft: 45,
  //   borderRadius: 20,
  //   color: '#000000',
  //   borderColor: '#999999',
  //   borderWidth: 1,
  //   marginBottom:10
  // },
  inputWrapper: {
    flex: DEVICE_HEIGHT*0.6,
    flex:1
  },
 

  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    top:10,
    left: DEVICE_WIDTH*0.85,
    top: 40,
  },

});
