import PropTypes, { string } from 'prop-types';
import React, { Component, useState, useEffect} from 'react';
import { StyleSheet, View, Text, 
  FlatList,
  Image,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import { Card } from 'react-native-elements'
import Constant from './Constant'
import Spinner from 'react-native-loading-spinner-overlay';
import {Actions} from 'react-native-router-flux';
import ratingstar from '../images/ratingstar.png';
import bgSrc from '../images/overlay.png';
import Lightbox from 'react-native-lightbox';
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
import mapIcon from '../images/map.png';
import location_icn from '../images/location-icn.png';
import { NavigationActions,withNavigationFocus } from 'react-navigation';
import noimageHome from '../images/noimageHome.png';
import Wallpaper from './Wallpaper';
import notfound from '../images/not-found.png';
import NetInfo from "@react-native-community/netinfo";
import OfflineData from "./OfflineData"
import { showMessage, hideMessage } from "react-native-flash-message";
const MARGIN = 40;

class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      cityId:this.props.navigation.getParam('cityId'),
      stateId:'',
      locationList:[],
      stateName:this.props.navigation.getParam('statename'),
    };
    this._GetLocationData = this._GetLocationData.bind(this);
    this.backToCity=this.backToCity.bind(this);
  }

  componentDidMount() { 
    this._GetLocationData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isFocused && !prevProps.isFocused) {
      // Screen has now come into focus, perform your tasks here! 
      this.setState({
        isLoading:true,
        locationList:""
      })
      this._GetLocationData();
    }
  }
  backToCity()
  {
    this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'CityScreen',params: {stateId: this.props.navigation.getParam('stateId'),title: this.props.navigation.getParam('statename','Choose City')}}))
  }

  _GetLocationData() {
      NetInfo.fetch().then(state => 
      {
          if (state.isConnected && !OfflineData.isOfflineMode) 
          {
            //console.log(this.props.navigation.getParam('cityId', '1'));
            //fetch(Constant.API_URL + "locations/locations", {
            fetch(Constant.API_URL + "locations/villagebycityid?cityid="+ this.props.navigation.getParam('cityId'), {
              method: 'GET',
            }).then((response) => {
              // console.log(response.status);
              const statusCode = response.status;
              const result = response.json();
              return Promise.all([statusCode, result]);
            })
            .then(([res, result]) => {
              //console.log(result);
              result.map((data) => {
                data.mainImage=Constant.Main_Images_URL + data.mainImage
              });
              this.setState({
                  locationList: result.length==0?null:result,
                 //s isLoading:false,
              })
              setTimeout(()=>this.setState({isLoading:false}),1000)
            })
          }
          else{
            (async () => {             
             var arryLocationData=[];
             var locationListData = await OfflineData.getOfflineData("locationList");
             if(locationListData === null || locationListData === undefined)
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
                    var locationLocalData= locationListData.filter(item => 
                    {
                        return item.filter((data) => {
                        //data.stateId === this.state.stateId;
                        });
                    });
                    //console.log("locationLocalData:"+locationLocalData);
                    locationLocalData = locationLocalData.filter(obj => 
                        obj.find(o => o.cityId === this.props.navigation.getParam('cityId'))
                      );  
                    //console.log("locationLocalData:"+locationLocalData);
                    locationLocalData.map((item) => {
                      item.map((data) => {
                        data.mainImage= Constant.FileDisplay_Prefix_Local + Constant.LocationImage_Url_Local + data.mainImage
                        //console.log(data);
                        arryLocationData.push(data);
                      });
                    });
                    //console.log("arryLocationData:"+arryLocationData);
                    //console.log("offline mode 11");
                    this.setState({
                        locationList: arryLocationData.length > 0 ? arryLocationData : null,
                        //isLoading:false,
                    }); 
                    setTimeout(()=>this.setState({isLoading:false}),1000)
              }
            })();
          }
        });
  }

  actionOnRow = (item) => {
      const navigateAction = NavigationActions.navigate({ routeName: 'LocationDetailsScreen',params: {title:item.name,id:item.id,cityId:this.props.navigation.getParam('cityId'),cityname:this.props.navigation.getParam('title') }  });
      this.props.navigation.dispatch(navigateAction);
  };

  actionOnView = (item) => {
      const navigateAction = NavigationActions.navigate({ routeName: 'LocationDetailsScreen',params: {title:item.name,id:item.id,cityId:this.props.navigation.getParam('cityId'),cityname:this.props.navigation.getParam('title') }  });
      this.props.navigation.dispatch(navigateAction);
  };


  render() {
    // console.log(this.props.cityId+'city Id');
    // var cityId=this.props.cityId;
    // this.state.cityId=cityId;

    return (
      <Wallpaper>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <ScrollView style={{width: DEVICE_WIDTH*0.96}} 
          bounces={false} scrollIndicatorInsets={{ right: 1 }}>
      <View style={styles.MainContainer}>
      <View style={styles.container}>
        <Spinner visible={this.state.isLoading}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle} 
            overlayColor='white' // overlay of Loader(spiner made white)
            color='green'
            /*overlayColor={'rgba(39,62,84,0.82)'}*/
            />
       </View>
       {this.state.locationList==null ? (
        //  <View style={{flex:1,backgroundColor:'white', marginTop:DEVICE_HEIGHT*0.35}}>
        //       <Text style={{
        //           fontSize:15, 
        //           fontWeight:'bold', 
        //           justifyContent:'center', 
        //           textAlign: 'center',
        //       }}> No Location found for this City</Text>
        // </View>
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
             }}> No location found for this City</Text>

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
             onPress={this.backToCity}
             activeOpacity={2}>      
            <Text style={{color:'white'}}>Back to city list</Text>
           </TouchableOpacity>
       </View>
            ) : (
      <FlatList 
      bounces={false}
      horizontal={false} 
      showsHorizontalScrollIndicator={true}
      data={this.state.locationList}
      renderItem={ ({ item, index }) => (
      <View style={{
                        width: DEVICE_WIDTH*0.95,
                        height: DEVICE_HEIGHT*0.38,
                        borderWidth: 2,
                        //margin: 10,
                        //marginLeft:13,
                        marginTop:5,
                        marginBottom:5,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        overflow: 'hidden',
                        borderColor: '#ecf0f1',
                        shadowRadius: 2,
                          }}>
        <TouchableWithoutFeedback onPress={ () => this.actionOnRow(item)}>
        {item.mainImage != null ? (
        <Image 
          //source={{uri: Constant.Main_Images_URL + item.mainImage}}
          source={{uri: item.mainImage}}
          key={index} // Important to set a key for list items
          style={{
                                      width: DEVICE_WIDTH*0.95,
                                      height: DEVICE_HEIGHT*0.30,
                                      //borderWidth: 5,
                                      overflow: 'hidden',
          }}
        />
        ) : (
            <ImageBackground source={noimageHome}
                style=
                {{
                 //marginTop:1,
                 width: DEVICE_WIDTH*0.95,
                 height: DEVICE_HEIGHT*0.30,
                 //borderWidth: 1,
                 overflow: 'hidden',
                }}>
            </ImageBackground>
        )}
         </TouchableWithoutFeedback>
        
         <View style={{flex:1, flexDirection:'row'}}>
                           <View style={{flex:1, flexDirection:'row', marginLeft:8}}>
                                 <ImageBackground source={location_icn}
                             style=
                              {{
                                marginTop:DEVICE_HEIGHT*0.019,
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
                              onPress={ () => this.actionOnView(item,this.state.cityId)}
                               activeOpacity={1}>
                              <Text 
                               style=
                               {{
                                fontSize:14,color: 'white'
                               }}>Explore</Text>
                          </TouchableOpacity>         
                          </View>
                      </View>

        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
    )}
  </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Wallpaper>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    // flex: 1,
    //paddingTop: DEVICE_HEIGHT * 0.005,
    marginTop: 3,
    backgroundColor:'white',
    //marginLeft:DEVICE_WIDTH*0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameStyle:{
      fontSize:15,
      color:'black',
      //fontWeight:'bold',
      textAlign: 'center',
      position: 'absolute',
      marginTop: DEVICE_HEIGHT * 0.41,
      color:'white',
      marginLeft: DEVICE_WIDTH * 0.06,
      fontWeight:'bold',
      // opacity: 0.3,
      // backgroundColor: '#000000'
  },
  locStyle:{
    fontSize:15,
    color:'black',
    //fontWeight:'bold',
    textAlign: 'center',
    position: 'absolute',
    marginTop:DEVICE_HEIGHT * 0.45,
    color:'white',
    marginLeft: DEVICE_WIDTH * 0.06,
    fontWeight:'bold',
  },
  ratingtyle:{
      position: 'absolute',
      marginTop: DEVICE_HEIGHT * 0.495,
      marginLeft: DEVICE_WIDTH * 0.06,
  },
  galleryNameStyle :{
    fontSize:15,
    color:'black',
    //fontWeight:'bold',
    textAlign: 'center',
    position: 'absolute',
    marginTop:50,
    color:'white',
    marginLeft: 5,
 },
 spinnerTextStyle: {
  //color: '#FFF'
},
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F5FCFF'
},
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
text: {
  color: 'white',
  backgroundColor: 'transparent',
},
picture: {
  //flex: 1,
  width: null,
  height: null,
  //resizeMode: 'cover',
},
// overlay: {
//   opacity: 0.5,
//   backgroundColor: '#000000'
// },
});

//export default HomeScreen;
export default withNavigationFocus(HomeScreen)