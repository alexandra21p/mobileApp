/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import Router from './components/Router'


export default class PlsWork extends Component {
  render() {
        return (
           <Router />
        )
     }
}


AppRegistry.registerComponent('PlsWork', () => PlsWork);
