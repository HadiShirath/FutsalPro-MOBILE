import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import React from 'react';
import {colors} from '../../../utils/colors/index';
import {fonts} from '../../../utils/fonts/index';
import Gap from '../Gap/index';

export default function ButtonLoading({padding}) {
  return (
    <TouchableOpacity style={styles.content(padding)}>
      <ActivityIndicator size="small" color="#ffffff" />
      <Gap width={10} />
      <Text style={styles.text}>Loading ...</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: padding => ({
    flexDirection: 'row',
    backgroundColor: colors.grey6,
    padding: padding ? padding : 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  text: {
    fontSize: 17,
    color: colors.white,
    fontFamily: fonts.primary.medium,
  },
});
