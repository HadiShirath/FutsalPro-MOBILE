import {StyleSheet, View} from 'react-native';
import React from 'react';
import CardCategory from '../../atoms/CardCategory/index';
import {colors} from '../../../utils/colors/index';
import {dummyCategories} from '../../../data/dummyCategories/index';

export default function ListCategory({navigation}) {
  const category = ['vinyl', 'rumput'];

  return (
    <View style={styles.page}>
      {category.map((key, index) => {
        return (
          <CardCategory
            key={index}
            category={key}
            color={colors.white}
            navigation={navigation}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 20,
    marginLeft: -10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
