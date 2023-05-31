import Constant from './Constant'
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';

class OfflineData {
  static isOfflineMode=false;
  static syncMessage='You are Offline and seems like you have not sync your app for offline mode';
  static syncMsgDuration=10000;
  static syncMsgType='danger';
  static syncMsgPosition='bottom';
  static offlineMessage='This feature is not available in offline mode.';
  static errorMessage='Some error occurred. Please try later.';

  static async setDownloadingMessage(key,value) {
    try {
        await AsyncStorage.setItem(key,value);
        return true;
    }
    catch(exception) {
        return false;
    }
  }

  static async setOfflineData(ACCESS_TOKEN,value) {
    // try {
    //     await AsyncStorage.setItem(key,value);
    //     return true;
    // }
    // catch(exception) {
    //     return false;
    // }
    AsyncStorage.setItem(ACCESS_TOKEN, JSON.stringify(value), (err)=> {
      if(err){
          //console.log("an error");
          throw err;
      }
      //console.log("success");
      }).catch((err)=> {
          //console.log("error is: " + err);
      });
  }

  static async getOfflineData(ACCESS_TOKEN)
  {
      try {
        const value = await AsyncStorage.getItem(ACCESS_TOKEN);
        //console.log(value);
        if (value !== null) {
            // We have data!!
            //console.log(JSON.parse(value));
            return JSON.parse(value);
        }
      } catch (error) {
          // Error retrieving data
      }
  }

  static async removeItemValue(key) {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch(exception) {
        return false;
    }
  }

  static async checkForDirectory(path)
  {
      RNFS.mkdir(path)
      .then((res) => {
        //console.warn(`MKDIR: ${res}`);
      })
      .catch((err) => {
        //console.error(`MKDIRERR: ${err}`);
      });
  }

  static async onDownloadImage(url,localUrl) {
    //console.log(url);
    //console.log(itemName);
    RNFS.downloadFile({
      fromUrl: url,
      toFile: localUrl,
    }).promise.then((r) => {
      console.log('done');
    });
  }

  static async storeDeclarationFormData(declarationData)
  {
    var arrDeclarationData=[];
    var declarationLocalData = await OfflineData.getOfflineData("declarationData");
    if(declarationLocalData!=null && declarationLocalData!=undefined && declarationLocalData!="")
    {
      declarationLocalData.push(declarationData);
      arrDeclarationData=declarationLocalData;
    }
    else
    {
      arrDeclarationData.push(declarationData);
    }
    OfflineData.setOfflineData("declarationData",arrDeclarationData);
  }
  static async sendDecalartionFormToServer()
  {
      (async () => { 
        //console.log("outer sendDecalartionFormToServer");
        //OfflineData.removeItemValue("declarationData");
        var declarationLocalData = await OfflineData.getOfflineData("declarationData");
        if(declarationLocalData!=null && declarationLocalData!=undefined && declarationLocalData!="")
        {
            //console.log("sendDecalartionFormToServer");
            var totalLength=declarationLocalData.length;
            var counter=0;
            declarationLocalData.map(obj=>{
              fetch(Constant.API_URL + "travels/addselfdeclarationdata", {
                method: 'Post',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body:JSON.stringify(obj),
                })
                .then((response) => {
                  const statusCode = response.status;
                  const result = response.json();
                  return Promise.all([statusCode, result]);
                })
                .then(([res, result]) => {
                  counter++;
                  if (res == 200) {
                      console.log("Update data on server");
                      if(totalLength==counter)
                      {
                        OfflineData.removeItemValue("declarationData");
                      }
                      else
                      {
                        // We can remove the updated record from storage
                        //var remainingDecalartionData=declarationLocalData;
                      }
                  }
                  else {
                    console.log("Some error occur while sending declaration data to server.");
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            });
        }
    })();  
  }

  static async storeCheckinFormData(checkInData)
  {
      var arrCheckInData=[];
      var checkInLocalData = await OfflineData.getOfflineData("checkInData");
      if(checkInLocalData!=null && checkInLocalData!=undefined && checkInLocalData!="")
      {
        checkInLocalData.push(checkInData);
        arrCheckInData=checkInLocalData;
      }
      else
      {
        arrCheckInData.push(checkInData);
      }
      OfflineData.setOfflineData("checkInData",arrCheckInData);
  }
  static async sendCheckinFormToServer()
  {
    (async () => { 
        //OfflineData.removeItemValue("checkInData");
        var checkInLocalData = await OfflineData.getOfflineData("checkInData");
        if(checkInLocalData!=null && checkInLocalData!=undefined && checkInLocalData!="")
        {
            var totalLength=checkInLocalData.length;
            var counter=0;
            //console.log("checkInLocalData");
            checkInLocalData.map(obj=>{
                //console.log("obj =>" +obj.UserVisitDetailId);
                fetch(Constant.API_URL + "travels/addcheckindetail", {
                  method: 'Post',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(obj),
                })
                .then((response) => {
                  const statusCode = response.status;
                  const result = response.json();
                  return Promise.all([statusCode, result]);
                })
                .then(([res, result]) => {
                  if (res == 200) {
                      console.log("Update data on server");
                      if(totalLength==counter)
                      {
                         OfflineData.removeItemValue("checkInData");
                      }
                      else
                      {
                        // We can remove the updated record from storage
                        //var remainingDecalartionData=declarationLocalData;
                      }
                  }
                  else {
                    console.log("Some error occur while sending checkin data to server.");
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
           });
        }
    })();   
  }

  static async storeCheckoutFormData(checkOutData)
  {
      var arrCheckOutData=[];
      var checkOutLocalData = await OfflineData.getOfflineData("checkOutData");
      if(checkOutLocalData!=null && checkOutLocalData!=undefined && checkOutLocalData!="")
      {
        checkOutLocalData.push(checkOutData);
        arrCheckOutData=checkOutLocalData;
      }
      else
      {
        arrCheckOutData.push(checkOutData);
      }
      OfflineData.setOfflineData("checkOutData",arrCheckOutData);
  }
  static async sendCheckoutFormToServer()
  {
      (async () => { 
        //OfflineData.removeItemValue("checkOutData");
        var checkOutLocalData = await OfflineData.getOfflineData("checkOutData");
        if(checkOutLocalData!=null && checkOutLocalData!=undefined && checkOutLocalData!="")
        {
            var totalLength=checkOutLocalData.length;
            var counter=0;
            //console.log("checkOutLocalData");
            checkOutLocalData.map(obj=>{
              //console.log("obj"+ JSON.stringify(obj));
              //obj.DepartureTime = "26:02:00"
              fetch(Constant.API_URL + "travels/addcheckoutdetail", {
                method: 'Post',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
              })
                .then((response) => {
                  const statusCode = response.status;
                  const result = response.json();
                  return Promise.all([statusCode, result]);
                })
                .then(([res, result]) => {
                  counter++;
                  if (res == 200) { 
                      //console.log("checkOutData: Update data on server");
                      if(totalLength==counter)
                      {
                        //console.log("Remove checkOutData");
                         OfflineData.removeItemValue("checkOutData");
                      }
                      else
                      {
                        // We can remove the updated record from storage
                        //var remainingDecalartionData=declarationLocalData;
                      }
                  }
                  else {
                    console.log("Some error occur while sending checkout data to server.");
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
            });
        }
    })();  
  }
}

export default OfflineData;