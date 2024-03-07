import {StyleSheet, Text, View, ActivityIndicator, Image} from 'react-native';
import React from 'react';
import CardKeranjang from '../../atoms/CardKeranjang/index';
import {colors} from '../../../utils/colors/index';
import {IllustrationEmpty} from '../../../assets';

export default function ListKeranjang({
  listKeranjangResult,
  listKeranjangLoading,
  navigation,
}) {
  return (
    <View>
      {listKeranjangResult ? (
        Object.keys(listKeranjangResult.pesanans).map((key, index) => {
          return (
            <CardKeranjang
              keranjang={listKeranjangResult.pesanans[key]}
              keranjangUtama={listKeranjangResult}
              tanggal={key}
              key={index}
              navigation={navigation}
            />
          );
        })
      ) : listKeranjangLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <View style={styles.empty}>
          <Image source={IllustrationEmpty} />
          <Text style={styles.emptyText}>Ooops! Keranjangmu kosong</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 17,
    maxWidth: '60%',
    textAlign: 'center',
    color: colors.grey4,
  },
});
