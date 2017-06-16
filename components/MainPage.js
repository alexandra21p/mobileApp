import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  ListView,
  Modal,
  Alert,
  NetInfo,
  ActivityIndicator,
  ToastAndroid,
  View,
} from 'react-native';

import ModalInput from './ModalInput';
import ListItemModal from './ListItemModal';

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

var REQUEST_URL = 'http://192.168.0.107:3000/goods';
var globalName = '';
var idList = [];
var store = [];
var requests = 0;

var ws = new WebSocket('ws://localhost:3000');
ws.onopen = () => {
    ws.send('HELLO SERVER');
};

ws.onmessage = (e) => {
    var res = JSON.parse(e.data);
    let ind = idList.indexOf(res.id);
    if (ind != -1 && res.quantity == 0) {
        idList.splice(ind,1);
        console.log('ID: ' + res.id + ' deleted from memory list.');
    }
    //alert('Good with ID: ' + res.id + ' has been sold! Price: ' + res.price);
    MessageBarManager.showAlert({
      message: 'Good with ID: ' + res.id + ' has been sold! Price: ' + res.price,
      alertType: 'info',
      duration: 5000,
      shouldHideOnTap: true,
      viewTopOffset: 50,
      stylesheetInfo: { backgroundColor: '#0097A7', strokeColor: '#00838F' },
      messageNumberOfLines: 2,
    });
};

ws.onerror = (e) => {
    console.log(e.message);
};

AddButton = (props) => {
        return (
          <TouchableHighlight
          onPress={props.openModal}
          underlayColor='transparent'
          activeOpacity={0.7}>
          <View style={styles.addButton}>
            <Text style={styles.buttonText}> ₊</Text>
          </View>
          </TouchableHighlight>
        );
}

export default class MainPage extends Component {
  constructor(props) {
            super(props);
            this.state = {
              dataSource: new ListView.DataSource({
                      rowHasChanged: (row1, row2) => row1 !== row2,
              }),
              isLoading: false,
              isConnected: null,
              data: [],
              modalVisible: false,
              itemModalVisible: false,
              initialState: {
                    name: '',
                    quantity: '',
                    price: ''
              }
            };
  }


  blurContainer = function() {
        if (this.state.modalVisible || this.state.itemModalVisible) {
            return {
                paddingTop: 15,
                backgroundColor: '#006064',
                flex:1,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                opacity: 0.2
            }
        }
        else return {
            paddingTop: 15,
            backgroundColor: '#006064',
            flex:1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center'
        }
  }


  openModal = () => {
       this.setState({modalVisible: true});
  }

  openItemModal(text)  {
      this.setState({itemModalVisible: true});
      let newState = this.state.initialState;
      newState.name = text;
      this.setState({initialState: newState});
  }


  componentDidMount() {
      MessageBarManager.registerMessageBar(this.refs.alert);

      NetInfo.isConnected.addEventListener(
              'change',
              this._handleConnectivityChange);
      NetInfo.isConnected.fetch().done(
                      (isConnected) => { this.setState({isConnected}); }
      );
      //this.fetchData();
  }

  componentWillUnmount() {
    MessageBarManager.unregisterMessageBar();
    NetInfo.isConnected.removeEventListener(
            'change',
            this._handleConnectivityChange
    );
  }

