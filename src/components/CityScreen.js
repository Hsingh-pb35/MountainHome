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
  Platform
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
import noimageHome from '../images/noimageHome.png';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationActions,withNavigationFocus } from 'react-navigation';
import notfound from '../images/not-found.png';
import NetInfo from "@react-native-community/netinfo";
import OfflineData from "./OfflineData"



const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


export default class CityScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
      isLoading: true,
      name:'',
      CityList:[],
      stateId:this.props.navigation.getParam('stateId', '1'),
      id:'',
      statename:this.props.navigation.getParam('title'),
    };

    this._GetCityData = this._GetCityData.bind(this);
    this.showPass = this.showPass.bind(this);
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPressHome=this._onPressHome.bind(this);
    this.backToHome=this.backToHome.bind(this);
  }
  componentDidMount() {
    //console.log("statename:"+this.state.statename);
    //  console.log(this.state.id+'cccjjjj');
    this.props.navigation.setParams({ title: this.state.statename });
    this._GetCityData();
  }

  componentDidUpdate(prevProps) {
    //console.log("componentDidUpdate statename:"+this.state.statename);
    if (this.props.isFocused && !prevProps.isFocused) {
      // Screen has now come into focus, perform your tasks here! 
      this.setState({
        CityList: "",
        isLoading:true,
      })
      this._GetCityData();
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


  backToHome() {
    Actions.indexScreen();
  };

    _onPressHome = (item) => {
       //console.log(item);
       //Actions.homeScreen({cityId:item});
        //const navigateAction = NavigationActions.navigate({ routeName: 'Home',params: { cityId: item.id,stateId:this.state.stateId,title:"Village List" }  });
        const navigateAction = NavigationActions.navigate({ routeName: 'Home',params: { cityId: item.id,stateId:this.state.stateId,title: item.name + ": Villages",statename:this.state.statename,cityname:item.name }  });
        this.props.navigation.dispatch(navigateAction);
      };


    _GetCityData() {

        NetInfo.fetch().then(state => 
        {
            if (state.isConnected && !OfflineData.isOfflineMode) 
            {
                  //console.log("State Id:"+this.state.stateId);
                  fetch(Constant.API_URL + "locations/citiesbystateid?stateId=" +this.state.stateId, {
                  //fetch(Constant.API_URL + "locations/citiesbystateid?stateId=" +34, {
                    method: 'GET',
                  })
                  .then((response) => {
                    // console.log(response.status);
                    const statusCode = response.status;
                    const result = response.json();
                    return Promise.all([statusCode, result]);
                  })
                  .then(([res, result]) => {
                  //console.log(result+'result');
                  
                    result.map((data) => {
                      var imageName=data.imageName;
                      data.imageName= Constant.CityImage_Url + data.imageName;
                    });

                    this.setState({                      
                        CityList: result.length==0?null:result,                        
                        //statename:
                    });
                    setTimeout(()=>this.setState({isLoading:false}),1000)

                  })
          }
          else{
          (async () => {             
              var arryCityData=[];
              var cityListData = await OfflineData.getOfflineData("cityList");
              if(cityListData === null || cityListData === undefined)
              {
                  showMessage({
                    message: OfflineData.syncMessage,
                    type: OfflineData.syncMsgType,
                    duration: OfflineData.syncMsgDuration,
                    position: OfflineData.syncMsgPosition,
                  });
                  this.setState({
                    stateList: null,
                    // isLoading:false,
                }); 
                setTimeout(()=>this.setState({isLoading:false}),1000)
              }
              else
              {
                var cityLocalData= cityListData.filter(item => 
                {
                    return item.filter((data) => {
                    //data.stateId === this.state.stateId;
                    });
                });
                cityLocalData = cityLocalData.filter(obj => obj.find(o => o.stateId === this.state.stateId));  
                cityLocalData.map((item) => {
                  item.map((data) => {
                    data.imageName= Constant.FileDisplay_Prefix_Local + Constant.CityImage_Url_Local + data.imageName;
                    arryCityData.push(data);
                  });
                });
                //console.log("offline mode 11");
                this.setState({
                    CityList: arryCityData.length > 0 ? arryCityData : null,
                    // isLoading:false,
                }); 
                setTimeout(()=>this.setState({isLoading:false}),1000)
                //console.log(arryCityData);
            }
          })();
        }
      });
  }


  render() {
     //console.log(this.state.stateList[0]+' : lstLocationImages');
    //  var {state} = this.props.navigation;
    //  console.log("PROPS " + state.params.stateId);
    //  console.log(state+'state');

    const {state} = this.props.navigation;
    //console.log("PROPS " + state.params.stateId);

    this.state.stateId=state.params.stateId;
    //  var stateId=this.props.stateId;
    //  this.state.stateId=stateId;
   // console.log(this.state.stateId+'new state stateId');



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
          <ScrollView style={{width: DEVICE_WIDTH*0.96}} bounces={false} scrollIndicatorInsets={{ right: 1 }}>
            <View style={{marginTop:3}}>
              <View style={styles.MainContainer}>
                     <Spinner visible={this.state.isLoading}
                      textContent={'Loading...'}
                      textStyle={styles.spinnerTextStyle}
                      overlayColor='white' // overlay of Loader(spiner made white)
                      color='green'/>
                      
                   {/* <TouchableOpacity onPress={() => this.backToHome()} activeOpacity={1}>
                        <Text 
                         // source={backIcon}
                          style={{
                             width: 40,
                             height: 40,
                             marginLeft: DEVICE_WIDTH * 0.80,
                             borderRadius: 40,
                             marginTop: DEVICE_HEIGHT * 0.01,
                             color: 'green',
                          }}>Back</Text>
                  </TouchableOpacity> */}
   {this.state.CityList==null ? (
         <View style={{marginTop:DEVICE_HEIGHT*0.15, alignItems: 'center',
         justifyContent: 'center', }}>
             <Image source={notfound}
                              style=
                               {{
                                width: DEVICE_WIDTH*0.40,
                                 height: DEVICE_WIDTH*0.41,
                                 //borderWidth: 5,
                                 overflow: 'hidden',
                                }}
                            />
            <Text style={{
                  fontSize:20, 
                  fontWeight:'bold', 
                  justifyContent:'center', 
                  textAlign: 'center',
                  color: '#489142',
                  marginTop:5,
              }}> Whoops</Text>
              <Text style={{
                  fontSize:15, 
                  justifyContent:'center', 
                  textAlign: 'center',
                  color:'gray',
                  marginTop:5,
              }}> No City found for this State</Text>

          <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#4b9445',
                height: MARGIN,
                width: DEVICE_WIDTH - MARGIN,
                borderRadius: 10,
                zIndex: 100,
                marginTop:DEVICE_HEIGHT*0.22,
              }}
              onPress={this.backToHome}
              activeOpacity={2}>      
             <Text style={{color:'white'}}>Back to state list</Text>
            </TouchableOpacity>
        </View>
            ) : ((this.state.CityList.length == 1 ? ( 
              <FlatList bounces={false}
              numColumns={2}
              // showsHorizontalScrollIndicator={true}
              // horizontal={false}
              //data={vilagesData}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
                data={this.state.CityList}
                renderItem={({ item, index }) => (
               <View 
                  style=
                  {{
                     width: DEVICE_WIDTH*0.95,
                    // height: 190,
                     height: DEVICE_HEIGHT*0.38,
                     borderWidth: 2,
                     //margin: 2,
                     //marginLeft:11,
                     marginTop:5,
                     //marginBottom:5,
                     //margin:5,
                     borderTopLeftRadius: 20,
                     borderTopRightRadius: 20,
                     borderBottomLeftRadius: 20,
                     borderBottomRightRadius: 20,
                     overflow: 'hidden',
                     borderColor: '#ecf0f1',
                   }}>
              
                  {item.imageName != null ? (
                   
                  <TouchableOpacity
                     // onPress={this._onPressHome}>
                      onPress={() => this._onPressHome(item)}>
                     <Image
                      //onPress={() => this.setState({ activeSlide: index })}
                      //source={item.src} // Use item to set the image source
                      //source={{ uri: Constant.CityImage_Url + item.imageName }}
                      source={{ uri: item.imageName }}
                      key={index} // Important to set a key for list items
                      style=
                       {{
                        width: DEVICE_WIDTH*0.95,
                        height: DEVICE_HEIGHT*0.30,
                         //borderWidth: 5,
                         overflow: 'hidden',
                        }}
                    />
                   </TouchableOpacity>
                   ) : (
                    <TouchableOpacity
                       onPress={() => this._onPressHome(item)}>
                       <ImageBackground source={noimageHome}
                          style={{
                            width: DEVICE_WIDTH*0.95,
                            height:(Platform.OS === 'ios') ? DEVICE_HEIGHT*0.33 :DEVICE_HEIGHT*0.32,
                            //borderWidth: 1,
                            overflow: 'hidden',
                           }}>
                       </ImageBackground>
                   </TouchableOpacity>
                  )}

                  <View style={{flex:1, flexDirection:'row', marginLeft:8}}>
                       <ImageBackground source={location_icn}
                         style=
                         {{
                            marginTop:DEVICE_HEIGHT*0.019,
                            // width: 14,
                            // height: 20,
                            width: 19,
                            height: 27,
                            //marginLeft: 8,
                         }}>
                       </ImageBackground>
                       <Text
                           style=
                             {{
                              marginLeft: DEVICE_WIDTH * 0.03,
                              borderRadius: 40,
                              fontSize:18, 
                              marginTop:(Platform.OS === 'ios') ? DEVICE_HEIGHT*0.022 : DEVICE_HEIGHT*0.019,
                              fontWeight:'bold' 
                              }}>
                            {item.name}
                        </Text>
                  </View>
              </View>
          )}
              keyExtractor={(item, index) => index.toString()}
          />

                ):(
                   <FlatList bounces={false}
                      numColumns={2}
                        // showsHorizontalScrollIndicator={true}
                        // horizontal={false}
                        //data={vilagesData}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={this.state.CityList}
                        renderItem={({ item, index }) => (
                       <View 
                          style=
                          {{
                             width: DEVICE_WIDTH*0.46,
                            // height: 190,
                             height: DEVICE_HEIGHT*0.38,
                             borderWidth: 2,
                             //margin: 2,
                             //marginLeft:11,
                             //marginTop:5,
                             //marginBottom:5,
                             margin:5,
                             borderTopLeftRadius: 20,
                             borderTopRightRadius: 20,
                             borderBottomLeftRadius: 20,
                             borderBottomRightRadius: 20,
                             overflow: 'hidden',
                             borderColor: '#ecf0f1',
                           }}>
                      
                          {item.imageName != null ? (
                           
                          <TouchableOpacity
                             // onPress={this._onPressHome}>
                              onPress={() => this._onPressHome(item)}>
                             <Image
                              //onPress={() => this.setState({ activeSlide: index })}
                              //source={item.src} // Use item to set the image source
                              //source={{ uri: Constant.CityImage_Url + item.imageName }}
                              source={{ uri: item.imageName }}
                              key={index} // Important to set a key for list items
                              style=
                               {{
                                width: DEVICE_WIDTH*0.46,
                                height:(Platform.OS === 'ios') ? DEVICE_HEIGHT*0.33 :DEVICE_HEIGHT*0.32,
                                 //borderWidth: 5,
                                 overflow: 'hidden',
                                }}
                            />
                           </TouchableOpacity>
                           ) : (
                            <TouchableOpacity
                               onPress={() => this._onPressHome(item)}>
                               <ImageBackground source={noimageHome}
                                  style={{
                                    width: DEVICE_WIDTH*0.46,
                                    height:(Platform.OS === 'ios') ? DEVICE_HEIGHT*0.33 :DEVICE_HEIGHT*0.32,
                                    //borderWidth: 1,
                                    overflow: 'hidden',
                                   }}>
                               </ImageBackground>
                           </TouchableOpacity>
                          )}

                          <View style={{flex:1, flexDirection:'row', marginLeft:8}}>
                               <ImageBackground source={location_icn}
                                 style=
                                 {{
                                  marginTop:DEVICE_HEIGHT*0.01,
                                    width: 16,
                                    height: 22,
                                 }}>
                               </ImageBackground>
                               <Text
                                   style=
                                     {{
                                       marginLeft: DEVICE_WIDTH * 0.015,
                                       borderRadius: 40,
                                       fontSize:18, 
                                       marginTop:DEVICE_HEIGHT*0.0085,
                                       fontWeight:'bold' 
                                      }}>
                                    {item.name}
                                </Text>
                          </View>
                      </View>
                  )}
                      keyExtractor={(item, index) => index.toString()}
                  />
                ))
            )}
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

//   viewButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#4b9445',
//     height: 25,
//     width:60,
//     borderRadius: 10,
//     zIndex: 100,
//     textAlign: 'center',
//     position: 'absolute',
//     marginTop: DEVICE_HEIGHT * 0.485,
//     marginLeft: DEVICE_WIDTH * 0.59,
//   },

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
    alignItems: 'center',
    justifyContent: 'center', 
    //alignItems: 'center',
  },

//   button: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#4b9445',
//     height: MARGIN,
//     borderRadius: 20,
//     zIndex: 100,
//   },

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

