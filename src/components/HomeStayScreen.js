import React, {Component, useState, useEffect } from 'react';
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
  FlatList,
  ScrollView ,
  TouchableWithoutFeedback,
  SafeAreaView,
  VirtualizedList,
  ImageBackground,
  TouchableHighlight,
  StatusBar,
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
import {Actions, ActionConst} from 'react-native-router-flux';

import { showMessage, hideMessage } from "react-native-flash-message";
import Constant from './Constant';
import Wallpaper from './Wallpaper';
import Logo from './Logo';
import AsyncStorage from '@react-native-community/async-storage';
import { Value } from 'react-native-reanimated';
const MARGIN = 40;
import mapIcon from '../images/map.png';
import homeStayIcon from '../images/homestay.png';
import hostIcon from '../images/host.png';
import qrcodeIcon from '../images/qrcode.png';
import noimage from '../images/noimage.png';
import backIcon from '../images/back.png';
import Lightbox from 'react-native-lightbox';
import { NavigationActions } from 'react-navigation';
import Slideshow from 'react-native-image-slider-show';
import NetInfo from "@react-native-community/netinfo";
import OfflineData from "./OfflineData"
import Spinner from 'react-native-loading-spinner-overlay';
import galleryClose from '../images/close-btn.png';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


export default class LocationDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
      isLoading: true,
      title:'',
      address:'',
      descrption:'',
      //only use back to location details page use locationId
      //locationId:this.props.id,
      locationId:this.props.navigation.getParam('id'),
      mainImgName:'',
      homeStayImages:[],
      imageName:'',
      // homeStayId:'',
      homeStayId:this.props.navigation.getParam('homeStayId'),
      sliderDataSource: [],
      sliderPosition:0,
      showGallery:false,
    };

    this._GetHomeStayData = this._GetHomeStayData.bind(this);
    this.showPass = this.showPass.bind(this);
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
  }

    componentDidMount() 
    {
      StatusBar.setHidden(true);
      this._GetHomeStayData();
    }
    componentDidUpdate(prevProps) {
      //console.log(this.state.id+"Test componentDidUpdate");
      if(this.props.navigation.getParam('homeStayId')!==prevProps.navigation.getParam('homeStayId')){
        //console.log("Test if:"+this.props.navigation.getParam('id'));
        this.setState({
          title: '',
          address: '',
          descrption: '',
          mainImgName: '',
          homeStayImages:'',
          isLoading:true,
        })
        this._GetHomeStayData();
     }
     //this.scrollView.scrollTo({x: 0, y: 0, animated: true})
    }


  showPass() {
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false});
  }

  _GetHomeStayData() {
        NetInfo.fetch().then(state => 
        {
          if (state.isConnected && !OfflineData.isOfflineMode) 
          {
              //console.log(this.state.homeStayId+'home stay hgjhgj   gjjh id');
              // fetch(Constant.API_URL + "locations/gethomestaybyid?homestayId=" +this.state.homeStayId,{
              fetch(Constant.API_URL + "locations/gethomestaybyid?homestayId=" +this.props.navigation.getParam('homeStayId'),{
                method: 'GET',
                })
                .then((response) =>{ 
                  const statusCode = response.status;
                  const result = response.json();
                  return Promise.all([statusCode, result]);
                })
              .then(([res, result]) => {
                    this.setState({
                      title: result.title,
                      address: result.address,
                      descrption: result.descrption,
                      //mainImgName:result.mainImgName,
                      mainImgName: Constant.Gallery_HomeStay_MainImage_Images_URL + result.mainImgName,
                      homeStayImages:result.homeStayImages,
                     // isLoading:false,
                    })
                    setTimeout(()=>this.setState({isLoading:false}),1000)
                    let tempArray = [];
                    for (let locationImg of result.homeStayImages) {
                      locationImg.imageName = Constant.Gallery_HomeStay_Images_URL + locationImg.imageName;
                      tempArray.push({
                        title: '',
                        caption: '',
                        url: locationImg.imageName,
                      });
                    }
                    //console.log(tempArray);
                    this.setState({
                      sliderDataSource:tempArray,
                    });
                })
            }
            else{
              (async () => {             
                var arryLocationData=[];
                var homestayData = await OfflineData.getOfflineData("homeStayList");
                if(homestayData === null || homestayData === undefined)
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
                      var homestayLocalData= homestayData.filter(obj => obj.id == this.props.navigation.getParam('homeStayId'));
                      let result=homestayLocalData[0];
                      //console.log(result);
                      //console.log(Constant.Gallery_HomeStay_MainImage_Images_URL_Local + result.mainImgName);
                       this.setState({
                        title: result.title,
                        address: result.address,
                        descrption: result.descrption,
                        mainImgName: Constant.FileDisplay_Prefix_Local + Constant.Gallery_HomeStay_MainImage_Images_URL_Local + result.mainImgName,
                        homeStayImages:result.homeStayImages,
                      //  isLoading:false,
                      })
                      setTimeout(()=>this.setState({isLoading:false}),1000)
                      let tempArray = [];
                      for (let locationImg of result.homeStayImages) {
                        locationImg.imageName = Constant.FileDisplay_Prefix_Local + Constant.Gallery_HomeStay_Images_URL_Local + locationImg.imageName;
                        tempArray.push({
                          title: '',
                          caption: '',
                          url: locationImg.imageName,
                        });
                      }
                      //console.log(tempArray);
                      this.setState({
                        sliderDataSource:tempArray,
                      });
                      
                 }
               })();
            }
       });  
  }

  backTolocationdetails()
  {
     //Actions.locationDetailsScreen({id:this.state.locationId});
     const navigateAction = NavigationActions.navigate({ routeName: 'LocationDetailsScreen',params: { id: this.props.navigation.getParam('id') }  });
     this.props.navigation.dispatch(navigateAction);
  }

  showGallerySlider(index)
  {
    this.setState({ 
      showGallery:true,
    })
    setTimeout(() => {
      this.setState({ 
        sliderPosition: index,
      })
    }, 200);
  };

  hideGallerySlider()
  {
    this.setState({ 
      sliderPosition: 0,
      showGallery:false,
    })
  };

  render() 
  {
      // var homeStayId=this.props.homeStayId;
      // this.state.homeStayId=homeStayId;

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
          {!this.state.showGallery?(
         <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <Spinner visible={this.state.isLoading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
            overlayColor='white' // overlay of Loader(spiner made white)
            color='green'
            />
           <ScrollView bounces={false}>
              <View>
                  <View>
                    <Lightbox 
                    springConfig={{tension: 900000, friction: 900000}}
                    underlayColor="white" renderContent={()=> {
                            return(
                                    <Image
                                    // source={{uri: Constant.Gallery_HomeStay_MainImage_Images_URL + this.state.mainImgName}}
                                    source={{uri: this.state.mainImgName}}
                                    style={{ height: DEVICE_HEIGHT, }}
                                    resizeMethod="resize"
                                  // resizeMode="cover"
                                    resizeMode="contain"
                                    />
                                  )
                              }}>
                          {/* <ImageBackground  source={{uri: Constant.Gallery_HomeStay_MainImage_Images_URL + this.state.mainImgName}} */}
                          <ImageBackground  source={{uri: this.state.mainImgName}}
                                      style={{ 
                                        height:DEVICE_HEIGHT*0.56,
                                        marginBottom:10,
                                        overflow: 'hidden',
                                  }}>
                                {/* <View style={{flex:1, flexDirection:'row'}}>
                                    <TouchableOpacity onPress={() => this.backTolocationdetails(this.state.locationId)} activeOpacity={1}>
                                          <Image source={backIcon}
                                                style={{ width: 40, height: 40, marginLeft: DEVICE_WIDTH * 0.013,
                                                borderRadius: 40, marginTop:DEVICE_HEIGHT*0.01 }}/>
                                    </TouchableOpacity>
                                </View> */}
                          </ImageBackground>
                    </Lightbox>

                    {this.state.title.length>20 ? (
                    <Text style={styles.nameStyle}>{this.state.title.substring(0,20) + '..'}</Text>
                        ) : (
                            <Text style={styles.nameStyle}>{this.state.title}</Text>
                        )}
                 </View>
                  <View>
                        <Text style={styles.text}>Overview</Text>
                        <Text style={styles.subtext}>{this.state.descrption}</Text>
                  </View>
                  <View>
                      <Text style={styles.text}>Address</Text>
                      <Text style={styles.subtext}>{this.state.address}</Text>
                  </View>
                  <View style={{ borderBottomColor: '#999999', borderBottomWidth: 1, marginLeft:10, marginRight:10, paddingTop:10}}/>
                  <View style={styles.MainContainer}>
                      <Text style={styles.text}>Photos</Text>
                        <FlatList
                            horizontal={true} 
                            showsHorizontalScrollIndicator={false} 
                            //data={vilagesData}
                            data={this.state.homeStayImages}
                            renderItem={ ({ item, index }) => (
                                <View>
                                      {/* <Lightbox underlayColor="white" renderContent={()=> {
                                            return(
                                              <Image
                                                  source={{uri: Constant.Gallery_HomeStay_Images_URL + item.imageName}}
                                                  style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT }}
                                                  resizeMode='center'
                                                        />
                                                      )
                                                  }}> */}
                                            <TouchableWithoutFeedback onPress={() => this.showGallerySlider(index)}  activeOpacity={1}>
                                               <Image 
                                                // source={{uri: Constant.Gallery_HomeStay_Images_URL + item.imageName}}
                                                source={{uri: item.imageName}}
                                                key={index} // Important to set a key for list items
                                                style={{
                                                  width:120,
                                                  height:80,
                                                  //borderWidth:2,
                                                  // borderColor:'#d35647',
                                                  // resizeMode:'contain',
                                                  margin:6,
                                                  borderTopLeftRadius: 20,
                                                  borderTopRightRadius: 20,
                                                  borderBottomLeftRadius: 20,
                                                  borderBottomRightRadius: 20,
                                                  overflow: 'hidden',
                                              }}
                                            />
                                        </TouchableWithoutFeedback>
                                     {/* </Lightbox>  */}
                              </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                  </View>
             </View>
          </ScrollView> 
         </KeyboardAvoidingView>
           )
           :
           (
          <View>
                 <TouchableOpacity onPress={() => this.hideGallerySlider()} activeOpacity={1}
                  // style={{height:DEVICE_HEIGHT*0.105}}
                  >
                   {/* <Text style={{color:'green', textAlign: 'right', marginTop:DEVICE_HEIGHT*0.029, marginRight:10, fontSize:18, fontWeight:'bold'}}>Close</Text> */}
                  
                   <Text style={{ width:130, color:'white', backgroundColor:'green',paddingTop:(Platform.OS === 'ios')?8:4 ,
               borderRadius:8, marginTop:8,  height:31, textAlign: 'center',alignSelf: 'flex-end',
                 marginRight:10, fontSize:15, fontWeight:'bold'}}>X  Close Gallery</Text>
                   {/* <Image source={galleryClose} style={{ margin:10, alignSelf: 'flex-end'}} /> */}
                 </TouchableOpacity>
                 <View style={{
                   //display: 'flex',
   //flexDirection: 'column',
   justifyContent: 'center', 
   alignItems: 'center',
   marginTop:DEVICE_HEIGHT*0.18
                 }}>
                 <Slideshow 
                   //height = {300}
                   //height={DEVICE_HEIGHT*0.75}
                   height={DEVICE_HEIGHT*0.32}
                   dataSource={this.state.sliderDataSource}
                   position={this.state.sliderPosition}
                   scrollEnabled={false}
                   onPositionChanged={sliderPosition => this.setState({ sliderPosition })}/>
              </View>
              <View style={{height:DEVICE_HEIGHT*0.13}}></View>
            </View>
          )}
      </Wallpaper>
   );
  }
}

const styles = StyleSheet.create({
 
  HedingText: {
    alignItems: 'center',
    justifyContent: 'center',
    width: DEVICE_WIDTH - 40,
    height: 40,
    marginHorizontal: 30,
    paddingLeft: 50,
    color: 'green',
    backgroundColor: 'transparent',
    fontSize:20,
  
  },

  secondContainer: {
    overflow: 'hidden',
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondStyle:{
     margin:DEVICE_WIDTH*0.035,
     fontSize:14,
     alignItems: 'center',
     fontWeight:"bold",
},


  nameStyle:{
    fontSize:20,
    color:'black',
    fontWeight:'bold',
    textAlign: 'center',
    position: 'absolute',
    marginTop:DEVICE_HEIGHT*0.49,
    color:'white',
    marginLeft: DEVICE_WIDTH*0.04,
},


viewButton:{
  position: 'absolute',
  marginTop:DEVICE_HEIGHT*0.49,
  marginLeft: DEVICE_WIDTH*0.75,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#4b9445',
  height: 28,
  width:65,
  borderRadius: 10,
  zIndex: 100,
  textAlign: 'center',
},

viewOrangeButton:{
  position: 'absolute',
  marginTop:DEVICE_HEIGHT*0.49,
  marginLeft: DEVICE_WIDTH*0.75,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'orange',
  height: 28,
  width:72,
  borderRadius: 10,
  zIndex: 100,
  textAlign: 'center',
},

mapStyle:{
   fontSize:11,
   alignItems: 'center',
  // color:'black',
  // marginTop:5,
  // color:'black',
  // marginLeft: 30,
},

nearAboutText:{
  fontSize:11,
  alignItems: 'center',
  textAlign: 'center',
},

  container: {
    flex: 1,
    //alignItems: 'center',
  },
  btnEye: {
    position: 'absolute',
    top: 58,
    right: 28,
  },
  iconEye: {
    width: 25,
    height: 25,
  //  tintColor: 'rgba(0,0,0,0.2)',
  },
  // HedingText: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderRadius: 20,
  //   zIndex: 100,
  // },

  containerSubmit: {
    flex: 1,
    top: 25,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4b9445',
    height: MARGIN,
    borderRadius: 20,
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
    marginTop:10,
    fontSize:20,
    color: 'black',
    marginLeft: 10,
    backgroundColor: 'transparent',
    fontWeight:'bold',
  },

  subtext: {
    marginTop:10,
    fontSize:15,
    //color: 'white',
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'transparent',
  },

  image: {
    width: 40,
    height: 40,
  },

  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: DEVICE_WIDTH - 40,
    height: 40,
    marginHorizontal: 20,
    paddingLeft: 45,
    borderRadius: 20,
    color: '#000000',
    borderColor: '#FF0000',
  },
  inputWrapper: {
    flex: 1,
  },
  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: 35,
    top: 9,
  },
});

