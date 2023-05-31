import React, {Component,useRef } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  Platform,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  Animated,
  Alert,
} from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";
import NetInfo from "@react-native-community/netinfo";
import OfflineData from "./OfflineData"
import spinner from '../images/loading.gif';
import Constant from './Constant';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-community/async-storage';
import BackgroundJob from 'react-native-background-job';
import KeepAwake from 'react-native-keep-awake';
import refereshImg from '../images/referesh-icn.png';
//import BackgroundTask from 'react-native-background-task'
import Moment from 'moment';

const MARGIN = 40;
 
// const backgroundJob = {
//  jobKey: "SyncOfflineData",
//  job: () => console.log("Running in background")
// };
 
// BackgroundJob.register(backgroundJob);

// BackgroundTask.define(() => {
//   console.log('Hello from a background task')
//   BackgroundTask.finish()
// })

//const [myState, setMystate] = useState('downloadingStatus');

export default class OfflineSyncScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      offlineDownloadStatus:'',
      isDeleteLoader: false,
      isShowRefreshButton:false,
      isShowLastRunDate:false,
      //offlineDownloadStatus: AsyncStorage.getItem("downloadingStatus"),
    };
    this.syncData = this.syncData.bind(this);
    this.deleteAllOfflineData = this.deleteAllOfflineData.bind(this);
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this.updateStateOfDownloding = this.updateStateOfDownloding.bind(this)

  }

  async componentDidMount() {
    this.updateStateOfDownloding();
  }

  async updateStateOfDownloding()
  {
        AsyncStorage.getItem("downloadingStatus").then((value) => {
          console.log(value);
          this.setState({offlineDownloadStatus:value});
          if(value==null || value=="")
          {
            this.setState({isShowLastRunDate:false});
          }
          else
          {
            this.setState({isShowLastRunDate:true});
            
            if(value.indexOf("Last Sync on") !== -1)
            {
              this.setState({isShowRefreshButton:false});
            }
            else
            {
              this.setState({isShowRefreshButton:true});
            }
          }
        });
  }

  async syncData() { 

      NetInfo.fetch().then(state => 
      {            
            if (state.isConnected) 
            {     
              this.setState({isShowRefreshButton:true});     
              // console.log('11')
              // BackgroundTask.schedule();

              if(Platform.OS === 'ios')
              {
                Alert.alert(
                  "Alert!",
                  "Please don't leave this screen until download is completed.",
                  [
                    { text: "OK ", 
                     onPress: () => {
                        this.setState({isLoading: true});       
                        (async () => {
                          this.deleteOfflineData();   
                        })();
      
                        // Download data again
                        this.getStateData();  // Used to download all data
                      },
                    },
                  ],
                  { cancelable: false }
                );
              }
              else{
                var backgroundSchedule = {
                  jobKey: "SyncOfflineData",
                }
                  
                BackgroundJob.schedule(backgroundSchedule)
                  .then(() =>{ 
                     //console.log("Success");
                      this.setState({isLoading: true});       
                      (async () => {
                        this.deleteOfflineData();   
                      })();

                      // Download data again
                      this.getStateData();  // Used to download all data
                    }).catch(err => console.err(err)); 
                }

                // this.setState({isLoading: true});       
                // (async () => {
                //   this.deleteOfflineData();   
                // })();

                // // Download data again
                // this.getStateData();  // Used to download all data

                
                // // // function for unit testing
                // // this.getHomeStayHostData([7,19]);

                // //  this.setState({isLoading: true});       
                // // (async () => {

                // //   var locationItemListData = await OfflineData.getOfflineData("locationItemsList");
                // //   this.downloadItemListImages(locationItemListData); 

                // // })();     
            } 
            else
            {
              showMessage({
                  message: 
                  "You are Offline!",
                  type: "danger",
                });
                return;
            }
        });
    }


  async deleteOfflineData()
  {
        //this.setState({offlineDownloadStatus:'Preparing for downloading offline data'})
        OfflineData.setDownloadingMessage("downloadingStatus",'Preparing for downloading offline data'); 
        this.updateStateOfDownloding();
        OfflineData.removeItemValue("stateList");
        OfflineData.checkForDirectory(Constant.StateImage_Url_Local);
        OfflineData.removeItemValue("cityList");
        OfflineData.checkForDirectory(Constant.CityImage_Url_Local);
        OfflineData.removeItemValue("locationList");
        OfflineData.checkForDirectory(Constant.LocationImage_Url_Local);    
        //console.log("delete all Images");
        this.deleteAllImages();
  }  

  async getStateData()
  {
     fetch(Constant.API_URL + "locations/states", {
        method: 'GET',
      }).then((response) => {
        const statusCode = response.status;
        const result = response.json();
        return Promise.all([statusCode, result]);
      })
      .then(([res, result]) => {  
          let arrayStateId=[];
          //console.log("start state");
          // Save data for offline
          //this.setState({offlineDownloadStatus:'Downloading states data'})
          OfflineData.setDownloadingMessage("downloadingStatus",'Downloading states data'); 
          this.updateStateOfDownloding();
          OfflineData.removeItemValue("stateList");
          OfflineData.setOfflineData("stateList",result); 
          OfflineData.checkForDirectory(Constant.StateImage_Url_Local);
          let counter=0;
          let totalLength=result.length;
          //console.log(totalLength);
          const requests = result.map(data => {
              //console.log("state " +data.id);
              var imageUrl= Constant.StateImage_Url + data.imageName;
              var localPath= Constant.StateImage_Url_Local + data.imageName;
              //Save images for offline
              //this.onDownloadImage(imageUrl, localPath);
              
           RNFS.downloadFile({
                fromUrl: imageUrl,
                toFile: localPath,
              }).promise.then((r) => {
                counter++;
                arrayStateId.push(data.id);
                //console.log('done');
                //console.log("counter:"+counter);
                //console.log("totalLength: "+totalLength);
                if(counter==totalLength)
                {
                  //console.log("arrayStateId:"+ arrayStateId);
                  console.log('State data downloaded.')
                  this.getCityData(arrayStateId);
                }
              });
          });
        
          // Wait for all requests
         Promise.all(requests).then(() => {
           //console.log('State data downloaded.')
          });
      })
      // .catch((stateErr)=>
      // {
      //   console.log('Error while downloading State Data:' +stateErr);
      //   this.setState({isLoading: false, offlineDownloadStatus:'Error while downloading State Data. Please try again.'});
      // });
  }

  async getCityData(arrayStateId)
  {
      //this.setState({offlineDownloadStatus:'Downloading cities data'})
      OfflineData.setDownloadingMessage("downloadingStatus",'Downloading cities data'); 
      this.updateStateOfDownloding();
      //console.log("Start city");
      //console.log(arrayStateId);
      let arrayCityId=[];
      //console.log("Start City "+stateId);
      OfflineData.removeItemValue("cityList");
      OfflineData.checkForDirectory(Constant.CityImage_Url_Local);
      let allCitiesData =[];
      let outerCounter=0;
      let outerTotalLength=arrayStateId.length;
      
      const requests = arrayStateId.map(stateId => {
        //looping through all states
        fetch(Constant.API_URL + "locations/citiesbystateid?stateId=" +stateId, {
          method: 'GET',
        }).then((response) => {
          const statusCode = response.status;
          const result = response.json();
          return Promise.all([statusCode, result]);
        })
        .then(([res, result]) => {
            let counter=0;
            let totalLength=result.length;
            allCitiesData.push(result); 
            //Save data for offline
            if(result.length==0)
            {
              outerCounter++;
            }
            result.map((data) => {
              //console.log("City " +data.id);
              var imageUrl= Constant.CityImage_Url + data.imageName;
              var localPath= Constant.CityImage_Url_Local + data.imageName;

              //Save images for offline
              RNFS.downloadFile({
                fromUrl: imageUrl,
                toFile: localPath,
              }).promise.then((r) => {
                counter++;
                arrayCityId.push(data.id);
                //console.log('done');
                //console.log("counter:"+counter);
                //console.log("totalLength: "+totalLength);
                if(counter==totalLength)
                {
                  //shows current api call is completed
                  outerCounter++;
                }

                //console.log("outerCounter:"+outerCounter);
                //console.log("outerTotalLength: "+outerTotalLength);
                if(outerCounter==outerTotalLength)
                {
                   OfflineData.setOfflineData("cityList",allCitiesData);
                   console.log('City data downloaded.')
                   //console.log("arrayCityId:"+ arrayCityId);
                  this.getVillageData(arrayCityId);
                }
              });
            });
        })
      })
      // .catch((cityErr)=>
      // {
      //   console.log('Error while downloading City Data:' +cityErr);
      //   this.setState({isLoading: false, offlineDownloadStatus:'Error while downloading City Data. Please try again.'});
      // });

       // Wait for all requests
      await Promise.all(requests).then(() => {
        //console.log('City data downloaded.')
        //this.getVillageData(arrayCityId);
       });
  }

  async getVillageData(arrayCityId)
  {
      //this.setState({offlineDownloadStatus:'Downloading locations data'})
      OfflineData.setDownloadingMessage("downloadingStatus",'Downloading locations data');
      this.updateStateOfDownloding(); 
      //console.log("Start Location");
      //console.log(arrayCityId);
      OfflineData.removeItemValue("locationList");
      OfflineData.checkForDirectory(Constant.LocationImage_Url_Local);
      //OfflineData.setOfflineData("locationList",result);
      let allLocationsData =[];
      let outerCounter=0;
      let outerTotalLength=arrayCityId.length; 

      const requests = arrayCityId.map(cityId => {
        //looping through all states
        fetch(Constant.API_URL + "locations/villagebycityid?cityid=" + cityId, {
          method: 'GET',
        }).then((response) => {
          const statusCode = response.status;
          const result = response.json();
          return Promise.all([statusCode, result]);
        })
        .then(([res, result]) => {
            //console.log(result);
            let counter=0;
            let totalLength=result.length;
            allLocationsData.push(result); 
            //Save data for offline
            if(result.length==0)
            {
              outerCounter++;
            }
            result.map((data) => {
              //console.log("City " +data.id);
              var imageUrl= Constant.Main_Images_URL + data.mainImage;
              var localPath= Constant.LocationImage_Url_Local + data.mainImage;
              //Save images for offline
              RNFS.downloadFile({
                fromUrl: imageUrl,
                toFile: localPath,
              }).promise.then((r) => {
                counter++;
                //console.log('done');
                //console.log("counter:"+counter);
                //console.log("totalLength: "+totalLength);
                if(counter==totalLength)
                {
                  //shows current api call is completed
                  outerCounter++;
                }

                //console.log("outerCounter:"+outerCounter);
                //console.log("outerTotalLength: "+outerTotalLength);
                if(outerCounter==outerTotalLength)
                {
                   OfflineData.setOfflineData("locationList",allLocationsData);
                   console.log('Location data downloaded.')
                   //this.setState({isLoading: false, offlineDownloadStatus:'Downloading done!'})
                   //console.log("arrayCityId:"+ arrayCityId);

                   // Download location gallery data
                   AsyncStorage.getItem("id").then((userId) => {      
                    //console.log(userId);
                    fetch(Constant.API_URL + "travels/gettravelrequestlocationsbyuserid?userId=" + userId, {
                      method: 'GET',
                    }).then((response) => {
                      const statusCode = response.status;
                      const result = response.json();
                      return Promise.all([statusCode, result]);
                    })
                    .then(([res, result]) => {
                        //console.log(result)
                        this.getLocationDetailsData(result,userId);
                    });
                  });
              }
              });
            });
        })
      })
      // .catch((locationErr)=>
      // {
      //   console.log('Error while downloading Location Data:' +locationErr);
      //   this.setState({isLoading: false, offlineDownloadStatus:'Error while downloading Location Data. Please try again.'});
      // });

      // Wait for all requests
      Promise.all(requests).then(() => {
        //console.log('Location data downloaded.')
       });
  }

  async getLocationDetailsData(locationIds,userId)
  {
    // We have already location dat so need to download gallery images only. We will download gallery images for Requested and Approved locations
      console.log("Downloading locations gallery images");
      OfflineData.checkForDirectory(Constant.LocationGalleryImage_URL_Local);
      OfflineData.checkForDirectory(Constant.Map_Images_URL_Local);
      //this.setState({offlineDownloadStatus:'Downloading locations gallery images'})
      OfflineData.setDownloadingMessage("downloadingStatus",'Downloading locations gallery images'); 
      this.updateStateOfDownloding();
      let outerCounter=0;
      let outerTotalLength=locationIds.length; 
      //console.log("outerTotalLength: "+outerTotalLength);

      const requests = locationIds.map(locationId => {
        //looping through all states
        fetch(Constant.API_URL + "locations/location?locationId=" + locationId, {
          method: 'GET',
        }).then((response) => {
          const statusCode = response.status;
          const result = response.json();
          return Promise.all([statusCode, result]);
        })
        .then(([res, result]) => {
            //console.log(result);
            let counter=0;
            //Save data for offline
              if(result!=null && result.id > 0 )
              {
                    // Download Map images
                    //console.log("result.mapImgName:"+result.mapImgName)
                    if(result.mapImgName !=null && result.mapImgName !="")
                    {
                      //console.log(result.mapImgName);
                      var mapImageUrl= Constant.Map_Images_URL + result.mapImgName;
                      var mapLocalPath= Constant.Map_Images_URL_Local + result.mapImgName;
                      RNFS.downloadFile({
                        fromUrl: mapImageUrl,
                        toFile: mapLocalPath,
                      }).promise.then((r) => {
                      //this.downloadLocationGalleryImages(result, outerCounter, outerTotalLength, counter);

                        // Download gallery images           
                        let totalLength=result.lstLocationImages.length;
                        if(totalLength==0)
                        {
                          outerCounter++;
                          if(outerCounter==outerTotalLength)
                          {
                            //OfflineData.setOfflineData("locationDetailsList",allLocationsDetailsData);
                            console.log('Location details data downloaded.')
                            this.getLocationItemsData(locationIds,userId);
                          }
                        }

                        for (let locationImg of result.lstLocationImages) {
                            //console.log("locationImg " +locationImg);
                            var galleryImageUrl= Constant.Gallery_Images_URL + locationImg.imageName;
                            var galleryLocalPath= Constant.LocationGalleryImage_URL_Local + locationImg.imageName;
                            //Save images for offline
                            RNFS.downloadFile({
                              fromUrl: galleryImageUrl,
                              toFile: galleryLocalPath,
                            }).promise.then((r) => {
                              counter++;
                              if(counter==totalLength)
                              {
                                //shows current api call is completed
                                outerCounter++;
                                //console.log("outerCounter1: " + outerCounter);
                              }
                              if(outerCounter==outerTotalLength)
                              {
                                //OfflineData.setOfflineData("locationDetailsList",allLocationsDetailsData);
                                console.log('Location details data downloaded.')
                                this.getLocationItemsData(locationIds,userId);
                              }
                          }).catch(function(error) {
                            console.log('There has been a problem while downloading gallery image: ' + error.message);
                             // ADD THIS THROW error
                              //throw error;
                            });;
                        }

                      });
                    }
                    else
                    {
                      //this.downloadLocationGalleryImages(result, outerCounter, outerTotalLength, counter);
                      
                        // Download gallery images           
                        let totalLength=result.lstLocationImages.length;
                        if(totalLength==0)
                        {
                          outerCounter++;
                          if(outerCounter==outerTotalLength)
                          {
                            //OfflineData.setOfflineData("locationDetailsList",allLocationsDetailsData);
                            console.log('Location details data downloaded.')
                            this.getLocationItemsData(locationIds,userId);
                          }  
                        }

                        for (let locationImg of result.lstLocationImages) {
                            //console.log("locationImg " +locationImg);
                            var galleryImageUrl= Constant.Gallery_Images_URL + locationImg.imageName;
                            var galleryLocalPath= Constant.LocationGalleryImage_URL_Local + locationImg.imageName;
                            //Save images for offline
                            RNFS.downloadFile({
                              fromUrl: galleryImageUrl,
                              toFile: galleryLocalPath,
                            }).promise.then((r) => {
                              counter++;
                              if(counter==totalLength)
                              {
                                //shows current api call is completed
                                outerCounter++;
                                //console.log("outerCounter2: " + outerCounter);
                              }
                              if(outerCounter==outerTotalLength)
                              {
                                //OfflineData.setOfflineData("locationDetailsList",allLocationsDetailsData);
                                console.log('Location details data downloaded.')
                                this.getLocationItemsData(locationIds,userId);
                              }
                          }).catch(function(error) {
                            console.log('There has been a problem while downloading gallery image: ' + error.message);
                             // ADD THIS THROW error
                              //throw error;
                            });
                      }

                    }
                    // End map image downloading
            }
            else{
              //console.log("outerCounter3: " + outerCounter);
              outerCounter++;
              if(outerCounter==outerTotalLength)
              {
                console.log('Location details data downloaded.')
                this.getLocationItemsData(locationIds,userId);
              }
            }
        }).catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
           // ADD THIS THROW error
            //throw error;
          });
      })
      // .catch((locationDetailsErr)=>
      // {
      //   console.log('Error while downloading Location details Data:' +locationDetailsErr);
      //   this.setState({isLoading: false, offlineDownloadStatus:'Error while downloading Location details Data. Please try again.'});
      // });

      // Wait for all requests
      Promise.all(requests).then(() => {
        //console.log('Location data downloaded.')
       });
  }

  async downloadLocationGalleryImages(result,locationIds,userId, outerCounter, outerTotalLength, counter)
  {
      // Download gallery images           
      let totalLength=result.lstLocationImages.length;
      if(totalLength==0)
      {
        outerCounter++;
        if(outerCounter==outerTotalLength)
        {
          //OfflineData.setOfflineData("locationDetailsList",allLocationsDetailsData);
          console.log('Location details data downloaded.')
          this.getLocationItemsData(locationIds,userId);
        }
      }

      for (let locationImg of result.lstLocationImages) {
          console.log("locationImg " +locationImg);
          var galleryImageUrl= Constant.Gallery_Images_URL + locationImg.imageName;
          var galleryLocalPath= Constant.LocationGalleryImage_URL_Local + locationImg.imageName;
          //Save images for offline
          RNFS.downloadFile({
            fromUrl: galleryImageUrl,
            toFile: galleryLocalPath,
          }).promise.then((r) => {
            counter++;
            if(counter==totalLength)
            {
              //shows current api call is completed
              outerCounter++;
              console.log("outerCounter1: " + outerCounter);
            }
            if(outerCounter==outerTotalLength)
            {
              //OfflineData.setOfflineData("locationDetailsList",allLocationsDetailsData);
              console.log('Location details data downloaded.')
              this.getLocationItemsData(locationIds,userId);
            }
        }).catch(function(error) {
          console.log('There has been a problem while downloading gallery image: ' + error.message);
            // ADD THIS THROW error
            //throw error;
          });
      }
  }

  async getLocationItemsData(locationIds,userId)
  {
      console.log("Downloading location items");
      //this.setState({offlineDownloadStatus:'Downloading location items'})
      OfflineData.setDownloadingMessage("downloadingStatus",'Downloading location items');
      this.updateStateOfDownloding(); 
      //console.log("Start Location");
      //console.log(arrayCityId);
      OfflineData.removeItemValue("locationItemsList");
      OfflineData.checkForDirectory(Constant.LocationItemImage_URL_Local);
      let allLocationItemsData =[];
      let outerCounter=0;
      let outerTotalLength=locationIds.length; 

      const requests = locationIds.map(locationId => {
        //looping through all states
        fetch(Constant.API_URL + "locations/locationitems?locationId=" + locationId, {
          method: 'GET',
        }).then((response) => {
          const statusCode = response.status;
          const result = response.json();
          return Promise.all([statusCode, result]);
        })
        .then(([res, result]) => {
            //console.log("Location item:" +result);
            let counter=0;
            let totalLength=result.length;
            //Save data for offline
            if(result.length==0)
            {
              outerCounter++;
              if(outerCounter==outerTotalLength)
              {
                 OfflineData.setOfflineData("locationItemsList",allLocationItemsData);
                 console.log('Location Items downloaded.');
                 this.downloadItemListImages(allLocationItemsData,locationIds, userId);
                   //this.getUserTravelRequestData(locationIds, userId);
              }
            }
            result.map((data) => {
              //console.log("Location item:" +data);
              allLocationItemsData.push(data); 
              //console.log("City " +data.id);
              var imageUrl= Constant.Main_Images_Item_URL + data.mainImage;
              var localPath= Constant.LocationItemImage_URL_Local + data.mainImage;
              //Save images for offline
              RNFS.downloadFile({
                fromUrl: imageUrl,
                toFile: localPath,
              }).promise.then((r) => {
                counter++;
                //console.log('done');
                //console.log("counter:"+counter);
                //console.log("totalLength: "+totalLength);
                if(counter==totalLength)
                {
                  //shows current api call is completed
                  outerCounter++;
                }

                //console.log("outerCounter:"+outerCounter);
                //console.log("outerTotalLength: "+outerTotalLength);
                if(outerCounter==outerTotalLength)
                {
                   OfflineData.setOfflineData("locationItemsList",allLocationItemsData);
                   console.log('Location Items downloaded.');
                   this.downloadItemListImages(allLocationItemsData,locationIds, userId);
                   //this.getUserTravelRequestData(locationIds, userId);
                }
              });
            });
        })
      })
      // .catch((locationItemErr)=>
      // {
      //   console.log('Error while downloading Location items Data:' +locationItemErr);
      //   this.setState({isLoading: false, offlineDownloadStatus:'Error while downloading Location items Data. Please try again.'});
      // });

      // Wait for all requests
      Promise.all(requests).then(() => {
        //console.log('Location data downloaded.')
       });
  }

  async downloadItemListImages(allLocationItemsData,locationIds, userId)
  {
      //console.log(allLocationItemsData);
      console.log('Location Items from ckeditor started.');
      OfflineData.checkForDirectory(Constant.CKEditor_ItemImage_URL_Local);
      var outerCounter=0;
      var lstSrc = [];
      allLocationItemsData.map(obj => 
      {
          //console.log("Location descrption" + obj.descrption);
          var m, 
          //regex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;
          //regex = /<img.*?src="(.*?)"[^>]+>/g;
          regex = /src="(.*?)"/g;
          while ( m = regex.exec(obj.descrption ) ) {
            //console.log("m: "+m[1]);
            lstSrc.push( m[1] );
          }

          // Download video for offline
         var v,
         vregex = /href="(.*?)"/g;
         while ( v = vregex.exec(obj.descrption ) ) {
            //console.log("v: "+v[1]);
            lstSrc.push( v[1] );
          }

          if(obj.descrption!=null && obj.descrption!=undefined && obj.descrption!="")
          {
              var matches = [];
              obj.descrption.replace(/[^<]*(<a href="([^"]+)">([^<]+)<\/a>)/g, function () {
              matches.push(Array.prototype.slice.call(arguments, 1, 4))
              });
              //console.log(matches);
              for (var i = 0; i < matches.length; i++) { 
                //console.log(matches[i][1]);
                lstSrc.push(matches[i][1] );
                let thumbnailImage = matches[i][1];
                thumbnailImage = thumbnailImage.substr(0, thumbnailImage.lastIndexOf(".")) + ".jpg";
                //console.log("thumbnailImage:"+thumbnailImage);
                lstSrc.push(thumbnailImage);
              }
          }

          // var snippet = document.createElement("div");
          // snippet.innerHTML=obj.descrption;
          // var links = snippet.getElementsByTagName("a");
          // for (i = 0; i < links.length; i++) {
          //   //// If required we can apply filter video extensions
          //   //console.log(links[i].href);
          //   lstSrc.push( links[i].href );
          // }

      });

      var totalOuterCounterLength = lstSrc.length;
      //console.log("totalOuterCounterLength: "+totalOuterCounterLength);
      //console.log("lstSrc: "+ lstSrc);

      if(lstSrc.length > 0)
      {
          lstSrc.forEach(src => {
              if(src !=null && src!="")
              {
                  //console.log("src:" + src);
                  var imageUrl= src;
                  var lastSlash = src.lastIndexOf('/');
                  var fileName = src.substring(lastSlash + 1);
                  var localPath= Constant.CKEditor_ItemImage_URL_Local + fileName;
                  console.log("image localPath: "+localPath);
                  if(Platform.OS === 'android')
                  {
                    imageUrl=imageUrl.replace(/https:/g,'http:');
                    imageUrl=imageUrl.replace(/mountainhomestays.app/g,'139.59.6.220:8000');
                  }

                  //Save images for offline
                  try
                  {
                      RNFS.downloadFile({
                        fromUrl: imageUrl,
                        toFile: localPath,
                      }).promise.then((r) => {
                        outerCounter++;
                        //console.log("outerCounter: "+outerCounter);  
                        if(outerCounter == totalOuterCounterLength)
                        {
                          // Proceed to next function
                          //console.log("done");
                          console.log('Location Items from ckeditor downloaded.');
                          this.getUserTravelRequestData(locationIds, userId);
                        }
                      })
                      .catch(err => 
                        {
                          console.log("Error in downloading image:" + imageUrl);
                          outerCounter++;
                          if(outerCounter==totalOuterCounterLength)
                          {
                              // Proceed to next function
                              //console.log("done 2");
                              console.log('Location Items from ckeditor downloaded.');
                              this.getUserTravelRequestData(locationIds, userId);
                          }
                      });
                  }
                  catch(error)
                  {
                    console.log("error:"+error);
                  }
              }
              else
              {
                outerCounter++
                if(outerCounter==totalOuterCounterLength)
                {
                  // Proceed to next function
                    //console.log("done 3");
                    console.log('Location Items from ckeditor downloaded.');
                    this.getUserTravelRequestData(locationIds, userId);
                }
              }
            });
    }
    else{
      console.log('No ckeditor file found for downloading.');
      this.getUserTravelRequestData(locationIds, userId);
    }
  }

  async getUserTravelRequestData(locationIds, userId)
  {
      OfflineData.checkForDirectory(Constant.QrCode_Images_URL_Local);
      console.log("Downloading user travel list");
      //this.setState({offlineDownloadStatus:'Downloading user travel list'})
      OfflineData.setDownloadingMessage("downloadingStatus",'Downloading user travel list'); 
      this.updateStateOfDownloding();
      //console.log("Start Location");
      //console.log(arrayCityId);
      OfflineData.removeItemValue("userTravelList");
      let userTravelData =[];
      let outerCounter=0;
      let outerTotalLength=locationIds.length;
      let homeStayIds =[]; 

      const requests = locationIds.map(locationId => {
        //looping through all states
        fetch(Constant.API_URL + "travels/gettravellerbyuseridandlocationid?userId=" + userId + "&locationId=" + locationId, {
          method: 'GET',
        }).then((response) => {
          const statusCode = response.status;
          const result = response.json();
          return Promise.all([statusCode, result]);
        })
        .then(([res, result]) => {
            //console.log("Home Stay Id:"+result.homeStayId);
            homeStayIds.push(result.homeStayId);
            userTravelData.push(result);

            if(result.qrCode!=null && result.qrCode!="")
            {
                console.log("Download QR images");
                var qrImageUrl= Constant.QrCode_Images_URL + result.qrCode;
                var qrLocalPath= Constant.QrCode_Images_URL_Local + result.qrCode;
                //console.log("qrImageUrl:" + qrImageUrl);
                //console.log("qrLocalPath:" + qrLocalPath);
                RNFS.downloadFile({
                  fromUrl: qrImageUrl,
                  toFile: qrLocalPath,
                }).promise.then((r) => {
                    outerCounter++;
                    //Save data for offline
                    if(outerCounter==outerTotalLength)
                    {
                        console.log("QR code downloading done");
                        OfflineData.setOfflineData("userTravelList",userTravelData);
                        console.log('User travel list downloaded.')
                        this.getHomeStayData(homeStayIds);
                    }     
                }).catch( err =>
                { 
                    console.log("Error while downloadinh QR code => " + err);     
                    outerCounter++;
                    //Save data for offline
                    if(outerCounter==outerTotalLength)
                    {
                        console.log("QR code downloading done");
                        OfflineData.setOfflineData("userTravelList",userTravelData);
                        console.log('User travel list downloaded.')
                        this.getHomeStayData(homeStayIds);
                    }    
                });
            }
            else
            {
                outerCounter++;
                //Save data for offline
                if(outerCounter==outerTotalLength)
                {
                    OfflineData.setOfflineData("userTravelList",userTravelData);
                    console.log('User travel list downloaded.')
                    this.getHomeStayData(homeStayIds);
                }     
            }
        })
      })
      // .catch((travelDataErr)=>
      // {
      //   console.log('Error while downloading Location details Data:' +travelDataErr);
      //   this.setState({isLoading: false, offlineDownloadStatus:'Error while downloading Location details Data. Please try again.'});
      // });

      // Wait for all requests
      Promise.all(requests).then(() => {
        //console.log('Location data downloaded.')
       });
  }

  async getHomeStayData(homeStayIds)
  {
      //console.log("homeStayIds:"+homeStayIds);
      console.log("Downloading home stay data");
      //this.setState({offlineDownloadStatus:'Downloading home stay data'})
      OfflineData.setDownloadingMessage("downloadingStatus",'Downloading home stay data');
      this.updateStateOfDownloding(); 
      //console.log("Start Location");
      //console.log(arrayCityId);
      OfflineData.removeItemValue("homeStayList");
      OfflineData.checkForDirectory(Constant.Gallery_HomeStay_MainImage_Images_URL_Local);
      OfflineData.checkForDirectory(Constant.Gallery_HomeStay_Images_URL_Local);
      let homeStayData =[];
      let outerCounter=0;
      let outerTotalLength=homeStayIds.length; 

      const requests = homeStayIds.map(homeStayId => {
        //looping through all homestay
        fetch(Constant.API_URL + "locations/gethomestaybyid?homestayId=" + homeStayId,{
          method: 'GET',
        }).then((response) => {
          const statusCode = response.status;
          const result = response.json();
          return Promise.all([statusCode, result]);
        })
        .then(([res, result]) => {
            //console.log(result);
            homeStayData.push(result);

             //Save images for offline
            var imageUrl= Constant.Gallery_HomeStay_MainImage_Images_URL + result.mainImgName;
            var localPath= Constant.Gallery_HomeStay_MainImage_Images_URL_Local + result.mainImgName;
            //console.log("main image: "+ localPath);
             RNFS.downloadFile({
              fromUrl: imageUrl,
              toFile: localPath,
            }).promise.then((r) => {

              // Download gallery images of hoemstay
              let counter=0;
              let totalLength= (result.homeStayImages==undefined || result.homeStayImages==null)? 0: result.homeStayImages.length;
              if(totalLength==0)
              {
                  outerCounter++;
                  if(outerCounter==outerTotalLength)
                  {
                      OfflineData.setOfflineData("homeStayList",homeStayData);
                      console.log('Homestay data downloaded.');
                      this.getHomeStayHostData(homeStayIds);
                      //this.setState({isLoading: false, offlineDownloadStatus:'Downloading done!'})
                      //console.log("arrayCityId:"+ arrayCityId);
                  }   
              }
              else{             
                  for (let locationImg of result.homeStayImages) {
                      counter++;
                      var imageUrl_GalleryImage= Constant.Gallery_HomeStay_Images_URL + locationImg.imageName;
                      var localPath_GalleryImage= Constant.Gallery_HomeStay_Images_URL_Local + locationImg.imageName;
                      RNFS.downloadFile({
                        fromUrl: imageUrl_GalleryImage,
                        toFile: localPath_GalleryImage,
                      }).promise.then((r) => {
                      //console.log(localPath);
                        if(counter==totalLength)
                        {
                          outerCounter++;
                        }

                        //Save data for offline
                        if(outerCounter==outerTotalLength)
                        {
                            OfflineData.setOfflineData("homeStayList",homeStayData);
                            console.log('Homestay data downloaded.')
                            this.getHomeStayHostData(homeStayIds);
                            //this.setState({isLoading: false, offlineDownloadStatus:'Downloading done!'})
                            //console.log("arrayCityId:"+ arrayCityId);
                        }    
                      });
                  }
              }
            });            
        })
      })
      // .catch((travelDataErr)=>
      // {
      //   console.log('Error while downloading Location details Data:' +travelDataErr);
      //   this.setState({isLoading: false, offlineDownloadStatus:'Error while downloading Location details Data. Please try again.'});
      // });

      // Wait for all requests
      Promise.all(requests).then(() => {
        //console.log('Location data downloaded.')
       });
  }

  async getHomeStayHostData(homeStayIds)
  {
      //console.log("homeStayIds:"+homeStayIds);
      console.log("Downloading home stay host data");
      //this.setState({offlineDownloadStatus:'Downloading home stay host data'})
      OfflineData.setDownloadingMessage("downloadingStatus",'Downloading home stay host data');
      this.updateStateOfDownloding(); 
      //console.log("Start Location");
      //console.log(arrayCityId);
      OfflineData.removeItemValue("homeStayHostList");
      OfflineData.checkForDirectory(Constant.Homestay_MainImage_Url_Local);
      OfflineData.checkForDirectory(Constant.OwnerImage_Url_Local);
      let homeStayHostData =[];
      let outerCounter=0;
      let outerTotalLength=homeStayIds.length; 
      //console.log("outerTotalLength: "+outerTotalLength);

      const requests = homeStayIds.map(homeStayId => {
        //looping through all homestay
        fetch(Constant.API_URL + "locations/gethomestayownerbyhomestayid?homeStayId=" + homeStayId, {
          method: 'GET',
        }).then((response) => {
          const statusCode = response.status;
          const result = response.json();
          return Promise.all([statusCode, result]);
        })
        .then(([res, result]) => {
            //console.log("result:"+result);
            homeStayHostData.push(result);

             //Save images for offline
            var imageUrl= Constant.Homestay_MainImage_Url + result.homeStaymainImage;
            var localPath= Constant.Homestay_MainImage_Url_Local + result.homeStaymainImage;
            //console.log("result.homeStaymainImage: "+result.homeStaymainImage);
            //console.log("result.imageURL: "+result.imageURL);

            if(result.homeStaymainImage!=null && result.homeStaymainImage!="")
            {
              try{
                //console.log("main image: "+ localPath);
                RNFS.downloadFile({
                  fromUrl: imageUrl,
                  toFile: localPath,
                }).promise.then((r) => {
                  if(result.imageURL!=null && result.imageURL!="")
                  {
                      //this.downloadHomestayOwnerImage(result, homeStayHostData, outerCounter, outerTotalLength);
                      //download owner image         
                      var ownerImageUrl= Constant.OwnerImage_Url + result.imageURL;
                      var ownerImagelocalPath= Constant.OwnerImage_Url_Local + result.imageURL;
                      //console.log("main image: "+ localPath);
                      RNFS.downloadFile({
                        fromUrl: ownerImageUrl,
                        toFile: ownerImagelocalPath,
                      }).promise.then((r) => {
                            outerCounter++;
                            if(outerCounter==outerTotalLength)
                            {
                              OfflineData.setOfflineData("homeStayHostList",homeStayHostData);
                              console.log('Homestay host data downloaded.');
                              this.setState({isLoading: false, offlineDownloadStatus:'Downloading done!'});
                              this.setState({isShowRefreshButton:false});
                              OfflineData.setDownloadingMessage("downloadingStatus",'Last Sync on: '+ this.getParsedDate(new Date())); 
                              this.updateStateOfDownloding();
                              //OfflineData.removeItemValue("downloadingStatus");
                            }
                      })
                      .catch(err => 
                        {
                          console.log("Error in downloading image:" + imageUrl);
                          outerCounter++;
                          if(outerCounter==outerTotalLength)
                          {
                              // Proceed to next function
                              OfflineData.setOfflineData("homeStayHostList",homeStayHostData);
                              console.log('Homestay host data downloaded.');
                              this.setState({isLoading: false, offlineDownloadStatus:'Downloading done!'});
                              this.setState({isShowRefreshButton:false});
                              OfflineData.setDownloadingMessage("downloadingStatus",'Last Sync on: '+ this.getParsedDate(new Date())); 
                              this.updateStateOfDownloding();
                              //OfflineData.removeItemValue("downloadingStatus");
                          }
                      });  
                  }
                  else
                  {
                      outerCounter++;
                      if(outerCounter==outerTotalLength)
                      {
                        OfflineData.setOfflineData("homeStayHostList",homeStayHostData);
                        console.log('Homestay host data downloaded.');
                        this.setState({isLoading: false, offlineDownloadStatus:'Downloading done!'});
                        this.setState({isShowRefreshButton:false});
                        OfflineData.setDownloadingMessage("downloadingStatus",'Last Sync on: '+ this.getParsedDate(new Date())); 
                        this.updateStateOfDownloding();
                        //OfflineData.removeItemValue("downloadingStatus");
                      }
                  }
                });
              }
              catch(error)
              {
                console.log("error:"+error);
              }         
            }
            else if(result.imageURL!=null && result.imageURL!="")
            {
              try{
               //this.downloadHomestayOwnerImage(result, homeStayHostData, outerCounter, outerTotalLength);
                //download owner image         
                var ownerImageUrl= Constant.OwnerImage_Url + result.imageURL;
                var ownerImagelocalPath= Constant.OwnerImage_Url_Local + result.imageURL;
                //console.log("main image: "+ ownerImagelocalPath);
                RNFS.downloadFile({
                  fromUrl: ownerImageUrl,
                  toFile: ownerImagelocalPath,
                }).promise.then((r) => {
                      outerCounter++;
                      if(outerCounter==outerTotalLength)
                      {
                        OfflineData.setOfflineData("homeStayHostList",homeStayHostData);
                        console.log('Homestay host data downloaded.');
                        this.setState({isLoading: false, offlineDownloadStatus:'Downloading done!'});
                        this.setState({isShowRefreshButton:false});
                        OfflineData.setDownloadingMessage("downloadingStatus",'Last Sync on: '+ this.getParsedDate(new Date())); 
                        this.updateStateOfDownloding();
                        //OfflineData.removeItemValue("downloadingStatus");
                      }
                })
                .catch(err => 
                  {
                    console.log("Error in downloading image:" + imageUrl);
                    outerCounter++;
                    if(outerCounter==outerTotalLength)
                    {
                        // Proceed to next function
                        OfflineData.setOfflineData("homeStayHostList",homeStayHostData);
                        console.log('Homestay host data downloaded.');
                        this.setState({isLoading: false, offlineDownloadStatus:'Downloading done!'});
                        this.setState({isShowRefreshButton:false});
                        OfflineData.setDownloadingMessage("downloadingStatus",'Last Sync on: '+ this.getParsedDate(new Date())); 
                        this.updateStateOfDownloding();
                        //OfflineData.removeItemValue("downloadingStatus");
                    }
                });  
              }
              catch(error)
              {
                console.log("error:"+error);
              }    
            }
            else{
              outerCounter++;
              if(outerCounter==outerTotalLength)
              {
                  // Proceed to next function
                  OfflineData.setOfflineData("homeStayHostList",homeStayHostData);
                  console.log('Homestay host data downloaded.');
                  this.setState({isLoading: false, offlineDownloadStatus:'Downloading done!'});
                  this.setState({isShowRefreshButton:false});
                  OfflineData.setDownloadingMessage("downloadingStatus",'Last Sync on: '+ this.getParsedDate(new Date())); 
                  this.updateStateOfDownloding();
                  //OfflineData.removeItemValue("downloadingStatus");
              }
            }    
        })
      })
      // .catch((travelDataErr)=>
      // {
      //   console.log('Error while downloading Location details Data:' +travelDataErr);
      //   this.setState({isLoading: false, offlineDownloadStatus:'Error while downloading Location details Data. Please try again.'});
      // });

      // Wait for all requests
      Promise.all(requests).then(() => {
        //console.log('Location data downloaded.')
       });
  }

  async downloadHomestayOwnerImage(result, homeStayHostData, outerCounter, outerTotalLength)
  {
     //download owner image         
     var ownerImageUrl= Constant.OwnerImage_Url + result.imageURL;
     var ownerImagelocalPath= Constant.OwnerImage_Url_Local + result.imageURL;
     //console.log("main image: "+ localPath);
     RNFS.downloadFile({
       fromUrl: ownerImageUrl,
       toFile: ownerImagelocalPath,
     }).promise.then((r) => {
           if(outerCounter==outerTotalLength)
           {
             OfflineData.setOfflineData("homeStayHostList",homeStayHostData);
             console.log('Homestay host data downloaded.');
             this.setState({isLoading: false, offlineDownloadStatus:'Downloading done!'});
             this.setState({isShowRefreshButton:false});
             OfflineData.setDownloadingMessage("downloadingStatus",'Last Sync on: '+ this.getParsedDate(new Date())); 
             this.updateStateOfDownloding();
             //OfflineData.removeItemValue("downloadingStatus");
           }
     });  
  }


  async deleteAllImages()
  {
      RNFS.readDir(Constant.Base_URL_Local) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then((result) => {
         for (let folder of result) {
              //console.log(folder.path);      
              var ext =  folder.path.split('.').pop();    
              if (ext.toLowerCase() !="js")
              { 
                RNFS.readDir(folder.path)
                .then((resultFiles) => {
                  for (let file of resultFiles) { 
                    //console.log(file);
                    if (file.isFile()) { // only delete if it is a file
                      //console.log(file.path);
                      try {
                        RNFS.unlink(file.path);
                        //console.log(`Successfully deleted ${file.name}`);
                        console.log(`Successfully deleted ${file.path} ${file.name}`);
                      } catch (deleteError) {
                        console.log(`Error deleting ${file.name}`);
                      }
                    }
                  }
                }).catch((err)=>
                {
                  console.log('err:'+err);
                });
            }
        }
        // stat the first file
        //return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  }

  async deleteAllOfflineData() { 

    Alert.alert(
      "Delete Offline Data",
      "Are you sure you want to delete all offline data for your locations?",
      [
        {
          text: "Yes",
          onPress: () => {
            
            this.setState({isDeleteLoader: true});
            (async () => {
                OfflineData.removeItemValue("stateList");
                OfflineData.removeItemValue("cityList");
                OfflineData.removeItemValue("locationList");
                OfflineData.removeItemValue("locationItemsList");
                OfflineData.removeItemValue("userTravelList");
                OfflineData.removeItemValue("homeStayList");
                OfflineData.removeItemValue("homeStayHostList");
                OfflineData.removeItemValue("downloadingStatus");
                this.updateStateOfDownloding();
                this.deleteAllImages();
                setTimeout(() => {this.setState({isDeleteLoader: false})}, 5000)
            })();

          },
        },
        {
          text: "No",
          onPress: () => {
            //console.log("Cancel Pressed")
          },
          style: "cancel"
        },
      ],
      { cancelable: false }
    );
  }

  getParsedDate(date){
    Moment.locale('en');
    return Moment(date).format('LLL');
  }

  render() {
    const changeWidth = this.buttonAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [DEVICE_WIDTH - MARGIN, MARGIN],
    });
    const changeScale = this.growAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, MARGIN],
    });
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>       
        <View style={styles.containerSubmit}>
          <Animated.View style={{width: changeWidth}}>
            <TouchableOpacity
              style={styles.button}
              onPress={this.syncData}
              activeOpacity={2}>
              {this.state.isLoading ? (
                <Image source={spinner} style={styles.image} />
              ) : (
                <Text style={styles.text}>Sync Data</Text>
              )}
            </TouchableOpacity>
            <Animated.View
              style={[styles.circle, {transform: [{scale: changeScale}]}]}
          />
          </Animated.View>
        </View>
        {this.state.isShowLastRunDate === false?(<View></View>):
        (
          <View style={{ alignItems: 'center', justifyContent: 'center',marginTop:10, flexDirection: "row"}}>
            <Text style={{fontSize: 15, fontWeight:'bold'}}>{this.state.offlineDownloadStatus} </Text>
            {(Platform.OS !== 'ios' && this.state.isShowRefreshButton)?(
              <TouchableOpacity style={{marginLeft:10}}
                onPress={this.updateStateOfDownloding} activeOpacity={2}>
                <Image style={{width:25, height:25}} source={refereshImg}/>
              </TouchableOpacity>
            ):
            (<View></View>)
            }
          </View>
        )}
        <View style={styles.containerSubmit}>
          <Animated.View style={{width: changeWidth}}>
            <TouchableOpacity
              style={styles.button}
              onPress={this.deleteAllOfflineData}
              activeOpacity={2}>
              {this.state.isDeleteLoader ? (
                <Image source={spinner} style={styles.image} />
              ) : (
                <Text style={styles.text}>Delete All Offline Data</Text>
              )}
            </TouchableOpacity>
            <Animated.View
              style={[styles.circle, {transform: [{scale: changeScale}]}]}
          />
          </Animated.View>
        </View>
        <KeepAwake />
      </KeyboardAvoidingView>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1.8,
    marginTop:30
  },
  containerSubmit: {
    //flex: 1,
    //top: 25,
    //marginTop: DEVICE_WIDTH*0.1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop:20
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4b9445',
    height: MARGIN,
    borderRadius: 10,
    zIndex: 100,
    //marginTop:25,
  },
  image: {
    width: 24,
    height: 24,
  },
  text: {
    color: 'white',
    backgroundColor: 'transparent',
    fontWeight:"bold",
    fontSize:16
  },
});
