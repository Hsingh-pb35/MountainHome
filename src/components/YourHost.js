import React, { Component, useState } from 'react';
// import { Grid, Row, Col } from 'react-flexbox-grid';
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
  target,
  Button,
  ScrollView,
  ImageBackground,
  StatusBar,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import UserInput from './UserInput';
import ButtonSubmit from './ButtonSubmit';
import SignupSection from './SignupSection';
//  import FlashMsgScreen from './FlashMsgScreen';
import NewFlashMessage from "react-native-flash-message";
import usernameImg from '../images/username.png';
import passwordImg from '../images/password.png';
import eyeImg from '../images/eye_black.png';
import spinner from '../images/loading.gif';
import { Actions, ActionConst } from 'react-native-router-flux';

import { showMessage, hideMessage } from "react-native-flash-message";
import Constant from './Constant';
import Wallpaper from './Wallpaper';
import Logo from './Logo';
import AsyncStorage from '@react-native-community/async-storage';
import { Value } from 'react-native-reanimated';
//import Textarea from 'react-native-textarea';
import adressImg from '../images/addressc.png';
import phoneImg from '../images/phonec.png';
import noimage from '../images/noimage.png';
import Lightbox from 'react-native-lightbox';
import backIcon from '../images/back.png';
import emailImg from '../images/emailc.png';
import backgroundImage from '../images/background.jpg';
import { NavigationActions } from 'react-navigation';
import NetInfo from "@react-native-community/netinfo";
import OfflineData from "./OfflineData"
const MARGIN = 40;


