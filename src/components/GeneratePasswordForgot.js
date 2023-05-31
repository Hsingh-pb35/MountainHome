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
  Platform
} from 'react-native';

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
import Logo from './Logo';
const MARGIN = 40;

export default class GeneratePasswordForgot extends Component {

  constructor(props) {
    super(props);
  //Alert.alert(this.props.userid);
    this.state = {
      showPass: true,
      press: false,
      isLoading: false,
     // Id:'',
      NewPassword: '',
      ConfirmPassword:'',
    };

    this.showPass = this.showPass.bind(this);
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
    this._onPressCancel=this._onPressCancel.bind(this);
    this.CancelbuttonAnimated = new Animated.Value(0);

    // this.props.result.id;
    
  }

  showPass() {
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false});
  }

  _onPress() { 
    //console.log(this.state.username);
    //console.log(this.state.password);
    if(this.state.NewPassword.trim() == "")
    {
      showMessage({
        message: 
        "Please enter Password",
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

    
    if (this.state.isLoading) return;

    this.setState({isLoading: true});
    Animated.timing(this.buttonAnimated, {
      useNativeDriver: false,
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();

    fetch(Constant.API_URL + "users/forgetpasswordset", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        Id:this.state.Id,//Number(UserId),
       
        NewPassword:this.state.NewPassword,
        
        //Id:this.props.result.id,
       // password:this.state.password,
      })
      })
      .then((response) =>{ 
        const statusCode = response.status;
        const result = response.json();
        return Promise.all([statusCode, result]);
       })
      .then(([res, result]) => {
        if(result==true)
        {
          this.setState({isLoading: false});
          this.buttonAnimated.setValue(0);
          this.growAnimated.setValue(0);
          Actions.loginScreen();
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
  var Id=this.props.userid;
  this.state.Id=Id;
   //Alert.alert(UserId);
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
       <Logo />
       <View behavior="padding" style={styles.container}>
       <Text style={styles.HedingText}>Forgot Password</Text>
       <View style={{marginTop:10}}>
          <Text style={{ marginHorizontal: 20, fontWeight:"bold"}}>Password</Text>
        </View>
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
               //onChangeText = {this.handleEmail}
               onChangeText = {text=>this.setState({ NewPassword: text })}
               />
        </View>
        <View style={{marginTop:10}}>
          <Text style={{ marginHorizontal: 20, fontWeight:"bold"}}>Confirm Password</Text>
        </View>
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
               //onChangeText = {this.handleEmail}
               onChangeText = {text=>this.setState({ ConfirmPassword: text })}
               />
        </View>
        {/* <TouchableOpacity
          activeOpacity={0.7}
          style={styles.btnEye}
          onPress={this.showPass}>
          <Image source={eyeImg} style={styles.iconEye} />
        </TouchableOpacity> */}
 <View style={{ flexDirection:"row", alignItems:"center",justifyContent: 'center', marginTop:50,margin:5}}>
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
   
    </Wallpaper>
   );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 2.8,
    //top:DEVICE_HEIGHT*0.03,
  },

  containerSubmit: {
    //top: DEVICE_HEIGHT*0.2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin:5
  },
  containerCancel: {
    //flex: DEVICE_HEIGHT*4,
    //top: DEVICE_HEIGHT*0.2,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  btnEye: {
    position: 'absolute',
    top: DEVICE_HEIGHT * 0.07,
    right: DEVICE_WIDTH * 0.1,
  },
  iconEye: {
    width: 25,
    height: 25,
    tintColor: 'rgba(0,0,0,0.2)',
  },
  HedingText: {
    top: -5,
    alignItems: 'center',
     color: 'black',
     backgroundColor: 'transparent',
     fontSize:16,
     textAlign: 'center',
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
    height: 44,
    marginHorizontal: 20,
    //paddingLeft: 45,
    borderRadius: 20,
    color: '#000000',
    //borderColor: '#999999',
    //borderWidth: 1,
    borderBottomWidth: (Platform.OS === 'ios') ? 1 : 0,
    borderBottomColor:(Platform.OS === 'ios') ? 'gray' : 'transparent',
  },
  inputWrapper: {
    //flex: 1,
    //top:DEVICE_HEIGHT*0.00930,
  },
  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: DEVICE_WIDTH*0.85,
    top: 9,
  },
});
