import {StyleSheet, View, ActivityIndicator, Image, Text} from 'react-native';
import React from 'react';
import CardUlasan from '../../atoms/CardUlasan/index';
import {connect} from 'react-redux';
import {colors} from '../../../utils/colors/index';
import {IllustrationEmpty} from '../../../assets';

function ListUlasan({ratings, status, listUlasanResult, listUlasanLoading}) {
  const data =
    listUlasanResult && listUlasanResult[status]
      ? Object.keys(listUlasanResult[status]).map(
          key => listUlasanResult[status][key],
        )
      : [];

  const dataUlasan = data.reverse();

  return (
    <View style={styles.content}>
      {listUlasanResult[status] ? (
        dataUlasan.map((item, index) => {
          return <CardUlasan item={item} key={index} />;
        })
      ) : listUlasanLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <View style={styles.empty}>
          <Image source={IllustrationEmpty} />
          <Text style={styles.emptyText}>
            {status === 'waitings' ? 'Menunggu Pembayaran ' : 'Ulasan Saya '}
            Kosong
          </Text>
        </View>
      )}
    </View>
  );
}

const mapStatetoProps = state => ({
  listUlasanResult: state.UlasanReducer.listUlasanResult,
  listUlasanLoading: state.UlasanReducer.listUlasanLoading,
});

export default connect(mapStatetoProps, null)(ListUlasan);

const styles = StyleSheet.create({
  content: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 17,
    maxWidth: '60%',
    textAlign: 'center',
    color: colors.grey4,
  },
  loading: {
    marginTop: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
