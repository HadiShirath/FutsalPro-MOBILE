import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {IconNext} from '../../../assets';
import {colors} from '../../../utils/colors/index';
import {fonts} from '../../../utils/fonts/index';
import Gap from '../Gap/index';

export default function TextIcon({label, onPress, loading}) {
  if (loading) {
    return (
      <TouchableOpacity style={styles.content}>
        <ActivityIndicator size="small" color="#ffffff" />
        <Gap width={10} />
        <Text style={styles.text}>Loading ...</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
      <IconNext />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.primary.medium,
    color: colors.white,
    fontSize: 18,
  },
  content: {
    flexDirection: 'row',
    backgroundColor: colors.grey6,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 17,
    color: colors.white,
    fontFamily: fonts.primary.medium,
  },
});
