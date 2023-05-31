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
  Platform,
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

export default class GetotpforgotScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
      isLoading: false,
      PasswordOTP: '',
    };
    this.showPass = this.showPass.bind(this);
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
    this._onPressCancel = this._onPressCancel.bind(this);
    this.CancelbuttonAnimated = new Animated.Value(0);
  }

  showPass() {
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false});
  }

  _onPress() { 

    if(this.state.PasswordOTP.trim() == "")
    {
      showMessage({
        message: 
        "Please enter OTP",
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

    fetch(Constant.API_URL + "users/keyverify", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        PasswordOTP:this.state.PasswordOTP,
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
          this.setState({isLoading: false});
          this.buttonAnimated.setValue(0);
          Actions.generatePasswordForgot({userid: result.id});
        }
        else
        {
          showMessage({
            message: "Invalid OTP",
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
       <View>
          <Text style={styles.HedingText}>Forgot Password</Text>
        </View>
        <View style={{marginTop:10}}>
          <Text style={{ marginHorizontal: 20, fontWeight:"bold"}}>OTP</Text>
        </View>
      <View style={styles.inputWrapper}>
       
        <Image source={passwordImg} style={styles.inlineImg} />
        <TextInput 
              onBlur={ () => this._onBlur() }
              onFocus={ () => this._onFocus() }
              underlineColorAndroid={this._getULColor(this.state.hasFocus)}
              style={styles.input}
               source={passwordImg}
               placeholder="Enter OTP"
               autoCapitalize={'none'}
               returnKeyType={'done'}
               autoCorrect={false}
               onChangeText = {text=>this.setState({ PasswordOTP: text })}
               />
        </View>

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
    flex:2.8,
    //top:DEVICE_HEIGHT*0.021,
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

  HedingText: {
    //flex:1.3,
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
    // top:DEVICE_HEIGHT*0.00520,
    // flex: DEVICE_HEIGHT*0.01,
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
