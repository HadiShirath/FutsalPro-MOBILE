import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {IconStar} from '../../../assets';
import {colors} from '../../../utils/colors/index';
import {fonts} from '../../../utils/fonts/index';
import {numberWithCommas} from '../../../utils/numberFormat/index';
import {
  IconLove,
  IconLoveOutline,
  LapanganRumput,
  LapanganVinyl,
} from '../../../assets';
import {valueRating, totalReview} from '../../../utils/numberRating/index';
import {connect} from 'react-redux';
import {deleteFavorite} from '../../../actions/FavoriteAction';

function CardLapangan({lapangan, navigation, idLapangan, love, uid, dispatch}) {
  const dataLapangan = {...lapangan, idLapangan};

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetailLapangan', dataLapangan)}>
      {love && (
        <TouchableOpacity
          style={styles.love}
          onPress={() => dispatch(deleteFavorite(uid, idLapangan))}>
          <IconLove width={20} height={20} />
        </TouchableOpacity>
      )}
      <View style={styles.content}>
        <Image source={{uri: lapangan.gambar}} style={styles.image} />
        <Text style={styles.title}>Lapangan {lapangan.nama}</Text>
        <Text style={styles.desc}>
          {lapangan.category === 'pagi' ? 'pagi-sore' : 'malam'}
        </Text>
        <Text style={styles.price}>
          Rp. {numberWithCommas(lapangan.harga)}/Jam
        </Text>
        <View style={styles.review}>
          <IconStar />
          <Text style={styles.reviewText}>
            {valueRating(lapangan.rating)} ({totalReview(lapangan.rating)}{' '}
            Review )
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default connect()(CardLapangan);

const styles = StyleSheet.create({
  card: {
    paddingVertical: 20,
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    width: '47%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 3,
  },
  image: {
    width: 145,
    height: 75,
  },
  title: {
    textTransform: 'capitalize',
    paddingHorizontal: 5,
    marginTop: 10,
    fontSize: 14,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
  },
  desc: {
    paddingHorizontal: 5,
    marginTop: 4,
    fontSize: 13,
    fontFamily: fonts.secondary.reguler,
    color: colors.grey4,
    textTransform: 'capitalize',
  },
  price: {
    marginTop: 10,
    paddingHorizontal: 5,
    fontFamily: fonts.secondary.medium,
    fontSize: 14,
    color: colors.dark,
  },
  review: {
    marginTop: 5,
    flexDirection: 'row',
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  reviewText: {
    marginLeft: 5,
    fontSize: 13,
    fontFamily: fonts.secondary.reguler,
    color: colors.grey4,
  },
  love: {
    backgroundColor: colors.redSoft,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 45 / 2,
    position: 'absolute',
    zIndex: 1,
    right: 10,
    top: 10,
  },
});