 _handleConnectivityChange = (isConnected) => {
      this.setState({
        isConnected,
      });
      if (this.state.isConnected && store.length == 0) {
        this.fetchData();
      }
      else if (this.state.isConnected && store.length > 0) {
        this.fetchData();
         store.forEach((good) => {
            this.setState({ isLoading: true });

            fetch('http://localhost:3000/sell/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: good.name,
                    quantity: good.quantity,
                    price: good.price,
                })
            })
            .then(function(response) {
                if(response.status == 200) return response.json();
                else {
                    this.setState({ isLoading: false });
                    throw new Error('Something went wrong!'); }
            })
            .then((responseData) => {
                ToastAndroid.show('Successful request! ID of item: ' + responseData.id, ToastAndroid.LONG);
                idList.push(responseData.id);
                var arr = [];
                arr.push({
                    name: responseData.name,
                    quantity: responseData.quantity,
                    price: responseData.price});
                const index = store.findIndex(g => g.name === responseData.name && g.quantity === responseData.quantity && g.price === responseData.price);
                store.splice(index, 1);
                requests--;
                this.state.data = this.state.data.concat(arr);
                this.setState({
                    isLoading: false,
                    dataSource: this.state.dataSource.cloneWithRows(this.state.data)
                });
             })
            .catch(function(error) {
                 console.error(error);
            })
         });
      }
      else {
        console.log('No internet connection!');
        MessageBarManager.showAlert({
              title: 'Offline Mode',
              message: 'The is no internet connection! You\'ll only be able to add sell requests.',
              alertType: 'warning',
              duration: 5000,
              shouldHideOnTap: true,
              viewTopOffset: 50
        });
      }
  };


  updateName = (text) => {
     let newState = this.state.initialState;
     newState.name = text;
     this.setState({initialState: newState});
  }
  updateQuantity = (text) => {
     let newState = this.state.initialState;
     newState.quantity = text;
     this.setState({initialState: newState});
  }
  updatePrice = (text) => {
     let newState = this.state.initialState;
     newState.price = text;
     this.setState({initialState: newState});
  }

  addToStore = () => {
    this.setState({modalVisible: false});
    if (this.state.initialState.name == '' || this.state.initialState.quantity == '' || this.state.initialState.price == '') {
         this.tryAgain();
    }
    else {
        store.push(
          {
            name: this.state.initialState.name,
            quantity: this.state.initialState.quantity,
            price: this.state.initialState.price
          }
        );
        requests++;
        alert('Pending requests: ' + requests);
    }
  }

  tryAgain = () => {
        Alert.alert(
          'Operation Failed',
          'Could not process request. Would you like to try again?',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
            {text: 'OK', onPress: () => this.setState({modalVisible: true})},
          ],
          { cancelable: false }
        )
  }

  closeItemModal = () => {
     this.setState({itemModalVisible: false});
     this.setState({ isLoading: true });
     console.log('name: ' + this.state.initialState.name + '\nquantity: ' +
         this.state.initialState.quantity + '\nprice: ' + this.state.initialState.price);
     var self = this;
     fetch('http://localhost:3000/buy/', {
             method: 'POST',
             headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json',
             },
             body: JSON.stringify({
                 name: this.state.initialState.name,
                 quantity: this.state.initialState.quantity,
                 price: this.state.initialState.price,
             })
         })
             .then(function(response) {
                 if(response.status == 200) return response.json();
                 else {
                    self.setState({ isLoading: false });
                    Alert.alert(
                        'Operation Failed',
                        'Could not match the order. Would you like to try again with different values?',
                        [
                          {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
                          {text: 'OK', onPress: () => self.setState({itemModalVisible: true})},
                        ],
                        { cancelable: false }
                    )
                    throw new Error('Something went wrong!');
                 }

             })
             .then((responseData) => {
                 ToastAndroid.show('Successful request! Price: ' + responseData.price, ToastAndroid.LONG);
                 const index = this.state.data.findIndex(g => g.name === responseData.name  && g.price === responseData.price);
                 //let newGood = arr[0];
                 console.log(this.state.data);
                 let newArr = this.state.data.slice();
                 if (responseData.quantity == 0) {
                    newArr.splice(index,1);
                 }
                 else {
                    newArr[index] = {
                        ...this.state.dataSource[index],
                        name: responseData.name,
                        quantity: responseData.quantity,
                        price: responseData.price
                     };
                 }
                 this.setState({
                    isLoading: false,
                    dataSource: this.state.dataSource.cloneWithRows(newArr)
                 });
              })
             .catch(function(error) {
                  console.error(error);
             })
  }

  closeModal = () => {
    this.setState({modalVisible: false});
    this.setState({ isLoading: true });
    console.log('name: ' + this.state.initialState.name + '\nquantity: ' +
    this.state.initialState.quantity + '\nprice: ' + this.state.initialState.price);
    if (this.state.initialState.name == '' || this.state.initialState.quantity == '' || this.state.initialState.price == '') {
        //alert(this.state.initialState.name + this.state.initialState.quantity + this.state.initialState.price);
        this.setState({ isLoading: false });
        this.tryAgain();
    }
    else {
    fetch('http://localhost:3000/sell/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: this.state.initialState.name,
            quantity: this.state.initialState.quantity,
            price: this.state.initialState.price,
        })
    })
        .then(function(response) {
            if(response.status == 200) return response.json();
            else {
                this.setState({ isLoading: false });
                throw new Error('Something went wrong!'); }
        })
        .then((responseData) => {
            ToastAndroid.show('Successful request! ID of item: ' + responseData.id, ToastAndroid.LONG);
            idList.push(responseData.id);
            var arr = [];
            arr.push({
                name: responseData.name,
                quantity: responseData.quantity,
                price: responseData.price});
            console.log(arr);
            console.log(this.state.data);
            console.log(responseData);
            this.state.data = this.state.data.concat(arr);
            this.setState({
                isLoading: false,
                dataSource: this.state.dataSource.cloneWithRows(this.state.data)
            });
         })
        .catch(function(error) {
             console.error(error);
        })
    }
  }

  fetchData() {
      this.setState({ isLoading: true });
      fetch('http://localhost:3000/goods')
        .then((response) => response.json())
        .then((responseData) => {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(responseData),
            isLoading: false,
            data: responseData,
          });
        })
