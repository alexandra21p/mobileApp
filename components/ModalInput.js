import React, { Component } from 'react';
import {
   Modal,
   Text,
   TouchableHighlight,
   View,
   TextInput,
   Keyboard,
   StyleSheet
} from 'react-native';



export default class ModalInput extends Component {
//    componentWillMount () {
//        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
//        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
//      }
//
//    componentWillUnmount () {
//        this.keyboardDidShowListener.remove();
//        this.keyboardDidHideListener.remove();
//    }
//
//
//    _keyboardDidShow = () => {
//        let newState = this.state.modalStyle;
//        newState.marginTop = 80;
//        this.setState({modalStyle: newState});
//    }
//
//    _keyboardDidHide = () => {
//        let newState = this.state.modalStyle;
//        newState.marginTop = 150;
//        this.setState({modalStyle: newState});
//    }

    focusNextField = (nextField) => {
        this.refs[nextField].focus();
    }

   render() {
      return (
         <Modal
            animationType = {"slide"}
            transparent = {true}
            visible = {this.props.modalVisible}
            onRequestClose = {() => {console.log("Modal has been closed.")}}
            >
            <View style={styles.modal} >
               <Text style={{paddingLeft:50, marginTop:10}}>Enter the values to add a new item</Text>

               <TextInput ref='1' style={{paddingLeft:20, marginTop: 10}} placeholder = 'Name'
                    onChangeText = {this.props.updateName}
                    onSubmitEditing = {() => this.focusNextField('2')}
               />
               <TextInput ref='2' style={styles.input} placeholder = 'Quantity'
                    onChangeText = {this.props.updateQuantity}
                    onSubmitEditing = {() =>  this.focusNextField('3')}
               />
               <TextInput ref='3' style={styles.input} placeholder = 'Price'
                    onChangeText = {this.props.updatePrice}

               />
               <TouchableHighlight ref='submit' style={styles.btn} onPress = {() => {
                    if (this.props.isConnected) this.props.closeModal(this.props.initialState.name, this.props.initialState.quantity, this.props.initialState.price)
                    else this.props.addToStore(this.props.initialState.name, this.props.initialState.quantity, this.props.initialState.price)
                    }}>
                  <Text style={{marginLeft: 40, color: '#004D40'}}>SUBMIT</Text>
               </TouchableHighlight>
            </View>
         </Modal>
      );
   }
}

const styles = StyleSheet.create ({
   modal: {
      flex: 1,
      justifyContent: 'flex-start',
      width: 320,
      maxHeight: 430,
      marginTop: 100,
      marginHorizontal: 20,
      borderRadius: 5,
      backgroundColor: '#F1F8E9'
   },
   input: {
      paddingLeft:20,
   },
   btn: {
      marginTop: 10,
      marginLeft: 90,
      maxWidth: 230,
      padding: 5,
      borderRadius: 5,
      backgroundColor: 'silver',
      borderColor: 'grey',
      borderWidth: 1,
      elevation: 5
   }
});