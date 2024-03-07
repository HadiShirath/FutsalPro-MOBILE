import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../../utils/colors/index';
import {fonts} from '../../../utils/fonts/index';
import {
  IconEmail,
  IconPassword,
  IconUser,
  IconProfession,
  IconAddress,
  IconPhone,
  IconHide,
  IconUnhide,
} from '../../../assets';
import Gap from '../Gap/index';

export default function Input({
  label,
  placeholder,
  secureTextEntry,
  keyboardType,
  value,
  onChangeText,
  disabled,
  hidePassword,
}) {
  const [border, setBorder] = useState(colors.grey2);
  const [statuspassword, setStatusPassword] = useState(secureTextEntry);

  const icon = () => {
    if (label === 'Email') {
      return <IconEmail />;
    }
    if (
      label === 'Password' ||
      label === 'Password Lama' ||
      label === 'Password Baru' ||
      label === 'Konfirmasi Password Baru'
    ) {
      return <IconPassword />;
    }
    if (label === 'Nama Lengkap' || label === 'Nama Panggilan') {
      return <IconUser />;
    }
    if (label === 'No. Hp / Whatsapp') {
      return <IconPhone />;
    }
    if (label === 'Alamat') {
      return <IconAddress />;
    }
    if (label === 'Profesi') {
      return <IconProfession />;
    }
    return null;
  };

  const onFocusForm = () => {
    setBorder(colors.primary);
  };

  const onBlurForm = () => {
    setBorder(colors.grey2);
  };
  return (
    <View>
      <Text style={styles.title}>{label}</Text>
      <View style={styles.inputContainer(border, disabled)}>
        {icon()}
        <Gap width={10} />
        <View style={styles.line} />
        <Gap width={10} />
        <TextInput
          style={styles.input}
          onFocus={onFocusForm}
          onBlur={onBlurForm}
          placeholder={placeholder}
          secureTextEntry={statuspassword}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
          editable={!disabled}
          selectTextOnFocus={!disabled}
        />

        {statuspassword ? (
          <TouchableOpacity onPress={() => setStatusPassword(!statuspassword)}>
            <IconUnhide />
          </TouchableOpacity>
        ) : hidePassword ? (
          <TouchableOpacity onPress={() => setStatusPassword(!statuspassword)}>
            <IconHide />
          </TouchableOpacity>
        ) : (
          []
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: (border, disabled) => ({
    flexDirection: 'row',
    borderRadius: Platform.OS === 'ios' ? 18 : 15,
    paddingVertical: Platform.OS === 'ios' ? 20 : 2,
    paddingHorizontal: 16,
    backgroundColor: disabled ? colors.grey6 : colors.grey2,
    alignItems: 'center',
    borderColor: border,
    borderWidth: 2,
  }),
  input: {
    fontSize: 15,
    fontFamily: fonts.primary.reguler,
    color: colors.grey3,
    flex: 1,
  },
  title: {
    fontSize: 14,
    marginBottom: 15,
    fontFamily: fonts.primary.medium,
    color: colors.black,
  },
  line: {
    width: 1,
    height: Platform.OS === 'ios' ? '150%' : '55%',
    backgroundColor: colors.grey3,
  },
});
