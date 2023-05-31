import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Text,
  Easing,
  Dimensions,
  TextInput,
  ScrollView,
  Picker,
  Keyboard,
  Button,
  Alert,
} from 'react-native';

import Wallpaper from './Wallpaper';
import {Actions, ActionConst} from 'react-native-router-flux';

import arrowImg from '../images/left-arrow.png';
import logoImg from '../images/small-logo.png';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import calendarIcon from '../images/calendar.png';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationActions } from 'react-navigation';
import Moment from 'moment';
import { showMessage, hideMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from 'react-native-check-box';
import spinner from '../images/loading.gif';
import Constant from './Constant';
import NetInfo from "@react-native-community/netinfo";
import OfflineData from "./OfflineData"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';

//const [checked, setChecked] = React.useState(false);

const MARGIN = 40;
var radio_props_yes_no = [
  { label: 'Yes', value: true },
  { label: 'No', value: false }
];


var radio_props_check = [
  { label: '', value: 'Yes' }
];

//Local variable
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class COVIDDeclarationForm extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      UserVisitDetailId: 0,
      id: '',

      ArrivalDate:'',
      showArrivalDateCal: false,
      travellerArrivalDate: new Date(),

      Dateofdeparture:'',
      showDateofdepartureCal: false,
      travellerDateofdeparture: new Date(),

      anyOutstandings: '',
      stayDuration:'',
      fever: '',
      cough:'',
      breathlessness:'',
      sorethroat:'',
      pleasespecify:'',
      closeContact:'',
     // isSelected:'',
      country:'',
      Userid:'',
      isChecked:false,
      statusbtn: true,

      firstComp:false,
      secondComp:false,
      secondcountry:'',
      thirdcountry:'',

      SecondArrivalDate:'',
      SecondshowArrivalDateCal: false,
      SecondtravellerArrivalDate: new Date(),

      SecondDateofdeparture:'',
      SecondshowDateofdepartureCal: false,
      SecondtravellerDateofdeparture: new Date(),
         
      thirdArrivalDate:'',
      thirdshowArrivalDateCal: false,
      thirdtravellerArrivalDate: new Date(),

      thirdDateofdeparture:'',
      thirdshowDateofdepartureCal: false,
      thirdtravellerDateofdeparture: new Date(),
      formKey: "xyz",
      isSpinner:true,
      
    };
    
    this.thirdshowArrivalDatepicker = this.thirdshowArrivalDatepicker.bind(this);
    this.thirdshowDateofdepartureDatepicker=this.thirdshowDateofdepartureDatepicker.bind(this);
    this.SecondshowArrivalDatepicker = this.SecondshowArrivalDatepicker.bind(this);
    this.SecondshowDateofdepartureDatepicker=this.SecondshowDateofdepartureDatepicker.bind(this);
    this.showArrivalDatepicker = this.showArrivalDatepicker.bind(this);
    this.showDateofdepartureDatepicker=this.showDateofdepartureDatepicker.bind(this);
    this.buttonAnimated = new Animated.Value(0);
    this.growAnimated = new Animated.Value(0);
    this._onPress = this._onPress.bind(this);
    this._onPressCancel = this._onPressCancel.bind(this);
    this.CancelbuttonAnimated = new Animated.Value(0);
   // this.AddMoreMember=this.AddMoreMember.bind(this);


    AsyncStorage.getItem("id").then((value) => {
      this.setState({
        Userid: value
      })
    });

    AsyncStorage.getItem("UserVisitDetailId").then((value) => {
      //console.log("UserVisitDetailId", value);
      this.setState({
        UserVisitDetailId: parseInt(value)
      })
    });

    setTimeout(()=>{this.setState({isSpinner:false})},1000);

  }
  

  textClear() {

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

    console.log("random value"+this.state.formKey)

    this.setState({
      firstComp: false,
      secondComp:false,
    })

    this.setState({
      fever: "",
      cough: "",
      breathlessness: "",
      sorethroat: "",
      anyOutstandings: "",
      closeContact: "",

    })

    console.log("textClear")
    this.state.pleasespecify="",

    this.state.country="",
    this.state.secondcountry="",
    this.state.thirdcountry="",

    this.state.ArrivalDate="",
    this.state.SecondArrivalDate="",
    this.state.thirdArrivalDate="",

    this.state.Dateofdeparture="",
    this.state.SecondDateofdeparture="",
    this.state.thirdDateofdeparture="",

    this.state.isChecked=false;
  };

  componentDidUpdate(prevProps) {
    //console.log("Test");
    //console.log("componentDidUpdate statename:"+this.state.statename);
    
    if (prevProps.navigation.getParam('id') !== this.props.navigation.getParam('id')) {
      this.setState({isSpinner:true})
      setTimeout(()=>this.setState({isSpinner:false}),1000)
      this.textClear();
      //console.log("New Test");
      //this.goToTop();
      //this.textClear();
      // Screen has now come into focus, perform your tasks here! 
    }
    if (prevProps.navigation !== this.props.navigation) {
      this.setState({isSpinner:true})
     
      //this.textClear();
      this.setState({
        firstComp: false,
        secondComp:false,
      })
  
      this.setState({
        fever: "",
        cough: "",
        breathlessness: "",
        sorethroat: "",
        anyOutstandings: "",
        closeContact: "",  
      })
      this.state.pleasespecify="",
  
      this.state.country="",
      this.state.secondcountry="",
      this.state.thirdcountry="",
  
      this.state.ArrivalDate="",
      this.state.SecondArrivalDate="",
      this.state.thirdArrivalDate="",
  
      this.state.Dateofdeparture="",
      this.state.SecondDateofdeparture="",
      this.state.thirdDateofdeparture="",
  
      this.state.isChecked=false;

      setTimeout(()=>this.setState({isSpinner:false}),1000)
    }
  }
  componentDidMount() {
    if(this.state.isSpinner === true)
    {
       setTimeout(()=>this.setState({isSpinner:false}),1000);      
    }
  }

  goToTop = () => {
    this.scroll.scrollTo({x: 0, y: 0, animated: true});
  }



  // componentHideAndShow = () => {
  //   this.setState(previousState => ({ status: !previousState.status }))
  // }

  component1st = () => {

            if (this.state.country !="" && this.state.firstComp !=true) {
              this.setState(previousState => ({ firstComp: !previousState.firstComp }))
            }
            else if(this.state.country ==""){
              showMessage({
                message:
                  "Please enter country",
                type: "danger",
              });
              return;
            }

            else if (this.state.secondcountry !="" && this.state.secondComp !=true) {
              this.setState(previousState => ({ secondComp: !previousState.secondComp }))
               if (this.state.country !="" && this.state.secondcountry !="") {
                this.setState(previousState => ({ statusbtn: !previousState.statusbtn }))
              }
            }
            else if(this.state.secondcountry ==""){
              showMessage({
                message:
                  "Please enter country",
                type: "danger",
              });
              return;
            }

            // else if (this.state.country !="" && this.state.secondcountry !="") {
            //   this.setState(previousState => ({ statusbtn: !previousState.statusbtn }))
            // }

  }

  componenSecond = () => {
    this.setState(previousState => ({ secondComp: !previousState.secondComp }))
  }
  
  // _onPress() {
  //   const navigateAction = NavigationActions.navigate({ routeName: 'CheckInForm',params: { id: this.props.navigation.getParam('id'), homeStayId: this.state.homeStayId, cityId: this.props.navigation.getParam('cityId'),title:this.props.navigation.getParam('cityname','Village List')  }  });
  //   this.props.navigation.dispatch(navigateAction);
  // }

  DeclarationPOP(){
  {
    Alert.alert(
      "Alert!",
      "Please contact your host, for a full checkup for your safety and the safety of your host.",
      [
        { text: "OK ", 
         onPress: () => {
          const navigateAction = NavigationActions.navigate({ routeName: 'CheckInForm',params: { id: this.props.navigation.getParam('id'), homeStayId: this.state.homeStayId, cityId: this.props.navigation.getParam('cityId') } });
          this.props.navigation.dispatch(navigateAction);
          },
        },
      ],
      { cancelable: false }
    );
  }
}

  //On Submit of covid form
  _onPress() {
      //console.log(this.state.fever );

      // if (this.state.fever == "false") {

      //   console.log("   new test");
      // }

   // console.log(this.state.fever+"test is fever");
   //console.log(this.state.isChecked+"    is test  Checked");
  //console.log(this.state.fever+"is fever");

    if (this.state.fever == "") {
      showMessage({
        message:
          "Please select Fever",
        type: "danger",
      });
      return;
    }
    if (this.state.cough =="") {
      showMessage({
        message:
          "Please select Cough",
        type: "danger",
      });
      return;
    }
    if (this.state.breathlessness== "") {
      showMessage({
        message:
          "Please select Breathlessness",
        type: "danger",
      });
      return;
    }

    if (this.state.sorethroat == "") {
      showMessage({
        message:
          "Please select Sorethroat",
        type: "danger",
      });
      return;
    }

    if (this.state.anyOutstandings =="") {
      showMessage({
        message:
          "Please select Others",
        type: "danger",
      });
      return;
    }

    if (this.state.anyOutstandings == "true") {
      if (this.state.pleasespecify.trim() == "") {
        showMessage({
          message:
            "Please enter data in Specify",
          type: "danger",
        });
        return;
      }
    }



  if (this.state.country.trim() !== "") {

     if (this.state.ArrivalDate.trim() == "") {
      showMessage({
        message:
          "Please enter Arrival Date",
        type: "danger",
      });
      return;
    }

    if (this.state.Dateofdeparture.trim() == "") {
      showMessage({
        message:
          "Please enter Departure Date",
        type: "danger",
      });
      return;
    }

      else if ((Date.parse(this.state.travellerDateofdeparture)) > (Date.parse(this.state.travellerArrivalDate))) {
      showMessage({
        message:
          "Arrival Date should be equal or greater than Departure Date",
        type: "danger",
      });
      return;
    }


  }

  
  if (this.state.secondcountry.trim() !== "") {

    if (this.state.SecondArrivalDate.trim() == "") {
     showMessage({
       message:
         "Please enter Arrival Date",
       type: "danger",
     });
     return;
   }

   if (this.state.SecondDateofdeparture.trim() == "") {
     showMessage({
       message:
         "Please enter Departure Date",
       type: "danger",
     });
     return;
   }

     else if ((Date.parse(this.state.SecondtravellerDateofdeparture)) > (Date.parse(this.state.SecondtravellerArrivalDate))) {
     showMessage({
       message:
         "Arrival Date should be equal or greater than Departure Date",
       type: "danger",
     });
     return;
   }


 }


 
 if (this.state.thirdcountry.trim() !== "") {

  if (this.state.thirdArrivalDate.trim() == "") {
   showMessage({
     message:
       "Please enter Arrival Date",
     type: "danger",
   });
   return;
 }

 if (this.state.thirdDateofdeparture.trim() == "") {
   showMessage({
     message:
       "Please enter Departure Date",
     type: "danger",
   });
   return;
 }

   else if ((Date.parse(this.state.thirdtravellerDateofdeparture)) > (Date.parse(this.state.thirdtravellerArrivalDate))) {
   showMessage({
     message:
       "Arrival Date should be equal or greater than Departure Date",
     type: "danger",
   });
   return;
 }


}



    // else if ((Date.parse(this.state.travellerDateofdeparture)) < (Date.parse(this.state.travellerArrivalDate))) {
    //   showMessage({
    //     message:
    //       "Departure Date should be equal or greater than Arrival Date",
    //     type: "danger",
    //   });
    //   return;

    // }

    // if (this.state.country.trim() == "") {
    //   showMessage({
    //     message:
    //       "Please enter Name of Country/City",
    //     type: "danger",
    //   });
    //   return;
    // }

    // else if (this.state.ArrivalDate.trim() == "") {
    //   showMessage({
    //     message:
    //       "Please enter Arrival Date",
    //     type: "danger",
    //   });
    //   return;
    // }

    // else if (this.state.Dateofdeparture.trim() == "") {
    //   showMessage({
    //     message:
    //       "Please enter Date of Departure",
    //     type: "danger",
    //   });
    //   return;
    // }

    if (this.state.closeContact == "") {
      showMessage({
        message:
          "Please select If you have been in close contact with a confirmed case of coronavirus in the last 14 days",
        type: "danger",
      });
      return;
    }

    if (this.state.isChecked == false) {
      showMessage({
        message:
          "Please check the Declaration",
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
   
    //console.log(this.state.UserVisitDetailId+"UserVisitDetailId");
    //console.log(this.state.Userid+"Userid");

    // const navigateAction = NavigationActions.navigate({ routeName: 'CheckInForm',params: { id: this.props.navigation.getParam('id'), homeStayId: this.state.homeStayId, cityId: this.props.navigation.getParam('cityId'),title:this.props.navigation.getParam('cityname','Village List')  }  });
    // this.props.navigation.dispatch(navigateAction);
    
    let lstTravelHistory =[];
    if(this.state.country!="")
    {
      lstTravelHistory.push({
        CountryCityVisited: this.state.country,
        ArrivalDate: this.state.travellerArrivalDate,
        DepartureDate:this.state.travellerDateofdeparture,
      })
    }

    if(this.state.secondcountry!="")
    {
      lstTravelHistory.push({
        CountryCityVisited: this.state.secondcountry,
        ArrivalDate: this.state.SecondtravellerArrivalDate,
        DepartureDate:this.state.SecondtravellerDateofdeparture,
      })
    }

    if(this.state.thirdcountry!="")
    {
      lstTravelHistory.push({
        CountryCityVisited: this.state.thirdcountry,
        ArrivalDate: this.state.thirdtravellerArrivalDate,
        DepartureDate:this.state.thirdtravellerDateofdeparture,
      })
    }

    var declarationFormData={
      UserId: Number(this.state.Userid),
      UserVisitDetailId: Number(this.state.UserVisitDetailId),
    // Fever:this.state.cough =='Yes'?true:false,
      fever:this.state.fever == "true" ? true : false,
      cough:this.state.cough=="true" ? true : false,
      breathlessness: this.state.breathlessness=="true" ? true : false,
      sorethroat: this.state.sorethroat=="true" ? true : false,
      OtherProblemDetail: this.state.pleasespecify,
      InContactWithConfirmedCovidCase: this.state.closeContact=="true" ? true : false,
      TravelHistory:lstTravelHistory,
    }

    NetInfo.fetch().then(state => 
    {
      if (state.isConnected && !OfflineData.isOfflineMode) 
      {
        fetch(Constant.API_URL + "travels/addselfdeclarationdata", {
          method: 'Post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(declarationFormData),
        })
          .then((response) => {
           
            const statusCode = response.status;
            const result = response.json();
            return Promise.all([statusCode, result]);
          })
          .then(([res, result]) => {
            if (res == 200) {
              showMessage({
                message: "Submit Successfully",
                type: "success",
              });
              
              setTimeout(() => {
                this.setState({ isLoading: false });
                this.buttonAnimated.setValue(0);
                //this.props.navigation.navigate("ViewTravelRequestScreen");
              // Actions.locationDetailsScreen({ id: this.state.LocationId });

              if (this.state.fever == "true" || this.state.cough == "true" || this.state.breathlessness == "true" || this.state.sorethroat=="true" || this.state.closeContact=="true" || this.state.anyOutstandings == "true") {
                this.DeclarationPOP();
               }

              else  
              {
                const navigateAction = NavigationActions.navigate({ routeName: 'CheckInForm',params: { Userid: this.state.Userid,id: this.props.navigation.getParam('id'), homeStayId: this.state.homeStayId, cityId: this.props.navigation.getParam('cityId'),title:this.props.navigation.getParam('cityname','Village List')  }  });
                this.props.navigation.dispatch(navigateAction);
              }

              }, 1000);
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
          })
          .catch((error) => {
            console.log(error);
          });
          setTimeout(()=>{this.setState({isSpinner:false})},1000);
      }
      else
      {
          (async () => { 
              await OfflineData.storeDeclarationFormData(declarationFormData);
              showMessage({
                message: "Submit Successfully",
                type: "success",
              });

              this.setState({ isLoading: false });
              this.buttonAnimated.setValue(0);

             if (this.state.fever == "true" || this.state.cough == "true" || this.state.breathlessness == "true" || this.state.sorethroat=="true" || this.state.closeContact=="true" || this.state.anyOutstandings == "true") {
                this.DeclarationPOP();
             }

              else  
              {
                const navigateAction = NavigationActions.navigate({ routeName: 'CheckInForm',params: {Userid: this.state.Userid,id: this.props.navigation.getParam('id'), homeStayId: this.state.homeStayId, cityId: this.props.navigation.getParam('cityId'),title:this.props.navigation.getParam('cityname','Village List')  }  });
                this.props.navigation.dispatch(navigateAction);
              }
            }
            )();   
            setTimeout(()=>this.setState({isSpinner:false}),1000)
      }
    });

  }

  _onPressCancel() {
   //  Actions.locationDetailsScreen({ id: this.state.LocationId });
   
    this.textClear();
    // console.log('test');
    // console.log(this.props.navigation.getParam('id'));
    const navigateAction = NavigationActions.navigate({ routeName: 'LocationDetailsScreen',params: {Userid: this.state.Userid,id: this.props.navigation.getParam('id') }  });
    this.props.navigation.dispatch(navigateAction);
   }

   thirdonDateofarrivalChange = (event, selectedDate) => {
    console.log(selectedDate+"test")
    let currentDate = selectedDate || this.state.thirdtravellerArrivalDate;
    console.log(currentDate+" currentDate test")
    this.state.stayDuration='';
    this.setState({
      thirdtravellerArrivalDate: currentDate,
      thirdArrivalDate: Moment(currentDate).format('DD-MM-YYYY').toString(),
      thirdshowArrivalDateCal: false
    });
  };

  thirdonDateofdepartureChange = (event, selectedDate) => {
    let currentDate = selectedDate || this.state.thirdtravellerDateofdeparture;
    this.state.stayDuration='';
    this.setState({
      thirdtravellerDateofdeparture: currentDate,
      thirdDateofdeparture: Moment(currentDate).format('DD-MM-YYYY').toString(),
      thirdshowDateofdepartureCal: false
    });
  };

   SecondonDateofarrivalChange = (event, selectedDate) => {
    console.log(selectedDate+"test")
    let currentDate = selectedDate || this.state.SecondtravellerArrivalDate;
    console.log(currentDate+" currentDate test")
    this.state.stayDuration='';
    this.setState({
      SecondtravellerArrivalDate: currentDate,
      SecondArrivalDate: Moment(currentDate).format('DD-MM-YYYY').toString(),
      SecondshowArrivalDateCal: false
    });
  };

  SecondonDateofdepartureChange = (event, selectedDate) => {
    let currentDate = selectedDate || this.state.SecondtravellerDateofdeparture;
    this.state.stayDuration='';
    this.setState({
      SecondtravellerDateofdeparture: currentDate,
      SecondDateofdeparture: Moment(currentDate).format('DD-MM-YYYY').toString(),
      SecondshowDateofdepartureCal: false
    });
  };

  onDateofarrivalChange = (event, selectedDate) => {
    console.log(selectedDate+"test")
    let currentDate = selectedDate || this.state.travellerArrivalDate;
    console.log(currentDate+" currentDate test")
    this.state.stayDuration='';
    this.setState({
      travellerArrivalDate: currentDate,
      ArrivalDate: Moment(currentDate).format('DD-MM-YYYY').toString(),
      showArrivalDateCal: false
    });
  };

  onDateofdepartureChange = (event, selectedDate) => {
    let currentDate = selectedDate || this.state.travellerDateofdeparture;
    this.state.stayDuration='';
    this.setState({
      travellerDateofdeparture: currentDate,
      Dateofdeparture: Moment(currentDate).format('DD-MM-YYYY').toString(),
      showDateofdepartureCal: false
    });
  };

  thirdshowDateofdepartureDatepicker() {
    this.setState({ thirdshowDateofdepartureCal: true });
  };

  thirdshowArrivalDatepicker() {
    this.setState({ thirdshowArrivalDateCal: true });
  };

  SecondshowDateofdepartureDatepicker() {
    this.setState({ SecondshowDateofdepartureCal: true });
  };

  SecondshowArrivalDatepicker() {
    this.setState({ SecondshowArrivalDateCal: true });
  };



  showDateofdepartureDatepicker() {
    this.setState({ showDateofdepartureCal: true });
  };

  showArrivalDatepicker() {
    this.setState({ showArrivalDateCal: true });
  };

  showDatepicker () {
    this.setState({show:true});
  };

  
  setfever(value) {
    this.setState({ fever: value.toString() });
  }
  setCough(value) {
    this.setState({ cough: value.toString() });
  }
  setBreathlessness(value) {
    this.setState({ breathlessness: value.toString() });
  }
  setSorethroat(value) {
    this.setState({ sorethroat: value.toString() });
  }
  setClosecontact(value) {
    this.setState({ closeContact: value.toString() });
  }
  

  setOutstanding(value) {
    this.setState({ anyOutstandings: value.toString() });
  }


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
  render() {

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

    return (
   <Wallpaper>
     <ScrollView ref={(c) => {this.scroll = c}}
      style={styles.scrollView} contentContainerStyle={styles.contentContainer} bounces={false}>

     {/*Spinner*/}
     <View style={styles.container}>
     {/*  */}
    <Spinner 
    visible={
      this.state.isSpinner
      && Platform.OS === 'ios' }
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle} 
        overlayColor='white' // overlay of Loader(spiner made white)
        color='green'
        /*overlayColor={'rgba(39,62,84,0.82)'}*/
        />
   </View>

     <KeyboardAwareScrollView>
        {/* <View style={styles.img}>
            <Image source={logoImg} style={styles.logoImage} />
        </View> */}

        <View style={styles.container}>
        {      
                
               
            <View style={styles.textmargin}>
              {/* line */}
               {/* <View style={{ borderBottomColor: '#d3d3d3', borderBottomWidth: 1,margin:10}}/> */}

               <View style={{marginTop:5}}>
                  <Text style={styles.textStyle}>
                   Due to the ongoing and rapidly changing situation with the novel-coronavirus (COVID-19),we are requiring all visitors to Mountain Homestays to fill-out the self-declaration form
                   below. This is to ensure your and the community’s safety.
                  </Text>
                </View>
                {/* line */}
               <View style={{ borderBottomColor: '#d3d3d3', borderBottomWidth: 1,margin:10}}/>
               
                <View>
                    <Text style={styles.textStyle}>Each visitor must complete this form.</Text>
                </View>
                
                {/* line */}
                <View style={{ borderBottomColor: '#d3d3d3', borderBottomWidth: 1,margin:10}}/>
                
                <View>
                    <View style={{marginTop:5,}}>
                        <View> 
                            <View>
                                 <Text style={{ fontSize:15}}>1. Do you have any of the following flu-like symptoms:</Text>
                            </View>
                            <View style={{marginTop:10}}>
                             {/* Fever (100F or above)  */}
                             <View style={{ flex:1, flexDirection:'row',justifyContent: 'center'}}>
                             <Text style={{ width:DEVICE_WIDTH*0.58,fontWeight: "bold",marginTop:5}}>Fever (100 F or above) </Text>
                             <View>
                                  <RadioForm
                                   key={this.state.formKey}
                                   style={{textAlign:'right',marginTop:5}}
                                   radio_props={radio_props_yes_no}
                                   initial={-2}
                                   accessible={true}
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
                                   this.setfever(value);
                                   }}
                                  />
                             </View>
                             </View>
                             {/* Cough*/}
                             <View style={{ flex:1, flexDirection:'row',justifyContent: 'center'}}>
                                              <Text style={{ width:DEVICE_WIDTH*0.58,fontWeight: "bold",marginTop:5 }}>Cough</Text>
                                              <View>
                                                    <RadioForm
                                                      key={this.state.formKey}
                                                      style={{textAlign:'right',marginTop:5,}}
                                                      radio_props={radio_props_yes_no}
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
                                                        this.setCough(value);
                                                      }}
                                                    />
                                                  </View>
                                            </View>
                             {/*Breathlessness  */}
                             <View style={{flex:1, flexDirection:'row',justifyContent: 'center'}}>
                                            <Text style={{  width:DEVICE_WIDTH*0.58, fontWeight: "bold",marginTop:5,}}>Breathlessness</Text>
                                              <View>
                                                <RadioForm
                                                  key={this.state.formKey}
                                                  style={{textAlign:'right',marginTop:5,}}
                                                  radio_props={radio_props_yes_no}
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
                                                    this.setBreathlessness(value);
                                                  }}
                                                />
                                              </View>
                                          
                                            
                                            </View>
                              {/*Sore throat  */}
                              <View style={{flex:1, flexDirection:'row',justifyContent: 'center'}}>
                                            <Text style={{ width:DEVICE_WIDTH*0.58, fontWeight: "bold",marginTop:5, }}>Sore throat</Text>
                                              <View>
                                                <RadioForm
                                                  key={this.state.formKey}
                                                  style={{textAlign:'right',marginTop:5,}}
                                                  radio_props={radio_props_yes_no}
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
                                                    this.setSorethroat(value);
                                                  }}
                                                />
                                              </View>
                                            </View>
                             {/* Others: Please specify */}
                             <View style={{ flex:1, flexDirection:'row',justifyContent: 'center'}}>
                                            <Text style={{width:DEVICE_WIDTH*0.58, fontWeight: "bold",marginTop:5,}}>Others</Text>
                                              <View>
                                                <RadioForm
                                                  key={this.state.formKey}
                                                  style={{textAlign:'right',marginTop:5,}}
                                                  radio_props={radio_props_yes_no}
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

                            {this.state.anyOutstandings == "true" ? (
                            <View>
                            <Text style={{width:DEVICE_WIDTH*0.58, fontWeight: "bold", marginBottom: 10 }}>Please specify:</Text>
                            <View>
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
                                      //source={usernameImg}
                                      //placeholder="Enter any comments or suggestions"
                                      autoCapitalize={'none'}
                                      returnKeyType={'done'}
                                      autoCorrect={false}
                                      onSubmitEditing={Keyboard.dismiss}
                                      //onChangeText={text=>this.setState({ firstName: text })}
                                      value={this.state.pleasespecify}
                                      onChangeText={text => {
                                      this.setState({
                                        pleasespecify: text,
                                       });
                                      }}
                                      value={this.state.pleasespecify}
                                      //autoCapitalize={'words'}
                                    />
                                  </View>
                            </View>
                       </View>
                            ) : (
                            <View></View>
                            )}
                             {/* <View>
                                  <Text style={{ marginHorizontal: 10,marginLeft:38,fontWeight: "bold", marginBottom: 10 }}>Please specify:</Text>
                                  <View>
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
                                            //source={usernameImg}
                                            //placeholder="Enter any comments or suggestions"
                                            autoCapitalize={'none'}
                                            returnKeyType={'done'}
                                            autoCorrect={false}
                                            onSubmitEditing={Keyboard.dismiss}
                                            //onChangeText={text=>this.setState({ firstName: text })}
                                            onChangeText={text => {
                                            this.setState({
                                              pleasespecify: text,
                                             });
                                            }}
                                            value={this.state.pleasespecify}
                                            //autoCapitalize={'words'}
                                          />
                                        </View>
                                  </View>
                             </View>        */}
                            
                            
                            </View>
                        </View>
                          {/* line */}
                          <View style={{ borderBottomColor: '#d3d3d3', borderBottomWidth: 1,margin:10}}/>
               
                        <View> 
                            <View style={{marginTop:5}}>
                                            <Text style={{fontSize:15,}}>2. Please list the country/cities you have travelled to in the last 14 days prior to arriving
                                                here.</Text>
                                        </View>         
                            <View>
                                  <View style={{ flex:1,flexDirection:"row",}}>
                                       <Text style={{  fontWeight: "bold",fontSize:15, marginLeft: DEVICE_WIDTH*0.01,marginTop:10 }}>Name of Country/City:</Text>
                                          <View>
                                              <TextInput
                                                onBlur={() => this._onBlur()}
                                                onFocus={() => this._onFocus()}
                                                underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                                                style={styles.input}
                                                //source={emailImg}
                                                placeholder="Enter Country Name"
                                                autoCapitalize={'none'}
                                                returnKeyType={'done'}
                                                autoCorrect={false}
                                                value={this.state.country}
                                                onChangeText = {text=>this.setState({ country: text })}

                                             />
                                          </View>
                                  </View>
                             </View> 
                            <View>
                                 <View style={{flex:1,flexDirection:"row",}}>
                                        <Text style={{ marginHorizontal: 10, fontWeight: "bold",fontSize:15, marginLeft: DEVICE_WIDTH*0.01 }}>Date of arrival               :</Text>
                                        <View>
                                                <TouchableOpacity onPress={this.showArrivalDatepicker}>
                                            <Image source={calendarIcon} style={styles.inlineCalImg} />
                                            <TextInput value={this.state.ArrivalDate} editable={false} placeholder="Select date"
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
                                            {this.state.showArrivalDateCal && <DateTimePicker testID="ArrivalTimePicker"
                                                  value={this.state.travellerArrivalDate}
                                                  mode='date'
                                                  is24Hour={true}
                                                  display="default"
                                                 minimumDate={new Date().setDate(new Date().getDay()-3)}
                                                 maximumDate={new Date()}
                                                  // minimumDate={new Date(this.state.travellerCheckInDate)}
                                                  onChange={this.onDateofarrivalChange}
                                                />}
                                       </View>
                                 </View>
                            </View>
                            <View>
                                 <View style={{flex:1,flexDirection:"row",}}>
                                     <Text style={{marginHorizontal: 10, fontWeight: "bold",fontSize:15, marginLeft: DEVICE_WIDTH*0.01}}>Date of departure         :</Text>
                                     <View>
                                        <TouchableOpacity onPress={this.showDateofdepartureDatepicker}>
                                            <Image source={calendarIcon} style={styles.inlineCalImg} />
                                            <TextInput value={this.state.Dateofdeparture} editable={false} placeholder="Select date"
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
                                         {this.state.showDateofdepartureCal && <DateTimePicker testID="DateofdepartureTimePicker"
                                            value={this.state.travellerDateofdeparture}
                                            mode='date'
                                            is24Hour={true}
                                            display="default"
                                           // minimumDate={new Date(this.state.travellerArrivalDate)}
                                             minimumDate={new Date().setDate(new Date().getDay()-3)}
                                            maximumDate={new Date()}
                                            onChange={this.onDateofdepartureChange}
                                         />}
                                   </View>
                                 </View>
                            </View>        
                           
                            {/* <View>
                                <TouchableOpacity style={styles.buttonAddMore}
                                       // onPress={this.AddMoreMember}
                                        onPress={this.component1st}
                                      activeOpacity={2}>
                                        <View style={{flex:1, flexDirection:'row'}}>
                                          <Text style={styles.addMorePlus}>+ </Text>
                                          <Text style={styles.addMoreText}>Add</Text>
                                        </View>
                                </TouchableOpacity> 
                            </View> */}



