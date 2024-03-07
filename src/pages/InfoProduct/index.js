import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import Header from '../../components/atoms/Header/index';
import {colors} from '../../utils/colors/index';
import {fonts} from '../../utils/fonts/index';

import Gap from '../../components/atoms/Gap/index';
import {numberWithCommas} from '../../utils/numberFormat/index';

import Button from '../../components/atoms/Button/index';
import {dummyPesanan} from '../../data/dummyPesanan/index';
import {IconTime, IconInvoice} from '../../assets';
import {formatDate} from '../../utils/formatDate/index';
import ListInfoProduct from '../../components/molecules/ListInfoProduct/index';
import {formatDateNumber} from '../../utils/formatDateNumber/index';
import {printPDF} from '../../utils/printPdf/index';
import {getData} from '../../utils/localStorage';
import {addUlasan} from '../../actions/UlasanAction';
import {connect} from 'react-redux';
import {IconBackLight} from '../../assets';

class InfoProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pesanans: this.props.route.params,
      dataUser: '',
    };
  }

  componentDidMount() {
    getData('user').then(res => {
      const user = {
        fullName: res.fullName,
        alamat: res.address,
        email: res.email,
      };

      this.setState({
        dataUser: user,
      });
    });
  }

  componentDidUpdate(prevProps) {
    const {addUlasanResult} = this.props;
    if (addUlasanResult && prevProps.addUlasanResult !== addUlasanResult) {
      this.props.navigation.replace('MainApp');
      this.props.navigation.navigate('Ulasan');
    }
  }

  submit = orderId => {
    const {pesanans} = this.state;

    const dataPesanan = {...pesanans.pesanans};
    const dataPesananBaru = Object.values(dataPesanan);

    //hapus totalharga disetiap dataLapangan
    dataPesananBaru.map(item => delete item.totalHarga);

    const dataBaru = {
      tanggalOrder: pesanans.tanggalOrder,
      order_id: pesanans.order_id,
      user: pesanans.user,
      pesanans: dataPesanan,
    };

    this.props.dispatch(addUlasan(pesanans.user, dataBaru));
  };

  render() {
    const {pesanans, dataUser} = this.state;
    const {addUlasanLoading} = this.props;

    const dataItemInvoice = Object.entries(pesanans.pesanans).flatMap(
      ([tanggal, items]) =>
        Object.entries(items).map(([id, item]) => ({
          tanggal: formatDate(tanggal),
          lapangan: item.nama,
          totalHarga: numberWithCommas(item.hargaTotal),
          waktu: item.waktu.join(', '),
        })),
    );

    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.page}>
          <View style={styles.content}>
            <ScrollView>
              <View
                style={{
                  backgroundColor: colors.primary,
                  width: '100%',
                  borderBottomRightRadius: 30,
                  borderBottomLeftRadius: 30,
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                  }}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}>
                    <IconBackLight />
                  </TouchableOpacity>
                  <View
                    style={{
                      flex: 1,

                      marginRight: 20,
                    }}>
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: 19,
                        textAlign: 'center',
                        fontFamily: fonts.secondary.medium,
                      }}>
                      Informasi Pesanan
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: 15,
                    marginBottom: 30,
                    backgroundColor: colors.white,
                    paddingVertical: 20,
                    marginHorizontal: 15,
                    borderRadius: 20,
                  }}>
                  <ListInfoProduct pesanans={pesanans.pesanans} />
                </View>
              </View>

              <View style={styles.desc}>
                <View style={styles.priceWrapper}>
                  <Text style={styles.harga}>Total Harga Semua</Text>
                  <Text style={styles.harga}>
                    Rp. {numberWithCommas(pesanans.totalHarga)}
                  </Text>
                </View>
                <View style={styles.priceWrapper}>
                  <Text style={styles.harga}>Status</Text>
                  {pesanans.status === 'lunas' ? (
                    <Text style={styles.status}>{pesanans.status}</Text>
                  ) : pesanans.status === 'pending' ? (
                    <Text style={styles.statusPending}>{pesanans.status}</Text>
                  ) : (
                    <Text style={styles.statusGagal}>{pesanans.status}</Text>
                  )}
                </View>
                <View style={styles.priceWrapper}>
                  <Text style={styles.harga}>Tanggal Order</Text>
                  <Text style={styles.harga}>
                    {formatDateNumber(pesanans.tanggalOrder)}
                  </Text>
                </View>
                <View style={styles.priceWrapper}>
                  <Text style={styles.harga}>Waktu Order</Text>
                  <Text style={styles.harga}>{pesanans.waktuOrder}</Text>
                </View>
                <View style={styles.priceWrapper}>
                  <Text style={styles.harga}>Reminder Jadwal</Text>
                  <View style={styles.reminder}>
                    <Text style={styles.harga}>
                      {pesanans.reminder ? pesanans.reminder : '----'}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderWrapper}>
                  <Text style={styles.order}>Order ID</Text>
                  <Text style={styles.order}>
                    {pesanans.order_id.split('-')[0] +
                      '-' +
                      pesanans.order_id.split('-')[1]}
                  </Text>
                </View>
                <Gap height={30} />
                {pesanans.status === 'lunas' ? (
                  <TouchableOpacity
                    style={styles.invoice}
                    onPress={() =>
                      printPDF(
                        pesanans.order_id,
                        numberWithCommas(pesanans.totalHarga),
                        formatDate(pesanans.tanggalOrder),
                        dataUser,
                        dataItemInvoice,
                      )
                    }>
                    <IconInvoice />
                    <Text style={styles.textInvoice}>Cetak Invoice</Text>
                  </TouchableOpacity>
                ) : (
                  []
                )}

                {pesanans.status === 'lunas' && !pesanans.jadwal_selesai && (
                  <Button
                    label="Jadwal Selesai"
                    loading={addUlasanLoading}
                    onPress={() => this.submit(pesanans.order_id)}
                  />
                )}
                <Gap height={30} />
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  addUlasanResult: state.UlasanReducer.addUlasanResult,
  addUlasanLoading: state.UlasanReducer.addUlasanLoading,
});

export default connect(mapStateToProps, null)(InfoProduct);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    paddingHorizontal: 30,
  },
  content: {
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
    paddingTop: 10,
    paddingBottom: 30,
  },
  tanggalWrapper: {
    borderRadius: 10,
    backgroundColor: colors.grey5,
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
  },
  orderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.blueSoft,
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  order: {
    fontSize: 15,
    fontFamily: fonts.secondary.medium,
    color: colors.primary,
  },
  harga: {
    fontSize: 15,
    fontFamily: fonts.secondary.reguler,
    color: colors.dark,
  },
  status: {
    fontSize: 14,
    fontFamily: fonts.secondary.medium,
    color: colors.green,
    textTransform: 'uppercase',
    backgroundColor: colors.greenSoft,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusPending: {
    fontSize: 15,
    fontFamily: fonts.secondary.medium,
    color: colors.orange,
    textTransform: 'uppercase',
    backgroundColor: colors.orangeSoft2,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusGagal: {
    fontSize: 15,
    fontFamily: fonts.secondary.medium,
    color: colors.red,
    textTransform: 'uppercase',
    backgroundColor: colors.redSoft,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 12,
  },
  desc: {
    paddingTop: 20,
    paddingHorizontal: 30,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: colors.grey4,
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
  invoice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: 20,
  },
  textInvoice: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: fonts.secondary.medium,
    color: colors.primary,
  },
});
