import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {Component} from 'react';
import {colors} from '../../../utils/colors/index';
import {
  IconNextDark,
  ProductVinyl,
  ProductRumput,
  IconInvoice,
} from '../../../assets';
import {formatDate} from '../../../utils/formatDate/index';
import {ref, update, remove} from 'firebase/database';
import {db} from '../../../config/Firebase';
import Gap from '../Gap/index';
import {numberWithCommas} from '../../../utils/numberFormat/index';
import Button from '../Button/index';
import {namaBulan} from '../../../utils/namaBulan/index';
import {fonts} from '../../../utils/fonts/index';
import {connect} from 'react-redux';
import {formatDateNumber} from '../../../utils/formatDateNumber/index';

class CardNotification extends Component {
  render() {
    const {status, navigation, data, uid} = this.props;

    const dataNotification = {...data};
    const newDataNotification = {...dataNotification.pesanans};
    const dataBaru = Object.values(newDataNotification);
    console.log('databaru :', dataBaru);

    let dataUnRead;

    let number = 0;

    //hapus totalharga disetiap dataLapangan
    dataBaru.map(item => delete item.totalHarga);

    if (status === 'waitings') {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('InfoProduct', dataNotification);
          }}
          style={styles.contentWrapper}>
          <View style={styles.container}>
            <View>
              <Text>
                Tanggal Order :{' '}
                {formatDateNumber(dataNotification.tanggalOrder)}
              </Text>
              <View style={styles.textWrapper}>
                <View style={styles.tanggalWrapper}>
                  <Text style={styles.tanggal}>Order ID : {data.order_id}</Text>
                </View>
              </View>
            </View>
            <View style={styles.iconNextWrapper}>
              <IconNextDark width={24} height={24} />
            </View>
          </View>

          <View style={styles.line} />
          <Gap height={20} />

