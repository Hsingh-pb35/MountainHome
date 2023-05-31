import React, {Component,useState } from 'react';
import PropTypes, { bool } from 'prop-types';
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
  FlatList
} from 'react-native';
import Moment from 'moment';
import usernameImg from '../images/username.png';
import spinner from '../images/loading.gif';
import calendarIcon from '../images/calendar.png';
import {Actions} from 'react-native-router-flux';
import { showMessage, hideMessage } from "react-native-flash-message";
import Constant from './Constant';
import Wallpaper from './Wallpaper';
import AsyncStorage from '@react-native-community/async-storage';
import emailImg from '../images/email.png';
import phoneImg from '../images/phone.png';
import DateTimePicker from '@react-native-community/datetimepicker';
import backIcon from '../images/back.png';
import { ScrollView } from 'react-native-gesture-handler';
import adressImg from '../images/adressicon.png';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const MARGIN = 40;
export default class TravelRequestScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPass: true,
      press: false,
      isLoading: false,

      //User Visit Details
      id:'',
      LocationId:this.props.navigation.getParam('locationId'),//this.props.locationId,
      HomeStayId:'',
      QRCode:'',
      IsCheckIn:'',
      CheckInDate:'',
      UserRating:'',
      VisitStatus:'',
      Comment:'',
      CheckInDate:'',
      Amount:'0',
      locationName:this.props.navigation.getParam('locationName'),//this.props.locationName,
      Address:this.props.navigation.getParam('Address'),//this.props.Address,
      //User Visit Memeber Details
      MemberfirstName:'',
      MemberlastName: '',
      MemberphoneNumber:'',
      Memberemail:'',  
      date: new Date(),
      show:false,
      VisitStartDate:'',
      MemberAddress: '',
      itemList:[{
        Id:this.guidGenerator(),
        Name:'',
        Email:'',
        Phone: '',
        Address:'',
      }],
      textInputsName: [],
      textInputsEmail: [],
      textInputsPhone: [],
      textInputsAddress: [],
    };

