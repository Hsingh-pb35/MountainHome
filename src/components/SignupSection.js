import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet,Text, Dimensions,TouchableOpacity,
  Animated,
  Easing,
  Image,
  Alert,
  View,
  } from 'react-native';
import {Actions, ActionConst} from 'react-native-router-flux';

import spinner from '../images/loading.gif';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const MARGIN = 40;



export default class SignupSection extends Component {


  constructor() {
    super();
    this.state = {
      isLoading: false,
    };
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
    //this._onPressForgot = this._onPressForgot.bind(this);
  }
  _onPress() {
  
    Actions.registrationScreen();
    }

  _onGrow() {
   
    Animated.timing(this.growAnimated, {
      useNativeDriver: false,
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();
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
      <View style={styles.container}>
        <Text style={styles.text}>Don’t have account?</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={this._onPress}
            activeOpacity={1}>
            <Text style={styles.signup}> Sign up now</Text>
          </TouchableOpacity>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: DEVICE_HEIGHT*0.15,
    width: DEVICE_WIDTH,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    color: 'black',
    backgroundColor: 'transparent',
  },
  signup:
  {
    color: '#4b9445',
    backgroundColor: 'transparent',
  },
  image: {
    width: 24,
    height: 24,
  },
});
