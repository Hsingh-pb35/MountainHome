
import React, { Component, useState, useRef } from 'react';
// import { RadioButton } from 'react-native-paper';
import {  StyleSheet, KeyboardAvoidingView, View, ActivityIndicator, TouchableOpacity,  
  Image, Dimensions, Animated, TextInput, Easing, Alert, Text, Picker, target, Button, ScrollView, 
  ImageBackground,
  Platform,
    StatusBar,
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
import { color, Value } from 'react-native-reanimated';
import Moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { showMessage, hideMessage } from "react-native-flash-message";
import Constant from './Constant';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { string } from 'prop-types';
import NetInfo from "@react-native-community/netinfo";
import OfflineData from "./OfflineData";
import Spinner from 'react-native-loading-spinner-overlay';
//Local variable
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

var radio_props = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Prefer not to say', value: 'PreferNotToSay' }
];


export default class CheckInForm extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      isSpinner:true,
      // LocationId: '',
      LocationId: this.props.navigation.getParam('id'),
      UserVisitDetailId: 0,
      UserDetail: '',
      showCheckInDateCal: false,
      showCheckOutDateCal: false,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      id: '',
      email: '',
      Status: '',
      username: '',
      address: '',
      guestName: '',
      gender: '',
      age: 0,
      checkInDate: '',
      checkOutDate: '',
      timeOfArival: '',
      stayDuration: '',
      idType: '',
      numberOfGuests: '',
      travelingFrom: '',
      numberOfRooms: '',
      travellerCheckInDate: new Date(),
      travellerCheckOutDate: new Date(),
      hour: '',
      minutes: '',
      AMPM: 'AM',
      Userid: this.props.navigation.getParam('Userid'),
      formKey: "xyz",
      hourAMPM:'',
      isLoading:true,
      
    }
    this.showCheckInDatepicker = this.showCheckInDatepicker.bind(this);
    this.showCheckOutDatepicker = this.showCheckOutDatepicker.bind(this);
    this._GetUserData = this._GetUserData.bind(this);
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
    this._onPressCancel = this._onPressCancel.bind(this);
    this.CancelbuttonAnimated = new Animated.Value(0);

    
    //login user Id get
    AsyncStorage.getItem("id").then((value) => {
      this.setState({
        id: value
      })
     //this._GetUserData();
    });

    AsyncStorage.getItem("UserVisitDetailId").then((value) => {
      //console.log("UserVisitDetailId", value);
      this.setState({
        UserVisitDetailId: parseInt(value)
      })
    });

    AsyncStorage.getItem("totalMembers").then((value) => {
      //console.log("totalMembers", value);
      this.setState({
        numberOfGuests: value
      })
    });
  

    AsyncStorage.getItem("locationId").then((value) => {
      //console.log("locationId", value);
      this.setState({
        LocationId: value
      })
    });
  }

  componentDidMount() {
    if(this.state.isSpinner === true)
    {
       setTimeout(()=>this.setState({isSpinner:false}),1000)
      //  this.setState({FirstTime:1})
      //  console.log('Firsttime',this.state.FirstTime)
    }
   // StatusBar.setHidden(true);
   //console.log("componentDidMount Test");
   this._GetUserData();

 }

  // componentDidUpdate(prevProps) {
  //  //console.log(this.props.navigation.getParam('Userid')+"Test componentDidUpdate");
  //  //console.log(this.state.id+"user id componentDidUpdate");
  //  // console.log("Test prevProps"+this.props.navigation.getParam('id'));
  //   if(this.props.navigation.getParam('Userid') !== prevProps.navigation.getParam('Userid')){
  //     //console.log("Test if:"+this.props.navigation.getParam('id'));
  //     this._GetUserData();
  //  }
  // }

  textClear() {
    //console.log("textClear") 
    //this.setState({ gender: ""});
    //his.setState({ age: ""});

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
      AMPM:"AM" 
    })
    this.state.gender="",
    console.log("gender"+this.state.gender)
    this.state.age="",
    console.log("age"+this.state.age)
    this.state.checkInDate="",
    this.state.checkOutDate="",
    this.state.hour="",
    this.state.minutes="",
    this.state.stayDuration="",
    this.state.idType="",
    this.state.numberOfGuests="",
    this.state.travelingFrom="",
    this.state.numberOfRooms=""
  };

  componentDidUpdate(prevProps) {
    //console.log("Test");
    //console.log("componentDidUpdate statename:"+this.state.statename);
    if (prevProps.navigation !== this.props.navigation) {
      this.setState({isSpinner:true})
      console.log("New Test");
      this.textClear();
      // Screen has now come into focus, perform your tasks here! 
       //this.goToTop();
       this._GetUserData();

      //  this.scrollRef.current?.scrollTo({
      //   y: 0,
      //   animated: true,
      //   });
    }
  }

  showCheckInDatepicker() {
    this.setState({ showCheckInDateCal: true });
  };

  showCheckOutDatepicker() {
    this.setState({ showCheckOutDateCal: true });
  };

  onCheckInDataChange = (event, selectedDate) => {
  
    let currentDate = selectedDate || this.state.travellerCheckInDate;
    this.state.stayDuration=''
    this.setState({
      travellerCheckInDate: currentDate,
      checkInDate: Moment(currentDate).format('DD-MM-YYYY').toString(),
      showCheckInDateCal: false
    });

    var dateDiff= (new Date(this.state.travellerCheckOutDate)-new Date(this.state.travellerCheckInDate));        
    if(dateDiff>0)
    {
      this.setState({
        stayDuration:this.state.stayDuration=Math.round(dateDiff / (1000 * 60 * 60 * 24)).toString()
      })
    }
    // this.state.checkOutDate=React.createRef();
    // this.setState({
    //   travellerCheckOutDate: new Date(),
    //  // checkOutDate: Moment().format('MM-DD-YYYY').toString(),
    //   showCheckOutDateCal: false
    // });

  };

  onCheckOutDataChange = (event, selectedDate) => {
    let currentDate = selectedDate || this.state.travellerCheckOutDate;
    this.state.stayDuration='';
    this.setState({
      travellerCheckOutDate: currentDate,
      checkOutDate: Moment(currentDate).format('DD-MM-YYYY').toString(),
      showCheckOutDateCal: false
    });


    var dateDiff= (new Date(this.state.travellerCheckOutDate)-new Date(this.state.travellerCheckInDate));
                 
    if(dateDiff>0)
    {

      this.setState({
        stayDuration:this.state.stayDuration=Math.round(dateDiff / (1000 * 60 * 60 * 24)).toString()
      })

     
      //console.log(this.state.stayDuration);
    }
    

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
    Actions.locationDetailsScreen({ id: this.state.LocationId });
  }

  //On Submit of check-in form
  _onPress() {
   // hourAMPM
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

    //validation 
    let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //let regPhone = /^[0]?[6789]\d{9}$/;
    let regPhone = /^[0]?[123456789]\d{9,14}$/;
    if (this.state.guestName.trim() == "") {
      showMessage({
        message:
          "Please enter Name of the Guest",
        type: "danger",
      });
      return;
    }
    else if (this.state.gender.trim() == "") {
      showMessage({
        message:
          "Please select Gender",
        type: "danger",
      });
      return;
    }

    else if (this.state.age == "" || this.state.age == 0 || parseInt(this.state.age) < 0) {
      showMessage({
        message:
          "Please enter Age",
        type: "danger",
      });
      return;
    }

    else if (this.state.email.trim() == "") {
      showMessage({
        message:
          "Please enter your Email ID",
        type: "danger",
      });
      return;
    }
    else if (regEmail.test(this.state.email) === false) {
      showMessage({
        message:
          "Please enter valid Email ID",
        type: "danger",
      });
      return;
    }
    else if (this.state.phoneNumber.trim() == "") {
      showMessage({
        message:
          "Please enter your Phone Number",
        type: "danger",
      });
      return;
    }
    else if (regPhone.test(this.state.phoneNumber) === false) {
      showMessage({
        message:
          "Please enter valid Phone Number",
        type: "danger",
      });
      return;
    }
    else if (this.state.checkInDate.trim() == "") {
      showMessage({
        message:
          "Please enter Check In Date",
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
          "Check Out Date should be equal or greater than Check In Date",
        type: "danger",
      });
      return;

    }
    else if (this.state.hour.trim() == "") {
      showMessage({
        message:
          "Please select Arrival Hours",
        type: "danger",
      });
      return;
    }    
    else if (this.state.minutes.trim() == "") {
      showMessage({
        message:
          "Please select Arrival  Minutes",
        type: "danger",
      });
      return;
    }

    // else if (this.state.AMPM.trim() == "") {
    //   showMessage({
    //     message:
    //       "Please select AM or PM",
    //     type: "danger",
    //   });
    //   return;
    // }
    else if (this.state.stayDuration.trim() == "" || parseInt(this.state.stayDuration.trim()) < 0) {
      showMessage({
        message:
          "Please enter Stay Duration",
        type: "danger",
      });
      return;
    }
    else if (this.state.idType.trim() == "") {
      showMessage({
        message:
          "Please Select ID",
        type: "danger",
      });
      return;
    }
    else if (this.state.numberOfGuests == "" || this.state.numberOfGuests == 0 || parseInt(this.state.numberOfGuests.trim()) < 0) {
      showMessage({
        message:
          "Please enter Number of Guests",
        type: "danger",
      });
      return;
    }
    else if (this.state.travelingFrom.trim() == "") {
      showMessage({
        message:
          "Please enter Country/City",
        type: "danger",
      });
      return;
    }

    else if (this.state.numberOfRooms == "" || this.state.numberOfRooms == 0 || parseInt(this.state.numberOfRooms.trim()) < 0) {
      showMessage({
        message:
          "Please enter Number of Rooms",
        type: "danger",
      });
      return;
    }
    //Alert.alert("Alert Message", "This feature is under development");
    //return;

    if (this.state.isLoading) return;

    this.setState({ isLoading: true });
    Animated.timing(this.buttonAnimated, {
      useNativeDriver: false,
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();
    
        var checkinFormData={
          UserVisitDetailId: this.state.UserVisitDetailId,
          GuestName: this.state.guestName.trim(),
          Gender: this.state.gender.trim(),
          Age: parseInt(this.state.age),
          Email: this.state.email.trim(),
          PhoneNumber: this.state.phoneNumber.trim(),
          CheckInDate: this.state.travellerCheckInDate,
          CheckOutDate: this.state.travellerCheckOutDate,
          // ArivalTime: this.state.hour + ':' + this.state.minutes,
          ArivalTime: this.state.hourAMPM + ':' + this.state.minutes,
          StayDuration: parseInt(this.state.stayDuration),
          IdType: this.state.idType.trim(),
          NumberOfGuests: parseInt(this.state.numberOfGuests),
          TravellingFrom: this.state.travelingFrom.trim(),
          NumberOfRooms: parseInt(this.state.numberOfRooms)
        };
       // console.log(this.state.hour+"Hours");
        NetInfo.fetch().then(state => 
        {
            if (state.isConnected && !OfflineData.isOfflineMode) 
            {
              fetch(Constant.API_URL + "travels/addcheckindetail", {
                method: 'Post',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(checkinFormData),
              })
                .then((response) => {
                  const statusCode = response.status;
                  const result = response.json();
                  setTimeout(()=>this.setState({isSpinner:false}),1000)
                  return Promise.all([statusCode, result]);
                })
                .then(([res, result]) => {
                  if (res == 200) {
                    //Actions.indexScreen();
                    //this.props.navigation.navigate("ViewTravelRequestScreen");
                    // const navigateAction = NavigationActions.navigate({ routeName: 'ViewTravelRequestScreen' });
                    // this.props.navigation.dispatch(navigateAction);
                    showMessage({
                      message: "Checked in Successfully",
                      type: "success",
                    });
                    
                    this.setState({ isLoading: false });
                    this.buttonAnimated.setValue(0);
                    this.textClear();
                    const navigateAction = NavigationActions.navigate({ routeName: 'LocationDetailsScreen',params: { id: this.props.navigation.getParam('id') }  });
                    this.props.navigation.dispatch(navigateAction);
                    setTimeout(()=>this.setState({isSpinner:false}),1000)
                    // setTimeout(() => {
                    //   this.setState({ isLoading: false });
                    //   this.buttonAnimated.setValue(0);
                    //   //this.props.navigation.navigate("ViewTravelRequestScreen");
                    //   Actions.locationDetailsScreen({ id: this.state.LocationId });
                    // }, 1000);
                  }
                  else {
                  // console.log(result);
                    showMessage({
                      message: "Some error occured, please try after some time.",
                      type: "danger",
                    });
                    this.setState({ isLoading: false });
                    this.buttonAnimated.setValue(0);
                  }
                  setTimeout(()=>this.setState({isSpinner:false}),1000)
                })
                .catch((error) => {
                  console.log(error);
                  setTimeout(()=>this.setState({isSpinner:false}),1000)
                });
            }
            else{
              (async () => { 
                  await OfflineData.storeCheckinFormData(checkinFormData);
                  showMessage({
                    message: "Checked in Successfully",
                    type: "success",
                  });

                  this.setState({ isLoading: false });
                  this.buttonAnimated.setValue(0);
                  this.textClear();
                  const navigateAction = NavigationActions.navigate({ routeName: 'LocationDetailsScreen',params: { id: this.props.navigation.getParam('id') }  });
                  this.props.navigation.dispatch(navigateAction);
                  setTimeout(()=>this.setState({isSpinner:false}),1000)
                  }
              )();                 
            }
          })

  }

  //On Cancel button function
  _onPressCancel() {
   // Actions.locationDetailsScreen({ id: this.state.LocationId });
   this.textClear();
   //console.log('test');
   //console.log(this.props.navigation.getParam('id'));
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
              //var id = this.state.id;
              fetch(Constant.API_URL + "users/getuser?id=" + this.props.navigation.getParam('Userid'), {
                method: 'GET',
              })
                .then((response) => {
                  //console.log(response);
                  const statusCode = response.status;
                  const result = response.json();
                 setTimeout(()=>this.setState({isSpinner:false}),1000);
                  return Promise.all([statusCode, result]);
                })
                .then(([res, result]) => {
                  //console.log(result);
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
                    isLoading:false
                  });
                  setTimeout(()=>this.setState({isSpinner:false}),1000);
                })
            }
            else
            {
              this.setState({ isLoading: false });
              setTimeout(()=>this.setState({isSpinner:false}),1000);
            }
      });
  }

  //Code to go back to home
  backToHome() {
    Actions.indexScreen();
  }

  //Set and update gender value
  setGenderValue(value) {
    console.log("gender value "+value)
    this.setState({ gender: value });
  }

  goToTop = () => {
    this.scroll.scrollTo({x: 0, y: 0, animated: true});
  }

  //Render function
  render() {
    //const scrollRef = useRef();

    // const [checked, setChecked] = React.useState('first');
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
        {/* <KeyboardAvoidingView behavior="padding" style={styles.container}> */}
        <View>
          <ScrollView ref={(c) => {this.scroll = c}}
           style={styles.scrollView} contentContainerStyle={styles.contentContainer} bounces={false} >
         {/*Spinner*/}
         
  <View style={styles.container}>
        <Spinner visible={this.state.isSpinner &&  Platform.OS === 'ios'}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle} 
            overlayColor='white' // overlay of Loader(spiner made white)
            color='green'
            /*overlayColor={'rgba(39,62,84,0.82)'}*/
            />
       </View>
         <KeyboardAwareScrollView>  
           <Spinner visible={this.state.isLoading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}/>

            {/* <View style={{
              flex: 1,
              flexDirection: 'row',
              paddingTop: 15,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              paddingBottom: 10,
              color: 'green',
              borderColor: 'gray'
            }}><Text style={{ fontSize: 20, color: 'green', fontWeight: 'bold' }}>Check In Form</Text></View>
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

            {/* Gender */}
            <View style={styles.inputWrapper, { marginBottom: 10 }}>
              {/* <text style={{ marginTop: 10 }}> */}
              <Text style={{ marginHorizontal: 20, fontWeight: "bold", marginBottom: 10 }}>Gender</Text>
              {/* </View> */}

              <View style={{ marginHorizontal: 20}}>
                <RadioForm
                 style={{}}
                  key={this.state.formKey}
                  radio_props={radio_props}
                  initial={-1}
                  buttonOuterSize={80}
                  radioStyle={{paddingRight: 20}}
                  // marginHorizontal={29}
                  labelHorizontal={true}
                  formHorizontal={true}
                  buttonColor={'green'}
                  borderWidth={1}
                  buttonInnerColor={'green'}
                  buttonOuterColor={'green'}
                  buttonSize={12}
                  buttonOuterSize={20}
                  //value={this.state.gender}
                  onPress={(value) => {
                    this.setGenderValue(value);
                  }}
                />
              </View>
            </View>

            {/* AGE */}
            <View style={styles.inputWrapper, { marginBottom: 10 }}>
              <View style={{ marginTop: 10 }}>
                <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>Age</Text>
              </View>
              {/* <Image source={phoneImg} style={styles.inlineImg} /> */}
              <TextInput
               // ref={ref => this.textInputRef = ref}
                onBlur={() => this._onBlur()}
                onFocus={() => this._onFocus()}
                underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                style={styles.input}
                source={phoneImg}
                placeholder="Enter age"
                autoCapitalize={'none'}
                returnKeyType={'done'}
                autoCorrect={false}
                value={this.state.age}
                //onChangeText = {text=>this.setState({ phoneNumber: text })}
                keyboardType="numeric"
                maxLength={3}
                onChangeText={text => {this.setState({ age: text.replace(/[^0-9]/g, '')});
                }}
              />
            </View>
            
            {/* Email Id */}
            <View style={styles.inputWrapper, { marginBottom: 10 }}>
              <View style={{ marginTop: 10 }}>
                <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>Email ID</Text>
              </View>
              {/* <Image source={phoneImg} style={styles.inlineImg} /> */}
              <TextInput
                onBlur={() => this._onBlur()}
                onFocus={() => this._onFocus()}
                underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                style={styles.input}
                source={emailImg}
                placeholder="Enter email id"
                autoCapitalize={'none'}
                returnKeyType={'done'}
                autoCorrect={false}
                value={this.state.email}
                //onChangeText = {text=>this.setState({ phoneNumber: text })}

                onChangeText={text => {
                  this.setState({
                    email: text
                  });
                }}
              />
            </View>

            {/* PHONE NUMBER*/}
            <View style={styles.inputWrapper, { marginBottom: 10 }}>
              <View style={{ marginTop: 10 }}>
                <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>Phone Number</Text>
              </View>
              {/* <Image source={phoneImg} style={styles.inlineImg} /> */}
              <TextInput
                onBlur={() => this._onBlur()}
                onFocus={() => this._onFocus()}
                underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                style={styles.input}
                source={phoneImg}
                placeholder="Enter phone number"
                autoCapitalize={'none'}
                returnKeyType={'done'}
                autoCorrect={false}
                value={this.state.phoneNumber}
                //onChangeText = {text=>this.setState({ phoneNumber: text })}
                keyboardType="numeric"
                onChangeText={text => {
                  this.setState({
                    phoneNumber: text.replace(/[^0-9]/g, ''),
                  });
                }}
              />
            </View>
                      
            {/* Date of Check-in */}
            <View style={styles.inputWrapper, { marginBottom: 10 }}>
              <View style={{ marginTop: 1, marginBottom: 10 }}>
                <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>Check In Date</Text>
              </View>
              <TouchableOpacity onPress={this.showCheckInDatepicker}>
                <Image source={calendarIcon} style={styles.inlineCalImg} />
                <TextInput value={this.state.checkInDate} editable={false} placeholder="Select date"
                 
                 style={{
                    // width: DEVICE_WIDTH - 40,
                    width: DEVICE_WIDTH *0.96,
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    // width: DEVICE_WIDTH * 0.45,
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
              {this.state.showCheckInDateCal && <DateTimePicker testID="checkInDateTimePicker"
                value={this.state.travellerCheckInDate}
                mode='date'
                is24Hour={true}
                display="default"
                minimumDate={new Date()}
                onChange={this.onCheckInDataChange}
              />}

            </View>

            {/* Date of Check Out */}
            <View style={styles.inputWrapper, { marginBottom: 10 }}>
              <View style={{ marginTop: 1, marginBottom: 10 }}>
                <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>Check Out Date</Text>
              </View>
              <TouchableOpacity onPress={this.showCheckOutDatepicker}>
                <Image source={calendarIcon} style={styles.inlineCalImg} />
                <TextInput value={this.state.checkOutDate} editable={false} placeholder="Select date"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    width: DEVICE_WIDTH *0.96,
                    // width: DEVICE_WIDTH * 0.45,
                    height: 35,
                     borderRadius: 20,
                    color: '#000000',
                    // borderWidth: 1,
                    borderColor: '#999999',
                    marginLeft: DEVICE_WIDTH * 0.06,
                    // borderRadius: 40,
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
                textColor="#000"
                value={this.state.travellerCheckOutDate}
                mode='date'
                is24Hour={true}
                display="default"
                minimumDate={new Date(this.state.travellerCheckInDate)}
                onChange={this.onCheckOutDataChange}
              />}
            </View>

            {/* Time of Arrival  */}
            <View style={styles.inputWrapper, { marginBottom: 0 }}>
              <View style={{ marginTop: 10 }}>
                <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>Time of Arrival </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", justifyContent: 'center', margin: 5 }}>
                <View style={{ marginLeft: 10, width: DEVICE_WIDTH * .32, alignContent: 'flex-start' }}>
                  <Picker
                    //value={this.state.hour}
                    selectedValue={this.state.hour}
                    onValueChange={(itemValueHour, itemIndex) => this.setState({ hour: itemValueHour })}
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
                <View style={{ width: DEVICE_WIDTH * .32, justifyContent: 'flex-end', alignContent: 'flex-end' }}>
                  <Picker
                    selectedValue={this.state.minutes}
                    onValueChange={(itemValueminutes, itemIndex) => this.setState({ minutes: itemValueminutes })}
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
                <View style={{ width: DEVICE_WIDTH * .32, justifyContent: 'flex-end', alignContent: 'flex-end' }}>
                  <Picker
                    selectedValue={this.state.AMPM}
                    onValueChange={(itemValueAMPM, itemIndex) => this.setState({ AMPM: itemValueAMPM })}
                    mode="dropdown">
                    <Picker.Item label="AM" value="AM" />
                    <Picker.Item label="PM" value="PM" />
                  </Picker>
                </View>
              </View>
            </View>
            
            {/* Stay Duration (No. of Nights) */}
            <View style={styles.inputWrapper, { marginBottom: 10 }}>
              <View style={{ marginTop: 10 }}>
                <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>Stay Duration (No. of Nights)</Text>
              </View>
              {/* <Image source={adressImg} style={styles.inlineImg} /> */}
              <TextInput
                onBlur={() => this._onBlur()}
                onFocus={() => {this._onFocus();
                  var dateDiff= (new Date(this.state.travellerCheckOutDate)-new Date(this.state.travellerCheckInDate));
                 
                  if(dateDiff>0)
                  {
                    this.state.stayDuration=Math.round(dateDiff / (1000 * 60 * 60 * 24)).toString();
                    //console.log(this.state.stayDuration);
                  }
                  }}
                underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                style={styles.input}
                source={phoneImg}
                placeholder="Enter stay duration (In Nights)"
                autoCapitalize={'none'}
                keyboardType="numeric"
                maxLength={3}
                returnKeyType={'done'}
                autoCorrect={false}
                value={this.state.stayDuration}
                //multiline
                onChangeText={text => {
                  this.setState({
                    stayDuration: text.replace(/[^0-9]/g, ''),
                  })
                }}
              />
            </View>

            {/* ID Type */}
            <View style={styles.inputWrapper, { marginBottom: 5 }}>
              <View style={{ marginTop: 10 }}>
                <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>ID Type</Text>
              </View>
              {/* <Image source={adressImg} style={styles.inlineImg} /> */}
              <View style={{
                 marginLeft: 10, 
                 width: DEVICE_WIDTH *0.96,
               // width: DEVICE_WIDTH * .8, 
                justifyContent: 'flex-end', 
                alignContent: 'flex-end' }}>
                <Picker
                  selectedValue={this.state.idType}
                  onValueChange={(itemValueidType, itemIndex) => this.setState({ idType: itemValueidType })}
                  mode="dropdown">
                  <Picker.Item label="Select ID" value="" />
                  <Picker.Item label="Passport" value="Passport" />
                  <Picker.Item label="Driving License" value="DrivingLicense" />
                  <Picker.Item label="Aadhaar" value="Aadhaar" />
                  <Picker.Item label="Voter ID" value="VoterID" />
                </Picker>
              </View>
            </View>

            {/* No. of Guests  */}
            <View style={styles.inputWrapper, { marginBottom: 10 }}>
              <View style={{ marginTop: 10 }}>
                <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>Number of Guests </Text>
              </View>
              {/* <Image source={adressImg} style={styles.inlineImg} /> */}
              <TextInput
                onBlur={() => this._onBlur()}
                onFocus={() => this._onFocus()}
                underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                style={styles.input}
                source={phoneImg}
                placeholder="Enter number of guests"
                autoCapitalize={'none'}
                keyboardType="numeric"
                maxLength={3}
                returnKeyType={'done'}
                autoCorrect={false}
                 value={this.state.numberOfGuests}
                //multiline
                onChangeText={text => this.setState({ numberOfGuests: text.replace(/[^0-9]/g, '') })}
              />
            </View>

            {/* Traveling from Country /City */}
            <View style={styles.inputWrapper, { marginBottom: 10 }}>
              <View style={{ marginTop: 10 }}>
                <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>Travelling from Country/City</Text>
              </View>
              {/* <Image source={adressImg} style={styles.inlineImg} /> */}
              <TextInput
                onBlur={() => this._onBlur()}
                onFocus={() => this._onFocus()}
                underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                style={styles.input}
                source={phoneImg}
                placeholder="Travelling from country /city"
                autoCapitalize={'none'}
                returnKeyType={'done'}
                autoCorrect={false}
                value={this.state.travelingFrom}
                //multiline
                onChangeText={text => { this.setState({ travelingFrom: text }) }}
              />
            </View>

            {/* //No of Rooms */}
            <View style={styles.inputWrapper}>
              <View style={{ marginTop: 10 }}>
                <Text style={{ marginHorizontal: 20, fontWeight: "bold" }}>Number of Rooms</Text>
              </View>
              {/* <Image source={adressImg} style={styles.inlineImg} /> */}
              <TextInput
                onBlur={() => this._onBlur()}
                onFocus={() => this._onFocus()}
                underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                style={styles.input}
                source={phoneImg}
                placeholder="Number of rooms"
                keyboardType="numeric"
                maxLength={3}
                autoCapitalize={'none'}
                returnKeyType={'done'}
                autoCorrect={false}
                value={this.state.numberOfRooms}
                //multiline
                onChangeText={text => { this.setState({ numberOfRooms: text.replace(/[^0-9]/g, '') }) }}
              />
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
          </View>
        {/* </KeyboardAvoidingView> */}
      </Wallpaper>
    );
  }
}


const MARGIN = 40;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 10,
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
    // margin: 5
    margin: 6
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
    marginLeft:5,
    marginRight:5,
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

});