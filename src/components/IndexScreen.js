import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  View,
  Text,
  Image,
  TouchableOpacity,
  YellowBox,
  Dimensions,
  Button,
} from 'react-native';

//Import React Navigation
import {createAppContainer} from 'react-navigation';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import AsyncStorage from '@react-native-community/async-storage';

//Import all the screens
import ChooseStateScreen from './ChooseStateScreen';
import CityScreen from './CityScreen';
import HomeScreen from './HomeScreen'
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';

//Import custom Drawer / sidebar
import SideMenu from './SideMenu'

import hamburgerIcon from '../images/hamburger.png'
import backIcon from '../images/back-icn.png'
import noimage from '../images/noimage.png';
import ChangePassword from './ChangePassword';
import ViewTravelRequestScreen from './ViewTravelRequestScreen';
import TravelRequestScreen from './TravelRequestScreen';
import YourHost from './YourHost';
import CheckInForm from './CheckInForm';
import { Actions, ActionConst } from 'react-native-router-flux';
import { color } from 'react-native-reanimated';
import { NavigationActions } from 'react-navigation';
import LocationDetailsScreen from './LocationDetailsScreen';
import HomeStayScreen from './HomeStayScreen';
import CheckOutForm from './CheckOutForm';
import LocationItemScreen from './LocationItemScreen';
import OfflineSyncScreen from './OfflineSyncScreen';
import COVIDDeclarationForm from './COVIDDeclarationForm';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

//Navigation Drawer Structure for all screen
class NavigationDrawerStructure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'test',
      profileImg:'',
   }

  this.backToHome = this.backToHome.bind(this);

  }

  backToHome= () => {
    Actions.indexScreen();
  };

  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{flexDirection: 'row',justifyContent: "flex-end"}}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          {/*Donute Button Image */}
          <Image 
            source={hamburgerIcon}
            style={{ width: 22, height: 22, //marginLeft: 5
              marginRight: 12 }}
          />
        </TouchableOpacity>
{/*        
        <TouchableOpacity onPress={() => this.backToHome()} activeOpacity={1}>
                        <Text 
                         // source={backIcon}
                          style={{
                            //  width: 40,
                            //  height: 40,
                             marginLeft: DEVICE_WIDTH * 0.80,
                            //  borderRadius: 40,
                             marginTop: DEVICE_HEIGHT * 0.01,
                             color: 'green',
                          }}>Back</Text>
        </TouchableOpacity>
         */}
        {/* <Image
            source={noimage}
            style={{ width: 30, height: 30, marginLeft: DEVICE_WIDTH * 0.79, borderRadius: 40 }}
          /> */}
      </View>
    );
  }
}

//Stack Navigator for the First Option of Navigation Drawer

const ChooseStateScreen_StackNavigator = createStackNavigator({
  //All the screen from the Forth Option will be indexed here
  ChooseStateScreen: {
    screen: ChooseStateScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
        marginLeft: -3,
      },
      title: navigation.getParam('title','Choose State'),
      //title: 'Choose State',
      headerRight: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
      headerStyle: {
        //backgroundColor: '#4b9445',
      },
      headerTintColor: 'black',
    }),
  },
  //drawerPosition: 'right',
});


const CityScreen_StackNavigator = createStackNavigator({
  //All the screen from the Forth Option will be indexed here
  CityScreen: {
    screen: CityScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      title: navigation.getParam('title','City Screen'),
      headerRight: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
        marginLeft: -25,
      },
      headerStyle: {
        //backgroundColor: '#4b9445',
      },
      headerTintColor: 'black',
      headerLeft: () => (
        <TouchableOpacity
        onPress={() => Actions.indexScreen()}
        // onPress={() => 
        //   navigation.dispatch(NavigationActions.navigate({ routeName: 'ChooseStateScreen' }))
        // }
        activeOpacity={1}>
         {/* <Text style={
           {color:'#4b9445', marginLeft:12, fontSize:18, fontWeight:'bold'}
         }>Back</Text> */}
         <Image 
            source={backIcon}
            style={ styles.backButtonStyle}
          />
      </TouchableOpacity>
      ),
    }),
  },
});


