import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  Animated,
} from 'react-native';
import React, {Component} from 'react';
import {IconCancelDark} from '../../../assets';
import Button from '../Button/index';
import Gap from '../Gap/index';
import {AirbnbRating} from 'react-native-ratings';
import {fonts} from '../../../utils/fonts/index';
import {colors} from '../../../utils/colors/index';
import {formatDateNumber} from '../../../utils/formatDateNumber/index';
import {formatDate} from '../../../utils/formatDate/index';
import {ProductVinyl, ProductRumput} from '../../../assets';
import {getData} from '../../../utils/localStorage';
import {connect} from 'react-redux';
import {getValueUlasan} from '../../../actions/UlasanAction';
import {getListUlasan} from '../../../actions/UlasanAction';

class CardUlasan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nilaiRating: 3,
      isModalVisible: false,
      ulasanStatus: [],
      myArray: Array(5).fill(0),
      item: this.props.item,
      scaleValue: new Animated.Value(0),
    };
  }

  componentDidUpdate(prevProps) {
    const {getValueUlasanResult} = this.props;

    if (
      getValueUlasanResult &&
      prevProps.getValueUlasanResult !== getValueUlasanResult
    ) {
      getData('user').then(res => {
        this.props.dispatch(getListUlasan(res.uid));
      });
    }
  }

  toggleModal = (
    tanggal,
    namaLapangan,
    order_id,
    category,
    gambar,
    tanggalOrder,
    idLapangan,
    itemPesanans,
  ) => {
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
      ulasanStatus: [
        tanggal,
        namaLapangan,
        order_id,
        category,
        gambar,
        tanggalOrder,
        idLapangan,
        itemPesanans,
      ],
    });
  };

  getValueRating = rating => {
    this.setState({
      nilaiRating: rating,
    });
  };

  getRatingsforDB = rating => {
    const {myArray} = this.state;
    this.state.myArray = myArray.fill(0);
    myArray[rating - 1] = 1;

    return myArray;
  };

  submit = (
    nilaiRating,
    dataPesanan,
    idLapangan,
    tanggal,
    orderId,
    tanggalOrder,
  ) => {
    // Alert.alert('sukses', `${this.getRatingsforDB(nilaiRating)}`);
    const {getValueUlasanLoading} = this.props;

    getData('user').then(res => {
      //peroleh data
      const data =
        Object.values(dataPesanan).length === 1
          ? dataPesanan
          : Object.entries(dataPesanan)
              .filter(([key, value]) => value.idLapangan === idLapangan)
              .map(([key, value]) => ({[key]: value}))[0];

      const dataBaru = data[idLapangan];
      dataBaru.rating = this.getRatingsforDB(nilaiRating);

      const ulasanUtama = {
        uid: res.uid,
        tanggalOrder: tanggalOrder,
        order_id: orderId,
      };
      const ulasanDetail = {
        tanggal: tanggal,
        pesanans: dataBaru,
      };

      this.props.dispatch(getValueUlasan(ulasanUtama, ulasanDetail));
    });
  };

  render() {
    const {isModalVisible, ulasanStatus, nilaiRating} = this.state;
    const {item, getValueUlasanLoading} = this.props;
    let numberIndex = 0;

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.orderId}>
            Tanggal Order : {formatDateNumber(item.tanggalOrder)}
          </Text>
        </View>
        <Text style={styles.tanggal}>Order ID : {item.order_id}</Text>
        <Gap height={15} />
        {Object.keys(item.pesanans).map((itemDate, index) => {
          const dataPesanan = Object.values(item.pesanans[itemDate]);
          return (
            <View key={index}>
              <Text style={styles.tanggalWrapper}>{formatDate(itemDate)}</Text>

              {dataPesanan.map((key, innerIndex) => {
                const tanggal = ulasanStatus[0];
                const namaLapangan = ulasanStatus[1];
                const order_id = ulasanStatus[2];
                const category = ulasanStatus[3];
                const tanggalOrder = ulasanStatus[5];
                const idLapangan = ulasanStatus[6];
                const itemPesanans = ulasanStatus[7];
                numberIndex += 1;

                return (
                  <View key={innerIndex}>
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

                          <Text style={styles.tanggalModal}>
                            {formatDate(tanggal)}
                          </Text>

                          <Text style={styles.order_id}>{order_id}</Text>
                          <View style={styles.modalLapanganWrapper}>
                            <Image
                              source={
                                namaLapangan === 'vinyl'
                                  ? ProductVinyl
                                  : ProductRumput
                              }
                              style={styles.imagesModal}
                            />
                            <View>
                              <Text style={styles.lapangan}>
                                Lapangan {namaLapangan}
                              </Text>
                              <Text style={styles.desc}>
                                {category === 'pagi' ? 'Pagi-Sore' : 'Malam'}
                              </Text>
                            </View>
                          </View>
                          <Gap height={30} />
                          <Text style={styles.beriPenilaian}>
                            Beri Penilaian :
                          </Text>
                          <Gap height={20} />
                          <View>
                            <AirbnbRating
                              count={5}
                              reviews={[
                                'Sangat Buruk',
                                'Buruk',
                                'Lumayan',
                                'Baik',
                                'Sempurna',
                              ]}
                              reviewSize={22}
                              size={33}
                              showRating={true}
                              onFinishRating={rating =>
                                this.getValueRating(rating)
                              }
                            />
                          </View>
                          <Gap height={20} />

                          <Button
                            label="Kirim Ulasan"
                            fontSize={16}
                            padding={15}
                            onPress={() =>
                              this.submit(
                                nilaiRating,
                                itemPesanans,
                                idLapangan,
                                tanggal,
                                order_id,
                                tanggalOrder,
                              )
                            }
                            loading={getValueUlasanLoading}
                          />
                          <Gap height={10} />
                          <Text
                            style={styles.batal}
                            onPress={() => this.toggleModal()}>
                            Batal
                          </Text>
                        </Animated.View>
                      </View>
                    </Modal>

                    <View style={styles.productWrapper}>
                      <Text style={styles.numberIndex}>
                        {numberIndex + '. '}
                      </Text>
                      <Image
                        source={
                          key.nama === 'vinyl' ? ProductVinyl : ProductRumput
                        }
                        style={styles.images}
                      />
                      <Gap width={10} />
                      <View style={styles.namaWrapper}>
                        <Text style={styles.nama}>Lapangan {key.nama}</Text>
                        <Text style={styles.category}>
                          {key.category === 'pagi' ? 'Pagi-Sore' : 'Malam'}
                        </Text>
                      </View>
                      {!key.rating ? (
                        <View style={styles.button}>
                          <Button
                            label="Kirim Ulasan"
                            fontSize={14}
                            padding={Platform.OS === 'ios' ? 15 : 12}
                            borderRadius={12}
                            onPress={() =>
                              this.toggleModal(
                                itemDate,
                                key.nama,
                                item.order_id,
                                key.category,
                                key.gambar,
                                item.tanggalOrder,
                                key.idLapangan,
                                item.pesanans[itemDate],
                              )
                            }
                          />
                        </View>
                      ) : (
                        <AirbnbRating
                          count={5}
                          defaultRating={
                            key.rating.findIndex(value => value === 1) + 1
                          }
                          size={Platform.OS === 'ios' ? 19 : 16}
                          isDisabled
                          showRating={false}
                        />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}
        <View style={styles.line} />
      </View>
    );
  }
}

const mapStatetoProps = state => ({
  getValueUlasanResult: state.UlasanReducer.getValueUlasanResult,
  getValueUlasanLoading: state.UlasanReducer.getValueUlasanLoading,
});

export default connect(mapStatetoProps, null)(CardUlasan);

const styles = StyleSheet.create({
  tab: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  textTab: {
    fontSize: 15,
    fontFamily: fonts.secondary.reguler,
    color: colors.grey4,
  },
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    marginBottom: 20,
    paddingBottom: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 4,
  },
  btnTabActive: {
    borderBottomWidth: 2,
    borderColor: colors.primary,
    paddingBottom: 8,
  },
  tanggal: {
    fontSize: 17,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
    marginTop: 5,
  },
  orderId: {
    marginTop: 20,
    fontSize: 14,
    fontFamily: fonts.secondary.reguler,
    color: colors.dark,
  },
  images: {
    width: 65,
    height: 53,
  },
  productWrapper: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 15,
    backgroundColor: colors.blueSoft,
  },
  nama: {
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    fontFamily: fonts.secondary.reguler,
    color: colors.dark,
    textTransform: 'capitalize',
  },
  category: {
    marginTop: 2,
    fontSize: 14,
    fontFamily: fonts.secondary.reguler,
    color: colors.grey4,
  },
  namaWrapper: {
    flex: 1,
  },
  modal: {
    paddingTop: 40,
    paddingHorizontal: 40,
    paddingBottom: 30,
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
  line: {
    width: '100%',
    height: 2,
    backgroundColor: colors.grey1,
  },
  lapangan: {
    marginLeft: 10,
    fontSize: 17,
    textTransform: 'capitalize',
    fontFamily: fonts.secondary.reguler,
    color: colors.dark,
  },
  desc: {
    marginTop: 5,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: fonts.secondary.reguler,
    color: colors.grey4,
  },
  order_id: {
    fontSize: 18,
    textTransform: 'uppercase',
    fontFamily: fonts.secondary.medium,
    marginBottom: 20,
    color: colors.dark,
    paddingRight: 50,
  },
  batal: {
    textAlign: 'center',
    fontFamily: fonts.secondary.medium,
    fontSize: 15,
    color: colors.red,
  },
  beriPenilaian: {
    fontSize: 16,
    fontFamily: fonts.secondary.reguler,
    color: colors.dark,
  },
  imagesModal: {
    height: 60,
    width: 70,
  },
  tanggalModal: {
    color: colors.grey4,
    marginBottom: 5,
  },
  modalLapanganWrapper: {
    flexDirection: 'row',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.6)',
  },
  numberIndex: {
    fontSize: 14,
    fontFamily: fonts.primary.reguler,
    color: colors.dark,
  },
  tanggalWrapper: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.secondary.medium,
    marginBottom: 10,
  },
});
