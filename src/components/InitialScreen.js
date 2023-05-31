{/*initialScreen componet contains  Onboarding screens
runs when showRealApp state is false
*/}

import { func } from 'prop-types';
import React from 'react';
import { StyleSheet,View,Text,Image, ImageBackground,Dimensions,Platform,TouchableOpacity,SafeAreaView} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
//import Icon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LoginScreen from './LoginScreen';


const {height,width} = Dimensions.get('window'); // Visible window

{/*lets use useWindowDimensions for height and width of screen*/}

// const width = useWindowDimensions().width;
 //const height = useWindowDimensions().height;

const styles = StyleSheet.create({
   
  imgStyle:{


    height:height,
    width:width,
    //flex:1,
    

  },

  logo:{

  height:height*0.15,
  width:width*0.15,
  alignSelf:'center',
  
  },

  skipBox:{

  position:'absolute',
 // backgroundColor:'green',
  top:10,
  right:20,
  flexDirection:'row',
  justifyContent:'space-between',
  //alignItems:'center',
  width:width*0.22 ,
 },

 skip:{

 fontSize:16,
 color:'black',
 fontWeight:'bold',
 },

//  skipLogo:{

//  color:'red', // not changing the color , by default color of logo is black
//   // tintColor  prop is uded give color to the Logo
//  },



 DescriptionBox:{
  position:'absolute',
  bottom:height*0.14,
  width:width,
  height:height*0.10,
  //borderWidth:2,
  borderColor:'black',
  justifyContent:'center',
  alignItems:'center',
  alignSelf:'center',
  //backgroundColor:'rgba(0,0,0,0.5)',
 },
 
 desText:{

  fontSize:23.90,
  //fontWeight:'bold',
  color:'white',  
  textAlign:'center',
  fontWeight:'bold'
   //lineHeight:1,   
 },


  // logoWraper:{
  // width:width,
  // height:height*0.18,
  // //backgroundColor:'green',
  // justifyContent:'center',
  // alignItems:'center',
  
  // },

  buttonCircle:{
   
     width: 40,
     height: 40,
     backgroundColor: 'rgba(0, 0, 0, .2)',
     borderRadius: 20,
     justifyContent: 'center',
     alignItems: 'center',
},


btn:{

  backgroundColor:'#42893d',
  height:45,
  width:180,
  // borderWidth:1,
  //borderColor:'white',
  borderRadius:22,
  flexDirection:'row',
  justifyContent:'center',
  alignItems:'center',
  alignSelf:'center', // for making the button in the center
  padding:5,
  position:'absolute',
  bottom:height*0.02, // use device height to place the button
 
  },

btnTxt:{

  color:'white',
  fontSize:16,
  fontWeight:'bold',
  paddingBottom:3
},

img:{
 
  width:22,
  height:22,
  marginLeft:5,
  paddingBottom:3,
  //tintColor='white',
  // marginTop:3,

},

paginationContainer: {
  position: 'absolute',
   bottom:height*0.08,
   left: 16,
   right: 16,
  //backgroundColor:'red',
  // marginTop:height*80,
},

// Pagination styling

paginationDots: {
  height: 16,
  margin: 16,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
},
dot: {
  width: 9,
  height: 9,
  borderRadius: 4.5,
  marginHorizontal:7,
}

  
   }
 )

{/*below is the Data - Array of Objects this Data will be used to show in the
  particular screen (react-native-App-intro-slider) act as Flatlist


*/}

const slides = [
  {
    key: '1', // it's mandetory otherwise we have to use keyExtractor 
    title: 'First Screen',
    text: 'Visit Local, Sustainable & Green Mountain Homestays',
    logoimage: require('../images/back.png'),
    backgroundColor: '#59b2ab',
    //width:width,
    bgImage:require('../images/slide1.png') // used for image background
  },
  {
    key: '2',
    title: 'Second Screen',
    text: 'Explore Over 100+ Exquisite Destinations in the Himalayas',
    //logoimage: require('../assets/f2.png'),
    logoimage: require('../images/back.png'),
    backgroundColor: '#febe29',
    bgImage:require('../images/slide2.png')
  },
  {
    key: '3',
    title: 'Last Screen',
    text: 'Experience the Rich Culture &  Heritage of Local Communities',
    //logoimage: require('../assets/f3.png'),
    logoimage: require('../images/F3.png'),
    backgroundColor: '#22bcb5',
    bgImage:require('../images/slide3.png')
  }
];
 
