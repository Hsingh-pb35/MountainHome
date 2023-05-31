import React, {Component,useState } from 'react';
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
  ScrollView ,
  FlatList,
  SafeAreaView,
  Alert,
  target,
  Button,
  SectionList,
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
import phoneImg from '../images/phone.png';

const MARGIN = 40;

export default class ViewTravelRequestMemberScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
      isLoading: false,
      id:'',
      Userid:'',
      locationId:'',
      //lcation field
      itemList:[],
      //Member
      userVisitMemberDetails:[],
      firstName:'',
      lastName:'',
      phoneNumber:'',
      email:'',
      MemberAddress:'',
    };
//login user Id get
AsyncStorage.getItem("id").then((value) => {
  this.setState({
     Userid : value
    })
    this._GetUserData();
});
    this._GetUserData = this._GetUserData.bind(this);
    this.showPass = this.showPass.bind(this);
  }

  showPass() {
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false});
  }

  _GetUserData() {
   // var id=this.state.id;

   //console.log(this.state.Userid+'user id');
   //console.log(this.state.locationId+'location id');

    fetch(Constant.API_URL + "travels/gettravellersbyuseridandlocationid?userId="+this.state.Userid+"&locationId="+this.state.locationId,{
      method: 'GET',
       })
       .then((response) =>{ 
         
        console.log(response.status);
        const statusCode = response.status;
        const result = response.json();
        return Promise.all([statusCode, result]);
       })
       .then(([res, result]) => {
        console.log(result);
           
        this.setState({
          itemList:result,
         });
      })
}
  render() {

      var locationId=this.props.locationId;
      this.state.locationId=locationId;
      //console.log(locationId+'locationId');
    return (
     <Wallpaper>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <ScrollView bounces={false}>
               <View style={{paddingBottom: 10}}>
                  <View>
                     <View>
                        <View>
                            <FlatList bounces={false}
                              data={this.state.itemList}
                              renderItem={ ({ item, index }) => (
                                <View>
                                      <View style={{paddingBottom: 10}}>      
                                          <View style={{flex:1, flexDirection:'row'}}>
                                              <Text
                                                style={{marginLeft: DEVICE_WIDTH * 0.09,borderRadius: 40, fontSize:15,marginTop:DEVICE_HEIGHT*0.01, fontWeight:'bold' }}>
                                                  First Name       :  
                                               </Text>
                                              <Text style={{alignItems:'center',fontSize:15,marginTop:DEVICE_HEIGHT*0.01,
                                                marginLeft: DEVICE_WIDTH * 0.05 }}>{item.firstName}
                                              </Text>
                                          </View>

                                          <View style={{flex:1, flexDirection:'row'}}>
                                              <Text
                                              style={{marginLeft: DEVICE_WIDTH * 0.09,borderRadius: 40,fontSize:15, marginTop:DEVICE_HEIGHT*0.01, fontWeight:'bold' }}>
                                                Last Name        :
                                                </Text>
                                              <Text style={{alignItems:'center',fontSize:15,marginTop:DEVICE_HEIGHT*0.01,
                                                marginLeft: DEVICE_WIDTH * 0.05, marginRight:DEVICE_WIDTH * 0.29}}>{item.lastName}</Text>
                                          </View>

                                          <View style={{flex:1, flexDirection:'row'}}>
                                              <Text
                                              style={{marginLeft: DEVICE_WIDTH * 0.09,borderRadius: 40,fontSize:15, marginTop:DEVICE_HEIGHT*0.01, fontWeight:'bold' }}>
                                                Phone Number :
                                                </Text>
                                              <Text style={{alignItems:'center',fontSize:15,marginTop:DEVICE_HEIGHT*0.01,
                                                marginLeft: DEVICE_WIDTH * 0.05, marginRight:DEVICE_WIDTH * 0.29}}>{item.phoneNumber}</Text>
                                          </View>

                                          <View style={{flex:1, flexDirection:'row'}}>
                                              <Text
                                              style={{marginLeft: DEVICE_WIDTH * 0.09,borderRadius: 40,fontSize:15, marginTop:DEVICE_HEIGHT*0.01, fontWeight:'bold' }}>
                                                Email                 :
                                                </Text>
                                              <Text style={{alignItems:'center',fontSize:15,marginTop:DEVICE_HEIGHT*0.01,
                                                marginLeft: DEVICE_WIDTH * 0.05, marginRight:DEVICE_WIDTH * 0.29}}>{item.email}</Text>
                                          </View>

                                          <View style={{flex:1, flexDirection:'row'}}>
                                              <Text
                                              style={{marginLeft: DEVICE_WIDTH * 0.09,borderRadius: 40,fontSize:15, marginTop:DEVICE_HEIGHT*0.01, fontWeight:'bold' }}>
                                                Address             :
                                                </Text>
                                              <Text style={{alignItems:'center',fontSize:15,marginTop:DEVICE_HEIGHT*0.01,
                                                marginLeft: DEVICE_WIDTH * 0.05, marginRight:DEVICE_WIDTH * 0.29}}>{item.MemberAddress}</Text>
                                          </View>

                                          <View>
                                              <View style={{ borderBottomColor: '#999999', borderBottomWidth: 1, marginLeft:10, marginRight:10, paddingTop:10}}/>
                                          </View>
                                       </View>
                                </View>
                              )}
                              keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
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
    flex: 1.2,
    top:5,
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


