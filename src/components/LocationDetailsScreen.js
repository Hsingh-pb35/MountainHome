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
  StatusBar,
  Platform
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
import galleryClose from '../images/close-btn.png';
import { Actions, ActionConst } from 'react-native-router-flux';

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
import chekOutIcon from '../images/checkout.png';
import noimage from '../images/noimage.png';
import backIcon from '../images/back.png';
import Lightbox from 'react-native-lightbox';
import { StackActions, NavigationActions } from 'react-navigation';
import { BackHandler } from 'react-native';
import Slideshow from 'react-native-image-slider-show';
//import checkInIcon from '../images/check-in.png';
import checkInIcon from '../images/checkinIcon.png';
import covidIcon from '../images/covidicon.png';
import NetInfo from "@react-native-community/netinfo";
import OfflineData from "./OfflineData"


const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


export default class LocationDetailsScreen extends Component {
 
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      showPass: true,
      press: false,
      isLoading: true,
      cityId:this.props.navigation.getParam('cityId'),
      ItemId: '',
      name: '',
      address: '',
      descrption: '',
      mainImage: '',
      mapImgName: '',
      lstLocationImages: [],
      imageName: '',
      itemList: [],
      itemName: '',
      id: this.props.navigation.getParam('id'),
      Userid: '',
      IsAlreadyRequested: 'false',
      RequestStatus: '',
      homeStayId: '',
      status: '',
      IsCheckIn: '',
      IsDeclaration:'',
      IsCheckOut: '',
      checkInDate: '',
      checkOutDate: '',
      QRCodeImage: '',
      activeSlide: [],
      today: new Date(),
      sliderDataSource: [],
      sliderPosition:0,
      showGallery:false,
      sliderTitle:'',
      sliderDesc:'',
      offlineMode:false,
      isSpinner:true,
      //sliderDataSource: [{"caption": "", "title": "", "url": "http://139.59.6.220/AppImages/Location/85bb49c3-e5f4-452a-b253-83fd05b1a0b7.jpg"}, {"caption": "", "title": "", "url": "http://139.59.6.220/AppImages/Location/d1019f16-7556-4674-8409-360473e2ebe2.jpg"}, {"caption": "", "title": "", "url": "http://139.59.6.220/AppImages/Location/73d9939a-0aa5-4bab-b038-fe6518650b19.jpg"}]
    };

    AsyncStorage.getItem("id").then((value) => {
      this.setState({
        Userid: value
      })
      //this._GetLocationDataByUserIdandLocationId();
    });


    this._GetUserData = this._GetUserData.bind(this);
    this.showPass = this.showPass.bind(this);
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
  }

  componentDidMount() {

    console.log('first time LocationDetails');

    if(this.state.isSpinner === true)
    {
       setTimeout(()=>this.setState({isSpinner:false}),1000)
     
    }

     StatusBar.setHidden(true);
         //console.log(this.state.id+"Testt");
    //console.log(this.state.cityId+"cityId Testt");
    //  console.log(this.state.id+'cccjjjj');
    this._GetUserData();

  }
  
  componentDidUpdate(prevProps) {
      //console.log(this.state.id+"Test componentDidUpdate");
    if(this.props.navigation.getParam('id')!==prevProps.navigation.getParam('id')){
      //console.log("Test if:"+this.props.navigation.getParam('id'));
      //this._GetUserData();
   }
   if (prevProps.navigation !== this.props.navigation) {

     //this.setState({isLoading:true})

     this.state.isSpinner=true;
     setTimeout(()=>this.setState({isSpinner:false}),1000)

    

      this.setState({
        name: "",
        address: "",
        descrption: "",
        mainImage: "", 
        mapImgName: "",
        ItemId: "",
        lstLocationImages: "",
        status: "",
        isLoading:true,
        RequestStatus: '',
        IsAlreadyRequested: 'false',
        itemList: [],
        lstLocationImages: [],
      })
     
      // check for 
      NetInfo.fetch().then(state => 
      {
          if (state.isConnected && !OfflineData.isOfflineMode) 
          {
              OfflineData.sendDecalartionFormToServer();
              OfflineData.sendCheckinFormToServer();
              OfflineData.sendCheckoutFormToServer();
          }
      });

      this._GetUserData();
      this.setState({
        showGallery:false,
        });      
    }
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
    //const navigateAction = NavigationActions.navigate({ routeName: 'Home',params: { cityId: this.props.navigation.getParam('cityId'),title:this.props.navigation.getParam('cityname','Village List') }  });
    //this.props.navigation.dispatch(navigateAction);
  }

  showPass() {
    this.state.press === false
      ? this.setState({ showPass: false, press: true })
      : this.setState({ showPass: true, press: false });
  }

  actionOnRow = (item) => {
    //Alert.alert(this.state.id);
    //Actions.locationItemScreen({ selectedItemId: item.id });
    //console.log( item.id);
    const navigateAction = NavigationActions.navigate({ routeName: 'LocationItemScreen',params: { selectedItemId: item.id, title:item.itemName }  });
    this.props.navigation.dispatch(navigateAction);
  };

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

  _GetUserData() {
    NetInfo.fetch().then(state => 
    {
        if (state.isConnected && !OfflineData.isOfflineMode) 
        {
              this.setState({offlineMode:false});
              //console.log(this.state.id+"this.state.id");
              //   var id=this.state.id;
              fetch(Constant.API_URL + "locations/location?locationId=" + this.props.navigation.getParam('id'), {
                method: 'GET',
              })
                .then((response) => {

                  // console.log(response.status);
                  const statusCode = response.status;
                  const result = response.json();
                  

                  return Promise.all([statusCode, result]);
                })
                .then(([res, result]) => {
                  this.assignLocationData(result,false);
                  
                })
          }
          else
          {
            (async () => {   

              this.setState({offlineMode:true});
              var locationListData = await OfflineData.getOfflineData("locationList");
              //console.log("locationListData:"+locationListData)
              if(locationListData === null || locationListData === undefined)
               {
                   showMessage({
                     message: OfflineData.syncMessage,
                     type: OfflineData.syncMsgType,
                     duration: OfflineData.syncMsgDuration,
                     position: OfflineData.syncMsgPosition,
                   });
                   this.setState({
                    isLoading:false,
                }); 
               }
               else
               {
                  //OfflineData.removeItemValue("declarationData"); 

                  //console.log("location id: "+this.props.navigation.getParam('id'));
                  let userLocationdata = [];
                  locationListData.map((item) => {
                    if(item.length > 0)
                    {
                      var locationDeatil= item.filter(obj => obj.id==this.props.navigation.getParam('id'));
                      if(locationDeatil.length)
                      {
                        userLocationdata=locationDeatil;
                        return;
                      }
                      
                    }
                  });
               
                  if(userLocationdata.length > 0)
                  {
                    this.assignLocationData(userLocationdata[0],true);
                  }
                  else
                  {
                    showMessage({
                      message: "No data found for offline.",
                      type: OfflineData.syncMsgType,
                    });
                    this.setState({
                      isLoading:false,
                  }); 
                  }
                  
                  // Check for Offline decalartion form data
                  var declarationData = await OfflineData.getOfflineData("declarationData");
                    //console.log("declarationData: " + declarationData);
                  if(declarationData != null || declarationData != undefined)
                  {
                        var isValidForCurrentLocation=declarationData.filter(obj=>{
                            //console.log(obj);
                            //console.log(this.state.userTravelRequestId);
                            return obj.UserVisitDetailId==this.state.userTravelRequestId;
                        });

                        //console.log("isValidForCurrentLocation:"+isValidForCurrentLocation);
                        if(isValidForCurrentLocation.length >0 )
                        {
                          this.setState({
                              IsDeclaration: true,   
                          });
                        }
                  }
                  
                  // Check for Offline CheckIn form data
                  var checkInData = await OfflineData.getOfflineData("checkInData");
                  //console.log("checkInData: "+checkInData);
                  if(checkInData != null || checkInData != undefined)
                  {
                      var chekinDataForCurrentLocation=checkInData.filter(obj=>{
                        //console.log(obj);
                        //console.log(this.state.userTravelRequestId);
                        return obj.UserVisitDetailId==this.state.userTravelRequestId;
                      });

                      //console.log("chekinDataForCurrentLocation:"+chekinDataForCurrentLocation);
                      if(chekinDataForCurrentLocation.length >0 )
                      {
                          this.setState({
                            IsCheckIn:true,
                          });
                      }
                  }

                 // Check for Offline Checkout form data
                  var checkOutData = await OfflineData.getOfflineData("checkOutData");
                  //console.log("checkOutData: " + checkOutData);
                  if(checkOutData != null || checkOutData != undefined)
                  {
                      var chekoutDataForCurrentLocation=checkOutData.filter(obj=>{
                        //console.log(obj);
                        //console.log(this.state.userTravelRequestId);
                        return obj.UserVisitDetailId==this.state.userTravelRequestId;
                      });

                      //console.log("chekinDataForCurrentLocation:"+chekinDataForCurrentLocation);
                      if(chekoutDataForCurrentLocation.length >0 )
                      {
                          this.setState({
                            IsCheckOut:true,
                          });
                      }
                  }
                  //console.log("IsCheckOut: " + this.state.IsCheckOut);
              }

              if(this.state.IsDeclaration && this.state.IsCheckIn && this.state.IsCheckOut)
              {
                this.setState({
                  RequestStatus: "Request",
                })
              }

             })();
          }
     });
      }

      assignLocationData(result, isOffline)
      {

        //setTimeout(()=>this.setState({isSpinner:false}),4000);

        //console.log(result);
        this.setState({
          name: result.name,
          address: result.address,
          descrption: result.descrption,
          //mainImage: result.mainImage,
          mainImage: (!isOffline?Constant.Main_Images_URL:Constant.FileDisplay_Prefix_Local + Constant.LocationImage_Url_Local) + result.mainImage, 
          //mapImgName: result.mapImgName,
          mapImgName: (!isOffline?Constant.Map_Images_URL:Constant.FileDisplay_Prefix_Local + Constant.Map_Images_URL_Local) + result.mapImgName,
          ItemId: result.id,
          lstLocationImages: result.lstLocationImages,
          status: result.status
        })
        //console.log(this.state.mainImage);

        if(!isOffline)
        {
          this._GetLocationDataByUserIdandLocationId();
          this.GetItemListData();
        }
        else{
          //console.log("Offline data");
          this._GetLocationDataByUserIdandLocationIdOffline();
          this.GetItemListDataOffline();
        }

        let tempArray=[];
        for (let locationImg of result.lstLocationImages) {
          locationImg.imageName = (!isOffline?Constant.Gallery_Images_URL:Constant.FileDisplay_Prefix_Local + Constant.LocationGalleryImage_URL_Local) + locationImg.imageName;
          tempArray.push({
              title: '',
              caption: '',
              imgTitle: locationImg.title,
              imgDescription: locationImg.descrption,
              url: locationImg.imageName,
          });
          //console.log("tempArray: "+(!isOffline?Constant.Gallery_Images_URL:Constant.FileDisplay_Prefix_Local + Constant.LocationGalleryImage_URL_Local) + locationImg.imageName);
        }
        //console.log("tempArray: "+tempArray);
        this.setState({
          sliderDataSource:tempArray,
        });

        this.setState({
          isLoading:false,
      }); 
    }

  _GetLocationDataByUserIdandLocationId() {
    //console.log(this.state.Userid + "user id");
    //console.log(this.state.id + "location id");
    //Item Loaction Api
    //var id=this.state.ItemId;
    fetch(Constant.API_URL + "travels/gettravellerbyuseridandlocationid?userId=" + this.state.Userid + "&locationId=" + this.props.navigation.getParam('id'), {
      method: 'GET',
    })
      .then((response) => {
        //console.log(response.status);
        const statusCode = response.status;
        const result = response.json();
        return Promise.all([statusCode, result]);
      })
      .then(([res, result]) => {
        //console.log(result.displayVisitStatus);
        this.assignUserTravelData(result, false);
      })
  }

  _GetLocationDataByUserIdandLocationIdOffline() {
    (async () => {     
       //console.log("Offline data _GetLocationDataByUserIdandLocationIdOffline");        
        var locationListData = await OfflineData.getOfflineData("userTravelList");
        var userTravelLocalData= locationListData.filter(item => 
        {
            if(item.userId == this.state.Userid && item.locationId ==  this.props.navigation.getParam('id'))
            {
              //console.log(item);
              return item;
            }
        });
        this.assignUserTravelData(userTravelLocalData[0], true);
     })();
  }

  assignUserTravelData(result, isOffline)
  {
    if (result == null || result.displayVisitStatus == null || result.displayVisitStatus == "Visited" || result.displayVisitStatus == "Rejected" || result.displayVisitStatus == "6") {
      this.setState({
        IsAlreadyRequested: 'false',
        RequestStatus: '',
      })
    }
    else {
      //console.log(result +"test ");
      //console.log("result.IsDeclaration",result.isDeclaration);
      this.setState({
        IsAlreadyRequested: 'true',
        IsCheckIn: result.isCheckIn,
        IsDeclaration: result.isDeclaration,
        IsCheckOut: result.IsCheckOut,
        checkInDate: new Date(result.checkInDate),
        checkOutDate: new Date(result.checkOutDate),
        //QRCodeImage: Constant.QrCode_Images_URL + result.qrCode,
        QRCodeImage: (!isOffline?Constant.QrCode_Images_URL:Constant.FileDisplay_Prefix_Local + Constant.QrCode_Images_URL_Local) + result.qrCode,
        RequestStatus: (result.displayVisitStatus == "Approved" ? result.displayVisitStatus : "Requested"),
        homeStayId: result.homeStayId,
        userTravelRequestId: result.id,
      })
      //console.log("QRCodeImage: "+ this.state.QRCodeImage);
      //console.log("result IsDeclaration",this.state.IsDeclaration);
      // console.log("totalMembers", result.totalMembers);
      AsyncStorage.setItem("UserVisitDetailId", result.id.toString())
      AsyncStorage.setItem("locationId", this.props.navigation.getParam('id').toString())
      AsyncStorage.setItem("totalMembers", result.totalMembers.toString())
    }
  }

  TravelRequested() {
      NetInfo.fetch().then(state => 
      {
          if (state.isConnected && !OfflineData.isOfflineMode) 
          {
            Alert.alert(
              'Travel Request',
              'You have all ready requested a visit for this place.',
            )
         } 
          else
          {
            showMessage({
              message: 
              OfflineData.offlineMessage,
              type: "danger",
            });
            return;
          }
      });
  }

  //your home stay Details Screen
  Sendyourhomestay() {
    const navigateAction = NavigationActions.navigate({ routeName: 'HomeStayScreen',params: {id: this.props.navigation.getParam('id'), homeStayId: this.state.homeStayId, cityId: this.props.navigation.getParam('cityId')}  });
    this.props.navigation.dispatch(navigateAction);
  }

  // your host Details Screen
  YourHost() {
    const navigateAction = NavigationActions.navigate({ routeName: 'HomestayOwner',params: {id: this.props.navigation.getParam('id'), homeStayId: this.state.homeStayId, cityId: this.props.navigation.getParam('cityId') }  });
    this.props.navigation.dispatch(navigateAction);
  }

  //your host Details Screen
  QRCode() {
   //Actions.CheckInForm({ id: this.props.navigation.getParam('id'), homeStayId: this.state.homeStayId });

  const navigateAction = NavigationActions.navigate({ routeName: 'CheckInForm',params: {Userid: this.state.Userid, id: this.props.navigation.getParam('id'), homeStayId: this.state.homeStayId, cityId: this.props.navigation.getParam('cityId') }  });
  this.props.navigation.dispatch(navigateAction);

  }

  //your host Details Screen
  CovidForm() {
    //Actions.COVIDDeclarationForm();
       const navigateAction = NavigationActions.navigate({ routeName: 'COVIDDeclarationForm',params: {Userid: this.state.Userid, id: this.props.navigation.getParam('id'), homeStayId: this.state.homeStayId}  });
      this.props.navigation.dispatch(navigateAction);
    }

  //form to redirect to checkout form
  checkOutForm() {
    
    console.log(this.state.checkInDate+"  check In Date");
    //Actions.CheckOutForm({ id: this.props.navigation.getParam('id'), homeStayId: this.state.homeStayId });
    // const navigateAction = NavigationActions.navigate({ routeName: 'CheckOutForm',params: { id: this.props.navigation.getParam('id'), homeStayId: this.state.homeStayId,checkInDate:this.state.checkInDate }  });
    // this.props.navigation.dispatch(navigateAction);
    const navigateAction = NavigationActions.navigate({ routeName: 'CheckOutForm',params: { Userid: this.state.Userid,id: this.props.navigation.getParam('id'), homeStayId: this.state.homeStayId,checkInDate:this.state.checkInDate }  });
    this.props.navigation.dispatch(navigateAction);
    
}
  

 // function for changing scrolltate



  GetItemListData() {
    //Item Loaction Api
    // var id=this.state.ItemId;
    fetch(Constant.API_URL + "locations/locationitems?locationId=" + this.props.navigation.getParam('id'), {
      method: 'GET',
    })
      .then((response) => {

        //   console.log(response.status);
        const statusCode = response.status;
        const result1 = response.json();
        return Promise.all([statusCode, result1]);
      })

      .then(([res, result1]) => {
        //console.log(result1+'result1');
        result1.map((data) => {
          data.mainImage= Constant.Main_Images_Item_URL + data.mainImage;
        });

        this.setState({
          itemList: result1,
        })
      })
  }

  GetItemListDataOffline() {
    (async () => {       
          //console.log("Offline data GetItemListDataOffline"); 
          var arryCityData=[];     
          var locationItemListData = await OfflineData.getOfflineData("locationItemsList");
          var locationItemLocalData = locationItemListData.filter(obj => 
          {
            //console.log("obj:" +obj);
             return obj.locationId === this.props.navigation.getParam('id');
          }); 

          locationItemLocalData.map((data) => {           
            //console.log("data: " + data)
            data.mainImage= Constant.FileDisplay_Prefix_Local + Constant.LocationItemImage_URL_Local + data.mainImage;
            arryCityData.push(data);
          });

          //console.log("arryCityData" + arryCityData);

          this.setState({
            itemList: arryCityData,
          })
      
   })();

  }


  SendTravelRequest() {

      NetInfo.fetch().then(state => 
      {
          if (state.isConnected && !OfflineData.isOfflineMode) 
          {
            Alert.alert(
              "Travel Request",
              "Are you sure you want to visit this location?",
              [
                // {
                //   text: "Ask me later",
                //   onPress: () => console.log("Ask me later pressed")
                // },
                {
                  text: "Yes",
                  onPress: () => {
                    //Actions.travelRequestScreen({ locationId: this.props.navigation.getParam('id'), locationName: this.state.name, Address: this.state.address });
                    const navigateAction = NavigationActions.navigate({ routeName: 'TravelRequestScreen',params: { locationId: this.props.navigation.getParam('id'), locationName: this.state.name, Address: this.state.address}  });
                    this.props.navigation.dispatch(navigateAction);
                  },
                },
                {
                  text: "No",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
              ],
              { cancelable: false }
            );
        }
          else
          {
            showMessage({
              message: 
              OfflineData.offlineMessage,
              type: "danger",
            });
            return;
          }
      });

  };

  backToHome() {
    // const navigateAction = NavigationActions.navigate({ routeName: 'CityScreen',params: { cityId: item,title:statename }  });
    // this.props.navigation.dispatch(navigateAction);
    //console.log(this.props.navigation.getParam('cityname'));
    //console.log(this.props.navigation.getParam('cityId'));
    const navigateAction = NavigationActions.navigate({ routeName: 'Home',params: { cityId: this.props.navigation.getParam('cityId'),title:this.props.navigation.getParam('cityname','Village List') }  });
    this.props.navigation.dispatch(navigateAction);
  };

  toggleQRImage() {
    alert();
  };

  showGallerySlider(index)
  {
    this.setState({ 
      showGallery:true,
    })
    setTimeout(() => {
      this.setState({ 
        sliderPosition: index,
        sliderTitle:this.state.sliderDataSource[index].imgTitle,
      sliderDesc:this.state.sliderDataSource[index].imgDescription,
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

  galleryPostionChanged = (position) => {
    this.setState({ 
      sliderPosition:position, 
      //sliderTitle:'Test title'+ position,
      //sliderDesc:'Test Description' + position
      sliderTitle:this.state.sliderDataSource[position].imgTitle,
      sliderDesc:this.state.sliderDataSource[position].imgDescription,
    });
 }

  // get pagination() {
  //   const { entries, activeSlide } = this.state.lstLocationImages;
  //   return (
  //     <Pagination
  //       dotsLength={entries.length}
  //       activeDotIndex={activeSlide}
  //       containerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
  //       dotStyle={{
  //         width: 10,
  //         height: 10,
  //         borderRadius: 5,
  //         marginHorizontal: 8,
  //         backgroundColor: 'rgba(255, 255, 255, 0.92)'
  //       }}
  //       inactiveDotStyle={{
  //         // Define styles for inactive dots here
  //       }}
  //       inactiveDotOpacity={0.4}
  //       inactiveDotScale={0.6}
  //     />
  //   );
  // }

  render() {
    // this.setState({
    //   id: this.props.navigation.getParam('id'),
    //   cityId:this.props.navigation.getParam('cityId'),
    // })
    //  console.log(this.props.cityId+'city Id');

    //  var cityId=this.props.cityId;
    //  this.state.cityId=cityId;
    //  console.log( this.state.cityId+' this.state.cityId');

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
      <ScrollView bounces={false} style={{maxWidth:DEVICE_WIDTH}} >
          {/*Spinner*/}

      <View style={styles.container}>
        <Spinner visible={this.state.isSpinner}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle} 
            overlayColor='white' // overlay of Loader(spiner made white)
            color='green'
            />
       </View>

            <View>
              <View>
                <Lightbox 
                springConfig={{tension: 900000, friction: 900000}}
                underlayColor="white" renderContent={() => {
                  return (
                    <Image
                      //source={{ uri: Constant.Main_Images_URL + this.state.mainImage }}
                      source={{ uri: this.state.mainImage }}
                      style={{ height: DEVICE_HEIGHT, 
                        //marginTop:DEVICE_HEIGHT*0.21 
                      }}
                      //resizeMode='center'
                       resizeMethod="resize"
                    //  // resizeMode="cover"
                       resizeMode="contain"
                    />
                  )
                }}>
                  <ImageBackground 
                    //source={{ uri: Constant.Main_Images_URL + this.state.mainImage }}
                    source={{ uri: this.state.mainImage }}
                    style={{
                      height: DEVICE_HEIGHT * 0.56,
                      marginBottom: 10,
                      overflow: 'hidden',
                    }}>
                    {/* <View style={{ flex: 1, flexDirection: 'row' }}>
                      <TouchableOpacity onPress={() => this.backToHome()} activeOpacity={1}>
                        <Image source={backIcon}
                          style={{
                            width: 40, height: 40, marginLeft: DEVICE_WIDTH * 0.013,
                            borderRadius: 40, marginTop: DEVICE_HEIGHT * 0.015
                          }} />
                      </TouchableOpacity>
                    </View> */}
                  </ImageBackground>
                </Lightbox>

                {/* {this.state.name.length > 20 ? (
                  <Text style={styles.nameStyle}>{this.state.name.substring(0, 20) + '..'}</Text>
                ) : (
                    <Text style={styles.nameStyle}>{this.state.name}</Text>
                  )} */}

                {this.state.IsAlreadyRequested == "false" ? (

                  <TouchableOpacity
                    style={styles.viewButton}
                    // onPress={this.SendTravelRequest}
                    onPress={() => this.SendTravelRequest(this.props.navigation.getParam('id'), this.state.name, this.state.address)}
                    activeOpacity={2}
                  >
                    <Text style={{ color: 'white', backgroundColor: 'transparent' }}>Request</Text>
                  </TouchableOpacity>

                ) : (
                      (this.state.IsCheckIn && this.state.IsDeclaration && !this.state.IsCheckOut) ? (        

                        <TouchableOpacity
                        style={styles.viewCheckoutButton}
                        onPress={() => this.checkOutForm(this.state.homeStayId, this.props.navigation.getParam('id'))}
                        activeOpacity={2}
                        >
                        <Text style={{ color: 'white', backgroundColor: 'transparent' }}>Check Out</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                        style={this.state.IsCheckOut?styles.viewButton:styles.viewOrangeButton}
                        onPress={() => this.TravelRequested()}
                        activeOpacity={2}
                      >
                        <Text style={{ color: 'white', backgroundColor: 'transparent' }}>{this.state.RequestStatus}</Text>
                      </TouchableOpacity>

                      )

                  )}


                {/* <TouchableOpacity
                  style={styles.viewButton}
                  // onPress={this.SendTravelRequest}
                  onPress={ () => this.SendTravelRequest(this.state.id,this.state.name,this.state.address)}
                  activeOpacity={2}
                  >
                  <Text style={{color: 'white', backgroundColor: 'transparent'}}>Request</Text>
            </TouchableOpacity> */}


              </View>

              {this.state.RequestStatus == "Approved" ? (
                <View style={styles.secondContainer}>

                  <Lightbox 
                   springConfig={{tension: 900000, friction: 900000}}
                  //swipeToDismiss={false}
                  underlayColor="white" renderContent={() => {
                    return (
                      <Image
                      //fadeDuration={10}
                        //source={{ uri: Constant.Map_Images_URL + this.state.mapImgName }}
                        source={{ uri: this.state.mapImgName }}
                        style={{ 
                          height: DEVICE_HEIGHT, 
                          //marginTop:DEVICE_HEIGHT*0.19 
                        }}
                        //resizeMode='center'
                        resizeMethod="resize"
                        resizeMode="contain"
                      />
                    )
                  }}>
                    
                    <View style={styles.secondStyle}>
                      <ImageBackground source={mapIcon}
                        // style={{
                        //   width: 40,
                        //   height: 40,
                        // }}
                        style={styles.image}
                        >
                      </ImageBackground>
                      <Text style={styles.mapStyle}>Map</Text>
                    </View>
                  </Lightbox>

                  <TouchableOpacity
                    onPress={() => this.Sendyourhomestay(this.state.homeStayId, this.props.navigation.getParam('id'))}
                    activeOpacity={2}
                  >
                    <View style={styles.secondStyle}>
                      <Image source={homeStayIcon} style={styles.image} />
                      <Text style={styles.mapStyle}>Your Homestay</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.YourHost(this.state.homeStayId, this.props.navigation.getParam('id'))}
                    activeOpacity={2}
                  >
                    <View style={styles.secondStyle}>
                      <Image source={hostIcon} style={styles.image} />
                      <Text style={styles.mapStyle}>Your Host</Text>
                    </View>
                  </TouchableOpacity >

                  {this.state.IsDeclaration ? (
                   this.state.IsCheckIn ? (
                    //console.log(this.state.IsCheckIn),
                    <Lightbox 
                    springConfig={{tension: 900000, friction: 900000}}
                    underlayColor="white" renderContent={() => {
                      return (
                        <Image
                          //source={{ uri: Constant.QrCode_Images_URL + this.state.QRCodeImage }}
                          source={{ uri: this.state.QRCodeImage }}
                          style={{ height: DEVICE_HEIGHT, 
                            //marginTop:DEVICE_HEIGHT*0.13 
                          }}
                          //resizeMode='center'
                          resizeMethod="resize"
                          //resizeMode="cover"
                          resizeMode="contain"
                        />
                      )
                    }}>
                      <View style={styles.secondStyle}>
                        <ImageBackground source={qrcodeIcon}
                          // style={{
                          //   width: 40,
                          //   height: 40,
                          // }}
                          style={styles.image}
                          >
                        </ImageBackground>
                        <Text style={styles.mapStyle}>QR Code</Text>
                      </View>
                    </Lightbox>

                  // ) : (<TouchableOpacity
                  //   onPress={() => this.QRCode(this.state.homeStayId, this.props.navigation.getParam('id'))}
                  //   activeOpacity={2}
                  // >
                  //   <View style={styles.secondStyle}>
                  //     <Image source={checkInIcon} style={styles.image} />
                  //     <Text style={styles.mapStyle}>Check In</Text>
                  //   </View>
                  // </TouchableOpacity >)}
                  
                  ) : (
                   
                    <TouchableOpacity
                      onPress={() => this.QRCode(this.state.homeStayId, this.props.navigation.getParam('id'))}
                      activeOpacity={2}
                    >
                      <View style={styles.secondStyle}>
                        <Image source={checkInIcon} style={styles.image} />
                        <Text style={styles.mapStyle}>Check In</Text>
                      </View>
                    </TouchableOpacity >
                    
                   )):(
                   
                    <TouchableOpacity
                    onPress={() => this.CovidForm(this.state.homeStayId, this.props.navigation.getParam('id'))}
                    activeOpacity={2}
                  >
                    <View style={styles.secondStyle}>
                      <Image source={covidIcon} style={styles.image} />
                      <Text style={styles.mapStyle}>Declaration</Text>
                     
                    </View>
                  </TouchableOpacity >
                    
                      
                   )}
                 
                  {/* If CHECKED-IN and CHECK-OUT Date is less than or equal to today's date then show checkout form */}
                  {//(this.state.IsCheckIn && this.state.checkOutDate >= this.state.today && this.state.IsCheckOut ) 
                  //  (this.state.IsCheckIn && this.state.checkOutDate <= this.state.today && !(this.state.IsCheckOut)) ? (
                  //   (this.state.IsCheckIn) ? (        
                  //   <TouchableOpacity
                  //     onPress={() => this.checkOutForm(this.state.homeStayId, this.props.navigation.getParam('id'))}
                  //     activeOpacity={2}
                  //   >
                      
                  //     <View style={styles.secondStyle}>
                  //       <Image source={chekOutIcon} style={styles.image,{width:20,height:20}} />
                  //       <Text style={styles.mapStyle}>Check Out</Text>
                  //     </View>
                  //   </TouchableOpacity >
                    
                  // ) : (
                  
                  // <View></View>
                  
                  // )
                  }

                </View>
              
              
              ) : (
                
                  <View></View>

                )}
               
             
              <View>
                <Text style={styles.text}>Overview</Text>
                <Text style={styles.subtext}>{this.state.descrption}</Text>
              </View>
              {/* <View>
                <Text style={styles.text}>Address</Text>
                <Text style={styles.subtext}>{this.state.address}</Text>
              </View> */}
             
              <View style={{ borderBottomColor: '#999999', borderBottomWidth: 1, marginLeft: 10, marginRight: 10, paddingTop: 10 }} />
              {this.state.RequestStatus == "Approved" ? (
                <View>
                  <Text style={styles.text}>Near About</Text>
                  <View style={{justifyContent: 'center',
                            alignItems: 'center'}}>
                    <SafeAreaView style={{ flex: 1 }}>
                      <FlatList
                        //horizontal={true} 
                        //showsHorizontalScrollIndicator={false} 
                        contentContainerStyle={{ alignSelf: 'flex-start', padding: 5 }}
                        numColumns={4}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={this.state.itemList}
                        renderItem={({ item, index }) => (
                          <View>
                            <TouchableWithoutFeedback onPress={() => this.actionOnRow(item)}>
                              <Image
                                //source={{ uri: Constant.Main_Images_Item_URL + item.mainImage }}
                                source={{ uri: item.mainImage }}
                                key={index} // Important to set a key for list items
                                style={{
                                  width: DEVICE_WIDTH * 0.21,
                                  height: DEVICE_HEIGHT * 0.11,
                                  //borderWidth: 2,
                                  margin: DEVICE_WIDTH * 0.015,
                                  borderTopLeftRadius: 20,
                                  borderTopRightRadius: 20,
                                  borderBottomLeftRadius: 20,
                                  borderBottomRightRadius: 20,
                                  overflow: 'hidden',
                                }}
                              />
                            </TouchableWithoutFeedback>
                            {item.itemName.length > 15 ? (
                              <Text style={styles.nearAboutText}>{item.itemName.substring(0, 15) + '..'}</Text>
                            ) : (
                                <Text style={styles.nearAboutText}>{item.itemName}</Text>
                              )}

                          </View>

                        )}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </SafeAreaView>
                  </View>
                </View>
              ) : (
                  <View></View>
                )}
              <View style={styles.photoContainer}>
                <Text style={styles.text}>Photos</Text>
                
                { (this.state.offlineMode==true && this.state.RequestStatus != "Approved" && this.state.RequestStatus != "Pending")?(
                   <Text style={styles.offlineText}>{OfflineData.offlineMessage}</Text>
                ) : 
                <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                //data={vilagesData}
                data={this.state.lstLocationImages}
                renderItem={({ item, index }) => (
                  <View>
                     <TouchableWithoutFeedback onPress={() => this.showGallerySlider(index)}  activeOpacity={1}>
                      <Image
                        //onPress={() => this.setState({ activeSlide: index })}
                        //onPress={() => galleryClick(index) }//this.setState({ sliderPosition: index })}
                        //source={item.src} // Use item to set the image source
                        //source={{ uri: Constant.Gallery_Images_URL + item.imageName }}
                        source={{ uri: item.imageName }}
                        key={index} // Important to set a key for list items

                        style={{
                          width: 120,
                          height: 80,
                          //borderWidth: 2,
                          // borderColor:'#d35647',
                          // resizeMode:'contain',
                          margin: 6,
                          borderTopLeftRadius: 20,
                          borderTopRightRadius: 20,
                          borderBottomLeftRadius: 20,
                          borderBottomRightRadius: 20,
                          overflow: 'hidden',
                        }}
                      />
                      </TouchableWithoutFeedback>
                    {/* </Lightbox> */}
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              }
             </View>           
         </View>
          </ScrollView>
        </KeyboardAvoidingView>
        )
        :
        (
       <View>
              <TouchableOpacity onPress={() => this.hideGallerySlider()} activeOpacity={1}
              //  style={{height:DEVICE_HEIGHT*0.05}}
               >
               <Text style={{ width:130, color:'white', backgroundColor:'green',paddingTop:(Platform.OS === 'ios')?8:4,
               borderRadius:8, marginTop:8,  height:31, textAlign: 'center',alignSelf: 'flex-end',
                 marginRight:10, fontSize:15, fontWeight:'bold'}}>X  Close Gallery</Text>


                {/* <Image source={galleryClose} height="26" width="100" style={{ margin:10, alignSelf: 'flex-end'}} /> */}
              </TouchableOpacity>
           <View style={{
             //display: 'flex',
             //flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              marginTop:DEVICE_HEIGHT*0.17
              }}>
              <Text style={{marginBottom:5, fontWeight:'bold', fontSize:15}}>{this.state.sliderTitle}</Text>
              <Slideshow 
                //height = {300}
                height={DEVICE_HEIGHT*0.32}
                dataSource={this.state.sliderDataSource}
                position={this.state.sliderPosition}
                //onPositionChanged={sliderPosition => this.setState({ sliderPosition })}
                onPositionChanged = {this.galleryPostionChanged}
                scrollEnabled={false}
                />
           <Text style={{margin:5}}>{this.state.sliderDesc}</Text>
           </View>
           {/* <View style={{height:DEVICE_HEIGHT*0.13}}></View> */}
         </View>
       )}
      </Wallpaper>
    );
  }
}

//Styes
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
    fontSize: 20,

  },

  secondContainer: {
   
    overflow: 'hidden',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight:10,
  },
  secondStyle: {
    //margin: DEVICE_WIDTH * 0.032,
    fontSize: 14,
    alignItems: 'center',
    fontWeight: "bold",
    width:DEVICE_WIDTH*0.25
  },

  secondStyleSelf: {
    marginLeft: DEVICE_WIDTH * 0.032,
    marginTop: DEVICE_WIDTH * 0.036,
    marginRight:DEVICE_WIDTH * 0.032,
    fontSize: 14,
    alignItems: 'center',
    fontWeight: "bold",
  },

  nameStyle: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    marginTop: DEVICE_HEIGHT * 0.49,
    color: 'white',
    marginLeft: DEVICE_WIDTH * 0.04,
  },

  viewButton: {
    position: 'absolute',
    marginTop: DEVICE_HEIGHT * 0.49,
    marginLeft: DEVICE_WIDTH * 0.77,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4b9445',
    height: 28,
    width: 65,
    borderRadius: 10,
    zIndex: 100,
    textAlign: 'center',
  },

  viewOrangeButton: {
    position: 'absolute',
    marginTop: DEVICE_HEIGHT * 0.49,
    marginLeft: DEVICE_WIDTH * 0.72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    height: 28,
    width: DEVICE_WIDTH * 0.25,
    borderRadius: 10,
    zIndex: 100,
    textAlign: 'center',
  },

  viewCheckoutButton: {
    position: 'absolute',
    marginTop: DEVICE_HEIGHT * 0.49,
    marginLeft: DEVICE_WIDTH * 0.72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f05959',
    height: 28,
    width: DEVICE_WIDTH * 0.25,
    borderRadius: 10,
    zIndex: 100,
    textAlign: 'center',
  },

  mapStyle: {
    //fontSize: 11,
     fontSize: 12,
    alignItems: 'center',
    // color:'black',
    // marginTop:5,
    // color:'black',
    // marginLeft: 30,
  },

  nearAboutText: {
    fontSize: 11,
    alignItems: 'center',
    textAlign: 'center',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
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
    marginTop: 10,
    fontSize: 20,
    color: 'black',
    marginLeft: 10,
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },

  offlineText: {
    marginTop: 0,
    fontSize: 15,
    color: 'black',
    marginLeft: 10,
    marginBottom: 5,
    backgroundColor: 'transparent',
    //fontWeight: 'bold',
  },

  subtext: {
    marginTop: 10,
    fontSize: 15,
    //color: 'white',
    marginLeft: 10,
    marginRight:10,
    backgroundColor: 'transparent',
  },

  image: {
    // width: 40,
    // height: 40,
    width: DEVICE_WIDTH*0.19,
    height: DEVICE_HEIGHT*0.06,
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

  photoContainer:{
marginBottom:DEVICE_HEIGHT*0.05
  }
});

