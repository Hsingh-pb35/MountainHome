
import React, { Component, useState } from 'react';
// import { RadioButton } from 'react-native-paper';
import {
  StyleSheet,Keyboard, View, ActivityIndicator, TouchableOpacity, Image, Dimensions, Animated, TextInput, 
  Easing, Alert, Text, Picker, target, Button, ScrollView, ImageBackground,
  Platform,
} from 'react-native';

import PropTypes from 'prop-types';
import { Actions, ActionConst } from 'react-native-router-flux';
import spinner from '../images/loading.gif';
import AsyncStorage from '@react-native-community/async-storage';
import adressImg from '../images/adressicon.png';
import phoneImg from '../images/phone.png';
import usernameImg from '../images/username.png';
import calendarIcon from '../images/calendar.png';

import Wallpaper from './Wallpaper';
import backIcon from '../images/back.png';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import emailImg from '../images/email.png';
import { Value } from 'react-native-reanimated';
import Moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { showMessage, hideMessage } from "react-native-flash-message";
import Constant from './Constant';

import { parseJsonConfigFileContent } from 'typescript';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import NetInfo from "@react-native-community/netinfo";
import OfflineData from "./OfflineData";
import Spinner from 'react-native-loading-spinner-overlay';



//Local variable
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

var radio_props_anyoutstanding = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' }
];

var radio_props_ratings = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' }
];

export default class CheckOutForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      LocationId: '',
      UserVisitDetailId: 0,
      guestName: '',
      showCheckOutDateCal: false,
      firstName: '',
      lastName: '',
      id: '',
      checkOutDate: '',
      timeOfDeparture: '',
      travellerCheckOutDate: new Date(),
      hour: '',
      minutes: '',
      anyOutstandings: '',
      cleanliness: '',
      accuracy: '',
      communication: '',
      food: '',
      easeOfReachingTheProperty: '',
      valueForMoney: '',
      host: '',
      nearbyActivities: '',
      comments: '',
      keyboardOffset: 0,
      AMPM: 'AM',
      checkInDate: this.props.navigation.getParam('checkInDate'),
      travellerCheckInDate: new Date(),
      Userid:'',
      formKey: "xyz",
      hourAMPM:'',
      //isSpinerLoader:true, // state for showing Spiner or Loader
      //animating:true,
      // isLoading:true,
      isSpinner:true,
      FirstTime:0,
    }

  
    this.showCheckOutDatepicker = this.showCheckOutDatepicker.bind(this);
    this._GetUserData = this._GetUserData.bind(this);
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
    this._onPressCancel = this._onPressCancel.bind(this);
    this.CancelbuttonAnimated = new Animated.Value(0);

    // for Spiner or Loader
    //this.showSpinerLoader = this.showSpinerLoader.bind(this)

    //login user Id get
    AsyncStorage.getItem("id").then((value) => {
      this.setState({
        id: value
      })
     //this._GetUserData();
    });
   
    AsyncStorage.getItem("UserVisitDetailId").then((value) => {
      console.log("UserVisitDetailId", value);
      this.setState({
        UserVisitDetailId: parseInt(value)
      })
    });

    AsyncStorage.getItem("locationId").then((value) => {
      console.log("locationId", value);
      this.setState({
        LocationId: value
      })
    });
  }

  textClear() {
    //console.log("textClear")


    if (this.state.formKey=="xyz") {
      this.setState({
        formKey: "xy" // update the key 
      })
    }
    
    else{
    
      this.setState({
        formKey:"xyz" // update the key 
      })
    
    }

    this.setState({
      anyOutstandings:"",
      cleanliness:"",
      accuracy:"",
      communication:"",
      food:"",
      easeOfReachingTheProperty:"",
      valueForMoney:"",
      host:"",
      nearbyActivities:"",
      AMPM: 'AM',
    })

    this.state.checkOutDate="",
    this.state.hour="",
    this.state.minutes="",
    this.state.comments=""
    //this.setState({ gender: ""});
    //his.setState({ age: ""});
  };

  componentDidMount() {

    // for closing ActivityIndicator(Loader)
   // this.closeActivityIndicator()
  console.log('Initial Render');

  if(this.state.isSpinner === true)
  {
     setTimeout(()=>this.setState({isSpinner:false}),1000)
    //  this.setState({FirstTime:1})
    //  console.log('Firsttime',this.state.FirstTime)
  }
  

    this.setState({
      travellerCheckInDate: this.state.checkInDate,
    });
    this._GetUserData();
  }


  componentDidUpdate(prevProps,prevState) {

    if (prevProps.navigation !== this.props.navigation) {
       this.setState({isSpinner:true})
       setTimeout(()=>this.setState({isSpinner:false}),1000)

       console.log("New Test");
      //this.textClear(); i made this comment it effects the design of radio btn and cancel
      // Screen has now come into focus, perform your tasks here! 
      // this.goToTop();
       this._GetUserData();
    }
  }

  // These are the functions

  // goToTop = () => {
  //   this.scroll.scrollTo({x: 0, y: 0, animated: true});
  // }

  // Activity Indicator Function

  // closeActivityIndicator = () => setTimeout(() => this.setState({
  //   animating: false }), 1000)
  
  // Activity Indicator opening function
