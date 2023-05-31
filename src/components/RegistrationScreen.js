import React, {Component } from 'react';
import Logo from './Logo';
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
//import { TouchableOpacity} from 'react-native-gesture-handler'
import { ScrollView } from 'react-native-gesture-handler';

import UserInput from './UserInput';
import ButtonSubmit from './ButtonSubmit';
import SignupSection from './SignupSection';
import usernameImg from '../images/username.png';
import passwordImg from '../images/password.png';
import eyeImg from '../images/eye_black.png';
import spinner from '../images/loading.gif';
import {Actions, ActionConst} from 'react-native-router-flux';
import { showMessage, hideMessage } from "react-native-flash-message";
import Constant from './Constant';
import Wallpaper from './Wallpaper';
import emailImg from '../images/email.png';
import phoneImg from '../images/phone.png';
import NetInfo from "@react-native-community/netinfo";
import logoImg from '../images/small-logo.png';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputScrollView from 'react-native-input-scroll-view';

const MARGIN = 40;

export default class RegistrationScreen extends Component {
  constructor(props) {

    super(props);
    this.state = {
      showPass: true,
      press: false,
      isLoading: false,
      
      FirstName: '',
      LastName: '',
      UserName: '',
      Email: '',
      PhoneNumber: '',
      PasswordHash:'',
      ConfirmPassword:''

    };
    this.showPass = this.showPass.bind(this);
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
     this._onPress = this._onPress.bind(this);

  }