{
        this.state.firstComp ?
                            <View>
                       
                                <View>
                                      <View style={{ flex:1,flexDirection:"row",}}>
                                          <Text style={{ marginHorizontal: 10, fontWeight: "bold",fontSize:15, marginLeft: DEVICE_WIDTH*0.01,marginTop:10 }}>Name of Country/City:</Text>
                                              <View>
                                                  <TextInput
                                                    onBlur={() => this._onBlur()}
                                                    onFocus={() => this._onFocus()}
                                                    underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                                                    style={styles.input}
                                                    //source={emailImg}
                                                    placeholder="Enter Country Name"
                                                    autoCapitalize={'none'}
                                                    returnKeyType={'done'}
                                                    autoCorrect={false}
                                                   value={this.state.secondcountry}
                                                    onChangeText = {text=>this.setState({ secondcountry: text })}

                                                />
                                              </View>
                                      </View>
                                </View> 
                                <View>
                                    <View style={{flex:1,flexDirection:"row",}}>
                                            <Text style={{ marginHorizontal: 10, fontWeight: "bold",fontSize:15, marginLeft: DEVICE_WIDTH*0.01 }}>Date of arrival               :</Text>
                                            <View>
                                                    <TouchableOpacity onPress={this.SecondshowArrivalDatepicker}>
                                                <Image source={calendarIcon} style={styles.inlineCalImg} />
                                                <TextInput value={this.state.SecondArrivalDate} editable={false} placeholder="Select date"
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
                                                {this.state.SecondshowArrivalDateCal && <DateTimePicker testID="SecondArrivalTimePicker"
                                                      value={this.state.SecondtravellerArrivalDate}
                                                      mode='date'
                                                      is24Hour={true}
                                                      display="default"
                                                      //minimumDate={new Date()}
                                                      minimumDate={new Date().setDate(new Date().getDay()-3)}
                                                      maximumDate={new Date()}
                                                      // minimumDate={new Date(this.state.travellerCheckInDate)}
                                                      onChange={this.SecondonDateofarrivalChange}
                                                    />}
                                          </View>
                                    </View>
                                </View>
                                <View>
                                    <View style={{flex:1,flexDirection:"row",}}>
                                        <Text style={{marginHorizontal: 10, fontWeight: "bold",fontSize:15, marginLeft: DEVICE_WIDTH*0.01}}>Date of departure         :</Text>
                                        <View>
                                            <TouchableOpacity onPress={this.SecondshowDateofdepartureDatepicker}>
                                                <Image source={calendarIcon} style={styles.inlineCalImg} />
                                                <TextInput value={this.state.SecondDateofdeparture} editable={false} placeholder="Select date"
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
                                            {this.state.SecondshowDateofdepartureCal && <DateTimePicker testID="SecondDateofdepartureTimePicker"
                                                value={this.state.SecondtravellerDateofdeparture}
                                                mode='date'
                                                is24Hour={true}
                                                display="default"
                                                //minimumDate={new Date()}
                                                minimumDate={new Date().setDate(new Date().getDay()-3)}
                                                maximumDate={new Date()}
                                                onChange={this.SecondonDateofdepartureChange}
                                            />}
                                      </View>
                                    </View>
                                </View>          
 
                           </View>
                           :null
}

