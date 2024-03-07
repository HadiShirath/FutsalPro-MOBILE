import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import {numberWithCommas} from '../../../utils/numberFormat/index';
import {colors} from '../../../utils/colors/index';
import Gap from '../Gap/index';
import {fonts} from '../../../utils/fonts/index';
import {IconDelete} from '../../../assets';
import {formatDate} from '../../../utils/formatDate/index';
import {ProductVinyl, ProductRumput} from '../../../assets';
import {deleteKeranjang} from '../../../actions/KeranjangAction';
import {connect} from 'react-redux';
import {ref, onValue, query, orderByChild, equalTo} from 'firebase/database';
import {db} from '../../../config/Firebase/index';

function CardKeranjang({
  keranjang,
  keranjangUtama,
  tanggal,
  dispatch,
  navigation,
}) {
  //membuat dataBaru yang berisi data berdasarkan tanggal
  const data = {...keranjang};
  delete data.totalHarga;
  const dataBaru = Object.values(data);
  const dataBarudenganTanggal = dataBaru.map(item => ({...item, tanggal}));

  const deleteItemKeranjang = item => {
    dispatch(deleteKeranjang(keranjangUtama, item, keranjang.totalHarga));
  };

  const onContinue = idLapangan => {
    onValue(
      ref(db, `fields/${idLapangan}`),
      snapshot => {
        if (snapshot.val()) {
          // berhasil
          const dataLapangan = snapshot.val();
          const dataKirim = {
            ...data[idLapangan],
            rating: dataLapangan.rating,
            tanggal: tanggal,
          };
          navigation.navigate('Order', dataKirim);
        } else {
          //
        }
      },
      {
        onlyOnce: true,
      },
    );
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.textWrapper}>
          <View style={styles.tanggalWrapper}>
            <Text style={styles.tanggal}>{formatDate(tanggal)}</Text>
          </View>
        </View>
      </View>

      {dataBarudenganTanggal.map((item, index) => {
        return (
          <TouchableOpacity
            style={styles.page}
            key={index}
            onPress={() => onContinue(item.idLapangan)}>
            <View style={styles.content}>
              <Text>{index + 1 + '. '}</Text>
              <Image
                source={item.nama === 'vinyl' ? ProductVinyl : ProductRumput}
                style={styles.images}
              />
              <Gap width={15} />
              <View style={styles.titleWrapper}>
                <Text style={styles.nama}>Lapangan {item.nama}</Text>
                <Text style={styles.category}>
                  {item.category === 'pagi' ? 'pagi-sore' : 'malam'}
                </Text>
                <Text style={styles.price}>
                  Rp. {numberWithCommas(item.harga)}/Jam
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.deleteWrapper}
                  onPress={() => deleteItemKeranjang(item)}>
                  <IconDelete />
                </TouchableOpacity>
              </View>
            </View>
            <Gap height={15} />
            <View style={styles.waktu}>
              <Text style={styles.price}>Waktu</Text>
              <View style={styles.contentWaktu}>
                {item.waktu.map((key, index) => {
                  return (
                    <View style={styles.wrapperWaktu} key={index}>
                      <Text style={styles.waktuPilihan}>{key}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            <Gap height={5} />
            <View style={styles.waktu}>
              <Text style={styles.price}>Total Harga</Text>
              <Text style={styles.totalHarga}>
                Rp. {numberWithCommas(item.hargaTotal)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={styles.line} />
    </View>
  );
}

export default connect()(CardKeranjang);

const styles = StyleSheet.create({
  page: {
    paddingTop: 25,
    paddingBottom: 20,
    paddingHorizontal: 25,
  },
  container: {
    paddingTop: 15,
    paddingHorizontal: 25,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentWaktu: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  titleWrapper: {
    flex: 1,
  },
  textWrapper: {
    marginTop: 15,
    flexDirection: 'row',
  },
  tanggalWrapper: {
    borderRadius: 10,
    backgroundColor: colors.grey7,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tanggal: {
    fontSize: 15,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
  },
  images: {
    width: 86,
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
    marginLeft: 20,
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
  line: {
    marginTop: 10,
    height: 1,
    width: '100%',
    backgroundColor: colors.grey6,
  },
  nama: {
    fontSize: 18,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
    textTransform: 'capitalize',
  },
  category: {
    fontSize: 15,
    marginTop: 2,
    fontFamily: fonts.secondary.reguler,
    color: colors.grey4,
    textTransform: 'capitalize',
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
});
