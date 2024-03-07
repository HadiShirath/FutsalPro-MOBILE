import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {fonts} from '../../../utils/fonts/index';
import {colors} from '../../../utils/colors/index';
import HeaderHome from './HeaderHome';
import HeaderPage from './HeaderPage';
import HeaderMenu from './HeaderMenu';

export default function Header({
  title,
  type,
  navigation,
  onPress,
  reload,
  color,
}) {
  if (type === 'Header-Home') {
    return <HeaderHome navigation={navigation} />;
  }
  if (type === 'page') {
    return <HeaderPage title={title} onPress={onPress} reload={reload} />;
  }
  if (type === 'menu') {
    return <HeaderMenu title={title} color={color} />;
  }

  return (
    <View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 20,
    fontSize: 23,
    fontFamily: fonts.primary.medium,
    textAlign: 'center',
    color: colors.dark,
  },
});
