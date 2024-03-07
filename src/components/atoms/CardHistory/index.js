import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
  Image,
  TextInput,
} from 'react-native';
import {IconNextPrimary, IconInvoice, IconTime} from '../../../assets';
import React, {Component} from 'react';
import {numberWithCommas} from '../../../utils/numberFormat/index';
import Gap from '../Gap/index';
import Button from '../Button/index';
import {colors} from '../../../utils/colors/index';
import {connect} from 'react-redux';
import {fonts} from '../../../utils/fonts/index';
import {addUlasan} from '../../../actions/UlasanAction';
import {cancelPesanan} from '../../../actions/PesananAction';
import {formatDateNumber} from '../../../utils/formatDateNumber/index';
import {IconDelete, IconEdit, IconCancelDark} from '../../../assets';
import PushNotification, {Importance} from 'react-native-push-notification';
import {formatDate} from '../../../utils/formatDate/index';
import {ref, set, onValue, update, remove} from 'firebase/database';
import {db} from '../../../config/Firebase';
import {Alarm} from '../../../assets';
import {deleteAlarm} from '../../../actions/AlarmAction';
import {
  createChannels,
  handleDatePicker,
} from '../../../utils/pushNotification/index';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {printPDF} from '../../../utils/printPdf/index';
import LottieView from 'lottie-react-native';

class CardHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataModal: [],
      isModalVisible: false,
      scaleValue: new Animated.Value(0),
      isDateTimePickerVisible: false,
      isMessagePickerVisible: false,
      isCancelModalVisible: false,
      message: '',
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      createChannels();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  datePicker = (dateTime, order_id, uid, message) => {
    const {isDateTimePickerVisible, isMessagePickerVisible} = this.state;
    var currentTime = Date.now();
    if (dateTime.getTime() < currentTime) {
      Alert.alert(
        'Perhatian',
        'Anda memilih waktu masa lampau, Harap memilih waktu kedepan atau yang akan datang',
        [
          {
            text: 'Pilih Ulang',
          },
        ],
      );
      this.setState({
        isDateTimePickerVisible: !isDateTimePickerVisible,
      });
      return;
    }

    handleDatePicker(this.props.dispatch, dateTime, order_id, uid, message);

    this.setState({
      isDateTimePickerVisible: !isDateTimePickerVisible,
      isMessagePickerVisible: !isMessagePickerVisible,
    });

    //pesan Notification
    const idNotification = new Date().getTime();
    const now = new Date();
    const jam = String(now.getHours()).padStart(2, '0'); // Mendapatkan jam (dalam format 24 jam)
    const menit = String(now.getMinutes()).padStart(2, '0'); // Mendapatkan menit

    const day = now.getDate();
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    const dataBaruNotification = {
      tanggal: new Date().toLocaleDateString('en-CA'),
      waktu: `${jam}:${menit}`,
      title: '⏰ Pesan Pengingat',
      message: `Pesan Pengingat pada ${day} ${month} ${year}, ${jam}:${menit} WIB`,
      unread: true,
      id: idNotification,
    };

    //Kirim Pesan Informasi Notification
    set(
      ref(db, `notifications/${uid}/all/${idNotification}`),
      dataBaruNotification,
    );
  };

  timePicker = (waktuAlarmDB, order_id, uid) => {
    const {isDateTimePickerVisible, message} = this.state;

    const orderIdDB = `${order_id}-${uid}`;
    return (
      <View>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => this.toggleModal(order_id, waktuAlarmDB)}>
          <View style={styles.reminderTimePicker}>
            <Text style={{color: colors.grey5, fontSize: 13}}>
              {waktuAlarmDB ? waktuAlarmDB : '+ Tambah Pengingat'}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: colors.orangeSoft,
              padding: 10,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
            }}>
            <IconTime />
          </View>
        </TouchableOpacity>

        <DateTimePicker
          mode="datetime"
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={dateTime =>
            this.datePicker(dateTime, orderIdDB, uid, message)
          }
          onCancel={() =>
            this.setState({isDateTimePickerVisible: !isDateTimePickerVisible})
          }
        />
      </View>
    );
  };

  submit = orderId => {
    const {data, uid} = this.props;

    const dataPesanan = {...data.pesanans};
    const dataPesananBaru = Object.values(dataPesanan);

    //hapus totalharga disetiap dataLapangan
    dataPesananBaru.map(item => delete item.totalHarga);

    const dataBaru = {
      tanggalOrder: data.tanggalOrder,
      order_id: data.order_id,
      user: data.user,
      pesanans: dataPesanan,
    };

    this.props.dispatch(addUlasan(uid, dataBaru));
  };

  cancelPesanan = () => {
    const {data} = this.props;
    const order_id = `${data.order_id}-${data.user}`;

    this.props.dispatch(cancelPesanan(order_id));
  };

  toggleModal = (orderId, reminder) => {
    const {scaleValue, isModalVisible} = this.state;

    if (!isModalVisible) {
      this.setState({
        isModalVisible: !isModalVisible,
      });

      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 3500,
        useNativeDriver: true,
      }).start();
    } else {
      this.setState({
        isModalVisible: !isModalVisible,
        scaleValue: new Animated.Value(0),
      });
    }

    this.setState({
      dataModal: [orderId, reminder],
    });
  };

  toggleModalMessage = () => {
    const {isMessagePickerVisible} = this.state;
    this.setState({
      isMessagePickerVisible: !isMessagePickerVisible,
    });
  };

  toggleModalCancel = () => {
    const {scaleValue, isCancelModalVisible} = this.state;
    if (!isCancelModalVisible) {
      this.setState({
        isCancelModalVisible: !isCancelModalVisible,
      });

      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 3500,
        useNativeDriver: true,
      }).start();
    } else {
      this.setState({
        isCancelModalVisible: !isCancelModalVisible,
        scaleValue: new Animated.Value(0),
      });
    }
  };

  render() {
    const {navigation, data, orderId, uid, dataUser, loading} = this.props;
    const {
      isModalVisible,
      dataModal,
      isMessagePickerVisible,
      isDateTimePickerVisible,
      isCancelModalVisible,
    } = this.state;

    const dataHistory = {...data};
    const newDataHistory = {...dataHistory.pesanans};
    const dataBaru = Object.values(newDataHistory);

    //hapus totalharga disetiap dataLapangan
    dataBaru.map(item => delete item.totalHarga);

    const dataItemInvoice = Object.entries(newDataHistory).flatMap(
      ([tanggal, items]) =>
        Object.entries(items).map(([id, item]) => ({
          tanggal: formatDate(tanggal),
          lapangan: item.nama,
          totalHarga: numberWithCommas(item.hargaTotal),
          waktu: item.waktu.join(', '),
        })),
    );

    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isCancelModalVisible}
          onRequestClose={() => {
            this.setState({isCancelModalVisible: !isCancelModalVisible});
          }}>
          <View style={styles.centeredView}>
            <Animated.View
              style={[
                styles.modal,
                {transform: [{scale: this.state.scaleValue}]},
              ]}>
              <View style={{alignItems: 'center'}}>
                <LottieView
                  source={require('../../../assets/images/animationWarning.json')}
                  style={{width: 110, height: 110}}
                  autoPlay
                  loop={false}
                />

                <View
                  style={{
                    paddingHorizontal: 40,
                    paddingTop: 10,
                    paddingBottom: 5,
                  }}>
                  <Text
                    style={{
                      color: colors.dark,
                      fontSize: 23,
                      fontFamily: fonts.secondary.medium,
                      textAlign: 'center',
                    }}>
                    Batalkan Pesanan
                  </Text>
                  <Text
                    style={{
                      color: colors.grey5,
                      fontSize: 16,
                      fontFamily: fonts.secondary.reguler,
                      textAlign: 'center',
                    }}>
                    Apakah Kamu Yakin?
                  </Text>
                </View>

                <Gap height={20} />

                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Button
                    label="Cancel"
                    fontSize={15}
                    padding={13}
                    color={colors.grey4}
                    onPress={() => this.toggleModalCancel()}
                  />

                  <Gap width={10} />
                  <Button
                    label="Iya, Batalkan"
                    fontSize={15}
                    padding={13}
                    color={colors.red}
                    onPress={() => this.cancelPesanan()}
                  />
                </View>
              </View>

              <Gap height={10} />
            </Animated.View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {
            this.setState({isModalVisible: !isModalVisible});
          }}>
          <View style={styles.centeredView}>
            <Animated.View
              style={[
                styles.modal,
                {transform: [{scale: this.state.scaleValue}]},
              ]}>
              <TouchableOpacity
                style={styles.cancel}
                onPress={() => this.toggleModal()}>
                <IconCancelDark />
              </TouchableOpacity>

              <View style={{paddingHorizontal: 50}}>
                <View
                  style={{
                    alignItems: 'center',
                    paddingHorizontal: 40,
                  }}>
                  <Image
                    source={Alarm}
                    style={{
                      width: 135,
                      height: 95,
                      marginTop: -90,
                    }}
                  />
                </View>
                <Gap height={10} />
                <View style={{alignItems: 'center', marginBottom: 15}}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: fonts.secondary.medium,
                      color: colors.dark,
                    }}>
                    Reminder Jadwal
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: fonts.secondary.reguler,
                      color: colors.dark,
                    }}>
                    {dataModal[0]}
                  </Text>
                  <Gap height={10} />
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        backgroundColor: colors.grey6,
                        flex: 1,
                        alignItems: 'center',
                        paddingVertical: 7,
                        borderRadius: 10,
                      }}>
                      <Text
                        style={{
                          color: colors.dark,
                          fontFamily: fonts.primary.reguler,
                        }}>
                        {dataModal[1] ? dataModal[1] : 'Belum Ada Jadwal'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* <View
                style={{
                  height: 2,
                  backgroundColor: colors.grey6,
                }}
              /> */}
              <View
                style={{
                  marginTop: 10,
                  paddingHorizontal: 40,
                }}>
                {dataModal[1] ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text
                        style={{
                          color: colors.redbold,
                          fontFamily: fonts.secondary.medium,
                          fontSize: 15,
                        }}
                        onPress={() => {
                          const dataUserAlarm = {
                            order_id: orderId,
                            uid: this.props.uid,
                          };

                          this.toggleModal();
                          this.props.dispatch(deleteAlarm(dataUserAlarm));
                        }}>
                        Hapus Jadwal
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={{
                          color: colors.primary,
                          fontFamily: fonts.secondary.medium,
                          fontSize: 15,
                        }}
                        onPress={() => {
                          this.toggleModal();
                          this.toggleModalMessage();
                        }}>
                        Ubah Pengingat
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      <Text
                        style={{
                          color: colors.redbold,
                          fontFamily: fonts.secondary.medium,
                          fontSize: 14.5,
                          marginLeft: 10,
                        }}
                        onPress={() => this.toggleModal()}>
                        Batalkan
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        this.toggleModal();
                        this.toggleModalMessage();
                      }}>
                      <Text
                        style={{
                          color: colors.orange,
                          fontFamily: fonts.secondary.medium,
                          fontSize: 14.5,
                        }}>
                        Tambah Pengingat
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </Animated.View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={isMessagePickerVisible}
          onRequestClose={() => {
            this.setState({isMessagePickerVisible: !isMessagePickerVisible});
          }}>
          <View style={styles.centeredView}>
            <View style={[styles.modal]}>
              <TouchableOpacity
                style={styles.cancel}
                onPress={() => this.toggleModalMessage()}>
                <IconCancelDark />
              </TouchableOpacity>

              <View style={{paddingHorizontal: 50}}>
                <Gap height={10} />
                <View style={{alignItems: 'center'}}>
                  <Text>Masukan Pesan</Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: fonts.secondary.medium,
                      color: colors.dark,
                      paddingHorizontal: 30,
                    }}>
                    Pengingat Jadwal
                  </Text>

                  <Gap height={10} />
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        borderColor: colors.orange,
                        backgroundColor: colors.orangeSoft2,
                        borderWidth: 2,
                        flex: 1,
                        borderRadius: 15,
                        paddingHorizontal: 10,
                      }}>
                      <TextInput
                        style={{
                          color: colors.grey5,
                          fontFamily: fonts.primary.reguler,
                          fontSize: 14,
                        }}
                        placeholder="Isi Pesan Pengingat"
                        value={this.message}
                        onChangeText={message => this.setState({message})}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <Text style={{textAlign: 'center', marginTop: 5}}>
                Misal: Jangan Lupa Hari ini 😉
              </Text>

              <View
                style={{
                  alignItems: 'center',
                  marginTop: 15,
                  paddingHorizontal: 40,
                }}>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        isDateTimePickerVisible: !isDateTimePickerVisible,
                      });
                    }}>
                    <Text
                      style={{
                        color: colors.orange,
                        fontFamily: fonts.secondary.medium,
                        fontSize: 15,
                      }}>
                      Selanjutnya
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.content}
          onPress={() => {
            navigation.navigate('InfoProduct', dataHistory);
          }}>
          <View style={styles.container}>
            <View>
              <Text>Tanggal Order : {formatDateNumber(data.tanggalOrder)}</Text>
              <View style={styles.textWrapper}>
                <View style={styles.tanggalWrapper}>
                  <Text style={styles.tanggal}>Order ID : {data.order_id}</Text>
                </View>
              </View>
            </View>
            <View style={styles.iconNextWrapper}>
              <IconNextPrimary width={24} height={24} />
            </View>
          </View>
          <View style={styles.desc}>
            <View style={styles.priceWrapper}>
              <Text style={styles.harga}>Status Pembayaran</Text>
              {data.status === 'lunas' ? (
                <Text style={styles.status}>{data.status}</Text>
              ) : data.status === 'pending' ? (
                <Text style={styles.statusPending}>{data.status}</Text>
              ) : (
                <Text style={styles.statusGagal}>{data.status}</Text>
              )}
            </View>
            <View style={styles.priceWrapper}>
              <Text style={styles.harga}>Total Harga Semua</Text>
              <Text style={styles.harga}>
                Rp. {numberWithCommas(data.totalHarga)}
              </Text>
            </View>
            <View style={styles.priceWrapper}>
              <Text style={styles.harga}>Reminder Jadwal</Text>
              {data.reminder ? (
                <View>
                  {this.timePicker(data.reminder, data.order_id, uid)}
                </View>
              ) : data.status === 'pending' || data.status === 'gagal' ? (
                <View style={styles.wrapperButton}>
                  <Gap width={10} />

                  <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => {
                      Alert.alert(
                        'Selesaikan Pembayaran',
                        'Fitur Tambah Pengingat Jadwal hanya dapat diaktifkan setelah berhasil melakukan pembayaran jadwal',
                      );
                    }}>
                    <View style={styles.reminder}>
                      <Text style={{color: colors.grey5, fontSize: 13}}>
                        + Tambah Pengingat
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: colors.grey6,
                        padding: 10,
                        borderTopRightRadius: 10,
                        borderBottomRightRadius: 10,
                      }}>
                      <IconTime />
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {this.timePicker(null, data.order_id, uid)}
                </View>
              )}
            </View>
            {data.status === 'lunas' && !data.jadwal_selesai ? (
              <View>
                <Gap height={30} />
                <View style={styles.wrapperButton}>
                  <TouchableOpacity
                    style={styles.invoice}
                    onPress={() =>
                      printPDF(
                        data.order_id,
                        numberWithCommas(data.totalHarga),
                        formatDate(data.tanggalOrder),
                        dataUser,
                        dataItemInvoice,
                      )
                    }>
                    <IconInvoice />
                    <Text style={styles.textInvoice}>Cetak Invoice</Text>
                  </TouchableOpacity>
                  <View style={{flex: 1}}>
                    <Button
                      label="Jadwal Selesai"
                      padding={11}
                      fontSize={15}
                      borderRadius={12}
                      onPress={() => this.submit(data.order_id)}
                    />
                  </View>
                </View>
                <Gap height={30} />
              </View>
            ) : data.status === 'pending' ? (
              <View>
                <Gap height={30} />
                <View style={styles.wrapperButton}>
                  <TouchableOpacity
                    style={styles.cancelOrder}
                    onPress={() => this.toggleModalCancel()}>
                    <Text style={styles.textCancelOrder}>Batalkan Pesanan</Text>
                  </TouchableOpacity>
                  <View style={{flex: 1}}>
                    <Button
                      label="Cek Pembayaran"
                      fontSize={14}
                      padding={11}
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
                <Gap height={30} />
              </View>
            ) : (
              <Gap height={30} />
            )}
          </View>

          {/* <View style={styles.line} /> */}
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect()(CardHistory);

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    marginBottom: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
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

  line: {
    height: 1.5,
    width: '100%',
    backgroundColor: colors.grey1,
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
    borderWidth: 2,
    borderColor: colors.grey6,
    paddingVertical: 3,
    paddingHorizontal: 10,
    // borderRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  reminderTimePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.orangeSoft,
    paddingVertical: 3,
    paddingHorizontal: 10,
    // borderRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  buttonReminder: pesanan => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: pesanan === 'lunas' ? colors.redSoft : colors.grey8,
  }),
  textReminder: pesanan => ({
    color: pesanan === 'lunas' ? colors.red : colors.grey4,
    marginLeft: 4,
    fontSize: 14,
    fontFamily: fonts.secondary.reguler,
  }),
  wrapperButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelOrder: {
    marginRight: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: 14,
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
  iconNextWrapper: {
    backgroundColor: colors.grey7,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30 / 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.6)',
  },
  modal: {
    paddingTop: 30,
    paddingBottom: 23,
    borderRadius: 30,
    backgroundColor: colors.white,
  },
  cancel: {
    position: 'absolute',
    backgroundColor: colors.grey6,
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    right: -10,
    top: -10,
  },
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.orangeSoft,
    paddingVertical: 8,
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: fonts.secondary.reguler,
    paddingHorizontal: 10,
    color: colors.dark,
  },
});
