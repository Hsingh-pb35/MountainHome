import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Carousel, { Pagination } from 'react-native-snap-carousel';
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
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  SafeAreaView,
  VirtualizedList,
  ImageBackground,
  TouchableHighlight,
  BackHandler,
  StatusBar,
  Platform,
} from 'react-native';

import RNFS from 'react-native-fs';

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
const MARGIN = 40;
import mapIcon from '../images/map.png';
import location_icn from '../images/location-icn.png';
import homeStayIcon from '../images/homestay.png';
import hostIcon from '../images/host.png';
import qrcodeIcon from '../images/qrcode.png';
import chekOutIcon from '../images/checkout.png';
import noimage from '../images/noimage.png';
import backIcon from '../images/back.png';
import Lightbox from 'react-native-lightbox';
import Spinner from 'react-native-loading-spinner-overlay';
import noimageHome from '../images/noimageHome.png';
import { NavigationActions } from 'react-navigation';
import NetInfo from "@react-native-community/netinfo";
import OfflineData from "./OfflineData"


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


export default class ChooseStateScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
      isLoading: true,
      ItemId: '',
      name:'',
      stateList:[],
      //imageName: [],
      id:'',
    };


    // AsyncStorage.getItem("id").then((value) => {
    //   this.setState({
    //     Userid: value
    //   })
    //   this._GetLocationDataByUserIdandLocationId();
    // });


    this._GetStateData = this._GetStateData.bind(this);
    this.showPass = this.showPass.bind(this);
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPressHome=this._onPressHome.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
      this.props.navigation.goBack(null);
      return true;
  }

  async componentDidMount() {
    StatusBar.setHidden(true);
    //console.log('test');
    //OfflineData.removeItemValue("stateList");
    await this._GetStateData();
  }

  componentDidUpdate(prevProps) {
    //console.log("componentDidUpdate statename:"+this.state.statename);
    if (prevProps.navigation !== this.props.navigation) {
      // Screen has now come into focus, perform your tasks here! 
      this.setState({
        stateList: "",
        isLoading:true,
      })
       this._GetStateData();
    }
  }

  showPass() {
    this.state.press === false
      ? this.setState({ showPass: false, press: true })
      : this.setState({ showPass: true, press: false });
  }

  setIndex = (indexC, indexF) => {
    let activeSlide = [...this.state.activeSlide];
    activeSlide[indexF.index] = indexC;
    this.setState({ activeSlide });
  };

  getIndex = index => {
    if (this.state.activeSlide[index.index] == undefined) {
      this.state.activeSlide.push(0);
    }
    return this.state.activeSlide[index.index];
  };