const HomeActivity_StackNavigator = createStackNavigator({
  //All the screen from the First Option will be indexed here
  Home: {
    screen: HomeScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      title: navigation.getParam('title','Choose Village'),
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
         marginLeft: -25,
      },
      headerRight: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
      headerTintColor: 'black',
      headerLeft: () => (
        <TouchableOpacity
        onPress={() => 
          //alert('This is a button!')
          //navigation.dispatch(NavigationActions.navigate({ routeName: 'CityScreen',params: {title: 'Choose City', stateId:''}}))
          navigation.dispatch(NavigationActions.navigate({ routeName: 'CityScreen'}))
        }
        activeOpacity={1}>
         {/* <Text style={
           {color:'#4b9445', marginLeft:12, fontSize:18, fontWeight:'bold'}
         }>Back</Text> */}
          <Image 
            source={backIcon}
            style={ styles.backButtonStyle}
          />
      </TouchableOpacity>
      ),
    }),
  },
});


const LocationDetailsScreen_StackNavigator = createStackNavigator({
  //All the screen from the Forth Option will be indexed here
  LocationDetailsScreen: {
      screen: LocationDetailsScreen,
      // navigationOptions: {
      //   gestureEnabled: false,
      //   header: null,
      // }
      navigationOptions: ({ navigation }) => ({
      gestureEnabled: false, 
      title: navigation.getParam('title','Location Details'),
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
          marginLeft: -25,
      },
      headerRight: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
      headerTintColor: 'black',
      headerLeft: () => (
          <TouchableOpacity
          onPress={() => 
            navigation.dispatch(NavigationActions.navigate({ routeName: 'Home' }))
          }
          activeOpacity={1}>
            <Image 
              source={backIcon}
              style={ styles.backButtonStyle}
            />
        </TouchableOpacity>
        ),
      }),
    },
  });

//Stack Navigator for the Second Option of Navigation Drawer
const ProfileScreen_StackNavigator = createStackNavigator({
  //All the screen from the Second Option will be indexed here
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      title: 'Profile',
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
          marginLeft: -25,
      },
      headerRight: ()=>  <NavigationDrawerStructure navigationProps={navigation} />,
      headerTintColor: 'black',
      headerLeft: () => (
      <TouchableOpacity
        onPress={() => Actions.indexScreen()}
        // onPress={() => 
        //   navigation.dispatch(NavigationActions.navigate({ routeName: 'ChooseStateScreen' }))
        // }
        activeOpacity={1}>
          <Image 
            source={backIcon}
            style={ styles.backButtonStyle}
          />
      </TouchableOpacity>
      ),
    }),
  },
});

//Stack Navigator for the Third Option of Navigation Drawer
const SettingsScreen_StackNavigator = createStackNavigator({
  //All the screen from the Third Option will be indexed here
  Settings: {
    screen: SettingsScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      title: 'Settings',
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
          marginLeft: -25,
      },
      headerRight: ()=>  <NavigationDrawerStructure navigationProps={navigation} />,
      headerTintColor: 'black',
      headerLeft: () => (
      <TouchableOpacity 
        onPress={() => Actions.indexScreen()}
        // onPress={() => 
        //   navigation.dispatch(NavigationActions.navigate({ routeName: 'ChooseStateScreen' }))
        // }
        activeOpacity={1}>
          <Image 
            source={backIcon}
            style={ styles.backButtonStyle}
          />
      </TouchableOpacity>
      ),
    }),
  },
});

//Stack Navigator for the Forth Option of Navigation Drawer
const ChangePassword_StackNavigator = createStackNavigator({
  //All the screen from the Forth Option will be indexed here
  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      title: 'Change Password',
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
          marginLeft: -25,
      },
      headerRight: ()=>  <NavigationDrawerStructure navigationProps={navigation} />,
      headerTintColor: 'black',
      headerLeft: () => (
      <TouchableOpacity 
        onPress={() => Actions.indexScreen()}
        // onPress={() => 
        //   navigation.dispatch(NavigationActions.navigate({ routeName: 'ChooseStateScreen' }))
        // }
        activeOpacity={1}>
          <Image 
            source={backIcon}
            style={ styles.backButtonStyle}
          />
      </TouchableOpacity>
      ),
    }),
  },
});

