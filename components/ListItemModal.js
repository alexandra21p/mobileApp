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


export default ListItemModal = (props) => {
    return (
             <Modal
                animationType = {"slide"}
                transparent = {true}
                visible = {props.itemModalVisible}
                onRequestClose = {() => {console.log("Modal has been closed.")}}
                >
                <View style={styles.modal} >
                   <Text style={{textAlign:'center', marginTop:10}}>Enter the values to buy the item</Text>

                   <TextInput style={{paddingLeft:20, marginTop: 10}} placeholder = 'Quantity'
                        onChangeText = {props.updateQuantity}
                   />
                   <TextInput style={styles.input} placeholder = 'Price'
                        onChangeText = {props.updatePrice}
                   />
                   <TouchableHighlight style={styles.btn} onPress = {() => props.closeItemModal(props.initialState.name, props.initialState.quantity, props.initialState.price)}>
                      <Text style={{textAlign:'center', color: '#004D40'}}>BUY</Text>
                   </TouchableHighlight>
                </View>
             </Modal>
    );

}

const styles = StyleSheet.create ({
   modal: {
      flex: 1,
      justifyContent: 'flex-start',
      width: 320,
      maxHeight: 380,
      marginTop: 150,
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