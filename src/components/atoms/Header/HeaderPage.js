import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {IconBack, IconReload} from '../../../assets';
import Gap from '../Gap/index';
import {colors} from '../../../utils/colors/index';
import {fonts} from '../../../utils/fonts/index';

export default function HeaderPage({title, onPress, reload}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.iconBack} onPress={onPress}>
          <IconBack />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <Gap width={25} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 5,
    marginHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 15 : 12,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: colors.dark,
    fontFamily: fonts.primary.medium,
  },
});
