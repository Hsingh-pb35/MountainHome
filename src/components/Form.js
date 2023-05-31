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
  //AsyncStorage,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import UserInput from './UserInput';
import ButtonSubmit from './ButtonSubmit';
import SignupSection from './SignupSection';
import usernameImg from '../images/username.png';
import passwordImg from '../images/password.png';
import eyeImg from '../images/eye_black.png';
import spinner from '../images/loading.gif';
import {Actions, ActionConst} from 'react-native-router-flux';
import { showMessage, hideMessage } from "react-native-flash-message";
import Constant from './Constant'
import noimage from '../images/noimage.png';
import NetInfo from "@react-native-community/netinfo";
const MARGIN = 40;

export default class Form extends Component {

handleEmail = (text) => {
    this.setState({ username: text })
 }

 handlePassword = (text) => {
    this.setState({ password: text })
 }

  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
      isLoading: false,
      username: '',
      password: '',
      //username: 'admin@test.com',
      //password: 'admins',
    };
    this.showPass = this.showPass.bind(this);
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
    this._onPressForgot = this._onPressForgot.bind(this);

    AsyncStorage.getItem("username").then((value) => {
      if(value!=null)
      {
        Actions.indexScreen();
      }
    });
  }

  showPass() {
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false});
  }

  _onPress() {   
    
 NetInfo.fetch().then(state => 
  {
            //console.log(this.state.username);
            //console.log(this.state.password);
            if(this.state.username.trim() == "")
            {
              showMessage({
                message: 
                "Please enter Email ID",
                type: "danger",
              });
              return;
            }
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (reg.test(this.state.username) === false) {
              showMessage({
                message: 
                "Please enter valid Email",
                type: "danger",
              });
              return;
            }
            else if(this.state.password.trim() == "")
            {
              showMessage({
                message: 
                "Please enter Password",
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

            fetch(Constant.API_URL + "users/authenticate", {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                Username: this.state.username, //'admin@test.com',
                Password:  this.state.password, //'admins',
              })
              })
              .then((response) =>{ 
                const statusCode = response.status;
                const result = response.json();
                return Promise.all([statusCode, result]);
              })
              .then(([res, result]) => {
                if(res==200 && result.id>0)
                {
                  this.setSessionData('username', result.userName);
                  this.setSessionData('id', result.id.toString());
                  this.setSessionData('name', result.firstName);
                  this.setSessionData('lastname', result.lastName);
                  if(result.imageUrl==null || result.imageUrl=="")
                  {
                      this.setSessionData('profileImg', '../images/noimage.png');
                  }
                  else
                  {
                      this.setSessionData('profileImg', result.imageUrl);
                  }
                  this.setState({isLoading: false});
                  this.buttonAnimated.setValue(0);
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
                "You are Offline!",
                type: "danger",
              });
              return;
            }
       });
  }

  async setSessionData(key,value) {
    try {
        await AsyncStorage.setItem(key,value);
        return true;
    }
    catch(exception) {
        return false;
    }
  }

  _onGrow() {
    Animated.timing(this.growAnimated, {
      useNativeDriver: false,
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();
  }

_onPressForgot() {
  Actions.forgotPasswordScreen();
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
    const changeScale = this.growAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, MARGIN],
    });

    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        {/* <UserInput
          source={usernameImg}
          placeholder="Enter Password"
          autoCapitalize={'none'}
          returnKeyType={'done'}
          autoCorrect={false}
          onChangeText={(text) => this.setState({text})}
          value={this.state.username}
        />  
         <UserInput
          source={passwordImg}
          secureTextEntry={this.state.showPass}
          placeholder="Enter Password"
          returnKeyType={'done'}
          autoCapitalize={'none'}
          autoCorrect={false}
        /> */}
       
        <View style={styles.inputWrapper}>
          <Text style={{ marginHorizontal: 20, fontWeight:"bold"}}>USERNAME</Text>
          <Image source={usernameImg} style={styles.inlineImg} />
          <TextInput 
                onBlur={ () => this._onBlur() }
                onFocus={ () => this._onFocus() }
                underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                style={styles.input}
                source={usernameImg}
                placeholder="Email ID"
                autoCapitalize={'none'}
                returnKeyType={'done'}
                autoCorrect={false}
                onChangeText = {text=>this.setState({ username: text })}
                />
        </View>
        <View style={styles.inputWrapper}>
          <Text style={{ marginHorizontal: 20, fontWeight:"bold"}}>PASSWORD</Text>
          <Image source={passwordImg} style={styles.inlineImg} />
          <TextInput 
                onBlur={ () => this._onBlur() }
                onFocus={ () => this._onFocus() }
                underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                style={styles.input}
                source={passwordImg}
                secureTextEntry={this.state.showPass}
                placeholder="Email Password"
                returnKeyType={'done'}
                autoCapitalize={'none'}
                autoCorrect={false}
                onChangeText = {this.handlePassword}/>
        </View>
        {/* <TouchableOpacity
          activeOpacity={0.7}
          style={styles.btnEye}
          onPress={this.showPass}>
          <Image source={eyeImg} style={styles.iconEye} />
        </TouchableOpacity> */}


      <View style={styles.forgotView}>
          <View style={{width:DEVICE_WIDTH*0.64}}>
          </View>
          <View>
            <Text style={{color: 'gray', textAlign:'right'}}
              onPress={this._onPressForgot} activeOpacity={1}>
              Forgot Password?
              </Text>
          </View>
         
    </View> 
     

        <View style={styles.containerSubmit}>
          <Animated.View style={{width: changeWidth}}>
            <TouchableOpacity
              style={styles.button}
              onPress={this._onPress}
              activeOpacity={2}>
              {this.state.isLoading ? (
                <Image source={spinner} style={styles.image} />
              ) : (
                <Text style={styles.text}>Login</Text>
              )}
            </TouchableOpacity>
            <Animated.View
              style={[styles.circle, {transform: [{scale: changeScale}]}]}
          />
        </Animated.View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1.8,
    //alignItems: 'center',
    marginTop:7
  },
  btnEye: {
    position: 'absolute',
    top: DEVICE_HEIGHT * 0.11,
    right: DEVICE_WIDTH * 0.1,
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.2)',
  },
  forgotView: {
    //flex: 1.5,
    //justifyContent: 'flex-start',
    //marginTop: DEVICE_WIDTH*0.02,
    flexDirection: 'row'
  },
  forgotViewtest: {
    //flex: 1.5,
    justifyContent: 'flex-start',
    //marginTop: DEVICE_WIDTH*0.02,
  },

  containerSubmit: {
    //flex: 1,
    //top: 25,
    //marginTop: DEVICE_WIDTH*0.1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop:30
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4b9445',
    height: MARGIN,
    borderRadius: 10,
    zIndex: 100,
    //marginTop:25,
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
    fontWeight:"bold",
    fontSize:16
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
  inputWrapper: {
    marginTop:10
  },
  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: DEVICE_WIDTH*0.85,
    top: 28,
  },
});