//  openActivityIndicator = ()=> 
//   {
  
//   this.setState({animating:true});
//   this.closeActivityIndicator()  
  
//   }
  
    // function for showSpinerLoader


  // showSpinerLoader(){

  //   this.setState({isSpinerLoader:false}) // Loader stoped as state becomes false

  // }


  //to set boolean value to show hide datepicker 
  showCheckOutDatepicker() {
    this.setState({ showCheckOutDateCal: true });
  };

  //on check out date change set the date.
  onCheckOutDataChange = (event, selectedDate) => {
    let currentDate = selectedDate || this.state.travellerCheckOutDate;
    this.state.stayDuration = '';
    this.setState({
      travellerCheckOutDate: currentDate,
      checkOutDate: Moment(currentDate).format('DD-MM-YYYY').toString(),
      showCheckOutDateCal: false
    });
  };

  _onBlur() {
    this.setState({ hasFocus: false });
  }

  // on focus of input box
  _onFocus() {
    this.setState({ hasFocus: true });
  }

  //to get the UI color on focus
  _getULColor(hasFocus) {
    //console.error(hasFocus);
    return (hasFocus === true) ? 'green' : 'lightgray';
  }

  //To redirect to location detail screen on submit success fully
  backTolocationdetails() {
    // const navigateAction = NavigationActions.navigate({ routeName: 'Home',params: { cityId: this.props.navigation.getParam('cityId'),title:this.props.navigation.getParam('cityname','Village List') }  });
    // this.props.navigation.dispatch(navigateAction);

    //Actions.locationDetailsScreen({ id: this.state.LocationId });
    const navigateAction = NavigationActions.navigate({ routeName: 'LocationDetailScreen',params: {id: this.state.LocationId}});
    this.props.navigation.dispatch(navigateAction);
  }

  //On Submit of check-out form
  _onPress() {
    let memberData = [];
    //console.log(this.state.AMPM+"Hours Test this.state.AMPM");
    // if(this.state.AMPM=="PM")
    // {
    //    let hoursPM=Number(this.state.hour)+12;
    //       this.state.hour=hoursPM.toString()
    //      console.log(this.state.hour+"Hours Test");
    // }

    if(this.state.AMPM=="PM")
    {
       let hoursPM=Number(this.state.hour)+12;
            //this.setState({hour:""})
            this.state.hourAMPM=hoursPM.toString()

         console.log(this.state.hourAMPM+" Hours Test PM");
    }

    if(this.state.AMPM=="AM")
    {
       let hoursPM=Number(this.state.hour);
            //this.setState({hour:""})
            this.state.hourAMPM=hoursPM.toString()

         console.log(this.state.hourAMPM+" Hours Test AM");
    }


    memberData.push({
     UserVisitDetailId: this.state.UserVisitDetailId,
        GuestName: this.state.guestName.trim(),
        CheckOutDate: this.state.travellerCheckOutDate,
        //CheckOutTime: this.state.hour + ':' + this.state.minutes,
        CheckOutTime: this.state.hourAMPM + ':' + this.state.minutes,
        AnyOutstandings: this.state.anyOutstandings,
        Cleanliness: parseInt(this.state.cleanliness),
        Accuracy: parseInt(this.state.accuracy),
        Communication: parseInt(this.state.communication),
        Food: parseInt(this.state.food),
        EaseOfReachingTheProperty: parseInt(this.state.easeOfReachingTheProperty),
        ValueForMoney: parseInt(this.state.valueForMoney),
        Host: parseInt(this.state.host),
        NearbyActivities: parseInt(this.state.nearbyActivities),
        Comments: this.state.comments
    });
    //console.log(memberData);
    //validation 

    if (this.state.guestName.trim() == "") {
      showMessage({
        message:
          "Please enter Guest Name",
        type: "danger",
      });
      return;
    }
    else if (this.state.checkOutDate.trim() == "") {
      showMessage({
        message:
          "Please enter Check Out Date",
        type: "danger",
      });
      return;
    }

    else if ((Date.parse(this.state.travellerCheckOutDate)) < (Date.parse(this.state.travellerCheckInDate))) {
      showMessage({
        message:
          "Check Out Date should be equal or greater then Check In Date",
        type: "danger",
      });
      return;

    }

    else if (this.state.hour.trim() == "") {
      showMessage({
        message:
          "Please select Check Out Hours",
        type: "danger",
      });
      return;
    }
    else if (this.state.minutes.trim() == "") {
      showMessage({
        message:
          "Please select Check Out Minutes",
        type: "danger",
      });
      return;
    }
     
    // else if (this.state.AMPM.trim() == "") {
    //   console.log(this.state.AMPM+"Test Validation")
    //   showMessage({
    //     message:
    //       "Please select AM or PM",
    //     type: "danger",
    //   });
    //   return;
    // }

    else if (this.state.anyOutstandings.trim() == "") {
      showMessage({
        message:
          "Please select any Outstandings",
        type: "danger",
      });
      return;
    }
    else if (this.state.cleanliness.trim() == "") {
      showMessage({
        message:
          "Please rate Cleanliness",
        type: "danger",
      });
      return;
    }
    else if (this.state.accuracy.trim() == "") {
      showMessage({
        message:
          "Please rate Accuracy",
        type: "danger",
      });
      return;
    }
    else if (this.state.communication.trim() == "") {
      showMessage({
        message:
          "Please rate Communication",
        type: "danger",
      });
      return;
    }
    else if (this.state.food.trim() == "") {
      showMessage({
        message:
          "Please Rate Food",
        type: "danger",
      });
      return;
    }
    else if (this.state.easeOfReachingTheProperty.trim() == "") {
      showMessage({
        message:
          "Please rate ease of reaching the property",
        type: "danger",
      });
      return;
    }

    else if (this.state.valueForMoney.trim() == "") {
      showMessage({
        message:
          "Please rate value for Money",
        type: "danger",
      });
      return;
    }

    else if (this.state.host.trim() == "") {
      showMessage({
        message:
          "Please rate the Host",
        type: "danger",
      });
      return;
    }
    else if (this.state.nearbyActivities.trim() == "") {
      showMessage({
        message:
          "Please rate near by Activities",
        type: "danger",
      });
      return;
    }

    else if (this.state.comments.trim() == "") {
      showMessage({
        message:
          "Please enter Comments",
        type: "danger",
      });
      return;
    }

    if (this.state.isLoading) return;

    this.setState({ isLoading: true });
    Animated.timing(this.buttonAnimated, {
      useNativeDriver: false,
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();
    
     
    var checkOutData={
      UserVisitDetailId: this.state.UserVisitDetailId,
      GuestName: this.state.guestName.trim(),
      CheckOutDate: this.state.travellerCheckOutDate,
      // DepartureTime: this.state.hour + ':' + this.state.minutes,
      DepartureTime: this.state.hourAMPM + ':' + this.state.minutes,
      AnyOutstandings: this.state.anyOutstandings,
      Cleanliness: parseInt(this.state.cleanliness),
      Accuracy: parseInt(this.state.accuracy),
      Communication: parseInt(this.state.communication),
      Food: parseInt(this.state.food),
      EaseOfReachingTheProperty: parseInt(this.state.easeOfReachingTheProperty),
      ValueForMoney: parseInt(this.state.valueForMoney),
      Host: parseInt(this.state.host),
      NearbyActivities: parseInt(this.state.nearbyActivities),
      Comments: this.state.comments,
    };

      NetInfo.fetch().then(state => 
      {
          if (state.isConnected && !OfflineData.isOfflineMode) 
          {
              //console.log(this.state.hour+"Hours Test");
              fetch(Constant.API_URL + "travels/addcheckoutdetail", {
                method: 'Post',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(checkOutData),
              })
                .then((response) => {
                  const statusCode = response.status;
                  const result = response.json();
                  return Promise.all([statusCode, result]);
                })
                .then(([res, result]) => {
                  if (res == 200) {
                    //Actions.indexScreen();
                    //this.props.navigation.navigate("ViewTravelRequestScreen");
                    // const navigateAction = NavigationActions.navigate({ routeName: 'ViewTravelRequestScreen' });
                    // this.props.navigation.dispatch(navigateAction);
                    showMessage({
                      message: "Check Out Successfully",
                      type: "success",
                    });

                    setTimeout(() => {
                      this.setState({ isLoading: false });
                      this.buttonAnimated.setValue(0);
                      //this.props.navigation.navigate("ViewTravelRequestScreen");
                      //Actions.locationDetailsScreen({ id: this.state.LocationId });
                      this.textClear();
                      
                      Actions.indexScreen();
                    }, 1000);
                  }
                  else {
                    // console.log(result);
                    showMessage({
                      message: "Some error occured, please try after some time",
                      type: "danger",
                    });
                    this.setState({ isLoading: false });
                    this.buttonAnimated.setValue(0);
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
          }
          else{
            (async () => { 
                await OfflineData.storeCheckoutFormData(checkOutData);
                showMessage({
                  message: "Check Out Successfully",
                  type: "success",
                });

                this.setState({ isLoading: false });
                this.buttonAnimated.setValue(0);
                this.textClear();
       
               Actions.indexScreen();
              }
              )();   
          }
    });

  }

  //On Cancel button function
  _onPressCancel() {
    //this.textClear(); 
    //Actions.locationDetailsScreen({ id: this.state.LocationId });
    const navigateAction = NavigationActions.navigate({ routeName: 'LocationDetailsScreen',params: { id: this.props.navigation.getParam('id') }  });
   this.props.navigation.dispatch(navigateAction);
  }

  _onGrow() {
    Animated.timing(this.growAnimated, {
      useNativeDriver: false,
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();
  }

  //Get logged in user data
  _GetUserData() {
      NetInfo.fetch().then(state => 
      {
          if (state.isConnected && !OfflineData.isOfflineMode) 
          {
            var id = this.state.id;
            //fetch(Constant.API_URL + "users/getuser?id=" + id, {
            fetch(Constant.API_URL + "users/getuser?id=" + this.props.navigation.getParam('Userid'),{
              method: 'GET',
            })
              .then((response) => {
                //console.log(response);
                const statusCode = response.status;
                const result = response.json();
                return Promise.all([statusCode, result]);
              })
              .then(([res, result]) => {
                console.log(result);
                this.setState({
                  firstName: result.firstName,
                  lastName: result.lastName,
                  phoneNumber: result.phoneNumber,
                  email: result.email,
                  Status: result.Status,
                  age: parseInt(result.age),
                  username: result.username,
                  address: result.address,
                  guestName: result.firstName + " " + result.lastName,
                  //isSpinner:false,

                })
                setTimeout(()=>this.setState({isSpinner:false}),1000)
              })
            }
            else{
              //Assign data to some of field from storage (Storage data is saved at the time of login)
              this.setState({
                guestName:'',
              })
            }
        });
  }

  //Code to go back to home
  backToHome() {
    Actions.indexScreen();
  }

  //Set and update Any Outstanding Payment?  value
  setOutstanding(value) {
    this.setState({ anyOutstandings: value });
  }

  //Set and update Cleanliness value
  setCleanliness(value) {
    console.log(value);
    this.setState({ cleanliness: value });
  }

  //Set and update Accuracy  value
  setAccuracy(value) {
    this.setState({ accuracy: value });
  }

  //Set and update Communication  value
  setCommunication(value) {
    this.setState({ communication: value });
  }

  //Set and update Food value
  setFood(value) {
    this.setState({ food: value });
  }

  //Set and update Ease of reaching the property  value
  setEaseOfReachingTheProperty(value) {
    this.setState({ easeOfReachingTheProperty: value });
  }

  //Set and update Value for Money value
  setValueForMoney(value) {
    this.setState({ valueForMoney: value });
  }

  //Set and update Host  value
  setHost(value) {
    this.setState({ host: value });
  }

  //Set and update Nearby Activities value
  setNearbyActivities(value) {
    this.setState({ nearbyActivities: value });
  }

//   _keyboardDidHide() {
//     this.setState({
//         keyboardOffset: 0,
//     })
// }



  //Render function
  render() {
    //console.log(.getParam('checkInDate')+"Test");


    // const [checked, setChecked] = React.useState('first');
    // const changeWidth = this.buttonAnimated.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [DEVICE_WIDTH - MARGIN, MARGIN],
    // });

    // const changeWidthCancel = this.CancelbuttonAnimated.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [DEVICE_WIDTH - MARGIN, MARGIN],
    // });

    const changeScale = this.growAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, MARGIN],
    });


    return(
    <Wallpaper>
    <ScrollView ref={(c) => {this.scroll = c}}
     style={styles.scrollView} 
     contentContainerStyle={styles.contentContainer} 
     bounces={false}>

  {/*Spinner*/}
  
 <View style={styles.container}>
 <Spinner visible={this.state.isSpinner&& Platform.OS === 'ios'}
     textContent={'Loading...'}
     textStyle={styles.spinnerTextStyle} 
     overlayColor='white' // overlay of Loader(spiner made white)
     color='green'
     /*overlayColor={'rgba(39,62,84,0.82)'}*/
     />
</View>
 


         <KeyboardAwareScrollView>
           {/* <View style={{
             flex: 1,
             flexDirection: 'row',
             paddingTop: 10,
             justifyContent: 'center',
             alignContent: 'center',
             alignItems: 'center',
             paddingBottom: 10,
             color: 'green',
             borderColor: 'gray'
           }}><Text style={{ fontSize: 20, color: 'green', fontWeight: 'bold' }}>Check Out Form</Text></View>
           <View style={{ borderBottomColor: '#d3d3d3', borderBottomWidth: 0.8,margin:10}}/> */}
           {/* Name Of Guest */}
           <View style={styles.inputWrapper, { marginBottom: 10 }}>
             <View style={{ marginTop: 10 }}>
               <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>Name of the Guest </Text>
             </View>
             {/* <Image source={usernameImg} style={styles.inlineImg} /> */}
             <TextInput
               onBlur={() => this._onBlur()}
               onFocus={() => this._onFocus()}
               underlineColorAndroid={this._getULColor(this.state.hasFocus)}
               style={styles.input}
               source={usernameImg}
               placeholder="Enter guest name"
               autoCapitalize={'none'}
               returnKeyType={'done'}
               autoCorrect={false}
               //onChangeText={text=>this.setState({ firstName: text })}
               onChangeText={text => {
                 this.setState({
                   guestName: text.replace(/[^A-Za-z ]/gi, ''),
                 });
               }}
               value={this.state.guestName}
               autoCapitalize={'words'}
             />
           </View>

           {/* Date of Check Out */}
           <View style={styles.inputWrapper, { marginBottom: 10 }}>
             <View style={{ marginTop: 1, marginBottom: 10 }}>
               <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>Date of Checkout</Text>
             </View>
             <TouchableOpacity onPress={this.showCheckOutDatepicker}>
               <Image source={calendarIcon} style={styles.inlineCalImg} />
               <TextInput value={this.state.checkOutDate} editable={false} placeholder="Select date"
                 style={{
                   backgroundColor: 'rgba(255, 255, 255, 0.4)',
                   // width: DEVICE_WIDTH * 0.45,
                   width: DEVICE_WIDTH *0.96,
                   height: 35,
                   borderRadius: 20,
                   color: '#000000',
                   // borderWidth: 1,
                   borderColor: '#999999',
                   marginLeft: DEVICE_WIDTH * 0.06,
                   borderRadius: 40,
                   fontSize: 15,
                   marginTop: DEVICE_HEIGHT * 0.001,
                   padding: 2,
                   paddingLeft: 11,
                 }}
                 source={calendarIcon}
                 placeholder="DD-MM-YYYY"
                 autoCapitalize={'none'}
                 returnKeyType={'done'}
                 autoCorrect={false}
               ></TextInput>
             </TouchableOpacity>

             {/* <TouchableOpacity onPress={this.showDatepicker}>
                     <Image source={calendarIcon}
                               style={{ width: 25, height: 25,marginTop:DEVICE_HEIGHT*0.01,  }}/>
                   </TouchableOpacity> */}
             {this.state.showCheckOutDateCal && <DateTimePicker testID="checkOutDateTimePicker"
               value={this.state.travellerCheckOutDate}
               mode='date'
               is24Hour={true}
               display="default"
               minimumDate={new Date()}
               // minimumDate={new Date(this.state.travellerCheckInDate)}
               onChange={this.onCheckOutDataChange}
             />}
           </View>

           {/* Time of Departure  */}
           <View style={styles.inputWrapper, { marginBottom: 0 }}>
             <View style={{ marginTop: 10 }}>
               <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>Time of Checkout </Text>
             </View>
             <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", justifyContent: 'center', margin: 5 }}>
               <View style={{ marginLeft: 10, width: DEVICE_WIDTH * .31, alignContent: 'flex-start' }}>
                 <Picker
                   selectedValue={this.state.hour}
                   onValueChange={(itemValue, itemIndex) => this.setState({ hour: itemValue })}
                   mode="dropdown">
                   <Picker.Item label="Hour" value="" />
                   {/* <Picker.Item label="00" value="00" /> */}
                   <Picker.Item label="01" value="01" />
                   <Picker.Item label="02" value="02" />
                   <Picker.Item label="03" value="03" />
                   <Picker.Item label="04" value="04" />
                   <Picker.Item label="05" value="05" />
                   <Picker.Item label="06" value="06" />
                   <Picker.Item label="07" value="07" />
                   <Picker.Item label="08" value="08" />
                   <Picker.Item label="09" value="09" />
                   <Picker.Item label="10" value="10" />
                   <Picker.Item label="11" value="11" />
                   <Picker.Item label="12" value="12" />
                   {/* <Picker.Item label="13" value="13" />
                   <Picker.Item label="14" value="14" />
                   <Picker.Item label="15" value="15" />
                   <Picker.Item label="16" value="16" />
                   <Picker.Item label="17" value="17" />
                   <Picker.Item label="18" value="18" />
                   <Picker.Item label="19" value="19" />
                   <Picker.Item label="20" value="20" />
                   <Picker.Item label="21" value="22" />
                   <Picker.Item label="23" value="23" /> */}
                 </Picker>
               </View>
               <View style={{ width: DEVICE_WIDTH * .31, justifyContent: 'flex-end', alignContent: 'flex-end' }}>
                 <Picker
                   selectedValue={this.state.minutes}
                   onValueChange={(itemValue, itemIndex) => this.setState({ minutes: itemValue })}
                   mode="dropdown">
                   <Picker.Item label="Minute" value="" />
                   <Picker.Item label="00" value="00" />
                   <Picker.Item label="01" value="01" />
                   <Picker.Item label="02" value="02" />
                   <Picker.Item label="03" value="03" />
                   <Picker.Item label="04" value="04" />
                   <Picker.Item label="05" value="06" />
                   <Picker.Item label="07" value="07" />
                   <Picker.Item label="08" value="08" />
                   <Picker.Item label="09" value="09" />
                   <Picker.Item label="10" value="10" />
                   <Picker.Item label="11" value="11" />
                   <Picker.Item label="12" value="13" />
                   <Picker.Item label="14" value="14" />
                   <Picker.Item label="15" value="15" />
                   <Picker.Item label="16" value="16" />
                   <Picker.Item label="17" value="17" />
                   <Picker.Item label="18" value="18" />
                   <Picker.Item label="19" value="19" />
                   <Picker.Item label="20" value="20" />
                   <Picker.Item label="21" value="21" />
                   <Picker.Item label="22" value="22" />
                   <Picker.Item label="23" value="23" />
                   <Picker.Item label="24" value="24" />
                   <Picker.Item label="25" value="25" />
                   <Picker.Item label="26" value="26" />
                   <Picker.Item label="27" value="27" />
                   <Picker.Item label="28" value="28" />
                   <Picker.Item label="29" value="29" />
                   <Picker.Item label="30" value="30" />
                   <Picker.Item label="31" value="31" />
                   <Picker.Item label="32" value="32" />
                   <Picker.Item label="33" value="33" />
                   <Picker.Item label="34" value="34" />
                   <Picker.Item label="35" value="35" />
                   <Picker.Item label="36" value="36" />
                   <Picker.Item label="37" value="37" />
                   <Picker.Item label="38" value="38" />
                   <Picker.Item label="39" value="39" />
                   <Picker.Item label="40" value="40" />
                   <Picker.Item label="41" value="41" />
                   <Picker.Item label="42" value="42" />
                   <Picker.Item label="43" value="43" />
                   <Picker.Item label="44" value="44" />
                   <Picker.Item label="45" value="45" />
                   <Picker.Item label="46" value="46" />
                   <Picker.Item label="47" value="47" />
                   <Picker.Item label="48" value="48" />
                   <Picker.Item label="49" value="49" />
                   <Picker.Item label="50" value="50" />
                   <Picker.Item label="51" value="51" />
                   <Picker.Item label="52" value="52" />
                   <Picker.Item label="53" value="53" />
                   <Picker.Item label="54" value="54" />
                   <Picker.Item label="55" value="55" />
                   <Picker.Item label="56" value="56" />
                   <Picker.Item label="57" value="57" />
                   <Picker.Item label="58" value="58" />
                   <Picker.Item label="59" value="59" />

                 </Picker>
               </View>
               <View style={{ width: DEVICE_WIDTH * .31, justifyContent: 'flex-end', alignContent: 'flex-end' }}>
                 <Picker
                   selectedValue={this.state.AMPM}
                   onValueChange={(itemValue, itemIndex) => this.setState({ AMPM: itemValue })}
                   mode="dropdown">
                   <Picker.Item label="AM" value="AM" />
                   <Picker.Item label="PM" value="PM" />
                 </Picker>
               </View>

             </View>
           </View>

           {/* Any Out standings */}
           <View style={styles.inputWrapper, { marginBottom: 10 }}>
             {/* <text style={{ marginTop: 10 }}> */}
             <Text style={{ marginHorizontal: 20, fontWeight: "bold", marginBottom: 10 }}>Any Outstanding Payment?</Text>
             {/* </View> */}

             <View style={{ marginHorizontal: 20 }}>
               <RadioForm
                 key={this.state.formKey}
                 style={{}}
                 radio_props={radio_props_anyoutstanding}
                 initial={-2}
                  buttonColor={'green'}
                 radioStyle={{paddingRight: 20}}
                 labelHorizontal={true}
                 formHorizontal={true}

                 borderWidth={1}
                 buttonInnerColor={'green'}
                 buttonOuterColor={'green'}
                 buttonSize={12}
                 buttonOuterSize={20}
                 buttonStyle={{}}
                 onPress={(value) => {
                   this.setOutstanding(value);
                 }}
               />
             </View>
           </View>

           {/* Cleanliness  */}
           <View style={styles.inputWrapper, { marginBottom: 10 }}>
             {/* <text style={{ marginTop: 10 }}> */}
             <Text style={{ marginHorizontal: 20, fontWeight: "bold", marginBottom: 10 }}>Cleanliness</Text>
             {/* </View> */}

             <View style={{ marginHorizontal: 20 }}>
               <RadioForm
                key={this.state.formKey}
                 style={{}}
                 radio_props={radio_props_ratings}
                 initial={-1}
                  buttonColor={'green'}
                 borderWidth={1}
                 labelStyle={{ marginRight: 10, marginLeft: -5, fontSize: 16 }}
                 formHorizontal={true}
                 labelHorizontal={true}
                 buttonInnerColor={'green'}
                 buttonOuterColor={'green'}
                 buttonSize={12}
                 buttonOuterSize={20}
                 buttonStyle={{}}
                 onPress={(value) => {
                   this.setCleanliness(value);
                 }}
               />
             </View>
           </View>

           {/* Accuracy   */}
           <View style={styles.inputWrapper, { marginBottom: 10 }}>
             {/* <text style={{ marginTop: 10 }}> */}
             <Text style={{ marginHorizontal: 20, fontWeight: "bold", marginBottom: 10 }}>Accuracy</Text>
             {/* </View> */}

             <View style={{ marginHorizontal: 20 }}>
               <RadioForm
                key={this.state.formKey}
                 style={{}}
                 radio_props={radio_props_ratings}
                 initial={-1}
                  buttonColor={'green'}
                 borderWidth={1}
                 labelStyle={{ marginRight: 10, marginLeft: -5, fontSize: 16 }}
                 formHorizontal={true}
                 labelHorizontal={true}
                 buttonInnerColor={'green'}
                 buttonOuterColor={'green'}
                 buttonSize={12}
                 buttonOuterSize={20}
                 buttonStyle={{}}
                 onPress={(value) => {
                   this.setAccuracy(value);
                 }}
               />
             </View>
           </View>

           {/* Communication    */}
           <View style={styles.inputWrapper, { marginBottom: 10 }}>
             {/* <text style={{ marginTop: 10 }}> */}
             <Text style={{ marginHorizontal: 20, fontWeight: "bold", marginBottom: 10 }}>Communication </Text>
             {/* </View> */}

             <View style={{ marginHorizontal: 20 }}>
               <RadioForm
                key={this.state.formKey}
                 style={{}}
                 radio_props={radio_props_ratings}
                 initial={-1}
                  buttonColor={'green'}
                 borderWidth={1}
                 labelStyle={{ marginRight: 10, marginLeft: -5, fontSize: 16 }}
                 formHorizontal={true}
                 labelHorizontal={true}
                 buttonInnerColor={'green'}
                 buttonOuterColor={'green'}
                 buttonSize={12}
                 buttonOuterSize={20}
                 buttonStyle={{}}
                 onPress={(value) => {
                   this.setCommunication(value);
                 }}
               />
             </View>
           </View>

           {/* Food     */}
           <View style={styles.inputWrapper, { marginBottom: 10 }}>
             {/* <text style={{ marginTop: 10 }}> */}
             <Text style={{ marginHorizontal: 20, fontWeight: "bold", marginBottom: 10 }}>Food  </Text>
             {/* </View> */}

             <View style={{ marginHorizontal: 20 }}>
               <RadioForm
                    key={this.state.formKey}
                 style={{}}
                 radio_props={radio_props_ratings}
                 initial={-1}
                  buttonColor={'green'}
                 borderWidth={1}
                 labelStyle={{ marginRight: 10, marginLeft: -5, fontSize: 16 }}
                 formHorizontal={true}
                 labelHorizontal={true}
                 buttonInnerColor={'green'}
                 buttonOuterColor={'green'}
                 buttonSize={12}
                 buttonOuterSize={20}
                 buttonStyle={{}}
                 onPress={(value) => {
                   this.setFood(value);
                 }}
               />
             </View>
           </View>

           {/* Ease of reaching the property     */}
           <View style={styles.inputWrapper, { marginBottom: 10 }}>
             {/* <text style={{ marginTop: 10 }}> */}
             <Text style={{ marginHorizontal: 20, fontWeight: "bold", marginBottom: 10 }}>Ease of reaching the property  </Text>
             {/* </View> */}

             <View style={{ marginHorizontal: 20 }}>
               <RadioForm
                key={this.state.formKey}
                 style={{}}
                 radio_props={radio_props_ratings}
                 initial={-1}
                 buttonColor={'green'}
                 borderWidth={1}
                 labelStyle={{ marginRight: 10, marginLeft: -5, fontSize: 16 }}
                 formHorizontal={true}
                 labelHorizontal={true}
                 buttonInnerColor={'green'}
                 buttonOuterColor={'green'}
                 buttonSize={12}
                 buttonOuterSize={20}
                 buttonStyle={{}}
                 onPress={(value) => {
                   this.setEaseOfReachingTheProperty(value);
                 }}
               />
             </View>
           </View>

           {/* Ease of reaching the property     */}
           <View style={styles.inputWrapper, { marginBottom: 10 }}>
             {/* <text style={{ marginTop: 10 }}> */}
             <Text style={{ marginHorizontal: 20, fontWeight: "bold", marginBottom: 10 }}>Value for Money</Text>
             {/* </View> */}

             <View style={{ marginHorizontal: 20 }}>
               <RadioForm
                key={this.state.formKey}
                 style={{}}
                 radio_props={radio_props_ratings}
                 initial={-1}
                 buttonColor={'green'}
                 borderWidth={1}
                 labelStyle={{ marginRight: 10, marginLeft: -5, fontSize: 16 }}
                 formHorizontal={true}
                 labelHorizontal={true}
                 buttonInnerColor={'green'}
                 buttonOuterColor={'green'}
                 buttonSize={12}
                 buttonOuterSize={20}
                 buttonStyle={{}}
                 onPress={(value) => {
                   this.setValueForMoney(value);
                 }}
               />
             </View>
           </View>

           {/* Host */}
           <View style={styles.inputWrapper, { marginBottom: 10 }}>
             {/* <text style={{ marginTop: 10 }}> */}
             <Text style={{ marginHorizontal: 20, fontWeight: "bold", marginBottom: 10 }}>Host</Text>
             {/* </View> */}

             <View style={{ marginHorizontal: 20 }}>
               <RadioForm
                key={this.state.formKey}
                 style={{}}
                 radio_props={radio_props_ratings}
                 initial={-1}
                 buttonColor={'green'}
                 borderWidth={1}
                 labelStyle={{ marginRight: 10, marginLeft: -5, fontSize: 16 }}
                 formHorizontal={true}
                 labelHorizontal={true}
                 buttonInnerColor={'green'}
                 buttonOuterColor={'green'}
                 buttonSize={12}
                 buttonOuterSize={20}
                 buttonStyle={{}}
                 onPress={(value) => {
                   this.setHost(value);
                 }}
               />
             </View>
           </View>

           {/* Nearby Activities */}
           <View style={styles.inputWrapper, { marginBottom: 10 }}>
             {/* <text style={{ marginTop: 10 }}> */}
             <Text style={{ marginHorizontal: 20, fontWeight: "bold", marginBottom: 10 }}>Nearby Activities</Text>
             {/* </View> */}

             <View style={{ marginHorizontal: 20 }}>
               <RadioForm
                key={this.state.formKey}
                 style={{}}
                 radio_props={radio_props_ratings}

                 initial={-1}
                  buttonColor={'green'}
                 borderWidth={1}
                 labelStyle={{ marginRight: 10, marginLeft: -5, fontSize: 16 }}
                 formHorizontal={true}
                 labelHorizontal={true}
                 buttonInnerColor={'green'}
                 buttonOuterColor={'green'}
                 buttonWrapStyle={{ marginLeft: 10 }}
                 buttonSize={12}
                 buttonOuterSize={20}
                 buttonStyle={{}}
                 onPress={(value) => {
                   this.setNearbyActivities(value);
                 }}
               />
             </View>
           </View>

           {/* Comment */}
           <View style={styles.inputWrapper, { marginBottom: 10 }}>
             <View style={{ marginTop: 10,marginBottom:10 }}>
               <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>Any Comments or Suggestions </Text>
             </View>
             {/* <Image source={usernameImg} style={styles.inlineImg} /> */}
             <View style={styles.textAreaContainer}>
             <TextInput
               onBlur={() => this._onBlur()}
               onFocus={() => this._onFocus()}
               underlineColorAndroid={this._getULColor(this.state.hasFocus)}
               style={styles.textArea}
               underlineColorAndroid="transparent"
               placeholderTextColor="grey"
               numberOfLines={10}
               multiline={true}
               source={usernameImg}
               placeholder="Enter any comments or suggestions"
               autoCapitalize={'none'}
               returnKeyType={'done'}
               autoCorrect={false}
               onSubmitEditing={Keyboard.dismiss}
               //onChangeText={text=>this.setState({ firstName: text })}
               onChangeText={text => {
                 this.setState({
                   comments: text,
                 });
               }}
               value={this.state.comments}
             // autoCapitalize={'words'}
             />
             </View>
           </View>

           <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center', marginTop: 50, margin: 5 }}>
             <View style={styles.containerSubmit}>
               <Animated.View style={{ width: DEVICE_WIDTH * 0.4 }}>
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
                   style={[styles.circle, { transform: [{ scale: changeScale }] }]}
                 />
               </Animated.View>
             </View>

             <View style={styles.containerCancel}>
               <Animated.View style={{ width: DEVICE_WIDTH * 0.4 }}>
                 <TouchableOpacity
                   style={styles.Cancelbutton}
                   onPress={this._onPressCancel}
                   activeOpacity={1}>
                   <Text style={styles.textCancel}>CANCEL</Text>
                 </TouchableOpacity>
               </Animated.View>
             </View>
           </View>
           </KeyboardAwareScrollView>
         </ScrollView>
     </Wallpaper>

    )

   
}

}

const MARGIN = 40;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },


  LoaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70
 },
 activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
 },


  scrollView:{
    flex:1,
  },

  inlineCalImg: {
    position: 'absolute',
    zIndex: 99,
    width: 25,
    height: 25,
    // left: DEVICE_WIDTH * 0.4,
    left: DEVICE_WIDTH * 0.88,
    top: 5,
  },
  header: {
    padding: 10
  },

  containerSubmit: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 5
  },

  containerCancel: {
    //flex: DEVICE_HEIGHT*4,
    //top: DEVICE_HEIGHT*0.2,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4b9445',
    height: MARGIN,
    borderRadius: 10,
    zIndex: 100,
  },

  header: {
    //backgroundColor: "#DCDCDC",
    marginBottom: 10
  },

  headerContent: {
    padding: 10,
    alignItems: 'center',
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    marginBottom: 10,
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

  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  contentContainer: {
    //justifyContent: 'center',
    //alignItems: 'center',
    // backgroundColor: 'lightgrey',
    paddingBottom: 50,
    marginHorizontal: 5,
   marginTop:10,  
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
    paddingRight: 45,
    //borderRadius: 20,
    color: '#000000',
    //borderColor: '#999999',
    //borderWidth: 1,
    borderBottomWidth: (Platform.OS === 'ios') ? 1 : 0,
    borderBottomColor:(Platform.OS === 'ios') ? 'gray' : 'transparent',
  },
  // input: {
  //   backgroundColor: 'rgba(255, 255, 255, 0.4)',
  //   width: DEVICE_WIDTH - 40,
  //   height: 40,
  //   marginHorizontal: 20,
  //   paddingLeft: 45,
  //   borderRadius: 20,
  //   color: '#000000',
  //   borderColor: '#999999',
  //   borderWidth: 1,
  //   marginBottom:10
  // },
  inputWrapper: {
    // flex: DEVICE_HEIGHT * 0.6,
    // flex: 1
  },

  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: DEVICE_WIDTH * 0.85,
    top: DEVICE_HEIGHT * 0.065,
  },
  textArea: {
    height: 70,
    justifyContent:'center'
    
  },
  textAreaContainer: {
    borderColor: 'green',
    borderWidth: 1,
    padding: 5,
    width: DEVICE_WIDTH - 40,
    height: 90,
    marginHorizontal: 20,
    paddingRight: 45,
  }

});