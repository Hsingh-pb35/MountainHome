import React, {Component} from 'react';
import PropTypes from 'prop-types';
//import Dimensions from 'Dimensions';
import {StyleSheet, ImageBackground, View} from 'react-native';

import bgSrc from '../images/wallpaper.png';
import FlashMessage from "react-native-flash-message";

export default class Wallpaper extends Component {
  render() {
    return (
      <ImageBackground style={styles.picture} source={bgSrc}>
        {this.props.children}
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  picture: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
});
