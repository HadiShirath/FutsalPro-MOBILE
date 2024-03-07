import {StyleSheet, View, StatusBar} from 'react-native';
import React, {Component} from 'react';
import {LogoFutsalPro} from '../../assets/';
import {colors} from '../../utils/colors/index';
import {getData} from '../../utils/localStorage/index';

export default class Splash extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.getUserData();
    }, 2000);
  }

  getUserData = () => {
    getData('user').then(res => {
      const data = res;

      if (data) {
        this.props.navigation.replace('MainApp');
      } else {
        this.props.navigation.replace('GetStarted');
      }
    });
  };

  render() {
    return (
      <View style={styles.page}>
        <StatusBar backgroundColor={colors.splash} barStyle="light-content" />
        <LogoFutsalPro />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.splash,
  },
});
