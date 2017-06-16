import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  NetInfo,
  Alert,
} from 'react-native';

Button = (props) => {
    return (
              <TouchableHighlight
              underlayColor='transparent'
              activeOpacity={0.7}
              onPress={props.navMainPage}>
              <View style={styles.button}>
                <Text style={styles.buttonText}> Let's get started    ❯</Text>
              </View>
              </TouchableHighlight>
            );
}

export default class FrontPage extends Component {
  constructor(props) {
              super(props);
  };


  navMainPage = () => {
      this.props.navigator.push({
        name: 'Main',
        title: 'Main'
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
           Welcome
        </Text>
        <Text style={styles.instructions}>
          This app will allow you to do stuff.
        </Text>
        <Text style={styles.instructions}>
          Pretty cool, huh?
        </Text>
        <Button navMainPage = {this.navMainPage}/>
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#006064',
  },
  welcome: {
    fontSize: 45,
    textAlign: 'center',
//    fontFamily: 'Arial',
    marginTop: 130,
    marginBottom: 15,
    color: '#F1F8E9',
    borderBottomWidth: 0.3,
    borderBottomColor: '#212121',
  },
  instructions: {
    textAlign: 'center',
    color: '#263238',
  },
  button: {
    marginTop: 130,
    padding: 10,
    backgroundColor: '#212121',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#424242',
//    elevation: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#ecf0f1'
  }
});

AppRegistry.registerComponent('FrontPage', () => FrontPage);