          {Object.keys(newDataNotification).map((itemTanggal, index) => {
            const pesanan = Object.values(newDataNotification[itemTanggal]);
            return (
              <View key={index}>
                <View style={styles.jadwalContent}>
                  <Text style={styles.jadwalText}>
                    Jadwal : {formatDate(itemTanggal)}
                  </Text>
                </View>

                {pesanan.map((dataPesanan, innerIndex) => {
                  number += 1;
                  return (
                    <View key={innerIndex} style={styles.contentAll}>
                      <Text>{dataPesanan.tanggal}</Text>
                      <Text>{number + '. '}</Text>
                      <Image
                        source={
                          dataPesanan.nama === 'vinyl'
                            ? ProductVinyl
                            : ProductRumput
                        }
                        style={styles.images}
                      />
                      <Gap width={15} />
                      <View style={styles.titleWrapper}>
                        <Text style={styles.nama}>
                          Lapangan {dataPesanan.nama}
                        </Text>
                        <Text style={styles.category}>
                          {dataPesanan.category === 'pagi'
                            ? 'pagi-sore'
                            : 'malam'}
                        </Text>
                        <Text style={styles.price}>
                          Total Harga : Rp.{' '}
                          {numberWithCommas(dataPesanan.hargaTotal)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}

          <View style={styles.desc}>
            <View style={styles.priceWrapper}>
              <Text style={styles.harga}>Status</Text>
              {dataNotification.status === 'lunas' ? (
                <Text style={styles.status}>{dataNotification.status}</Text>
              ) : (
                <Text style={styles.statusPending}>
                  {dataNotification.status}
                </Text>
              )}
            </View>
            <View style={styles.priceWrapper}>
              <Text style={styles.harga}>Total Harga Semua</Text>
              <Text style={styles.harga}>
                Rp. {numberWithCommas(dataNotification.totalHarga)}
              </Text>
            </View>

            {dataNotification.status === 'lunas' ? (
              <View>
                <Gap height={30} />
                <View style={styles.wrapperButton}>
                  <TouchableOpacity style={styles.invoice}>
                    <IconInvoice />
                    <Text style={styles.textInvoice}>Cetak Invoice</Text>
                  </TouchableOpacity>
                  <View style={styles.button}>
                    <Button
                      label="Jadwal Selesai"
                      padding={12}
                      fontSize={15}
                      borderRadius={12}
                    />
                  </View>
                </View>
                <Gap height={30} />
              </View>
            ) : dataNotification.status === 'pending' ? (
              <View>
                <Gap height={30} />
                <View style={styles.wrapperButton}>
                  <TouchableOpacity
                    style={styles.cancelOrder}
                    onPress={() =>
                      Alert.alert('Batalkan', 'Apakah Kamu Yakin?', [
                        {
                          text: 'Tidak',
                          style: 'destructive',
                        },
                        {
                          text: 'Iya',
                          onPress: () => console.warn('dataUmum dibatalkan'),
                        },
                      ])
                    }>
                    <Text style={styles.textCancelOrder}>Batalkan</Text>
                  </TouchableOpacity>
                  <View style={{flex: 1}}>
                    <Button
                      label="Cek Pembayaran"
                      fontSize={15}
                      padding={12}
                      borderRadius={12}
                      textColor={colors.white}
                      color={colors.orange3}
                      onPress={() => {
                        this.props.navigation.navigate('Midtrans', {
                          url: data.url,
                        });
                      }}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <Gap height={30} />
            )}
          </View>
        </TouchableOpacity>
      );
    } else if (status === 'all') {
      if (data.unread) {
        dataUnRead = data.unread;
        setTimeout(() => {
          remove(ref(db, `notifications/${uid}/all/${data.id}/unread`));
        }, 1000);
      }
    }

    return (
      <View style={styles.containerAll(dataUnRead)}>
        <View style={styles.line} />
        <Gap height={20} />
        <View style={styles.contentAll}>
          <View>
            <Text style={styles.category}>Informasi</Text>
            <Gap height={10} />
            <Text style={styles.title}>{data.title}</Text>
            <Text>{data.message}</Text>
          </View>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text>{data.tanggal.split('-')[2]} </Text>
              <Text>{namaBulan(data.tanggal.split('-')[1])}</Text>
              <Gap height={10} />
            </View>
            <Text style={{fontSize: 13, textAlign: 'right'}}>{data.waktu}</Text>
          </View>
        </View>
        <Gap height={30} />
      </View>
    );
  }
}

export default connect()(CardNotification);

const styles = StyleSheet.create({
  contentWaitings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerAll: dataRead => ({
    backgroundColor: dataRead ? colors.greenSoft : colors.white,
  }),
  contentAll: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    height: 2,
    backgroundColor: colors.grey7,
  },
  btnActive: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  wrapperButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tanggalMenunggu: {
    fontSize: 17,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
  },
  orderIdMenunggu: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 15,
    color: colors.dark,
    fontFamily: fonts.secondary.medium,
  },
  button: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: 85,
    height: 65,
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
  nama: {
    fontSize: 17,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
    textTransform: 'capitalize',
  },
  category: {
    fontSize: 14,
    marginTop: 2,
    fontFamily: fonts.secondary.reguler,
    color: colors.grey4,
    textTransform: 'capitalize',
  },
  price: {
    fontSize: 15,
    marginTop: 2,
    fontFamily: fonts.secondary.reguler,
    color: colors.dark,
    paddingBottom: 30,
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
    alignItems: 'center',
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
  statusPending: {
    fontSize: 15,
    fontFamily: fonts.secondary.medium,
    color: colors.orange,
    textTransform: 'uppercase',
  },
  desc: {
    paddingHorizontal: 25,
  },
  lineDateTime: {
    width: 1,
    height: 20,
    backgroundColor: colors.grey4,
    marginHorizontal: 8,
  },
  reminder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonReminder: pesanan => ({
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: pesanan === 'lunas' ? colors.redSoft : colors.grey8,
  }),
  textReminder: pesanan => ({
    color: pesanan === 'lunas' ? colors.red : colors.grey4,
    marginLeft: 4,
    fontSize: 13,
    fontFamily: fonts.secondary.reguler,
  }),
  cancelOrder: {
    marginRight: 15,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCancelOrder: {
    fontSize: 16,
    fontFamily: fonts.secondary.medium,
    color: colors.red,
  },
  invoice: {
    flexDirection: 'row',
    marginRight: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  textInvoice: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: fonts.secondary.medium,
    color: colors.primary,
  },
  contentWrapper: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginHorizontal: 15,
    paddingVertical: 30,
    marginBottom: 20,
    shadowColor: '#c9c9c9',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
    elevation: 3,
  },
  iconNextWrapper: {
    backgroundColor: colors.grey7,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30 / 2,
  },
  jadwalContent: {
    backgroundColor: colors.blueSoft,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  jadwalText: {
    fontSize: 16,
    fontFamily: fonts.secondary.medium,
    color: colors.primary,
  },
});
