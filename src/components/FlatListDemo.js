import React, { Component, useState  } from "react";
import { View, Text, FlatList, ActivityIndicator, Image } from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import imgLogo from '../images/logo.png'

class FlatListDemo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const images = [
      {src:imgLogo,desc:'This is test image 1'},
      {src:imgLogo,desc:'This is test image 2'},
      {src:imgLogo,desc:'This is test image 3'},
    ];
    

    return (
      <View>
        <FlatList
        horizontal={true} 
        showsHorizontalScrollIndicator={false} 
        data={images}
        renderItem={ ({ item, index }) => (
          <View>
          <Image source={item.src} // Use item to set the image source
            key={index} // Important to set a key for list items
            style={{
              width:260,
              height:300,
              borderWidth:2,
              borderColor:'#d35647',
              resizeMode:'contain',
              margin:8
            }}
          />
          <Text>{item.desc}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
    );
  }
}

export default FlatListDemo;