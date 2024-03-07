import {StyleSheet, View, ActivityIndicator, Image, Text} from 'react-native';
import React from 'react';
import CardLapangan from '../../atoms/CardLapangan/index';
import {connect} from 'react-redux';
import {colors} from '../../../utils/colors/index';
import {IllustrationEmpty} from '../../../assets';

function ListFavorite({
  lapangan,
  navigation,
  listFavoriteResult,
  listFavoriteLoading,
  uid,
}) {
  return (
    <View style={styles.page}>
      {listFavoriteResult ? (
        Object.keys(listFavoriteResult).map((key, index) => {
          return (
            <CardLapangan
              lapangan={listFavoriteResult[key]}
              idLapangan={key}
              key={index}
              navigation={navigation}
              uid={uid}
              love
            />
          );
        })
      ) : listFavoriteLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <View style={styles.empty}>
          <Image source={IllustrationEmpty} />
          <Text style={styles.emptyText}>
            Ooops! Data Lapangan Futsal favoritmu kosong
          </Text>
        </View>
      )}
    </View>
  );
}

const mapStatetoProps = state => ({
  listFavoriteResult: state.FavoriteReducer.listFavoriteResult,
  listFavoriteLoading: state.FavoriteReducer.listFavoriteLoading,
});

export default connect(mapStatetoProps, null)(ListFavorite);

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
  },
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
