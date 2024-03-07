import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors} from '../../../utils/colors/index';
import {fonts} from '../../../utils/fonts/index';
import {IconCart, IconPay, IconPayDisabled} from '../../../assets';
import TextIcon from './TextIcon';
import Gap from '../Gap/index';
import ButtonLoading from './buttonLoading';

export default function Button({
  label,
  onPress,
  type,
  icon,
  fontSize,
  padding,
  borderRadius,
  color,
  textColor,
  icons,
  loading,
  disabled,
}) {
  if (icon) {
    return <TextIcon label={label} onPress={onPress} loading={loading} />;
  }

  if (loading) {
    return <ButtonLoading padding={padding} />;
  }

  const renderIcons = () => {
    if (icons === 'Keranjang') {
      return (
        <View>
          <IconCart />
          <Gap width={40} />
        </View>
      );
    }
    if (icons === 'Money') {
      return (
        <View>
          <IconPay />
          <Gap width={40} />
        </View>
      );
    }
    if (icons === 'MoneyDisabled') {
      return (
        <View>
          <IconPayDisabled />
          <Gap width={40} />
        </View>
      );
    }
    return null;
  };

  if (disabled) {
    return (
      <View
        style={styles.container(color, padding, borderRadius)}
        onPress={onPress}>
        <View style={styles.contentButton}>
          {renderIcons()}
          <Text style={styles.label(fontSize, textColor)}>{label}</Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container(color, padding, borderRadius)}
      onPress={onPress}>
      <View style={styles.contentButton}>
        {renderIcons()}
        <Text style={styles.label(fontSize, textColor)}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: (color, padding, borderRadius) => ({
    backgroundColor: color ? color : colors.primary,
    padding: padding ? padding : 20,
    borderRadius: borderRadius ? borderRadius : 15,
  }),
  label: (fontSize, textColor) => ({
    textAlign: 'center',
    fontFamily: fonts.primary.medium,
    color: textColor ? textColor : colors.white,
    fontSize: fontSize ? fontSize : 18,
  }),
  contentButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