export default class InitialScreens extends React.Component {

  constructor(Props){
      super(Props)
      
  this.state = {
    showRealApp: false
  }
  }  

  
  slider: AppIntroSlider | undefined; 
  _renderItem = ({ item,index}) => {

    //let i = index+1;

    return (
      <View style={{flex:1}}>

    {/*Image Backgound*/}    
    <ImageBackground source={item.bgImage} style={styles.imgStyle} resizeMode='cover'>
   
     {/*Logo this for the Demo Purpose that Image can be shown dynamically*/}
     {/* <Image source={item.logoimage} style={styles.logo}/> */}
     
    {/*Skip*/}
     {/* <TouchableOpacity style={styles.skipBox} onPress={this._skipToLogin.bind(this)}>
      <Text style={styles.skip}>Skip</Text>
      <View style={styles.buttonCircle}>
      <Image source={require('../images/Skip.png')} style={styles.skipLogo}
      tintColor='green'/>
      </View>
      
     </TouchableOpacity> */}

 {/*Description - we can show Text Dynamically for each screen*/}

 <View style={styles.DescriptionBox}>

  <Text style={styles.desText}> {item.text} </Text>

 </View>

 {/*Custom Button "Start Exploring"*/}

<TouchableOpacity style={styles.btn} 
      onPress={this._skipToLogin.bind(this)}>
      
      <Text style={styles.btnTxt} >Start Exploring</Text>
      <Image source={require('../images/button.png')} 
      // tintColor='white'
      style={styles.img}/>
      </TouchableOpacity>

 

    </ImageBackground>
      </View>
    );
  }

// ----FUNCTIONS---- 

//user click on skip and state changes and Login screen will rendered

_skipToLogin()
{
   this.setState({showRealApp : true});

}

// RenderPagination, custom Pagination

_renderPagination = (activeIndex) => {
  return (
    <View style={styles.paginationContainer}>
      <SafeAreaView>
        <View style={styles.paginationDots}>
          {slides.length > 1 &&
            slides.map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dot,
                  i === activeIndex
                    ? {backgroundColor: 'white'}
                    : {backgroundColor: 'grey'},
                ]}
                onPress={() => this.slider?.goToSlide(i, true)}
              />
            ))}
        </View>
      </SafeAreaView>
    </View>
  );
};




//-------------//
  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    // onDone is called when introduction ends user press done
    // state becomes true , it will render the Login page or any other page instead of intro
    this.setState({ showRealApp: true });
  }

  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
      
      <Image source={require('../images/Forward.png')} tintColor='white'/>
        {/* <Icon name="arrow_forward"
         color="rgba(255, 255, 255, .9)"
          size={24}
        /> */}
      </View>
    )
  }

  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
      <Image source={require('../images/Done.png')} tintColor='green'/>

        {/* <Icon
          name="done"
          color="rgba(255, 255, 255, .9)"
          size={24}
        /> */}
      </View>
    );
  };


  render() {
    if (this.state.showRealApp) {
      return <LoginScreen/>; //  LoginScreen (when state is true)
    } else {
      // Intro onBoarding Screens(shown initially as state showRealApp is false )
      return (
      <AppIntroSlider 
      renderItem={this._renderItem} 
      data={slides} 
      onDone={this._onDone}
      renderDoneButton={this._renderDoneButton}
      // renderNextButton={this._renderNextButton}
      dotClickEnabled={true}
      renderPagination={this._renderPagination}
      ref={(ref)=>(this.slider = ref)}
       
      />
      )
    }
  }
}
