
import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import { WebView } from 'react-native-web-webview';
import { WebView } from 'react-native-webview';
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
  ScrollView, 
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import UserInput from './UserInput';
import ButtonSubmit from './ButtonSubmit';
import SignupSection from './SignupSection';
import eyeImg from '../images/eye_black.png';
import spinner from '../images/loading.gif';
import {Actions, ActionConst} from 'react-native-router-flux';
import { showMessage, hideMessage } from "react-native-flash-message";
import Constant from './Constant';
import Wallpaper from './Wallpaper';
import HTML from 'react-native-render-html';
import noimage from '../images/noimage.png';
import backIcon from '../images/back-green.png';
import { NavigationActions } from 'react-navigation';
import NetInfo from "@react-native-community/netinfo";
import OfflineData from "./OfflineData"
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';


const MARGIN = 40;

export default class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
      isLoading: true,
      descrption:'',
      locationId:0,
      itemName:'',
      isModalVisible:false,
      isPaused: false,
      buffering: true,
      videoUrl: '',
      //videoUrl: "http://139.59.6.220:8000/AppImages/Temp/LocationItems/fb085eb8-d673-48c9-8fab-cd0b39d73a8f.mp4",
    };

    this._onPressBack = this._onPressBack.bind(this);
    this.openVideoUrl=this.openVideoUrl.bind(this);
    this.onBack=this.onBack.bind(this);
  }


  componentDidMount() 
  {
    StatusBar.setHidden(true);
    this._GetLocationItemData();
  }

  componentDidUpdate(prevProps) {
    //console.log(this.state.id+"Test componentDidUpdate");
    //if(this.props.navigation.getParam('selectedItemId')!==prevProps.navigation.getParam('selectedItemId')){
    if (prevProps.navigation !== this.props.navigation) {
      this.setState({
        showPass: true,
        press: false,
        isLoading: true,
        descrption:'',
        locationId:0,
        itemName:'',
      })
      this._GetLocationItemData();
   }
  }

  _GetLocationItemData()
  {
        var ItemId=this.state.ItemId;
        NetInfo.fetch().then(state => 
        {
              if (state.isConnected && !OfflineData.isOfflineMode) 
              {
                //Alert.alert(ItemId);
                //console.log(ItemId);
                  fetch(Constant.API_URL + "locations/getlocationitem?itemId="+ItemId,{
                  method: 'GET',
                  })
                          .then((response) =>{
                              
                              //console.log(response.status);
                              const statusCode = response.status;
                              const result = response.json();
                              return Promise.all([statusCode, result]);
                          })
                          .then(([res,result]) => {
                              //console.log("result.descrption: "+result.descrption);
                              if(Platform.OS === 'android' && result.descrption!="" && result.descrption!=null)
                              {
                                //result.descrption=result.descrption.replace('https://mountainhomestays.app','http://139.59.6.220:8000');
                                result.descrption=result.descrption.replace(/https:/g,'http:');
                                result.descrption=result.descrption.replace(/mountainhomestays.app/g,'139.59.6.220:8000');
                              }
                              //console.log("result.descrption: "+result.descrption);
                              this.setState({
                                  descrption:(result.descrption == null || result.descrption == "") ? "<p style='color:#ff9966; font-size:20px; text-align: center;'>No details available for this.</p>" : result.descrption,
                                  locationId:result.locationId,
                                  itemName:result.itemName,
                                 
                              })
                              setTimeout(()=>this.setState({isLoading:false}),1000);
                              //console.log("Desciption: "+this.state.descrption);
                  })
              }
              else
              {
                (async () => {        
                  //console.log(ItemId);
                  var locationItemListData = await OfflineData.getOfflineData("locationItemsList");
                  var locationItemLocalData = locationItemListData.filter(obj => 
                  {
                     return obj.id == ItemId;
                  });

                  var result=locationItemLocalData[0];
                  // console.log("result description "+result.descrption);
                  if(result !=null && result.id>0)
                  {
                      //console.log(result.descrption);
                      const searchRegExp = new RegExp(Constant.BASE_URL + "AppImages/Temp/LocationItems/", 'g');
                      if(Platform.OS === 'android' && result.descrption!="" && result.descrption!=null)
                      {
                        result.descrption=result.descrption.replace(/https:/g,'http:');
                        result.descrption=result.descrption.replace(/mountainhomestays.app/g,'139.59.6.220:8000');
                      }
                      result.descrption = (result.descrption == null || result.descrption == "") ? "<p style='color:#ff9966; font-size:20px; text-align: center;'>No details available for this.</p>" : result.descrption;
                      result.descrption = result.descrption.replace(searchRegExp, Constant.FileDisplay_Prefix_Local + Constant.CKEditor_ItemImage_URL_Local); 
                      //console.log(result.descrption);
                      this.setState({
                        descrption:result.descrption,
                        locationId:result.locationId,
                        itemName:result.itemName,
                        
                    });
                    setTimeout(()=>this.setState({isLoading:false}),1000);
                    //console.log(this.state.descrption);
                 }
                 else
                 {
                  setTimeout(()=>this.setState({isLoading:false}),1000);
                  showMessage({
                      message: "No data found for offline.",
                      type: OfflineData.syncMsgType,
                    });
                 }
              
                })();

              }
    });
  }

  openVideoUrl(href) {
    console.log("href:"+href);
    //href ="/data/user/0/com.ghehomestayapp/files/ckeditorItemImages/ddefbf4d-78cd-47f9-a5be-76856725dd90.mp4";
    //console.log(href);
    if(href!="" && href!=null && href!=undefined)
    {
        var types = ['mp4','avi','mov','wmv','webm','mkv','flv','ogv'];
        var parts = href.split('.');
        if(parts.length >0 )
        {
          var extension = parts[parts.length-1];
          if(types.indexOf(extension.toLowerCase()) !== -1) {
            this.setState({
              videoUrl:href,
              isModalVisible: true
            });
          }
      }
    }
  }

