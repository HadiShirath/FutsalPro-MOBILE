import {StyleSheet, View} from 'react-native';
import React from 'react';

export default function Gap({width, height}) {
  return <View style={styles.content(width, height)} />;
}

const styles = StyleSheet.create({
  content: (width, height) => ({
    width: width,
    height: height,
  }),
});
