import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {fonts} from '../../../utils/fonts/index';
import {colors} from '../../../utils/colors/index';
import {IconReload} from '../../../assets';

export default function HeaderMenu({title, color}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title(color)}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    marginTop: 20,
  },
  title: color => ({
    fontSize: 19,
    fontFamily: fonts.primary.medium,
    color: color ? color : colors.dark,
  }),
});
