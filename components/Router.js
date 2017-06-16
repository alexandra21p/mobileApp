import React, { Component } from 'react'

import {
   StyleSheet,
   Text,
   Navigator,
   TouchableOpacity
} from 'react-native'

import FrontPage from './FrontPage'
import MainPage from './MainPage'

export default class Router extends Component {
   constructor(){
      super()
   }
   render() {
      return (
         <Navigator
            initialRoute = {{ name: 'Home', title: 'Home' }}
            renderScene = { this.renderScene }
            configureScene={(route, routeStack) =>
                        Navigator.SceneConfigs.HorizontalSwipeJump}
            navigationBar = {
               <Navigator.NavigationBar
                  style = { styles.navigationBar }
                  routeMapper = { NavigationBarRouteMapper } />
            }
         />
      );
   }
   renderScene(route, navigator) {
      if(route.name == 'Home') {
         return (
            <FrontPage
               navigator = {navigator}
               {...route.passProps}
            />
         )
      }
      if(route.name == 'Main') {
           return (
              <MainPage
                 navigator = {navigator}
                 {...route.passProps}
              />
           )
      }
   }
}

var NavigationBarRouteMapper = {
   LeftButton(route, navigator, index, navState) {
      if(index > 0) {
         return (
            <TouchableOpacity
               onPress = {() => { if (index > 0) { navigator.pop() } }}>
               <Text style={ styles.leftButton }>
                  ❮
               </Text>
            </TouchableOpacity>
         )
      }
      else { return null }
   },
   RightButton(route, navigator, index, navState) {
      return null
//         <TouchableOpacity
//            onPress = { () => route.openMenu() }>
//            <Text style = { styles.rightButton }>
//               { route.rightText || 'Menu' }
//            </Text>
//         </TouchableOpacity>
//      )
   },
   Title(route, navigator, index, navState) {
      return (
         <Text style = { styles.title }>
            {route.title.toLowerCase()}
         </Text>
      )
   }
};

const styles = StyleSheet.create({
   navigationBar: {
      marginTop: 15,
      backgroundColor: '#212121',
      height: 35
   },
   leftButton: {
      color: '#F1F8E9',
      margin: 5,
      fontSize: 17,
      paddingLeft: 15
   },
   title: {
      paddingTop: 27,
      color: '#F1F8E9',
      justifyContent: 'center',
      fontSize: 16
   },
   rightButton: {
      color: '#F1F8E9',
      margin: 10,
      fontSize: 16
   }
});