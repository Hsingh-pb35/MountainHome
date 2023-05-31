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
import Modal from 'react-native-modal';
import Moment from 'moment';
import UserInput from './UserInput';
import ButtonSubmit from './ButtonSubmit';
import SignupSection from './SignupSection';
//  import FlashMsgScreen from './FlashMsgScreen';
import NewFlashMessage from "react-native-flash-message";
import usernameImg from '../images/username.png';
import passwordImg from '../images/password.png';
import eyeImg from '../images/eye_black.png';
import Spinner from 'react-native-loading-spinner-overlay';
import {Actions, ActionConst} from 'react-native-router-flux';

import { showMessage, hideMessage } from "react-native-flash-message";
import Constant from './Constant';
import Wallpaper from './Wallpaper';
import Logo from './Logo';
import AsyncStorage from '@react-native-community/async-storage';
import { Value } from 'react-native-reanimated';
import phoneImg from '../images/phone.png';
import NetInfo from "@react-native-community/netinfo";
import OfflineData from "./OfflineData"

const MARGIN = 40;
export default class ViewTravelRequestScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
      Userid:'',
      //locationId:'',
      //visitStatus:'',
      //lcation field
      itemList:[],
      name:'',
      address:'',
      status:'',
      statusDisplayName:'',
      visitStartDate:'',
      id:'',
      //Member
      userVisitMemberDetails:[],
      firstName:'',
      lastName:'',
      phoneNumber:'',
      MemberAddress:'',
      totalMembers:'',
      isModalVisible:false,
      itemMemberList: [],
      loading:true,
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
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
  
 
    this.CancelbuttonAnimated = new Animated.Value(0);
    
  }

  toggleModal = (id) => {
    //this.setState({isModalVisible: !this.state.isModalVisible});
    this.setState({loading:true});
    this._GetTravellerByLocationIdData(id);
  };

  hideModal = () =>
  {
      this.setState({isModalVisible: !this.state.isModalVisible,
      itemMemberList:[]});
  }

  showPass() {
    this.state.press === false
      ? this.setState({showPass: false, press: true})
      : this.setState({showPass: true, press: false});
  }

  _GetUserData() {
    NetInfo.fetch().then(state => 
      {
        if (state.isConnected) 
        {
            // var id=this.state.id;
            //console.log(this.state.Userid+"User id");
              fetch(Constant.API_URL + "travels/gettravellersbyuserid?userId="+this.state.Userid,{
                method: 'GET',
                })
                .then((response) =>{ 
                  
                  //console.log(response.status);
                  const statusCode = response.status;
                  const result = response.json();
                  return Promise.all([statusCode, result]);
                })
                .then(([res, result]) => {
                // console.log(result);
                  //console.log(result.userVisitMemberDetails+'dfggfghhyt');
                  this.setState({
                    itemList:result,
                    userVisitMemberDetails:result.userVisitMemberDetails                   
                  });
                  setTimeout(()=>this.setState({loading:false}),1000)
                }).catch(function(error) {
                    console.log('Error: ' + error.message);
                    setTimeout(()=>this.setState({loading:false}),1000)
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
                setTimeout(()=>this.setState({loading:false}),1000)
                    showMessage({
                        message: 
                        OfflineData.offlineMessage,
                        type: "danger",
                      });
                      return;
                    }
              });
    }


    _GetTravellerByLocationIdData(visitId) {
      NetInfo.fetch().then(state => 
        {
          if (state.isConnected) 
          {

      console.log(visitId+"visitId");
      //fetch(Constant.API_URL + "travels/gettravellersbyuseridandlocationid?userId="+this.state.Userid+"&locationId="+this.state.locationId,{
      fetch(Constant.API_URL + "travels/getfellowmemberbyvisitid?visitId="+visitId,{
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
              isModalVisible: !this.state.isModalVisible,
              itemMemberList:result,
             
              });
              setTimeout(()=>this.setState({loading:false}),1000)
        })

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

    _GetMemberDetails(id) { 
        //console.log(id);
        Actions.viewTravelRequestMemberScreen({locationId:id});
      }


  render() {
    
   // console.log(this.state.userVisitMemberDetails+'userVisitMemberDetails');
  
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
          <View>
            <Spinner visible={this.state.loading}
              textContent={'Loading...'}
              textStyle={styles.spinnerTextStyle}
              overlayColor='white' // overlay of Loader(spiner made white)
              color='green'
              />
          </View>
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
                                                  Location   :  
                                               </Text>
                                              <Text style={{alignItems:'center',fontSize:15,marginTop:DEVICE_HEIGHT*0.01,
                                                marginLeft: DEVICE_WIDTH * 0.05 }}>{item.location.name}
                                              </Text>
                                          </View>

                                          <View style={{flex:1, flexDirection:'row'}}>
                                              <Text
                                              style={{marginLeft: DEVICE_WIDTH * 0.09,borderRadius: 40,fontSize:15, marginTop:DEVICE_HEIGHT*0.01, fontWeight:'bold' }}>
                                                Address    :
                                                </Text>
                                              <Text style={{alignItems:'center',fontSize:15,marginTop:DEVICE_HEIGHT*0.01,
                                                marginLeft: DEVICE_WIDTH * 0.05, marginRight:DEVICE_WIDTH * 0.29}}>{item.location.address}</Text>
                                          </View>

                                          <View style={{flex:1, flexDirection:'row'}}>
                                              <Text
                                              style={{marginLeft: DEVICE_WIDTH * 0.09,borderRadius: 40,fontSize:15, marginTop:DEVICE_HEIGHT*0.01, fontWeight:'bold' }}>
                                                Visit Date  :
                                                </Text>
                                              {/* <Text style={{alignItems:'center',fontSize:15,marginTop:DEVICE_HEIGHT*0.01,
                                                marginLeft: DEVICE_WIDTH * 0.05, marginRight:DEVICE_WIDTH * 0.29}}>{Moment(item.visitStartDate).format('DD-MM-YYYY   HH:MM A').toString()}</Text> */}
                                                  <Text style={{alignItems:'center',fontSize:15,marginTop:DEVICE_HEIGHT*0.01,
                                                marginLeft: DEVICE_WIDTH * 0.05, marginRight:DEVICE_WIDTH * 0.29}}>{Moment(item.visitStartDate).format('DD-MM-YYYY').toString()}</Text>
                                         
                                          </View>
                                          <View style={{flex:1, flexDirection:'row'}}>
                                              <Text
                                              style={{marginLeft: DEVICE_WIDTH * 0.09,borderRadius: 40,fontSize:15, marginTop:DEVICE_HEIGHT*0.01, fontWeight:'bold' }}>
                                                Status       :
                                                </Text>
                                             {item.displayVisitStatus == "Approved" ? (
                                                  
                                                  <Text style={{alignItems:'center',
                                                   color: 'green',
                                                   fontSize:15,
                                                   marginTop:DEVICE_HEIGHT*0.01,
                                                   marginLeft: DEVICE_WIDTH * 0.05,
                                                   marginRight:DEVICE_WIDTH * 0.29
                                                   }}>{item.displayVisitStatus}</Text>
                                          
                                                   ) : ((item.displayVisitStatus == "Rejected" ? (
                                             
                                                    <Text style={{alignItems:'center',fontSize:15,
                                                    color: 'red',
                                                 marginTop:DEVICE_HEIGHT*0.01,
                                                 marginLeft: DEVICE_WIDTH * 0.05,
                                                 marginRight:DEVICE_WIDTH * 0.29
                                                 }}>{item.displayVisitStatus}</Text>
                                                 
                                                 ):((item.displayVisitStatus == "Pending" ? (
                                              
                                                  <Text style={{alignItems:'center',fontSize:15,
                                                  color: 'orange',
                                                  marginTop:DEVICE_HEIGHT*0.01,
                                                  marginLeft: DEVICE_WIDTH * 0.05,
                                                  marginRight:DEVICE_WIDTH * 0.29
                                                  }}>{item.displayVisitStatus}</Text>
                                                 
                                                  ):((item.displayVisitStatus == "Visited" ? (
                                                  
                                                    <Text style={{alignItems:'center',fontSize:15,
                                                    color: 'green',
                                                    marginTop:DEVICE_HEIGHT*0.01,
                                                    marginLeft: DEVICE_WIDTH * 0.05,
                                                    marginRight:DEVICE_WIDTH * 0.29
                                                    }}>{item.displayVisitStatus}</Text>
                                                  ):(
                                                    <Text style={{alignItems:'center',fontSize:15,
                                                    color: 'orange',
                                                    marginTop:DEVICE_HEIGHT*0.01,
                                                    marginLeft: DEVICE_WIDTH * 0.05,
                                                    marginRight:DEVICE_WIDTH * 0.29
                                                    }}>{item.displayVisitStatus}</Text>
                                                    ))
                                                    ))
                                                  ))
                                                 )}
                                          </View>
                                          
                                          <View style={{flex:1, flexDirection:'row'}}>
                                            
                                              <Text
                                                style={{marginLeft: DEVICE_WIDTH * 0.09,borderRadius: 40,fontSize:15, marginTop:DEVICE_HEIGHT*0.01, fontWeight:'bold' }}>
                                                  Fellow Member:
                                              </Text >
                                                 
                                              {item.totalMembers>0 ? (
                                                  <Text style={{alignItems:'center',fontSize:15,
                                                  marginTop:DEVICE_HEIGHT*0.01,
                                                  marginLeft: DEVICE_WIDTH * 0.05,
                                                  marginRight:DEVICE_WIDTH * 0.19
                                                  }}>
                                                    {item.totalMembers}
                                                </Text>
                                                ) : (
                                                 <Text style={{alignItems:'center',fontSize:15,
                                                    marginTop:DEVICE_HEIGHT*0.01,
                                                    marginLeft: DEVICE_WIDTH * 0.05,
                                                    marginRight:DEVICE_WIDTH * 0.19
                                                    }}>
                                                    N/A
                                                  </Text>
                                                  )}

                                                 

                                                {item.totalMembers>0 ? (
                                                 
                                                        <TouchableOpacity
                                                        style={{
                                                          marginTop:DEVICE_HEIGHT*0.001,
                                                          marginLeft: DEVICE_WIDTH * 0.001,
                                                          borderRadius: 40,
                                                          justifyContent: 'center',
                                                          fontWeight:'bold',
                                                          height: 30,
                                                          width:90,
                                                          textAlign: 'center',
                                                          backgroundColor: '#4b9445',
                                                          borderRadius: 20,
                                                          zIndex: 100,
                                                        }}
                                                        // onPress={this.SendTravelRequest}
                                                        //onPress={ () => this._GetMemberDetails(item.location.id)}
                                                        onPress={ () =>this.toggleModal(item.id)}
                                                        activeOpacity={2}
                                                        >
                                                        <Text style={{
                                                          color: 'white',
                                                          backgroundColor: 'transparent',
                                                          textAlign: 'center',
                                                        }}>View</Text>
                                                      </TouchableOpacity>
                                                ) : (
                                                 
                                                 <Text>
                                                 </Text>
                                                  )}

                                          </View>

                                          <View>
                                              <View style={{ borderBottomColor: '#999999', borderBottomWidth: 1, marginLeft:10, marginRight:10, paddingTop:10}}/>
                                          </View>
                                       </View>
                                </View>
                                
                              )}
                              keyExtractor={(item, index) => index.toString()}
                            />
                      {/* </SafeAreaView> */}
                        </View>
                   </View>
                  </View>
               </View>
            </ScrollView>
        </KeyboardAvoidingView>
        <View style={{ flexDirection: 'column',justifyContent: 'center',alignItems: 'center' }}>
                    <Modal animationType="slide"
        transparent={true} isVisible={this.state.isModalVisible}>
                        <View>
                          <View style={{backgroundColor:'#4b9445', flexDirection:'row',justifyContent: 'space-between', textAlign: 'center',}}>
                              <Text style={{fontWeight:'bold',color:'white', fontSize:15, marginLeft:DEVICE_WIDTH*0.27, marginTop:5}}>Member List</Text>
                              <TouchableOpacity onPress={this.hideModal} activeOpacity={1}>
                                <Text style={{fontWeight:"bold",color:"white", margin:5}}>X</Text>
                              </TouchableOpacity>
                          </View>
                        <ScrollView bounces={false}>
                            <View style={{paddingBottom: 1, backgroundColor:'white'}}>
                                  <View>
                                    <View>
                                        <View>
                                            <FlatList bounces={false}
                                              data={this.state.itemMemberList}
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
                        </View>
                    </Modal>
                  </View>
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

  // viewButton:{
  //   position: 'absolute',
  //   marginTop:DEVICE_HEIGHT*0.49,
  //   marginLeft: DEVICE_WIDTH*0.75,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   backgroundColor: '#4b9445',
  //   height: 28,
  //   width:65,
  //   borderRadius: 10,
  //   zIndex: 100,
  //   textAlign: 'center',
  // },



  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 22,
    height: 22,
    left: 35,
    top: 9,
  },

  spinnerTextStyle: {
    //color: '#FFF'
  },
});


