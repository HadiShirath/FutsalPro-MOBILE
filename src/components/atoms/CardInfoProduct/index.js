import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {numberWithCommas} from '../../../utils/numberFormat/index';
import Gap from '../Gap/index';
import {colors} from '../../../utils/colors/index';
import {fonts} from '../../../utils/fonts/index';
import {formatDate} from '../../../utils/formatDate/index';
import {ProductVinyl, ProductRumput} from '../../../assets';

export default function CardInfoProduct({item, tanggal}) {
  let number = 0;

  return (
    <View>
      <View style={styles.contentTanggal}>
        <View style={styles.tanggalWrapper}>
          <Text style={styles.tanggal}>{formatDate(tanggal)}</Text>
        </View>
      </View>

      {Object.keys(item).map((key, index) => {
        number += 1;
        return (
          <View key={index}>
            <View style={styles.content}>
              <Text>{number}. </Text>
              <Image
                source={
                  item[key].nama === 'vinyl' ? ProductVinyl : ProductRumput
                }
                style={styles.images}
              />
              <View style={styles.titleWrapper}>
                <Text style={styles.nama}>Lapangan {item[key].nama}</Text>
                <Text style={styles.category}>
                  {item[key].category === 'pagi' ? 'pagi-sore' : 'malam'}
                </Text>
                <Text style={styles.price}>
                  Rp. {numberWithCommas(item[key].harga)}/Jam
                </Text>
              </View>
            </View>
            <Gap height={20} />
            <View style={styles.waktu}>
              <Text style={styles.price}>Waktu</Text>
              <View style={styles.contentWaktu}>
                {item[key].waktu.map((waktu, waktuIndex) => {
                  return (
                    <View style={styles.wrapperWaktu} key={waktuIndex}>
                      <Text style={styles.waktuPilihan}>{waktu}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            <View style={styles.waktu}>
              <Text style={styles.price}>Total Harga</Text>
              <Text style={styles.totalHarga}>
                Rp. {numberWithCommas(item[key].hargaTotal)}
              </Text>
            </View>
            <Gap height={20} />
            <View style={styles.line} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: 20,
    flexDirection: 'row',
  },
  contentWaktu: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  titleWrapper: {
    flex: 1,
    paddingLeft: 15,
  },
  textWrapper: {
    flexDirection: 'row',
  },
  tanggalWrapper: {
    borderRadius: 10,
    backgroundColor: colors.blueSoft,
    paddingVertical: 10,
    marginTop: 15,
    paddingHorizontal: 20,
  },
  tanggal: {
    fontSize: 15,
    fontFamily: fonts.secondary.medium,
    color: colors.primary,
  },
  images: {
    width: 89,
    height: 69,
  },
  deleteWrapper: {
    backgroundColor: colors.redSoft,
    width: 45,
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waktu: {
    marginLeft: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  wrapperWaktu: {
    marginLeft: 5,
    backgroundColor: colors.grey7,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
    marginBottom: 10,
  },
  nama: {
    fontSize: 18,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
  },
  category: {
    fontSize: 15,
    marginTop: 2,
    fontFamily: fonts.secondary.reguler,
    color: colors.grey4,
  },
  price: {
    fontSize: 15,
    marginTop: 2,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
  },
  waktuPilihan: {
    fontSize: 11,
    color: colors.dark,
    fontFamily: fonts.secondary.reguler,
  },
  totalHarga: {
    fontSize: 15,
    fontFamily: fonts.secondary.medium,
    color: colors.orange,
  },
  priceWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
  },
  orderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.grey8,
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  order: {
    fontSize: 15,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
  },
  harga: {
    fontSize: 15,
    fontFamily: fonts.secondary.reguler,
    color: colors.dark,
  },
  status: {
    fontSize: 15,
    fontFamily: fonts.secondary.medium,
    color: colors.green,
    textTransform: 'uppercase',
  },
  desc: {
    paddingTop: 20,
    paddingHorizontal: 30,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: colors.grey6,
  },
  lineDateTime: {
    width: 1,
    height: '105%',
    backgroundColor: colors.dark,
    marginHorizontal: 8,
  },
  reminder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