{
        this.state.secondComp ?
                           <View>
       
                                <View>
                                      <View style={{ flex:1,flexDirection:"row",}}>
                                          <Text style={{ marginHorizontal: 10, fontWeight: "bold",fontSize:15, marginLeft: DEVICE_WIDTH*0.01,marginTop:10 }}>Name of Country/City:</Text>
                                              <View>
                                                  <TextInput
                                                    onBlur={() => this._onBlur()}
                                                    onFocus={() => this._onFocus()}
                                                    underlineColorAndroid={this._getULColor(this.state.hasFocus)}
                                                    style={styles.input}
                                                    //source={emailImg}
                                                    placeholder="Enter Country Name"
                                                    autoCapitalize={'none'}
                                                    returnKeyType={'done'}
                                                    autoCorrect={false}
                                                    value={this.state.thirdcountry}
                                                    onChangeText = {text=>this.setState({ thirdcountry: text })}

                                                />
                                              </View>
                                      </View>
                                </View> 
                                <View>
                                    <View style={{flex:1,flexDirection:"row",}}>
                                            <Text style={{ marginHorizontal: 10, fontWeight: "bold",fontSize:15, marginLeft: DEVICE_WIDTH*0.01 }}>Date of arrival               :</Text>
                                            <View>
                                                    <TouchableOpacity onPress={this.thirdshowArrivalDatepicker}>
                                                <Image source={calendarIcon} style={styles.inlineCalImg} />
                                                <TextInput value={this.state.thirdArrivalDate} editable={false} placeholder="Select date"
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
                                                {this.state.thirdshowArrivalDateCal && <DateTimePicker testID="thirdArrivalTimePicker"
                                                      value={this.state.thirdtravellerArrivalDate}
                                                      mode='date'
                                                      is24Hour={true}
                                                      display="default"
                                                      //minimumDate={new Date()}
                                                      minimumDate={new Date().setDate(new Date().getDay()-3)}
                                                      maximumDate={new Date()}
                                                      // minimumDate={new Date(this.state.travellerCheckInDate)}
                                                      onChange={this.thirdonDateofarrivalChange}
                                                    />}
                                          </View>
                                    </View>
                                </View>
                                <View>
                                    <View style={{flex:1,flexDirection:"row",}}>
                                        <Text style={{marginHorizontal: 10, fontWeight: "bold",fontSize:15, marginLeft: DEVICE_WIDTH*0.01}}>Date of departure         :</Text>
                                        <View>
                                            <TouchableOpacity onPress={this.thirdshowDateofdepartureDatepicker}>
                                                <Image source={calendarIcon} style={styles.inlineCalImg} />
                                                <TextInput value={this.state.thirdDateofdeparture} editable={false} placeholder="Select date"
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
                                            {this.state.thirdshowDateofdepartureCal && <DateTimePicker testID="thirdDateofdepartureTimePicker"
                                                value={this.state.thirdtravellerDateofdeparture}
                                                mode='date'
                                                is24Hour={true}
                                                display="default"
                                                //minimumDate={new Date()}
                                                minimumDate={new Date().setDate(new Date().getDay()-3)}
                                                maximumDate={new Date()}
                                                onChange={this.thirdonDateofdepartureChange}
                                            />}
                                      </View>
                                    </View>
                                </View>          
                                            
                        </View>
                      :null
}