//Stack Navigator for the Forth Option of Navigation Drawer
const ViewTravelRequestScreen_StackNavigator = createStackNavigator({
  //All the screen from the Forth Option will be indexed here
  ViewTravelRequestScreen: {
    screen: ViewTravelRequestScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      title: 'View Travel Request',
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
          marginLeft: -25,
      },
      headerRight: ()=>  <NavigationDrawerStructure navigationProps={navigation} />,
      headerTintColor: 'black',
      headerLeft: () => (
      <TouchableOpacity 
        onPress={() => Actions.indexScreen()}
        // onPress={() => 
        //   navigation.dispatch(NavigationActions.navigate({ routeName: 'ChooseStateScreen' }))
        // }
        activeOpacity={1}>
          <Image 
            source={backIcon}
            style={ styles.backButtonStyle}
          />
      </TouchableOpacity>
      ),
    }),
  },
});

const OfflineSyncScreen_StackNavigator = createStackNavigator({
  //All the screen from the Forth Option will be indexed here
  OfflineSyncScreen: {
    screen: OfflineSyncScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      title: 'Sync Data',
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
          marginLeft: -25,
      },
      headerRight: ()=>  <NavigationDrawerStructure navigationProps={navigation} />,
      headerTintColor: 'black',
      headerLeft: () => (
      <TouchableOpacity 
        onPress={() => Actions.indexScreen()}
        // onPress={() => 
        //   navigation.dispatch(NavigationActions.navigate({ routeName: 'ChooseStateScreen' }))
        // }
        activeOpacity={1}>
          <Image 
            source={backIcon}
            style={ styles.backButtonStyle}
          />
      </TouchableOpacity>
      ),
    }),
  },
});

const AddTravelRequestScreen_StackNavigator = createStackNavigator({
  //All the screen from the Forth Option will be indexed here
  TravelRequestScreen: {
    screen: TravelRequestScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      title: navigation.getParam('title','Travel Request'),
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
          marginLeft: -25,
      },
      headerRight: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
      headerTintColor: 'black',
      headerLeft: () => (
          <TouchableOpacity
          onPress={() => 
            navigation.dispatch(NavigationActions.navigate({ routeName: 'LocationDetailsScreen' }))
          }
          activeOpacity={1}>
            <Image 
              source={backIcon}
              style={ styles.backButtonStyle}
            />
        </TouchableOpacity>
        ),
      }),
    },
  });

//Stack Navigator for the Forth Option of Navigation Drawer
const HomestayOwner_StackNavigator = createStackNavigator({
  //All the screen from the Forth Option will be indexed here
  HomestayOwner: {
    screen: YourHost,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      title: navigation.getParam('title','Your Host'),
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
          marginLeft: -25,
      },
      headerRight: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
      headerTintColor: 'black',
      headerLeft: () => (
          <TouchableOpacity
          onPress={() => 
            navigation.dispatch(NavigationActions.navigate({ routeName: 'LocationDetailsScreen' }))
          }
          activeOpacity={1}>
            <Image 
              source={backIcon}
              style={ styles.backButtonStyle}
            />
        </TouchableOpacity>
        ),
      }),
  },
});

const HomeStayScreen_StackNavigator = createStackNavigator({
  //All the screen from the Forth Option will be indexed here
  HomeStayScreen: {
    screen: HomeStayScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      title: navigation.getParam('title','Your Homestay'),
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
          marginLeft: -25,
      },
      headerRight: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
      headerTintColor: 'black',
      headerLeft: () => (
          <TouchableOpacity
          onPress={() => 
            navigation.dispatch(NavigationActions.navigate({ routeName: 'LocationDetailsScreen' }))
          }
          activeOpacity={1}>
            <Image 
              source={backIcon}
              style={ styles.backButtonStyle}
            />
        </TouchableOpacity>
        ),
      }),
  },
});

const LocationItemScreen_StackNavigator = createStackNavigator({
  //All the screen from the Forth Option will be indexed here
  LocationItemScreen: {
    screen: LocationItemScreen,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      title: navigation.getParam('title','Location Item Details'),
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
          marginLeft: -25,
      },
      headerRight: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
      headerTintColor: 'black',
      headerLeft: () => (
          <TouchableOpacity
          onPress={() => 
            navigation.dispatch(NavigationActions.navigate({ routeName: 'LocationDetailsScreen' }))
          }
          activeOpacity={1}>
            <Image 
              source={backIcon}
              style={ styles.backButtonStyle}
            />
        </TouchableOpacity>
        ),
      }),
  },
});