export default class YourHost extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
      isLoading: true,
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      locationName: '',
      // homeStayId: '',
      homeStayId:this.props.navigation.getParam('homeStayId'),
      about: '',
      homeStaymainImage: '',
      imageURL:'',
     // homestayId: '',
      // locationId: ''
      locationId: this.props.navigation.getParam('id'),

    };
    //login user Id get
    // AsyncStorage.getItem("id").then((value) => {
    //   this.setState({
    //     id: value
    //   })
    //   this._GetHomeStayOwnerDetails();
    // });

    this._GetHomeStayOwnerDetails = this._GetHomeStayOwnerDetails.bind(this);
    this.showPass = this.showPass.bind(this);
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    //this._onPress = this._onPress.bind(this);
  //  this._onPressCancel = this._onPressCancel.bind(this);
    this.CancelbuttonAnimated = new Animated.Value(0);

  }
  componentDidMount() 
  {
    StatusBar.setHidden(true);
    this._GetHomeStayOwnerDetails();
  }
  componentDidUpdate(prevProps) {
    //console.log(this.state.id+"Test componentDidUpdate");
    if(this.props.navigation.getParam('homeStayId')!==prevProps.navigation.getParam('homeStayId')){
      //console.log("Test if:"+this.props.navigation.getParam('id'));
      this.setState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        locationName: '',
        address: '',
        about: '',
        homeStaymainImage: '', 
        imageURL: '', 
        locationId: '',
        homestayId: '',
        isLoading:true,
      })
      this._GetHomeStayOwnerDetails();
   }
  }

  showPass() {
    this.state.press === false
      ? this.setState({ showPass: false, press: true })
      : this.setState({ showPass: true, press: false });
  }

  //cancel button function
  // _onPressCancel() {
  //  // Actions.locationDetailsScreen({ id: this.state.id });
  //  const navigateAction = NavigationActions.navigate({ routeName: 'LocationDetailsScreen',params: { id: this.props.navigation.getParam('id') }  });
  //  this.props.navigation.dispatch(navigateAction);
  // }

  _GetHomeStayOwnerDetails() {
    //console.log(this.props.navigation.getParam('homeStayId')+"HomeStayId");
    //var homeStayId = this.state.homeStayId;
      NetInfo.fetch().then(state => 
      {
        if (state.isConnected && !OfflineData.isOfflineMode) 
        //if (true) 
        {
          //console.log(this.props.navigation.getParam('homeStayId'));
          fetch(Constant.API_URL + "locations/gethomestayownerbyhomestayid?homeStayId=" + this.props.navigation.getParam('homeStayId'), {
            method: 'GET',
          })
            .then((response) => {
              //console.log(response.status);
              const statusCode = response.status;
              const result = response.json();
              return Promise.all([statusCode, result]);
            })
            .then(([res, result]) => {
              //console.log(result);
              this.assignOwnerData(result, false);

              // this.setState({
              //   firstName: result.firstName,
              //   lastName: result.lastName != null ? result.lastName : '',
              //   phoneNumber: result.phoneNumber,
              //   email: result.email,
              //   locationName: result.locationName,
              //   address: result.address,
              //   about: result.about != null ? result.about : '',
              //   homeStaymainImage: Constant.Homestay_MainImage_Url + result.homeStaymainImage,
              //   imageURL: Constant.OwnerImage_Url + result.imageURL,
              //   locationId: result.locationId,
              //   homestayId: result.homestayId
              // })
            })
        }
        else
        {
          (async () => {             
            var arryLocationData=[];
            var homestayHostData = await OfflineData.getOfflineData("homeStayHostList");
            //console.log("homestayHostData: "+homestayHostData);
            if(homestayHostData === null || homestayHostData === undefined)
            {
                 showMessage({
                   message: OfflineData.syncMessage,
                   type: OfflineData.syncMsgType,
                   duration: OfflineData.syncMsgDuration,
                   position: OfflineData.syncMsgPosition,
                 });
                 setTimeout(()=>this.setState({isLoading:false}),1000)
                 
             }
             else
             {
                  var homestayHostLocalData= homestayHostData.filter(obj => obj.homestayId == this.props.navigation.getParam('homeStayId'));
                  //console.log("homestayHostLocalData: "+homestayHostLocalData);
                  let result=homestayHostLocalData[0];
                  if(result !=null && result.id > 0)
                  {
                    this.assignOwnerData(result, true);
                  } 
                  else
                  {
                    showMessage({
                      message: "No data found for offline.",
                      type: OfflineData.syncMsgType,
                    });
                  }         
             }
           })();
        }
    });
  }

  async assignOwnerData(result, isOffline)
  {
    this.setState({
      firstName: result.firstName,
      lastName: result.lastName != null ? result.lastName : '',
      phoneNumber: result.phoneNumber,
      email: result.email,
      locationName: result.locationName,
      address: result.address,
      about: result.about != null ? result.about : '',
      //homeStaymainImage: Constant.Homestay_MainImage_Url + result.homeStaymainImage,
      homeStaymainImage: (!isOffline?Constant.Homestay_MainImage_Url:Constant.FileDisplay_Prefix_Local + Constant.Homestay_MainImage_Url_Local) + result.homeStaymainImage, 
      //imageURL: Constant.OwnerImage_Url + result.imageURL,
      imageURL: (!isOffline?Constant.OwnerImage_Url:Constant.FileDisplay_Prefix_Local + Constant.OwnerImage_Url_Local) + result.imageURL, 
      locationId: result.locationId,
      homestayId: result.homestayId,
     
      
    })
    setTimeout(()=>this.setState({isLoading:false}),1000);
    //console.log(this.state.homeStaymainImage);
    //console.log(this.state.imageURL);
  }

  backTolocationdetails() {
   // Actions.locationDetailsScreen({ id: this.state.locationId });
   const navigateAction = NavigationActions.navigate({ routeName: 'LocationDetailsScreen',params: { id: this.props.navigation.getParam('id') }  });
   this.props.navigation.dispatch(navigateAction);
  }

  render() {

    // var homeStayId = this.props.homeStayId;
    // this.state.homeStayId = homeStayId;

    // var id = this.props.id;
    // this.state.id = id;


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
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Spinner visible={this.state.isLoading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
            overlayColor='white' // overlay of Loader(spiner made white)
            color='green'
            />
          <ScrollView bounces={false}>
            <View>

              {/* //Upper Part */}
              <View style={styles.userUpper}>
                <ImageBackground style={{
                  height: DEVICE_HEIGHT * 0.450,
                  width: DEVICE_HEIGHT
                }} source={{ uri: this.state.homeStaymainImage }}>

                  {/* <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => this.backTolocationdetails(this.state.locationId)} activeOpacity={1}>
                      <Image source={backIcon}
                        style={{
                          width: 40, height: 40, marginLeft: DEVICE_WIDTH * 0.013,
                          borderRadius: 40, marginTop: DEVICE_HEIGHT * 0.015
                        }} />
                    </TouchableOpacity>
                  </View> */}

                </ImageBackground>

                {this.state.imageURL != null ?(
                        <ImageBackground
                         //source={{ uri: Constant.OwnerImage_Url+this.state.imageURL}}
                        source={{ uri: this.state.imageURL}}
                        style={{ height: DEVICE_HEIGHT * 0.25,
                        width: DEVICE_HEIGHT * 0.25,
                        overflow: 'hidden',
                        marginBottom: 5,
                        borderWidth: 1,
                        borderRadius: 80, 
                        alignSelf: 'center',
                        zIndex: 1000, 
                        backgroundColor: 'white',
                        top: DEVICE_HEIGHT * (-0.15) }}>
                        </ImageBackground>
                  ) : (
                        <ImageBackground
                        source={noimage}
                        style={{ height: DEVICE_HEIGHT * 0.25,
                        width: DEVICE_HEIGHT * 0.25,
                        overflow: 'hidden',
                        marginBottom: 5,
                        borderWidth: 1,
                        borderRadius: 80, 
                        alignSelf: 'center',
                        zIndex: 1000, 
                        backgroundColor: 'white',
                        top: DEVICE_HEIGHT * (-0.15) }}>
                      </ImageBackground>

                  )}

                {/* <ImageBackground
                  // source={noimage}
                  source={{ uri: this.state.imageURL}}
                  style={{ height: DEVICE_HEIGHT * 0.25,
                   width: DEVICE_HEIGHT * 0.25,
                   overflow: 'hidden',
                   marginBottom: 5,
                   borderWidth: 1,
                   borderRadius: 80, 
                   alignSelf: 'center',
                   zIndex: 1000, 
                   backgroundColor: 'white',
                   top: DEVICE_HEIGHT * (-0.15) }}>
                </ImageBackground> */}
              </View>


              {/* //Lower */}
              <View style={styles.userLower}>

                {/* //User Name */}
                <View>
                  <View style={styles.userName}>
                    <Text style={styles.userName}>{this.state.firstName + " " + this.state.lastName}</Text>
                  </View>
                  {/* //End User Name */}


                  {/* //About */}
                  <View style={styles.userDetail, { marginBottom: 0 }}>
                    <View >
                      {/* <Text style={{ color: 'gray', marginHorizontal: 20, fontWeight: "bold", fontSize: 18, marginLeft: 0 }}>ABOUT</Text> */}
                      <Text style={{ color: 'gray', marginHorizontal: 20, fontWeight: "bold", fontSize: 16, marginLeft: 0 }}>ABOUT</Text>
                    </View>
                    <Text style={styles.userAddress}>{this.state.about}</Text>
                  </View>
                 
                  {/* End //About */}

                  <View style={{ borderBottomColor: 'gray', margin: 5, padding: 10, borderBottomWidth: 1 }} />
                  {/* //Phone Number */}
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ width: DEVICE_WIDTH * .40, height: 50 }} >
                      <Image source={phoneImg} style={styles.inlineImg} />
                    </View>
                    <View style={{ width: DEVICE_WIDTH * .60, height: 50, textAlign: 'center',justifyContent:'center' }} >
                      <View><Text style={{  color: 'gray' }}>Phone</Text></View>
                      <View><Text>{this.state.phoneNumber}</Text></View>
                    </View>
                  </View>
                  {/* //End Phone */}

                  {/* //Email */}
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ width: DEVICE_WIDTH * .40, height: 50 }} >
                      <Image source={emailImg} style={styles.inlineImg} />
                    </View>
                    <View style={{ width: DEVICE_WIDTH * .60, height: 50, textAlign: 'center' ,justifyContent:'center'}} >
                      <View><Text style={{ color: 'gray' }}>Email</Text></View>
                      <View><Text>{this.state.email}</Text></View>
                    </View>
                  </View>
                  {/* //End Email */}

                </View>

              </View>




            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Wallpaper>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 6.2,
    //top: 2,
  },
  body: {
    padding: 10
  },
  userLower: { padding: 10 },
  userName: {
    //fontSize: 16,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    flexGrow: 1,
    marginTop: DEVICE_HEIGHT * .035,
    color: 'gray'
  },
  userAddress: {
    fontSize: 16,
    color: 'gray'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  userDetail: {
    fontSize: 15,
    textAlign: "center",
    justifyContent: 'center',
    flexGrow: 1,
    marginTop: DEVICE_HEIGHT * .0040,
    top: DEVICE_HEIGHT * .020,
    color: 'gray',
    marginBottom:0
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

  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: DEVICE_WIDTH - 40,
    height: 40,
    marginHorizontal: 20,
    paddingLeft: 45,
    borderRadius: 20,

    color: '#000000',
    borderColor: '#999999',
    borderWidth: 1,
  },

  inputWrapper: {
    flex: DEVICE_HEIGHT * 1.90,
  },

  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    justifyContent: 'center',
    height: 22,
    left: 30,
    top: 9,
    padding: 15
  },
  mapImage: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: 35,
    top: 9,
    color: 'green',
    textAlign: "center",
    padding: 15
  },

  userImage: {
    backgroundColor: '#999999'
  },

  userUpper: {
    backgroundColor: '#e6e6e6',
    marginBottom: 30,
    height: DEVICE_HEIGHT * 0.450,
  }

});
