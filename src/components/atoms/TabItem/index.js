import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  IconUser,
  IconHome,
  IconHomeActive,
  IconSchedule,
  IconScheduleActive,
  IconHistory,
  IconHistoryActive,
  IconProfile,
  IconProfileActive,
} from '../../../assets';
import {colors} from '../../../utils/colors/index';

export default function TabItem({onPress, onLongPress, isFocused, label}) {
  const icon = () => {
    if (label === 'Beranda') {
      return isFocused ? <IconHomeActive /> : <IconHome />;
    }
    if (label === 'Jadwal') {
      return isFocused ? <IconScheduleActive /> : <IconSchedule />;
    }
    if (label === 'Riwayat') {
      return isFocused ? <IconHistoryActive /> : <IconHistory />;
    }
    if (label === 'Profil') {
      return isFocused ? <IconProfileActive /> : <IconProfile />;
    }
    return <IconUser />;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.content}>
      {icon()}
      <Text style={styles.label(isFocused)}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
  },
  label: isFocused => ({
    marginTop: 5,
    color: isFocused ? colors.primary : colors.grey4,
  }),
});