{
        this.state.statusbtn ?
                          <View>
                                <TouchableOpacity style={styles.buttonAddMore}
                                       // onPress={this.AddMoreMember}
                                        onPress={this.component1st}
                                      activeOpacity={2}>
                                        <View style={{flex:1, flexDirection:'row'}}>
                                          <Text style={styles.addMorePlus}>+ </Text>
                                          <Text style={styles.addMoreText}>Add</Text>
                                        </View>
                                </TouchableOpacity> 
                            </View>
                      :null
}

                       </View>         
                        {/* line */}
                        <View style={{ borderBottomColor: '#d3d3d3', borderBottomWidth: 1,margin:10}}/>
               
                        <View> 
                            <View>
                                <Text style={{fontSize:15}}>3. Have you or an immediate family member come in close contact with a confirmed
                                            case of the coronavirus in the last 14 days? (“Close contact” means being at a distance
                                            of less than one metre for more than 15 minutes.)
                                </Text>
                            </View>
                            <View style={{marginTop:10}}>
                              
                                <View style={{ flexDirection:"row", alignItems:"center",justifyContent: 'center'}}>
                                    <Text style={{fontWeight: "bold",fontSize:15,width:DEVICE_WIDTH*0.58,  }}>
                                      I have been in close contact with a confirmed case of coronavirus in the last 14days.
                                    </Text>
                                    <View>
                                        <RadioForm
                                            key={this.state.formKey}
                                            style={{}}
                                            radio_props={radio_props_yes_no}
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
                                            this.setClosecontact(value);
                                            }}
                                         />
                                  </View>     
                               </View>
                            </View>    
                      </View> 
                    </View>
                </View>
                {/* line */}
                <View style={{ borderBottomColor: '#d3d3d3', borderBottomWidth: 1,margin:10}}/>
                <View>
                            <Text style={styles.textStyle}>This document will be retained confidentially by Mountain Homestays for one month after
                            submission. The health and wellbeing of our community and the travellers is our priority
                            therefore MH reserves the right to deny entry to the campus. </Text>
                          </View>
                {/* line */}
                <View style={{ borderBottomColor: '#d3d3d3', borderBottomWidth: 1,margin:10}}/>
                <View  style={{flex:1, flexDirection:'row'}}>
                            <View>
                                <CheckBox
                                    style={{marginTop:3}}
                                    tintColors={{ true: 'red' }, { false: 'green' }}
                                    // onFillColor={'green'}
                                    //checkedColor={'red'}
                                   // checkedColor='red'

                                    onClick={()=>{
                                            this.setState({
                                                isChecked:!this.state.isChecked
                                              })
                                            {this.state.isChecked == true ? (
                                            this.state.isChecked=false
                                            ) : (
                                            this.state.isChecked=true
                                            )}
                                    }}
                                    isChecked={this.state.isChecked}
                                />
                            </View>
                            <View >
                                  <Text style={{
                              // marginTop:10,
                              fontSize: 15,
                               marginLeft:10,
                               marginRight:15,
                            }}>
                                     I hereby declare that all information provided by me is correct and true in its nature. 
                                  </Text>
                            </View>
                                            
                          </View>
                {/* line */}
                <View style={{ borderBottomColor: '#d3d3d3', borderBottomWidth: 1,margin:10}}/>
               
           </View>
  }
       </View>
{/* 
              <View>
                  {
                   this.state.status ? <Text> Hello Friends </Text> : null
                  }
                  <Button title="Hide Text Component" onPress={this.componentHideAndShow} />
             </View> */}

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'center', marginTop: 10, margin: 5 }}>
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
    );
  }
}

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    // margin: 20,
    // alignItems: 'flex-end',
    // justifyContent: 'flex-end',
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

  addMoreText: {
    alignItems: 'center',
    justifyContent: 'center',
    //marginLeft:DEVICE_WIDTH*0.09,
    color: 'white',
    backgroundColor: 'transparent',
    fontSize:15,
    marginTop: 9
  },

  textmargin:{
    marginLeft:5,
    marginRight:5
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
  inputWrapper: {
    // flex: DEVICE_HEIGHT * 0.6,
    // flex: 1
  },
  inlineCalImg: {
    position: 'absolute',
    zIndex: 99,
    width: 25,
    height: 25,
    // left: DEVICE_WIDTH * 0.4,
    left: DEVICE_WIDTH * 0.35,
    top: 5,
  },
  contentContainer: {
    //justifyContent: 'center',
    //alignItems: 'center',
    // backgroundColor: 'lightgrey',
    paddingBottom: 50,
    marginHorizontal: 5,
  },
  Cancelbutton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    height: MARGIN,
    borderRadius: 10,
    zIndex: 100,
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
textStyle:{
  marginTop:5,
  fontSize: 15,
  marginLeft:5
},

img:{
marginLeft:DEVICE_WIDTH*0.15,

},
button: {
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#4b9445',
  height: MARGIN,
  borderRadius: 10,
  zIndex: 100,
},
text: {
  color: 'white',
  backgroundColor: 'transparent',
},
image: {
  width: 24,
  height: 24,
},

textCancel: {
  color: 'white',
  backgroundColor: 'transparent',
},

input: {
  backgroundColor: 'rgba(255, 255, 255, 0.4)',
  width: DEVICE_WIDTH - 60,
  height: 44,
  marginHorizontal: 20,
  // paddingRight: 45,
  paddingRight: 45,
  //borderRadius: 20,
  color: '#000000',
  //borderColor: '#999999',
  //borderWidth: 1,
  borderBottomWidth: (Platform.OS === 'ios') ? 1 : 0,
  borderBottomColor:(Platform.OS === 'ios') ? 'gray' : 'transparent',
},

textAreaContainer: {
  borderColor: 'green',
  borderWidth: 1,
  // padding: 5,
  width: DEVICE_WIDTH *0.92,
  height: 90,
  // marginHorizontal: 20,
  // paddingRight: 45,
  //marginLeft:40,
 
},

  logoImage: {
    width:270,
    height:100,
    marginTop:15,
  },

});