//cancel button function
_onPressBack() { 
  //Actions.indexScreen();
  //Actions.locationDetailsScreen({id:this.state.locationId});
  //console.log(this.state.locationId);
  const navigateAction = NavigationActions.navigate({ routeName: 'LocationDetailsScreen',params: { id: this.state.locationId }  });
  this.props.navigation.dispatch(navigateAction);
}

loadStart(){
  //console.log('loadStart');
}
onLoad(){
  //console.log('onLoad');
}

onProgress(){
  //console.log('onProgress');
}

onEnd(){
  //console.log('onEnd');
}

onError(){
  //console.log('onError');
}

onBuffer(){
  //console.log('onBuffer');
}

onTimedMetadata(){
  //console.log('onTimedMetadata');
}

onPlayPause()
{
  this.setState({
    isPaused: !this.state.isPaused,
  });
}

onBack() {
  //console.log('onBack');
  this.setState({
    isModalVisible:false
  });
}
  render() {
    var ItemId=this.props.navigation.getParam('selectedItemId'); //this.props.selectedItemId;
    this.state.ItemId=ItemId;
    return (
      <Wallpaper>
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <Spinner visible={this.state.isLoading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
            overlayColor='white' // overlay of Loader(spiner made white)
            color='green'
            />
                    <ScrollView style={{ flex: 1, margin:4 }} bounces={false}>
                    {/* <View style={{flex:1, flexDirection:'row',marginTop:DEVICE_HEIGHT*0.015}}>
                        <View style={{justifyContent:'flex-start', width:40}}>
                          <TouchableOpacity onPress={this._onPressBack} activeOpacity={1}>
                            <Image source={backIcon}
                                style={{ width: 40, height: 40, borderRadius: 40, }}/>
                          </TouchableOpacity>
                        </View>
                        <View style={{ alignItems:'center', justifyContent:'center', width:DEVICE_WIDTH-60}}>
                            {this.state.itemName.length>20 ? (
                          <Text style={{ color:'#4b9445', fontSize:25,
                          fontWeight:'bold'}}>{this.state.itemName.substring(0,20) + '..'}</Text>
                          ) : (
                            <Text style={{ color:'#4b9445', fontSize:25,
                            fontWeight:'bold'}}>{this.state.itemName}</Text>
                          )}
                        </View>
                      </View> */}
                      <View>
                       <HTML html={this.state.descrption} imagesMaxWidth={Dimensions.get('window').width} 
                      /* renderers={{
                        video: ({ src }) => (
                           <Video
                              style={{ width: Dimensions.get('window').width - 30 }}
                              source={{ uri: src }}
                            />
                         ),
                      }}*/
                      /*onLinkPress={ (evt, href) => { Linking.openURL(href); }}*/
                      onLinkPress={ (evt, href) => { this.openVideoUrl(href); }}
                        /> 
                       </View>
                       
                    </ScrollView>
          </KeyboardAvoidingView>
          <View>
              <Modal animationType="slide" transparent={true} isVisible={this.state.isModalVisible}>
                  {/* <View>
                      <TouchableOpacity onPress={this.onBack} activeOpacity={2}>
                          <Text style={{color:'green', textAlign: 'right', marginTop:DEVICE_HEIGHT*0.029, marginRight:10, fontSize:18, fontWeight:'bold'}}>Close</Text>
                      </TouchableOpacity>
                  </View> */}
                  <VideoPlayer 
                    source={{uri: this.state.videoUrl}}   // Can be a URL {uri:'https://www.w3schools.com/html/mov_bbb.mp4'} or a local file require('').   
                    ref={(ref) => {this.player = ref}}               
                    muted={false}                           // Mutes the audio entirely.                  
                    resizeMode="contain"                      // Fill the whole screen at aspect ratio.*
                    repeat={false}                           // Repeat forever.
                    playInBackground={false}                // Audio continues to play when app entering background.
                    playWhenInactive={false}                // [iOS] Video continues to play when control or notification center are shown.
                    ignoreSilentSwitch={"ignore"}           // [iOS] ignore | obey - When 'ignore', audio will still play with the iOS hard silent switch set to silent. When 'obey', audio will toggle with the switch. When not specified, will inherit audio settings as usual.
                    progressUpdateInterval={250.0}          // [iOS] Interval to fire onProgress (default to ~250ms)
                    onLoadStart={this.loadStart}            // Callback when video starts to load
                    onLoad={this.setDuration}               // Callback when video loads
                    onError={this.videoError}               // Callback when video cannot be loaded
                    onBuffer={this.onBuffer}                // Callback when remote video is buffering
                    onTimedMetadata={this.onTimedMetadata}  // Callback when the stream receive some metadata
                    style={styles.backgroundVideo} 
                    //width={DEVICE_WIDTH}
                    //height={DEVICE_HEIGHT * 0.40}
                    paused={this.state.isPaused}
                    controls={true}
                    onReadyForDisplay={() => { /*Had to manuever temporarily with this but just at the start */
                      this.setState({
                          buffering: false
                      })
                  }}
                  onBack={this.onBack}
                  disableVolume={true}
                  /> 
              </Modal>
          </View>
          {/* <WebView
        originWhitelist={['*']}
        source={{ html: this.state.descrption }}
      /> */}
      </Wallpaper>
   );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize:60,
  },
  htmlDescrption: {
    // top:10,
     width: 360,
     height: 400,
    // margin:6,
     fontSize:60,
  }, 
  image: {
    top:10,
    width: 30,
    height: 40,
    margin:10,
  },

  containerCancel: {
    flex: 3,
    top: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  containerSubmit: {
    flex: 1,
    top: 25,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
 
  Cancelbutton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    height: MARGIN,
    borderRadius: 20,
    zIndex: 100,
  },

  backgroundVideo: {
    // flex: 1,
    // marginTop:DEVICE_HEIGHT*0.35,
  },

});
