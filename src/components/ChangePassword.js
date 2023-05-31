import React, {Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
  Text,
  Animated,
  TextInput,
  Easing,
  Alert,
  Platform,
} from 'react-native';

import UserInput from './UserInput';
import ButtonSubmit from './ButtonSubmit';
import SignupSection from './SignupSection';
// import FlashMsgScreen from './FlashMsgScreen';
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
import NetInfo from "@react-native-community/netinfo";

const MARGIN = 40;

export default class ChangePassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false, 
      isLoading: false,
     // Id:'',
      Password:'',
      NewPassword: '',
      ConfirmPassword:'',
      id:'',
    };
//login user Id get
    AsyncStorage.getItem("id").then((value) => {
        this.setState({ id: value})
        console.log(value);
      });

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

  _onPress() { 
    NetInfo.fetch().then(state => 
      {
      //validation 
    if(this.state.Password.trim() == "")
    {
      showMessage({
        message: 
        "Please enter Current Password",
        type: "danger",
      });
      return;
    }
    if(this.state.NewPassword.trim() == "")
    {
      showMessage({
        message: 
        "Please enter New Password",
        type: "danger",
      });
      return;
    }
    if(this.state.ConfirmPassword.trim() == "")
    {
      showMessage({
        message: 
        "Please enter Confirm New Password",
        type: "danger",
      });
      return;
    }
    else if(this.state.NewPassword.trim() != this.state.ConfirmPassword.trim())
    {
      showMessage({
        message: 
        "The Password and Confirmation Password do not match",
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
    fetch(Constant.API_URL + "users/changepassword", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id:Number(this.state.id), //Number Convert string value to integer
        Password:this.state.Password,
        NewPassword:this.state.NewPassword,
      })
      })
      .then((response) =>{ 
        const statusCode = response.status;
        const result = response.json();
        return Promise.all([statusCode, result]);
       })
      .then(([res, result]) => {
        //console.log(result);
        if(result==true)
        {
          showMessage({
            message: "Your Password has been Changed Successfully",
            type: "success",
          });
            setTimeout(() => {
              this.setState({isLoading: false});
              this.buttonAnimated.setValue(0);
              Actions.indexScreen();
            }, 2300);
        }
        else
        {
          showMessage({
            message: "The Old Password you have entered is incorrect",
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
              "This feature is not available in offline mode",
              type: "danger",
            });
            return;
          }
    });
  }


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
       {/* <FlashMsgScreen /> */}
       <KeyboardAvoidingView behavior="padding" style={styles.container}>
   
      <View style={styles.inputWrapper}>
      <Text style={{ marginHorizontal: 20, fontWeight:"bold"}}>CURRENT PASSWORD</Text>
          <Image source={passwordImg} style={styles.inlineImg} />
        <TextInput 
              onBlur={ () => this._onBlur() }
              onFocus={ () => this._onFocus() }
              underlineColorAndroid={this._getULColor(this.state.hasFocus)}
              style={styles.input}
               source={passwordImg}
               secureTextEntry={this.state.showPass}
               placeholder="Enter Old Password"
               autoCapitalize={'none'}
               returnKeyType={'done'}
               autoCorrect={false}
               //onChangeText = {this.handleEmail}
               onChangeText = {text=>this.setState({ Password: text })}
               />
              
        </View>
       
        <View style={styles.inputWrapper}>
        <Text style={{ marginHorizontal: 20, fontWeight:"bold"}}>NEW PASSWORD</Text>
        <Image source={passwordImg} style={styles.inlineImg} />
        <TextInput 
        onBlur={ () => this._onBlur() }
        onFocus={ () => this._onFocus() }
        underlineColorAndroid={this._getULColor(this.state.hasFocus)}
              style={styles.input}
               source={passwordImg}
              secureTextEntry={this.state.showPass}
               placeholder="Enter New Password"
               autoCapitalize={'none'}
               returnKeyType={'done'}
               autoCorrect={false}
               //onChangeText = {this.handleEmail}
               onChangeText = {text=>this.setState({ NewPassword: text })}
               />


        </View>
      

        <View style={styles.inputWrapper}>
        <Text style={{ marginHorizontal: 20, fontWeight:"bold"}}>CONFIRM PASSWORD</Text>
        <Image source={passwordImg} style={styles.inlineImg} />
        <TextInput 
        onBlur={ () => this._onBlur() }
        onFocus={ () => this._onFocus() }
        underlineColorAndroid={this._getULColor(this.state.hasFocus)}
              style={styles.input}
               source={passwordImg}
               secureTextEntry={this.state.showPass}
               placeholder="Confirm Password"
               autoCapitalize={'none'}
               returnKeyType={'done'}
               autoCorrect={false}
               //onChangeText = {this.handleEmail}
               onChangeText = {text=>this.setState({ ConfirmPassword: text })}
               />
            
        </View>
             
        <View style={{ flexDirection:"row", alignItems:"center",justifyContent: 'center', marginTop:25,margin:5}}>
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
      </KeyboardAvoidingView>
   
    </Wallpaper>
   );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: DEVICE_HEIGHT*0.9,
    top:17,
  },
  btnEye: {
    position: 'absolute',
    marginTop:20,
    top: (DEVICE_HEIGHT)*.00001,
    right: DEVICE_WIDTH * 0.1,
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.2)',
  },

  containerSubmit: {
    //flex: DEVICE_HEIGHT*0.7,
   // marginTop:10,
   alignItems: 'center',
   justifyContent: 'flex-start',
   margin:5
  },
  containerCancel: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4b9445',
    height: MARGIN,
    borderRadius: 10,
    zIndex: 100,
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
    height: 40,
    marginHorizontal: 20,
    paddingLeft: 5,
    //borderRadius: 20,
    color: '#000000',
    //borderColor: '#999999',
    //borderWidth: 1,
    borderBottomWidth: (Platform.OS === 'ios') ? 1 : 0,
    borderBottomColor:(Platform.OS === 'ios') ? 'gray' : 'transparent',
  },
  inputWrapper: {
    marginTop:10
  },
  // inlineImg: {
  //   position: 'absolute',
  //   zIndex: 99,
  //   width: 22,
  //   height: 22,
  //   left: 35,
  //   top: 9,
  // },

  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: DEVICE_WIDTH*0.85,
    top: 22,
  },
});