_onPressHome = (item, statename) => {
   //console.log('View Item :',item);
    //console.log('View Item id:',item.id);
    //Actions.CityScreen({stateId:item});
     const navigateAction = NavigationActions.navigate({ routeName: 'CityScreen',params: { stateId: item,title:statename }  });
     this.props.navigation.dispatch(navigateAction);
  };

  async _GetStateData() {
      //console.log(OfflineData.isOfflineMode);
        await NetInfo.fetch().then(state => 
        {
            if (state.isConnected && !OfflineData.isOfflineMode) 
            {
                //console.log("online mode");
                //   var id=this.state.id;
                fetch(Constant.API_URL + "locations/states", {
                  method: 'GET',
                })
                  .then((response) => {
                    // console.log(response.status);
                    const statusCode = response.status;
                    const result = response.json();
                    return Promise.all([statusCode, result]);
                  })
                  .then(([res, result]) => { 
                    //console.log(result);
                    result.map((data) => {
                      data.imageName= Constant.StateImage_Url + data.imageName;
                    });
                    
                    this.setState({
                        stateList: result,
                    });
                    setTimeout(()=>this.setState({ isLoading:false}),1000)

                  }).catch(function(error) {
                      console.log('Error: ' + error.message); 
                    setTimeout(()=>this.setState({ isLoading:false}),1000)
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
                //console.log("offline mode");
                (async () => {
                  var stateListData = await OfflineData.getOfflineData("stateList");
                  //console.log(stateListData);
                  if(stateListData === null || stateListData === undefined)
                  {
                      showMessage({
                        message: OfflineData.syncMessage,
                        type: OfflineData.syncMsgType,
                        duration: OfflineData.syncMsgDuration,
                        position: OfflineData.syncMsgPosition,
                      });
                      this.setState({
                        stateList: null,
                    }); 
                    
                    setTimeout(()=>this.setState({ isLoading:false}),1000)
                  }
                  else
                  {
                      stateListData.map((data) => {
                        data.imageName= Constant.FileDisplay_Prefix_Local + Constant.StateImage_Url_Local + data.imageName;
                      });
                      //console.log("offline mode 11");
                      //console.log(stateListData);
                      this.setState({
                          stateList: stateListData
                      }); 
                      
                    setTimeout(()=>this.setState({ isLoading:false}),1000)
                  }
                  //console.log(this.state.stateList);
                 })();
              }
          });
    }


  render() {
   //  console.log(this.state.stateList[0]+' : lstLocationImages');

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
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <View style={styles.container}>
          <Spinner visible={this.state.isLoading}
              textContent={'Loading...'}
              textStyle={styles.spinnerTextStyle}
              overlayColor='white' // overlay of Loader(spiner made white)
            color='green'
              />
          </View>
          <ScrollView style={{width: DEVICE_WIDTH*0.95}} bounces={false} scrollIndicatorInsets={{ right: 1 }}>
            <View style={{marginTop:3}}>
              <View style={styles.MainContainer}>
                <FlatList bounces={false}
                  showsHorizontalScrollIndicator={true}
                  horizontal={false}
                  //data={vilagesData}
                  data={this.state.stateList}
                  renderItem={({ item, index }) => (
                   <View 
                        style={{
                           width: DEVICE_WIDTH*0.94,
                           height: DEVICE_HEIGHT*0.38,
                           borderWidth: 2,
                           //margin: 10,
                           //marginLeft:15,
                           marginTop:5,
                           marginBottom:5,
                           borderTopLeftRadius: 20,
                           borderTopRightRadius: 20,
                           borderBottomLeftRadius: 20,
                           borderBottomRightRadius: 20,
                           overflow: 'hidden',
                           borderColor: '#ecf0f1',
                          //shadowColor: 'green',
                           shadowRadius: 2, 
                          }}>
                    
                         {item.imageName != null ? (
                         <TouchableOpacity
                            onPress={() => this._onPressHome(item.id, item.name)}>
                            <Image
                               //source={{ uri: Constant.StateImage_Url + item.imageName }}
                               source={{ uri: item.imageName }}
                                  key={index} // Important to set a key for list items
                                    style=
                                    {{
                                    //  width: 280,
                                      width: DEVICE_WIDTH*0.94,
                                      height: DEVICE_HEIGHT*0.30,
                                     // height: 170,
                                      //borderWidth: 5,
                                      overflow: 'hidden',
                                     }}
                            />
                         </TouchableOpacity>
                          ) : (
                         <TouchableOpacity
                            onPress={() => this._onPressHome(item.id,item.name)} 
                            >
                           <ImageBackground source={noimageHome}
                               style=
                               {{
                                //marginTop:1,
                                width: DEVICE_WIDTH*0.94,
                                height: DEVICE_HEIGHT*0.30,
                                //borderWidth: 1,
                                overflow: 'hidden',
                               }}>
                           </ImageBackground>
                        </TouchableOpacity>
                         )}

                        <View style={{flex:1, flexDirection:'row'}}>
                           <View style={{flex:1, flexDirection:'row'}}>
                                 <ImageBackground source={location_icn}
                             style=
                              {{
                               marginTop: DEVICE_HEIGHT*0.019,
                               width: 19,
                               height: 27,
                               marginLeft: 8,
                              }}>
                          </ImageBackground>
                                 <Text
                                style={{
                                       marginLeft: DEVICE_WIDTH * 0.03,
                                       borderRadius: 40,
                                       fontSize:18, 
                                       marginTop:(Platform.OS === 'ios') ? DEVICE_HEIGHT*0.022 : DEVICE_HEIGHT*0.019,
                                      fontWeight:'bold' 
                                      }}>
                                {item.name}
                            </Text>
                          
                           </View>
                      <View style={{ justifyContent: 'center',alignContent: 'center',alignItems: 'center', 
                      marginTop:  DEVICE_HEIGHT * 0.019,//marginLeft: DEVICE_WIDTH * 0.01,
                      marginRight: 8, height:25, width:60, borderRadius: 10,backgroundColor: '#4b9445'}}>                          
                      <TouchableOpacity
                               onPress={() => this._onPressHome(item.id,item.name)} 
                               activeOpacity={1}>
                              <Text 
                               style={{fontSize:15,color: 'white',}}>View</Text>
                          </TouchableOpacity>
                         </View>                       
                        </View>
                   </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Wallpaper>
    );
  }
}

//Styes
const styles = StyleSheet.create({
  viewButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4b9445',
    height: 25,
    width:60,
    borderRadius: 10,
    zIndex: 100,
    textAlign: 'center',
    position: 'absolute',
    marginTop: DEVICE_HEIGHT * 0.485,
    marginLeft: DEVICE_WIDTH * 0.59,
  },

  mapStyle: {
    fontSize: 11,
    alignItems: 'center',
    // color:'black',
    // marginTop:5,
    // color:'black',
    // marginLeft: 30,
  },

  container: {
    flex: 1,
    //alignItems: 'center',
    alignItems: 'center',
    justifyContent: 'center',   
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4b9445',
    height: MARGIN,
    borderRadius: 20,
    zIndex: 100,
  },

  image: {
    width: 40,
    height: 40,
  },

  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 40,
    height: 40,
    left: 35,
    top: 9,
  },
});

