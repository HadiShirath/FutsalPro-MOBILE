import {StyleSheet, View} from 'react-native';
import React from 'react';
import CardInfoProduct from '../../atoms/CardInfoProduct/index';
import {colors} from '../../../utils/colors/index';

export default function ListInfoProduct({pesanans}) {
  return (
    <View>
      <View style={styles.container}>
        {Object.keys(pesanans).map((item, index) => {
          return (
            <CardInfoProduct item={pesanans[item]} tanggal={item} key={index} />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
});
