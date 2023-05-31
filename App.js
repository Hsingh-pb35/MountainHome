// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow strict-local
//  */

import React from 'react';
//import SplashScreen from 'react-native-splash-screen'

import { Router, Scene, Actions, ActionConst } from 'react-native-router-flux';
import LoginScreen from './src/components/LoginScreen';
import InitialScreens from './src/components/InitialScreen';
import SecondScreen from './src/components/SecondScreen';
import IndexScreen from './src/components/IndexScreen';
import RegistrationScreen from './src/components/RegistrationScreen';
import ForgotPasswordScreen from './src/components/ForgotPasswordScreen';
import GetotpforgotScreen from './src/components/GetotpforgotScreen';
import GeneratePasswordForgot from './src/components/GeneratePasswordForgot';
import FlatListDemo from './src/components/FlatListDemo';
import FlashMessage from "react-native-flash-message";
import { View, StatusBar } from 'react-native';
import HomeScreen from './src/components/HomeScreen';
import LocationDetailsScreen from './src/components/LocationDetailsScreen';
import LocationItemScreen from './src/components/LocationItemScreen';
import TravelRequestScreen from './src/components/TravelRequestScreen';
import ViewTravelRequestScreen from './src/components/ViewTravelRequestScreen';
import ViewTravelRequestMemberScreen from './src/components/ViewTravelRequestMemberScreen';
import HomeStayScreen from './src/components/HomeStayScreen';
import YourHost from './src/components/YourHost';
import CheckInForm from './src/components/CheckInForm';
import CheckOutForm from './src/components/CheckOutForm';
import ChooseStateScreen from './src/components/ChooseStateScreen';
import CityScreen from './src/components/CityScreen';
import COVIDDeclarationForm from './src/components/COVIDDeclarationForm';
import SplashScreen from 'react-native-splash-screen'
import OfflineData from "./src/components/OfflineData";
import NetInfo from "@react-native-community/netinfo";
import BackgroundJob from 'react-native-background-job';

const backgroundJob = {
  jobKey: "SyncOfflineData",
  job: () => console.log("Running in background")
};

BackgroundJob.register(backgroundJob);

class App extends React.Component {

  componentDidMount() {
    StatusBar.setHidden(true);
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    setTimeout(() => {
      SplashScreen.hide();
    }, 2500)

    console.log("app.js called");
    NetInfo.fetch().then(state => {
      if (state.isConnected && !OfflineData.isOfflineMode) {
        OfflineData.sendDecalartionFormToServer();
        OfflineData.sendCheckinFormToServer();
        OfflineData.sendCheckoutFormToServer();
      }
    });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Router>
          <Scene key="root">

            {/*initial onBoardng Intro*/}

            <Scene key="initialScreens"
              component={InitialScreens}
              animation='fade'
              hideNavBar={true}
              initial={true}
              gesturesEnabled={false}

            />

            {/*Login screen*/}
            <Scene key="loginScreen"
              component={LoginScreen}
              animation='fade'
              hideNavBar={true}
              // initial={true}
              gesturesEnabled={false}
            />

            <Scene key="indexScreen"
              component={IndexScreen}
              animation='fade'
              hideNavBar={true}
              gesturesEnabled={false}
            />
            <Scene key="registrationScreen"
              component={RegistrationScreen}
              animation='fade'
              hideNavBar={true}
              gesturesEnabled={false}
            />
            <Scene key="forgotPasswordScreen"
              component={ForgotPasswordScreen}
              animation='fade'
              hideNavBar={true}
              gesturesEnabled={false}
            />

            <Scene key="getotpforgotScreen"
              component={GetotpforgotScreen}
              animation='fade'
              hideNavBar={true}
              gesturesEnabled={false}
            />

            <Scene key="generatePasswordForgot"
              component={GeneratePasswordForgot}
              animation='fade'
              hideNavBar={true}
              gesturesEnabled={false}
            />

            {/* <Scene key="homeScreen"
                component={HomeScreen}
                animation='fade'
                hideNavBar={true}
                gesturesEnabled={false}
              />
              <Scene key="locationDetailsScreen"
                component={LocationDetailsScreen}
                animation='fade'
                hideNavBar={true}
                options={{gestureEnabled: false}}
              />
              <Scene key="locationItemScreen"
                component={LocationItemScreen}
                animation='fade'
                hideNavBar={true}
                options={{gestureEnabled: false}}
              />
               <Scene key="travelRequestScreen"
                component={TravelRequestScreen}
                animation='fade'
                hideNavBar={true}
                options={{gestureEnabled: false}}
              />
               <Scene key="viewTravelRequestScreen"
                component={ViewTravelRequestScreen}
                animation='fade'
                hideNavBar={true}
                options={{gestureEnabled: false}}
              />
                 <Scene key="viewTravelRequestMemberScreen"
                component={ViewTravelRequestMemberScreen}
                animation='fade'
                hideNavBar={true}
                options={{gestureEnabled: false}}
              />
                 <Scene key="homeStayScreen"
                component={HomeStayScreen}
                animation='fade'
                hideNavBar={true}
                options={{gestureEnabled: false}}
              />
                <Scene key="yourHost"
                component={YourHost}
                animation='fade'
                hideNavBar={true}
                options={{gestureEnabled: false}}
              />
              <Scene key="CheckInForm"
                component={CheckInForm}
                animation='fade'
                hideNavBar={true}
                options={{gestureEnabled: false}}
              />
              <Scene key="CheckOutForm"
                component={CheckOutForm}
                animation='fade'
                hideNavBar={true}
                options={{gestureEnabled: false}}
              />

             <Scene key="ChooseStateScreen"
                component={ChooseStateScreen}
                animation='fade'
                hideNavBar={true}
                options={{gestureEnabled: false}}
              />

             <Scene key="CityScreen"
                component={CityScreen}
                animation='fade'
                hideNavBar={true}
                options={{gestureEnabled: false}}
              />

              <Scene key="COVIDDeclarationForm"
                component={COVIDDeclarationForm}
                animation='fade'
                hideNavBar={true}
                options={{gestureEnabled: false}}
              /> */}
          </Scene>
        </Router>
        <FlashMessage position="top" />
      </View>
    );
  }

}

export default App;
