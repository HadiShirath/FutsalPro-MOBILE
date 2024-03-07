import {StyleSheet} from 'react-native';
import React, {Component} from 'react';
import {WebView} from 'react-native-webview';

class Whatsapp extends Component {
  render() {
    return (
      <WebView
        source={{uri: 'https://wa.me/6285262930852'}}
        style={styles.content}
        onError={error => console.error(error)}
      />
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  loading: {
    flex: 1,
    marginTop: 10,
    marginBottom: 50,
  },
});

export default Whatsapp;