  showPass() {
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false});
  }

  _onPress() { 

    NetInfo.fetch().then(state => 
      {
          if (state.isConnected) 
          {


                  if(this.state.FirstName.trim() == "")
                  {
                    showMessage({
                      message: 
                      "Please enter First Name",
                      type: "danger",
                    });
                    return;
                  }
                  else if(this.state.LastName.trim() == "")
                  {
                    showMessage({
                      message: 
                      "Please enter Last Name",
                      type: "danger",
                    });
                    return;
                  }

                  else if(this.state.Email.trim() == "")
                  {
                    showMessage({
                      message: 
                      "Please enter Email",
                      type: "danger",
                    });
                    return;
                  }

                 let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                  if (reg.test(this.state.Email) === false) {
                    showMessage({
                      message: 
                      "Please enter valid Email",
                      type: "danger",
                    });
                    return;
                  }


                  else if(this.state.PhoneNumber.trim() == "")
                  {
                    showMessage({
                      message: 
                      "Please enter Phone Number",
                      type: "danger",
                    });
                    return;
                  }
                     //reg = /^[0-9]+$/;
                  //reg = /^[0]?[6789]\d{9}$/;
                  reg = /^[0]?[123456789]\d{9,14}$/;
                  if (reg.test(this.state.PhoneNumber) === false) {
                    showMessage({
                      message: 
                      "Please enter valid Phone Number",
                      type: "danger",
                    });
                    return;
                  }
                  

                  else if(this.state.PasswordHash.trim() == "")
                  {
                    showMessage({
                      message: 
                      "Please enter Password",
                      type: "danger",
                    });
                    return;
                  }

                  
                  else if(this.state.PasswordHash.trim() != this.state.ConfirmPassword.trim())
                  {
                    showMessage({
                      message: 
                      "The Password and Confirmation Password do not match",
                      type: "danger",
                    });
                    return;
                  }



                  if (this.state.isLoading) return;

                  this.setState({isLoading: true});
                  Animated.timing(this.buttonAnimated, {
                    useNativeDriver: false,
                    toValue: 1,
                    duration: 200,
                    easing: Easing.linear,
                  }).start();

                  fetch(Constant.API_URL + "users/adduser", {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                            
                      FirstName: this.state.FirstName,
                      LastName: this.state.LastName,
                      Email: this.state.Email,
                      PhoneNumber: this.state.PhoneNumber,
                      UserName:this.state.Email,
                      UserRole:[{
                      RoleId:2
                    }],
                      PasswordHash: this.state.PasswordHash,
                    })
                    })
                    .then((response) =>{ 
                      const statusCode = response.status;
                      const result = response.json();
                      return Promise.all([statusCode, result]);
                    })
                    .then(([res, result]) => {
                      if(res==200)
                      {
                        showMessage({
                          message: "Account created Successfully",
                          type: "success",
                        });
                          setTimeout(() => {
                            this.setState({isLoading: false});
                            this.buttonAnimated.setValue(0);
                            Actions.loginScreen();
                          }, 2300);
                      }
                      else
                      {
                        showMessage({
                          message: result,
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
                    //Alert.alert("You are offline!");
                    showMessage({
                      message: 
                      "You are offline!",
                      type: "danger",
                    });
                    return;
                  }
             });          
  
   }


//cancel button function
_onPressCancel() { 
  Actions.loginScreen();
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
    const changeScale = this.growAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, MARGIN],
    });

    return (
    <Wallpaper>
       {/* <InputScrollView> */}
      <KeyboardAwareScrollView>
      <ScrollView style={{ flex: 1, margin:4, marginTop:25 }} bounces={false}>
      <View style={styles.container}>
          <Image source={logoImg} style={styles.logoImage} />
          <Text style={styles.HedingText}> Register </Text>
          <KeyboardAvoidingView behavior="padding">
        <View style={{marginTop:10}}>
          <Text style={{ marginHorizontal: 20, marginLeft:22,fontWeight:"bold"}}>First Name</Text>  
          <View style={styles.inputWrapper}>
            <Image source={usernameImg} style={styles.inlineImg} />
            <TextInput 
                  onBlur={ () => this._onBlur() }
                  onFocus={ () => this._onFocus() }
                  underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                  style={styles.input}
                  source={usernameImg}
                  placeholder="Enter First Name"
                  returnKeyType={'done'}
                  autoCorrect={false}
                  //onChangeText = {text=>this.setState({ FirstName: text })}
                  onChangeText={text => {
                    this.setState({
                      FirstName: text.replace(/[^A-Za-z ]/gi, ''),
                    });
                    }}
                    value = {this.state.FirstName}
                    autoCapitalize = {'words'}
                  />
            </View>
        </View>
        <View style={{marginTop:10}}>
        <Text style={{ marginHorizontal: 20, marginLeft:22, fontWeight:"bold"}}>Last Name</Text>  
        <View style={styles.inputWrapper}>
        <Image source={usernameImg} style={styles.inlineImg} />
        <TextInput 
               onBlur={ () => this._onBlur() }
               onFocus={ () => this._onFocus() }
               underlineColorAndroid={this._getULColor(this.state.hasFocus)}
              style={styles.input}
              source={usernameImg}
              //secureTextEntry={this.state.showPass}
              placeholder="Enter Last Name"
              returnKeyType={'done'}
              autoCorrect={false}
              //onChangeText = {text=>this.setState({ LastName: text })}
              onChangeText={text => {
                this.setState({
                  LastName: text.replace(/[^A-Za-z ]/gi, ''),
                });
                }}
                value = {this.state.LastName}
                autoCapitalize = {'words'}
              />
        </View>
        </View>

        <View style={{marginTop:10}}>
        <Text style={{ marginHorizontal: 20, marginLeft:22, fontWeight:"bold"}}>Email</Text>          
        <View style={styles.inputWrapper}>
        <Image source={emailImg} style={styles.inlineImg} />
        <TextInput 
              onBlur={ () => this._onBlur() }
              onFocus={ () => this._onFocus() }
              underlineColorAndroid={this._getULColor(this.state.hasFocus)}
              style={styles.input}
               source={emailImg}
               placeholder="Enter Email"
               autoCapitalize={'none'}
               returnKeyType={'done'}
               autoCorrect={false}
               onChangeText = {text=>this.setState({ Email: text })}
               />
        </View>
        </View>

        <View style={{marginTop:10}}>
        <Text style={{ marginHorizontal: 20, marginLeft:22, fontWeight:"bold"}}>Phone Number</Text>  
        <View style={styles.inputWrapper}>
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
               //onChangeText = {text=>this.setState({ PhoneNumber: text })}
               keyboardType="numeric"
               onChangeText={text => {
                this.setState({
                  PhoneNumber: text.replace(/[^0-9]/g, ''),
                });
                }}
                value = {this.state.PhoneNumber}
               />
        </View>
        </View>

        <View style={{marginTop:10}}>
        <Text style={{ marginHorizontal: 20, marginLeft:22, fontWeight:"bold"}}>Password</Text>  
        <View style={styles.inputWrapper}>
        <Image source={passwordImg} style={styles.inlineImg} />
        <TextInput 
               onBlur={ () => this._onBlur() }
               onFocus={ () => this._onFocus() }
               underlineColorAndroid={this._getULColor(this.state.hasFocus)}
              style={styles.input}
               source={passwordImg}
               secureTextEntry={this.state.showPass}
               placeholder="Enter Password"
               autoCapitalize={'none'}
               returnKeyType={'done'}
               autoCorrect={false}
               onChangeText = {text=>this.setState({ PasswordHash: text })}
               />
        </View>
        </View>

        <View style={{marginTop:10}}>
        <Text style={{ marginHorizontal: 20, marginLeft:22, fontWeight:"bold"}}>Confirm Password</Text>  
        <View style={styles.inputWrapper}>
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
               onChangeText = {text=>this.setState({ ConfirmPassword: text })}
               />
        </View>
        </View>
        {/* <TouchableOpacity
                  activeOpacity={2.9}
                  style={styles.btnEye}
                  onPress={this.showPass}>
            <Image source={eyeImg} style={styles.iconEye} />
            </TouchableOpacity> */}
      <View style={{ flexDirection:"row", alignItems:"center",justifyContent: 'center',margin:5}}>
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
    //flex: 0.5,
    top:10,
    alignItems: 'center',
  },
  btnEye: {
    position: 'absolute',
    marginTop: DEVICE_HEIGHT * 0.40,
    marginLeft: DEVICE_WIDTH * 0.82,
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.2)',
    // //New
    // position: 'absolute',
    // zIndex: 9999,
    // width: 22,
    // height: 22,
    // left: 260,
    // top: -29,
  },

  containerSubmit: {
    //top: DEVICE_HEIGHT*0.100,
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 5
  },

  containerCancel: {
    //top: DEVICE_HEIGHT*0.105,
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 5
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

  logoImage: {
    //width: 220,
    //height: 60,
    marginTop:5,
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
    //paddingLeft: 45,
    //borderRadius: 20,
    color: '#000000',
    //borderColor: '#999999',
    borderColor: 'white',
    //borderWidth: 1,
    borderBottomWidth: (Platform.OS === 'ios') ? 1 : 0.1,
    borderBottomColor:(Platform.OS === 'ios') ? 'gray' : 'transparent',
  },
  inputWrapper: {
    //flex: DEVICE_HEIGHT*0.8,
    //top:DEVICE_HEIGHT-530,
    //margin:5,
  },
  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: DEVICE_WIDTH*0.85,
    top: 9,
  },
  HedingText: {
    alignItems: 'center',
    justifyContent: 'center',
    //width: DEVICE_WIDTH - 40,
    //height: 40,
    //marginHorizontal: 100,
    marginTop:10,
    //paddingLeft: 50,
    color: 'black',
    backgroundColor: 'transparent',
    fontSize:17,
    //marginLeft:DEVICE_WIDTH*0.35
  },
});
