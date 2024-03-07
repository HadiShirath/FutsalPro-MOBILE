import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {LapanganVinyl, LapanganRumput} from '../../../assets';
import {colors} from '../../../utils/colors/index';
import {connect} from 'react-redux';
import {fonts} from '../../../utils/fonts/index';
import {
  getFieldsByCategory,
  saveKeywordField,
} from '../../../actions/FieldAction';

function CardCategory({category, color, navigation, dispatch}) {
  const toFieldByCategory = category => {
    dispatch(getFieldsByCategory(category));
    dispatch(saveKeywordField(''));
    navigation.navigate('Lapangan');
  };

  const icon = () => {
    if (category === 'vinyl') {
      return (
        <Image
          source={LapanganVinyl}
          style={{
            height: 40,
            width: 50,
            borderRadius: 30 / 2,
          }}
        />
      );
    }
    if (category === 'rumput') {
      return (
        <Image
          source={LapanganRumput}
          style={{
            height: 40,
            width: 50,
            borderRadius: 30 / 2,
          }}
        />
      );
    }
    // Jika tidak ada kondisi yang terpenuhi, dapat mengembalikan null atau elemen default
    return null;
  };

  return (
    <TouchableOpacity
      onPress={() => toFieldByCategory(category)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        flex: 1,
        marginLeft: 10,
        paddingVertical: 2,
        paddingHorizontal: 20,
        backgroundColor: colors.grey7,
      }}>
      <View style={styles.iconWrapper}>{icon()}</View>
      <View style={{marginLeft: 10}}>
        <Text style={styles.title}>Lapangan</Text>
        <Text style={styles.title}>{category}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default connect()(CardCategory);

const styles = StyleSheet.create({
  iconWrapper: {
    paddingVertical: 12,
  },
  title: {
    marginLeft: 5,
    color: colors.dark,
    textTransform: 'capitalize',
    fontFamily: fonts.secondary.reguler,
    fontSize: 14,
  },
});