//        .catch(function(error) {
//                console.error(error);
//        })
        .done();
  }

  render() {
//    if (!this.state.loaded) {
//          return this.renderLoadingView();
//    }

    var spinner = this.state.isLoading ?
      ( <ActivityIndicator
          size='large'/> ) :
      ( <View/>);

    return (
      <View style={this.blurContainer()}>
        <Text style={styles.welcome}>
           Here we have a list of thingies
        </Text>
        <View style={styles.sellContainer}>
            <Text style={styles.sellText}>Want to sell something?</Text>
            <AddButton openModal = {this.openModal}/>
        </View>
        <ModalInput modalVisible = {this.state.modalVisible} openModal = {this.openModal}
            initialState = {this.state.initialState} closeModal = {this.closeModal} updateName = {this.updateName}
            updateQuantity = {this.updateQuantity} updatePrice = {this.updatePrice}
            isConnected = {this.state.isConnected} addToStore = {this.addToStore}
        />

        <ListItemModal itemModalVisible = {this.state.itemModalVisible} openItemModal = {this.openItemModal}
            initialState = {this.state.initialState} closeItemModal = {this.closeItemModal}
            updateQuantity = {this.updateQuantity} updatePrice = {this.updatePrice}
        />

        <View style={styles.mainView}>
            <View style={styles.header}>
                  <Text style={styles.headerTxt}>Name</Text>
                  <Text style={styles.headerTxt}>Quantity</Text>
                  <Text style={styles.headerTxt}>Price</Text>
            </View>
            {spinner}
            <ListView
                dataSource = {this.state.dataSource}
                enableEmptySections = {true}
                renderRow = {
                   (rowData) => (
                       <TouchableHighlight
                                onPress={ () => {globalName = rowData.name; this.openItemModal(globalName)}}
                                underlayColor='#006064'
                                activeOpacity={0.7}>
                          <View style={styles.list}>
                          <Text style={styles.textt}>
                             {rowData.name}
                          </Text>
                          <Text style={styles.textt}>
                             {rowData.quantity}
                          </Text>
                          <Text style={styles.textt}>
                             {rowData.price}
                          </Text>
                          </View>
                       </TouchableHighlight>

                   )
                }
                renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            />

        </View>

      <MessageBarAlert ref="alert" />
      </View>

    );
  }

  renderLoadingView() {
      return (
        <View>
          <Text style={{marginTop: 200, marginLeft:120, fontSize: 15}}>
            Loading items...
          </Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  sellContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 5,
    padding: 5,
  },
  addButton: {
    width: 45,
    height: 45,
    marginHorizontal: 15,
    borderRadius: 100/2,
    borderColor: '#004D40',
    borderWidth: 1,
    backgroundColor: '#006064',
    elevation: 10,
  },
  buttonText: {
    color:'white',
    marginTop: -31,
    marginLeft: -1,
    fontSize: 50,
  },
  sellText: {
    padding: 6,
    marginVertical: 8,
    borderRadius: 5,
    backgroundColor: '#212121',
    marginLeft: 10,
    fontSize: 13,
    color: 'white'
  },
  mainView: {
    width:340,
    maxHeight: 380,
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#F1F8E9',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    opacity: 0.7
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 15,
    marginVertical: 5,
    borderBottomColor: '#212121',
    borderBottomWidth: 1,
  },
  headerTxt: {
    color: 'black',
    fontSize: 16,
    paddingRight: 70,
  },
  list: {
    marginHorizontal: 15,
    marginVertical: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
//    borderBottomColor: '#00796B',
//    borderBottomWidth: 1,
    opacity: 1.0
  },
  separator: {
    height: 1,
    backgroundColor: '#00796B',
    maxWidth: 323,
    marginLeft: 15
  },
  textt: {
    opacity: 1.0,
    color: 'black',
    marginRight: 90,
  },
  welcome: {
    fontSize: 14,
    textAlign: 'center',
//    fontFamily: 'Arial',
    marginTop: 50,
    marginBottom: 20,
    color: '#F1F8E9'
  }

});

AppRegistry.registerComponent('MainPage', () => MainPage);