//login user Id get
AsyncStorage.getItem("id").then((value) => {
  this.setState({
     id : value
    })
});

  
    this._GetUserData = this._GetUserData.bind(this);
    this.showPass = this.showPass.bind(this);
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
    this._onPressCancel=this._onPressCancel.bind(this);
    this.CancelbuttonAnimated = new Animated.Value(0);
    this.showDatepicker=this.showDatepicker.bind(this);
    this.AddMoreMember=this.AddMoreMember.bind(this);
    //this.RemoveTravellerMember=this.RemoveTravellerMember.bind(this);
  }

  componentDidUpdate(prevProps) {
    //console.log(this.state.id+"Test componentDidUpdate");
    if(this.props.navigation.getParam('locationId')!==prevProps.navigation.getParam('locationId')){
      this.textClear();
      this.setState({
        LocationId:this.props.navigation.getParam('locationId'), 
        locationName:this.props.navigation.getParam('locationName'),
        Address:this.props.navigation.getParam('Address'),
      })
   }
  }

  showPass() {
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false});
  }
 
  showDatepicker () {
    this.setState({show:true});
  };

  AddMoreMember()
  {
    if(this.state.itemList.length != this.state.textInputsName.length ||
      this.state.itemList.length != this.state.textInputsEmail.length ||
      this.state.itemList.length != this.state.textInputsPhone.length)
    {
      showMessage({
        message: 
        "Please enter Name, Email and Phone",
        type: "danger",
      });
      return;
    }


    // if(this.state.textInputsName.length >0)
    // {
    //     // Email validation
    //     let emailId= this.state.textInputsName[this.state.textInputsName.length-1];
    //     let reg = /[^A-Za-z]/ig;
    //     if (reg.test(emailId) === false) {
    //           showMessage({
    //             message: 
    //             "Please enter valid name",
    //             type: "danger",
    //           });
    //           return false;
    //     }
    // }


    if(this.state.textInputsEmail.length >0)
    {
        // Email validation
        let emailId= this.state.textInputsEmail[this.state.textInputsEmail.length-1];
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(emailId) === false) {
              showMessage({
                message: 
                "Please enter valid Email",
                type: "danger",
              });
              return false;
        }
    }

    if(this.state.textInputsPhone.length >0)
    {
        // Phone validation
        let phoneNumber= this.state.textInputsPhone[this.state.textInputsPhone.length-1];
        //let reg =  /^[0-9]+$/;
        let reg = /^[0]?[123456789]\d{9,14}$/;
        if (reg.test(phoneNumber) === false) {
              showMessage({
                message: 
                "Please enter valid Phone Number",
                type: "danger",
              });
              return false;
        }
    }

    var joined = this.state.itemList.concat({
      Id:this.guidGenerator(),
      Name:'',
      Email:'',
      Phone: '',
      Address:'',
    });
    this.setState({itemList:joined});
    
  };

  RemoveTravellerMember= (id, index) =>
  {
    Alert.alert(
      "Remove member",
      "Are you sure you want to remove this Fellow Member?",
      [
        { text: "Yes", 
         onPress: () => {
          this.setState({
            textInputsName: this.state.textInputsName.filter((_, i) => i !== index)
          });
          this.setState({
            textInputsPhone: this.state.textInputsPhone.filter((_, i) => i !== index)
          });
          this.setState({
            textInputsEmail: this.state.textInputsEmail.filter((_, i) => i !== index)
          });
          this.setState({
            textInputsAddress: this.state.textInputsAddress.filter((_, i) => i !== index)
          });
          
          const filteredData = this.state.itemList.filter(item => item.Id !== id);
          this.setState({ itemList: filteredData });
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

  guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


 onDataChange = (event, selectedDate) => {
    let currentDate = selectedDate || this.state.date;
    this.setState({
      date : currentDate,
      VisitStartDate:Moment(currentDate).format('DD-MM-YYYY').toString(),
      show:false
    });
  };

  _onPress() { 

    console.log("this.state.id"+this.state.id);
    console.log("this.state.id"+this.state.LocationId);

          let memberData=[];
          //validation 
          if(this.state.VisitStartDate.trim() == "")
          {
            showMessage({
              message: 
              "Please select Visit Start Date",
              type: "danger",
            });
            return;
          }
          // if(this.state.itemList.length > 0 && this.state.textInputsName.length >0)
          // {
          //   console.log("test");
          // }
       
          // if(this.state.itemList.length > 0 && this.state.textInputsName[this.state.textInputsName.length]!=null && this.state.textInputsName[this.state.textInputsName.length]!="undefined" && this.state.textInputsName[this.state.textInputsName.length].trim() !="")
          // {

            //console.log("Test:"+this.state.textInputsName[this.state.itemList.length -1]);
            if(this.state.itemList.length > 0 && this.state.textInputsName[this.state.itemList.length -1] !=null && this.state.textInputsName[this.state.itemList.length -1] !="")
            {
              //console.log("dfgffg");

              if(this.state.itemList.length != this.state.textInputsName.length ||
                this.state.itemList.length != this.state.textInputsEmail.length ||
                this.state.itemList.length != this.state.textInputsPhone.length)
              {
                showMessage({
                  message: 
                  "Please enter Name, Email and Phone",
                  type: "danger",
                });
                return;
              }

              if(this.state.textInputsName.length >0)
              {
                  // Name validation
                
                  let nameText= this.state.textInputsName[this.state.textInputsName.length-1];
                  let reg = /^(?:[A-Za-z]+|\d+)$/;
                  if (reg.test(nameText) === false) {
                        showMessage({
                          message: 
                          "Please enter valid Name",
                          type: "danger",
                        });
                        return false;
                  }
              }

              if(this.state.textInputsEmail.length >0)
              {
                  // Email validation
                  let emailId= this.state.textInputsEmail[this.state.textInputsEmail.length-1];
                  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                  if (reg.test(emailId) === false) {
                        showMessage({
                          message: 
                          "Please enter valid Email",
                          type: "danger",
                        });
                        return false;
                  }
              }
    
              if(this.state.textInputsPhone.length >0)
              {
                  // Phone validation
                  let phoneNumber= this.state.textInputsPhone[this.state.textInputsPhone.length-1];
                  //let reg =  /^[0-9]+$/;
                  let reg = /^[0]?[123456789]\d{9,14}$/;
                  if (reg.test(phoneNumber) === false) {
                        showMessage({
                          message: 
                          "Please enter valid Phone Number",
                          type: "danger",
                        });
                        return false;
                  }
              }
          }

            let counter=0;
            this.state.textInputsName.map((option, key) => 
            {
                if(this.state.itemList[counter].Name!=null && this.state.itemList[counter].Name!="undefined")
                {
                  this.state.itemList[counter].Name=option;
                }
                counter++;
            });
            counter=0;
            this.state.textInputsEmail.map((option, key) => 
            {
                if(this.state.itemList[counter].Email!=null && this.state.itemList[counter].Email!="undefined")
                {
                  this.state.itemList[counter].Email=option;
                }
                counter++;
            });
            counter=0;
            this.state.textInputsPhone.map((option, key) => 
            {
                if(this.state.itemList[counter].Phone!=null && this.state.itemList[counter].Phone!="undefined")
                {
                  this.state.itemList[counter].Phone=option;
                }
                counter++;
            });
            counter=0;
            this.state.textInputsAddress.map((option, key) => 
            {
                if(this.state.itemList[counter].Address!=null && this.state.itemList[counter].Address!="undefined")
                {
                  this.state.itemList[counter].Address=option;
                }
            });

              //console.log(this.state.itemList);
              this.state.itemList.map(data=>
              {
                let firstName=data.Name;
                let lastName='';
                let strNameList=data.Name.split(' ');
                if(strNameList.length>1)
                {
                  firstName=strNameList[0];
                  lastName=strNameList[1];
                }

                if(firstName.trim()!="")
                {
                  memberData.push({
                      FirstName:firstName,//this.state.MemberfirstName,
                      LastName:lastName,//this.state.MemberlastName,
                      email:data.Email,
                      PhoneNumber:data.Phone,
                      Address:data.Address,
                    })
                }
              });
     

    //Alert.alert("Alert Message", "This feature is under development");
    //return;
     //console.log(memberData+"memberData");
     //console.log(this.state.date+"this.state.date");

     //console.log(Number(this.state.id),this.state.LocationId+"Tesast");
    if (this.state.isLoading) return;

    this.setState({isLoading: true});
    Animated.timing(this.buttonAnimated, {
      useNativeDriver: false,
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();
    
 //API Post
    fetch(Constant.API_URL + "travels/addtravelrequest", {
      method: 'Post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserId:Number(this.state.id),
        LocationId:this.state.LocationId,
        VisitStatus:3,
        Amount:this.state.Amount,
        VisitStartDate: this.state.date,//this.state.VisitStartDate,
        UserVisitMemberDetails:memberData,
      })
      })
      .then((response) =>{ 
        const statusCode = response.status;
        const result = response.json();
        return Promise.all([statusCode, result]);
       })
      .then(([res, result]) => {
        if(res==200)
        {

              //Actions.indexScreen();
              //this.props.navigation.navigate("ViewTravelRequestScreen");
              // const navigateAction = NavigationActions.navigate({ routeName: 'ViewTravelRequestScreen' });
              // this.props.navigation.dispatch(navigateAction);
              showMessage({
                message: "Travel request added Successfully",
                type: "success",
              });    
              setTimeout(() => {
                this.setState({isLoading: false});
                this.buttonAnimated.setValue(0);
                //this.props.navigation.navigate("ViewTravelRequestScreen");
                Actions.indexScreen();
              }, 2300);
        }
        else
        {
          console.log(result);
          showMessage({
            message: "Some error occured, please try after some time",
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

 textClear() {
    console.log("textClear")
    
    this.setState({
      VisitStartDate:"",
    })

    this.setState({
      textInputsName:[],
      textInputsEmail:[],
      textInputsPhone:[],
      textInputsAddress:[],
      //itemList:[],
    })
   
  };
//cancel button function
_onPressCancel() { 
  this.textClear();
  //console.log(this.state.LocationId +'o press cancel');
  // Actions.locationDetailsScreen({id:this.state.LocationId});
  const navigateAction = NavigationActions.navigate({ routeName: 'LocationDetailsScreen',params: { id: this.state.LocationId}  });
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


  _GetUserData() {
    var id=this.state.id;
    fetch(Constant.API_URL + "users/getuser?id="+id,{
      method: 'GET',
       })
       .then((response) =>{ 
         
        //console.log(response.status);
        const statusCode = response.status;
        const result = response.json();
        return Promise.all([statusCode, result]);
       })
       .then(([res, result]) => {

        //console.log(result);
        this.setState({
          firstName: result.firstName,
          lastName: result.lastName,
          phoneNumber: result.phoneNumber,
          email:result.email,
          Status:result.Status,
          username:result.username,
         })

      })
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
  
  Capitalize(str){

    return str.charAt(0).toUpperCase() + str.slice(1);

    }

    Validname(str){
      console.log(str+"Validname");
    //  str.charAt(0).toUpperCase() + str.slice(1);
      return (str.replace(/[^A-Za-z]/ig, '' ));
    }

  backToHome()
  {
    //console.log(this.state.locationId+'back to home');
    //Actions.locationDetailsScreen({id:this.state.LocationId});
    const navigateAction = NavigationActions.navigate({ routeName: 'LocationDetailsScreen',params: { id: this.state.LocationId}  });
    this.props.navigation.dispatch(navigateAction);
  }
  render() {
    Moment.locale('en');
    var locationId=this.props.locationId;
    var locationName=this.props.locationName;
    var Address=this.props.Address;
    // console.log(locationId);
    // console.log(locationName);
    // console.log(Address);
    

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
       {/* <KeyboardAvoidingView behavior="padding" style={styles.container}> */}
       <KeyboardAwareScrollView>
         <ScrollView bounces={false}>
            <View style={{paddingBottom: 30}}>  
                {/* <View style={{flex:1, flexDirection:'row'}}>
                          <TouchableOpacity onPress={() => this.backToHome()} activeOpacity={1}>
                            <Image source={backIcon}
                                style={{ width: 40, height: 40, borderRadius: 40, marginTop:DEVICE_HEIGHT*0.01 }}/>
                          </TouchableOpacity>
                          <Text style={{alignItems:'center', color:'green', fontSize:15, 
                            marginLeft: DEVICE_WIDTH * 0.23, fontWeight:'bold',marginTop:DEVICE_HEIGHT*0.03 }}>Travel Request</Text>
              </View> */}

                <View style={{flex:1, flexDirection:'row'}}>
                          <Text
                           style={{marginLeft: DEVICE_WIDTH * 0.09,borderRadius: 40, fontSize:15,marginTop:DEVICE_HEIGHT*0.01, fontWeight:'bold' }}>
                             Location   :  
                             </Text>
                          <Text style={{alignItems:'center',fontSize:15,marginTop:DEVICE_HEIGHT*0.01,
                            marginLeft: DEVICE_WIDTH * 0.05 }}>{this.state.locationName}</Text>
                      </View>

                <View style={{flex:1, flexDirection:'row'}}>
                          <Text
                           style={{marginLeft: DEVICE_WIDTH * 0.09,borderRadius: 40,fontSize:15, marginTop:DEVICE_HEIGHT*0.01, fontWeight:'bold' }}>
                             Address    :
                             </Text>
                          <Text style={{alignItems:'center',fontSize:15,marginTop:DEVICE_HEIGHT*0.01,
                            marginLeft: DEVICE_WIDTH * 0.05, marginRight:DEVICE_WIDTH * 0.29}}>{this.state.Address}</Text>
                      </View>

                <View style={{flex:1, flexDirection:'row'}}>
                   <Text
                      style={{marginLeft: DEVICE_WIDTH * 0.09,borderRadius: 40,fontSize:15, marginTop:DEVICE_HEIGHT*0.02, fontWeight:'bold' }}>
                      Start Date :
                    </Text>
                  <View style={styles.inputWrapper}>
                  <TouchableOpacity onPress={this.showDatepicker}>
                    <Image source={calendarIcon} style={styles.inlineCalImg} />
                    <TextInput value={this.state.VisitStartDate} editable={false} placeholder="Select date"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.4)',
                      width: DEVICE_WIDTH*0.45,
                      height: 35,
                      borderRadius: 20,
                      color: '#000000',
                      // borderWidth: 1,
                      borderColor: '#999999',
                      marginLeft: DEVICE_WIDTH * 0.02,
                      borderRadius: 40,
                      fontSize:15, 
                      marginTop:DEVICE_HEIGHT*0.001, 
                      padding:2,
                      paddingLeft:11,
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
                    {this.state.show && <DateTimePicker testID="dateTimePicker"
                                value={this.state.date}
                                mode='date'
                                is24Hour={true}
                                display="default"
                                minimumDate={new Date()}
                                onChange={this.onDataChange}
                    />}
                  </View>
              </View>
                <View style={{ borderBottomColor: '#999999', borderBottomWidth: 0.8,margin:15}}/>
                <View style={styles.inputWrapper}>
                              <Text style={styles.HedingText}>Add Fellow Member Details</Text>
                </View>
                        <FlatList
                              data={this.state.itemList}
                              //extraData={this.state}
                              renderItem={ ({ item, index }) => 
                              (
                               
                            <View key={index.toString()}>
                                <Text style={{marginLeft: DEVICE_WIDTH * 0.06,borderRadius: 40, fontSize:15,marginTop:DEVICE_HEIGHT*0.01}}>Traveller {index+1} :</Text>
                                <View style={styles.inputWrapper}>
                                <Image source={usernameImg} style={styles.inlineImg} />
                                <TextInput 
                                       onBlur={ () => this._onBlur() }
                                       onFocus={ () => this._onFocus() }
                                       underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                                        style={styles.input}
                                        source={usernameImg}
                                        placeholder="Enter Name"
                                        autoCapitalize={'none'}
                                        returnKeyType={'done'}
                                        autoCorrect={false}
                                        // onChangeText = {text=>this.setState({ MemberfirstName: text })}
                                        // value={this.state.MemberfirstName}
                                    

                                        onChangeText={text => {
                                          let { textInputsName } = this.state//this.state;
                                          textInputsName[index] =this.Validname(text);
                                          // textInputsName[index] = this.Capitalize(text);
                                    
                                          this.setState({
                                            textInputsName,
                                          });

                                               
                                        }}

                                        value={this.state.textInputsName[index]}
                                        />
                              </View>
                              <View style={styles.inputWrapper}>
                                <Image source={emailImg} style={styles.inlineImg} />
                                <TextInput 
                                       onBlur={ () => this._onBlur() }
                                       onFocus={ () => this._onFocus() }
                                       underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                                        style={styles.input}
                                        source={emailImg}
                                        placeholder="Enter Email"
                                        autoCapitalize={'none'}
                                        returnKeyType={'done'}
                                        autoCorrect={false}
                                        // onChangeText = {text=>this.setState({ Memberemail: text })}
                                        // value={this.state.Memberemail}
                                        onChangeText={text => {
                                          let { textInputsEmail } = this.state;
                                          textInputsEmail[index] = text;
                                          this.setState({
                                            textInputsEmail,
                                          });
                                        }}
                                        value={this.state.textInputsEmail[index]}
                                        />
                          </View>
                            <View style={styles.inputWrapper}>
                                <Image source={phoneImg} style={styles.inlineImg} />
                                <TextInput 
                                       onBlur={ () => this._onBlur() }
                                       onFocus={ () => this._onFocus() }
                                       underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                                        keyboardType="numeric"
                                        style={styles.input}
                                        source={phoneImg}
                                        placeholder="Enter Phone Number"
                                        autoCapitalize={'none'}
                                        returnKeyType={'done'}
                                        autoCorrect={false}
                                        // onChangeText = {text=>this.setState({ MemberphoneNumber: text })}
                                        // value={this.state.MemberphoneNumber}
                                        onChangeText={text => {
                                          let { textInputsPhone } = this.state;
                                          textInputsPhone[index] = text;
                                          this.setState({
                                            textInputsPhone,
                                          });
                                        }}
                                        value={this.state.textInputsPhone[index]}
                                        />
                </View>
                <View style={styles.inputWrapper}>
                                <Image source={adressImg} style={styles.inlineImg} />
                                <TextInput 
                                       onBlur={ () => this._onBlur() }
                                       onFocus={ () => this._onFocus() }
                                       underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                                        style={styles.input}
                                        source={adressImg}
                                        placeholder="Enter City/Location"
                                        autoCapitalize={'none'}
                                        returnKeyType={'done'}
                                        autoCorrect={false}
                                        // onChangeText = {text=>this.setState({ MemberAddress: text })}
                                        // value={this.state.MemberAddress}
                                        onChangeText={text => {
                                          let { textInputsAddress } = this.state;
                                          textInputsAddress[index] = this.Capitalize(text);
                                          this.setState({
                                            textInputsAddress,
                                          });
                                        }}
                                        value={this.state.textInputsAddress[index]}
                                        />
                          </View>
                          {index != this.state.itemList.length -1 ? (
                            <View style={{marginTop:4}}>
                                  <TouchableOpacity style={styles.buttonRemoveMember}
                                                    onPress={ () => this.RemoveTravellerMember(item.Id, index)}
                                                      activeOpacity={2}>
                                                       <View style={{flex:1, flexDirection:'row'}}>
                                                          <Text style={styles.addMorePlus}>- </Text>
                                                          <Text style={styles.addMoreText}>Remove Traveller</Text>
                                                      </View>
                                        </TouchableOpacity> 
                                    <View style={{ borderBottomColor: '#999999', borderBottomWidth: 1,margin:10}}/>
                            </View>
                            // <View style={{ borderBottomColor: '#999999', borderBottomWidth: 1,margin:10}}/>
                                ) : (
                                  <View></View>
                                )}
                
                 
                    </View>
                                
                              )}
                              keyExtractor={(item, index) => index.toString()}
                          />
                <TouchableOpacity style={styles.buttonAddMore}
                        onPress={this.AddMoreMember}
                      activeOpacity={2}>
                        <View style={{flex:1, flexDirection:'row'}}>
                          <Text style={styles.addMorePlus}>+ </Text>
                          <Text style={styles.addMoreText}>Add Traveller</Text>
                        </View>
                </TouchableOpacity> 
           
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
                                style={[styles.circle, {transform: [{scale: changeScale}]}]}
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
          
           
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      {/* </KeyboardAvoidingView> */}
   
    </Wallpaper>
   );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    //flex: DEVICE_HEIGHT*0.9,
    //top:DEVICE_HEIGHT*0.04,
  },

  containerSubmit: {
    // flex: DEVICE_HEIGHT*0.9,
    // top: DEVICE_HEIGHT*0.01,
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 5
  },
  containerCancel: {
    // flex: DEVICE_HEIGHT*2,
    // top: DEVICE_HEIGHT*0.01,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  button: {
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: '#4b9445',
    // height: MARGIN,
    // borderRadius: 20,
    // zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4b9445',
    height: MARGIN,
    borderRadius: 10,
    zIndex: 100,
  },
  
  buttonAddMore: {
    alignItems: 'center',
    //justifyContent: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#4b9445',
    height: MARGIN,
    width: DEVICE_WIDTH*0.35,
    borderRadius: 10,
    zIndex: 100,
    marginRight: DEVICE_WIDTH*0.06,
    marginTop:4,
  },

  buttonRemoveMember: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: 'red',
    height: MARGIN,
    width: DEVICE_WIDTH*0.45,
    borderRadius: 10,
    zIndex: 100,
    marginRight: DEVICE_WIDTH*0.06,
  },

  Cancelbutton: {
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'red',
    // height: MARGIN,
    // borderRadius: 20,
    // zIndex: 100,
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
  // addMoreText: {
  //   textAlign:"center",
  //   color: 'white',
  //   backgroundColor: 'transparent',
  //   fontSize:30,
  // },
  textCancel: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  image: {
    width: 24,
    height: 24,
  },

  input: {
    // backgroundColor: 'rgba(255, 255, 255, 0.4)',
    // width: DEVICE_WIDTH - 40,
    // height: 40,
    // marginHorizontal: 20,
    // paddingLeft: 45,
    // borderRadius: 20,
   
    // color: '#000000',
    // borderColor: '#999999',
    // borderWidth: 1,
    // zIndex:999,


    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: DEVICE_WIDTH - 40,
    height: 40,
    marginHorizontal: 20,
    paddingLeft: 5,
    //borderRadius: 20,
    color: '#000000',
    //borderColor: '#999999',
    //borderWidth: 1,
    borderBottomWidth: (Platform.OS === 'ios') ? 1 : 0,
    borderBottomColor:(Platform.OS === 'ios') ? 'gray' : 'transparent',
  },
  inputWrapper: {
    flex: DEVICE_HEIGHT*0.8,
    //margin:4
    marginTop:7
  },
  inlineImg: {
    // position: 'absolute',
    // zIndex: 99,
    // width: 22,
    // height: 22,
    // left: 35,
    // top: 9,
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: DEVICE_WIDTH*0.85,
    top: 5,
  },
  inlineCalImg: {
    position: 'absolute',
    zIndex: 99,
    width: 25,
    height: 25,
    // left: DEVICE_WIDTH*0.4,
    left: DEVICE_WIDTH * 0.56,
    top: 5,
  },
  HedingText: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft:DEVICE_WIDTH*0.09,
    marginLeft:DEVICE_WIDTH*0.06,
    color: 'green',
    backgroundColor: 'transparent',
    fontSize:15,
    fontWeight:'bold'
  },
  addMoreText: {
    alignItems: 'center',
    justifyContent: 'center',
    //marginLeft:DEVICE_WIDTH*0.09,
    color: 'white',
    backgroundColor: 'transparent',
    fontSize:15,
    marginTop: 9
  },
  addMorePlus: {
    alignItems: 'center',
    justifyContent: 'center',
    //marginLeft:DEVICE_WIDTH*0.09,
    color: 'white',
    backgroundColor: 'transparent',
    fontSize:15,
    marginTop: 9,
    fontWeight:"bold"
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
  },
  datePickerStyle: {
    width: 200,
    marginTop: 20,
  },
});
