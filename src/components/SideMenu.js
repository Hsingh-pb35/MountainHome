/*Example of Navigation Drawer with Sectioned Menu*/

import PropTypes, { string } from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { ScrollView, Text, View, StyleSheet, Image,TouchableOpacity,Dimensions, Alert } from 'react-native';
import logoIcon from '../images/menulogo.png'
import {Actions} from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import backIcon from '../images/close.png'
import { color } from 'react-native-reanimated';
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class SideMenu extends Component {
  constructor() {
    super();
    /*Array of the sidebar navigation option with 
    Heading, Subheading and screen to navigate.*/
    //Sreen to navigate can be any screen defined in Drawer Navigator in App.js
    
    // this.options = [
    //   {
    //     mainHeading: 'Main Heading 1',
    //     subOptions: [
    //       { secondaryHeading: 'First Screen', navigationPath: 'First' },
    //     ],
    //   },
    //   {
    //     mainHeading: 'Main Heading 2',
    //     subOptions: [
    //       { secondaryHeading: 'Second Screen', navigationPath: 'Second' },
    //       { secondaryHeading: 'Third Screen', navigationPath: 'Third' },
    //     ],
    //   },
    // ];

      this.options = [
      {
        mainHeading: 'Main Heading 1',
        subOptions: [
          //{ secondaryHeading: 'Home', navigationPath: 'Home' },
          { secondaryHeading: 'Home', navigationPath: 'ChooseStateScreen'},
          { secondaryHeading: 'Profile', navigationPath: 'Profile' },
          //{ secondaryHeading: 'Settings', navigationPath: 'Settings' },
          { secondaryHeading: 'View Travel Request', navigationPath: 'ViewTravelRequestScreen' },
          { secondaryHeading: 'Change Password', navigationPath: 'ChangePassword' },
          //{ secondaryHeading: 'Choose State', navigationPath: 'ChooseStateScreen' },
          //{ secondaryHeading: 'Add Travel Request', navigationPath: 'TravelRequestScreen' },
          //{ secondaryHeading: 'Choose City', navigationPath: 'CityScreen' },
          { secondaryHeading: 'Sync Data', navigationPath: 'OfflineSyncScreen' },
        ],
        
      },
    ];

    this._onSignOut = this._onSignOut.bind(this);
  }

  navigateToScreen = route => () => {
    //console.log(route);
    if(route=="")
    {
      this.props.navigation.closeDrawer();
    }
    else
    {
    //username:string='Test';
      AsyncStorage.getItem("username").then((value) => {
        username=value;
        if(value==null || value=="")
        {
          Actions.loginScreen();
        }
      });
      const navigateAction = NavigationActions.navigate({
        routeName: route,
        params: {title:'Choose State'} ,
      });
      //this.props.navigation.setParams({title: 'test' });
      this.props.navigation.dispatch(navigateAction);
    }
  };

  _onSignOut() { 
    Alert.alert(
      "Sign out",
      "Are you sure you want to signout from app?",
      [
        { text: "Yes", 
         onPress: () => {
          AsyncStorage.getAllKeys()
          .then(keys => AsyncStorage.multiRemove(keys))
          .then(() => Actions.loginScreen());
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

  render() {
    return (
      <View style={styles.container}>
        <ScrollView bounces={false}>
          <View >
            {/* {this.options.map((option, key) => (
              <View key={key}>
                <Text style={styles.mainHeading}>{option.mainHeading}</Text>
                {option.subOptions.map((item, key) => (
                  <View style={styles.secondaryHeading} key={key}>
                    <Text onPress={this.navigateToScreen(item.navigationPath)}>
                      {item.secondaryHeading}
                    </Text>
                  </View>
                ))}
              </View>
            ))} */}


            <View style={{flexDirection:'row', display: 'flex', justifyContent: 'space-between' }}>
                  <Image source={logoIcon} style={{ marginLeft: 12,width: 190, height: 70, marginTop:7 }}></Image>
                  {/* <TouchableOpacity onPress={this.navigateToScreen('')} activeOpacity={2}>
                      <Image source={backIcon} style={{ marginRight: DEVICE_WIDTH*0.03 ,width: 20, height: 20,}}></Image>
                  </TouchableOpacity>    */}
             </View>

            {this.options.map((option, key) => (
              <View key={key}>
                {/* <Text style={styles.mainHeading}>{option.mainHeading}</Text> */}
                {option.subOptions.map((item, key) => (
                  <View style={styles.secondaryHeading} key={key}>
                    <Text onPress={this.navigateToScreen(item.navigationPath)} style={{fontSize:15, marginTop:5,}}>
                      {item.secondaryHeading}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            onPress={this._onSignOut}
            activeOpacity={2}>
            <Text style={{
                color:"#fff",
                fontSize:15
            }}
            >Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flex: 1,
  },
  secondaryHeading: {
    top:12,
    padding: 10,
  },
  mainHeading: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: 'lightgrey',
  },
  footerContainer: {
    padding: 20,
    //backgroundColor: 'lightgrey',
    backgroundColor: '#489142',
    
  },
});

export default SideMenu;