const COVIDDeclarationForm_StackNavigator = createStackNavigator({
  //All the screen from the Forth Option will be indexed here
  COVIDDeclarationForm: {
    screen: COVIDDeclarationForm,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      title: navigation.getParam('title','Coronavirus Self-Declaration'),
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
          marginLeft: -25,
      },
      headerRight: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
      headerTintColor: 'black',
      headerLeft: () => (
          <TouchableOpacity
          onPress={() => 
            navigation.dispatch(NavigationActions.navigate({ routeName: 'LocationDetailsScreen',params: { pid:1 } }))
          }
          activeOpacity={1}>
            <Image 
              source={backIcon}
              style={ styles.backButtonStyle}
            />
        </TouchableOpacity>
        ),
      }),
  },
});

const CheckInForm_StackNavigator = createStackNavigator({
  //All the screen from the Forth Option will be indexed here
  CheckInForm: {
    screen: CheckInForm,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      title: navigation.getParam('title','Check In Form'),
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
          marginLeft: -25,
      },
      headerRight: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
      headerTintColor: 'black',
      headerLeft: () => (
          <TouchableOpacity
          onPress={() => 
            navigation.dispatch(NavigationActions.navigate({ routeName: 'LocationDetailsScreen',params: { pid:1 } }))
          }
          activeOpacity={1}>
            <Image 
              source={backIcon}
              style={ styles.backButtonStyle}
            />
        </TouchableOpacity>
        ),
      }),
  },
});

const CheckOutForm_StackNavigator = createStackNavigator({
  //All the screen from the Forth Option will be indexed here
  CheckOutForm: {
    screen: CheckOutForm,
    navigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      title: navigation.getParam('title','Check Out Form'),
      headerTitleAlign: 'left',
      headerTitleContainerStyle: {
          marginLeft: -25,
      },
      headerRight: ()=> <NavigationDrawerStructure navigationProps={navigation} />,
      headerTintColor: 'black',
      headerLeft: () => (
          <TouchableOpacity
          onPress={() => 
            navigation.dispatch(NavigationActions.navigate({ routeName: 'LocationDetailsScreen' ,params: { pid:1 } }))
          }
          activeOpacity={1}>
            <Image 
              source={backIcon}
              style={ styles.backButtonStyle}
            />
        </TouchableOpacity>
        ),
      }),
  },
});

//Drawer Navigator for the Navigation Drawer / Sidebar
const Drawer = createDrawerNavigator(
  {
    //Drawer Optons and indexing
    NavScreen9: {screen:ChooseStateScreen_StackNavigator},
    NavScreen1: { screen: HomeActivity_StackNavigator },
    NavScreen2: { screen: ProfileScreen_StackNavigator },
    //NavScreen3: { screen: SettingsScreen_StackNavigator },
    NavScreen4: { screen: ChangePassword_StackNavigator },
    NavScreen5: { screen: ViewTravelRequestScreen_StackNavigator },
    NavScreen6: {screen:AddTravelRequestScreen_StackNavigator},
    NavScreen7: {screen:HomestayOwner_StackNavigator},
    NavScreen8: {screen:CheckInForm_StackNavigator},
    NavScreen10: {screen:CityScreen_StackNavigator},
    NavScreen11: {screen:LocationDetailsScreen_StackNavigator},
    NavScreen12: {screen:HomeStayScreen_StackNavigator},
    NavScreen13: {screen:CheckOutForm_StackNavigator},
    NavScreen14: {screen:LocationItemScreen_StackNavigator},
    NavScreen15: {screen:OfflineSyncScreen_StackNavigator},
    NavScreen16: {screen:COVIDDeclarationForm_StackNavigator},
  },
  {
    contentComponent: SideMenu,
    drawerWidth: Dimensions.get('window').width - 120,
    //drawerPosition: "right",
  }
);
//export default createAppContainer(Drawer);

const AppContainer = createAppContainer(Drawer);
export default class IndexScreen extends Component {
  render() {
    return <AppContainer />;
  }
}

//Styes
const styles = StyleSheet.create({
  backButtonStyle: {
   width:(Platform.OS === 'ios') ? 24 : 22,
   height:(Platform.OS === 'ios') ? 24 : 22,
   marginLeft: 12
  }  
});

