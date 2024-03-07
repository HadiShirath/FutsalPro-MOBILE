import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
  Easing,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {Component} from 'react';
import {colors} from '../../utils/colors/index';
import Header from '../../components/atoms/Header/index';
import {RumputPreview, VinylPreview, IconWifi, IconCctv} from '../../assets';
import {fonts} from '../../utils/fonts/index';
import Gap from '../../components/atoms/Gap/index';
import CheckBox from 'react-native-check-box';
import {numberWithCommas} from '../../utils/numberFormat/index';
import Button from '../../components/atoms/Button/index';
import {IconStar} from '../../assets';
import {valueRating} from '../../utils/numberRating/index';
import {Dropdown} from 'react-native-element-dropdown';
import {sevenDays} from '../../utils/optionSevenDay/index';
import {connect} from 'react-redux';
import {addKeranjang, checkKeranjang} from '../../actions/KeranjangAction';
import {getData} from '../../utils/localStorage';
import {
  checkFavorite,
  addFavorite,
  deleteFavorite,
} from '../../actions/FavoriteAction';
import {IconLove, IconLoveOutline} from '../../assets';
import {dummySchedule} from '../../data/dummySchedule/index';
import {checkPesanan} from '../../actions/PesananAction';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {showError} from '../../utils/showMessage/index';

class Order extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataWaktuPagi: [
        '08.00-09.00',
        '13.00-14.00',
        '09.00-10.00',
        '14.00-15.00',
        '10.00-11.00',
        '15.00-16.00',
        '11.00-12.00',
        '16.00-17.00',
      ],
      dataWaktuMalam: [
        '19.00-20.00',
        '22.00-23.00',
        '20.00-21.00',
        '23.00-23.59',
        '21.00-22.00',
      ],
      favIconScale: new Animated.Value(0.1),
      fiturScale: new Animated.Value(0.1),
      lapangan: this.props.route.params,

      valueDate: new Date().toLocaleDateString('en-CA'),
      selectedFilters: [],
      dataAwal: [],
      uid: '',
    };
  }

  componentDidMount() {
    const {favIconScale, fiturScale, valueDate, lapangan} = this.state;

    Animated.timing(favIconScale, {
      toValue: 1,
      duration: 2000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    Animated.timing(fiturScale, {
      toValue: 1,
      duration: 2000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Jika data dikirim dari keranjang tanggal bernilai lapangan.tanggal,
    // jika tidak maka tanggal bernilai valueDate
    const OptionDate = lapangan.tanggal ? lapangan.tanggal : valueDate;
    this.setState({valueDate: OptionDate});

    getData('user').then(res => {
      const userId = res.uid;
      const dataBaru = {
        ...lapangan,
        uid: userId,
      };
      this.props.dispatch(checkFavorite(dataBaru));
      this.props.dispatch(
        checkKeranjang(userId, OptionDate, lapangan.idLapangan),
      );

      this.setState({uid: userId});
    });

    this.props.dispatch(checkPesanan(OptionDate, lapangan.nama));

    // Filter jadwal berdasarkan value
    // const formattedSchedule = this.state.dataJadwal
    //   .map(schedule => {
    //     return schedule.jadwal.map(jadwal => {
    //       return jadwal.waktu.map(waktu => {
    //         return `${schedule.lapangan}-${jadwal.tanggal}-${waktu.waktu}`;
    //       });
    //     });
    //   })
    //   .flat()
    //   .flat();
  }

  handleFilterChange = (lapangan, date, timeSlot) => {
    const {selectedFilters} = this.state;
    const key = lapangan + '-' + date + '-' + timeSlot;

    if (selectedFilters.includes(key)) {
      this.setState({
        selectedFilters: selectedFilters.filter(item => item !== key),
      });
    } else {
      this.setState({
        selectedFilters: [...selectedFilters, key],
      });
    }
  };

  onChangeLove = () => {
    const {lapangan, love, uid} = this.state;
    if (love) {
      this.props.dispatch(deleteFavorite(uid, lapangan.idLapangan));
    } else {
      getData('user').then(res => {
        const dataBaru = {
          ...lapangan,
          uid: res.uid,
        };
        this.props.dispatch(addFavorite(dataBaru));
      });
    }
  };

  checkBox = dataCategory => {
    const {selectedFilters, dataAwal, lapangan, valueDate} = this.state;
    const {checkPesananLoading, checkKeranjangLoading} = this.props;

    return (
      <View style={styles.wrapperCheckBox}>
        {dataCategory.map((key, index) => (
          <View key={index} style={styles.contentCheckBox}>
            <View style={styles.listCheckBox}>
              {checkPesananLoading && checkKeranjangLoading ? (
                <View>
                  <SkeletonPlaceholder borderRadius={4}>
                    <View style={{width: 25, height: 25}} />
                  </SkeletonPlaceholder>
                </View>
              ) : (
                <CheckBox
                  key={index}
                  style={{transform: [{scaleX: 1.5}, {scaleY: 1.5}]}}
                  disabled={
                    dataAwal.includes(
                      lapangan.nama + '-' + valueDate + '-' + key,
                    )
                      ? true
                      : false
                  }
                  isChecked={selectedFilters.includes(
                    lapangan.nama + '-' + valueDate + '-' + key,
                  )}
                  onClick={() => {
                    this.handleFilterChange(lapangan.nama, valueDate, key);
                  }}
                  checkedCheckBoxColor={
                    dataAwal.includes(
                      lapangan.nama + '-' + valueDate + '-' + key,
                    )
                      ? colors.grey6
                      : colors.primary
                  }
                  checkBoxColor={colors.primary}
                />
              )}
              <Text style={styles.textCheckBox}>
                {key.split('-')[0] + ' - ' + key.split('-')[1]}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  renderCheckboxes = () => {
    const {dataWaktuPagi, dataWaktuMalam, lapangan} = this.state;
    return (
      <View>
        {lapangan.category === 'pagi'
          ? this.checkBox(dataWaktuPagi)
          : this.checkBox(dataWaktuMalam)}
      </View>
    );
  };

  onSubmit = () => {
    const {lapangan, selectedFilters, dataAwal, valueDate} = this.state;
    const dataUser = selectedFilters.filter(item => !dataAwal.includes(item));

    const dataSelected = dataUser.map(item =>
      lapangan.nama === 'vinyl' ? item.substring(17) : item.substring(18),
    );

    const dataBaru = {
      ...lapangan,
      tanggal: this.state.valueDate,
      waktu: dataSelected,
      uid: this.state.uid,
    };

    if (dataUser.length !== 0) {
      this.props.dispatch(addKeranjang(dataBaru));
    } else {
      Alert.alert('Perhatian', 'Anda Belum Memilih Jadwal');
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      addKeranjangResult,
      addFavoriteResult,
      checkFavoriteResult,
      deleteFavoriteResult,
      checkPesananResult,
      checkKeranjangResult,
    } = this.props;
    const {valueDate, lapangan, uid, selectedFilters} = this.state;

    if (
      addKeranjangResult &&
      prevProps.addKeranjangResult !== addKeranjangResult
    ) {
      this.props.navigation.replace('Keranjang');
    }

    if (
      addFavoriteResult &&
      prevProps.addFavoriteResult !== addFavoriteResult
    ) {
      this.setState({love: addFavoriteResult});
    }
    if (
      checkFavoriteResult &&
      prevProps.checkFavoriteResult !== checkFavoriteResult
    ) {
      this.setState({love: checkFavoriteResult});
    }
    if (
      deleteFavoriteResult &&
      prevProps.deleteFavoriteResult !== deleteFavoriteResult
    ) {
      this.setState({love: false});
    }
    if (
      checkPesananResult &&
      prevProps.checkPesananResult !== checkPesananResult
    ) {
      const dataPesanan = checkPesananResult.map(
        item => `${lapangan.nama}-${valueDate}-${item.waktu}`,
      );

      this.setState({
        selectedFilters: dataPesanan,
        dataAwal: dataPesanan,
      });
    }
    if (
      checkKeranjangResult &&
      prevProps.checkKeranjangResult !== checkKeranjangResult
    ) {
      const dataBaru = checkKeranjangResult.waktu.map(
        item => `${lapangan.nama}-${valueDate}-${item}`,
      );
      const gabunganData = selectedFilters.concat(dataBaru);
      this.setState({
        selectedFilters: gabunganData,
      });
    }
    if (valueDate && prevState.valueDate !== valueDate) {
      this.props.dispatch(checkPesanan(valueDate, lapangan.nama));
      this.props.dispatch(checkKeranjang(uid, valueDate, lapangan.idLapangan));
    }
  }

  render() {
    const {love, lapangan, valueDate} = this.state;

    return (
      <SafeAreaView style={styles.page}>
        <StatusBar backgroundColor={colors.secondary} barStyle="dark-content" />

        <View style={styles.lineImage} />
        <ScrollView>
          <Header
            title="Pesan Jadwal"
            type="page"
            onPress={() => this.props.navigation.goBack()}
          />
          <View style={styles.wrapperImages}>
            <View>
              <Gap height={20} />
              <Animated.View
                style={[
                  {
                    transform: [{scale: this.state.fiturScale}],
                  },
                ]}>
                <View style={styles.iconWrapper}>
                  <IconWifi />
                  <Text style={styles.iconText}>WIFI</Text>
                </View>
                <View style={styles.iconWrapper}>
                  <IconCctv />
                  <Text style={styles.iconText}>CCTV</Text>
                </View>
              </Animated.View>
            </View>
            <Image
              source={lapangan.nama === 'vinyl' ? VinylPreview : RumputPreview}
              style={styles.images}
            />
          </View>

          <View style={styles.content}>
            <Animated.View
              style={[
                styles.love,
                {
                  transform: [{scale: this.state.favIconScale}],
                },
              ]}>
              <TouchableOpacity onPress={this.onChangeLove}>
                {love && <IconLove width={25} height={25} />}
                {!love && <IconLoveOutline width={25} height={25} />}
              </TouchableOpacity>
            </Animated.View>
            <View style={styles.contentDesc}>
              <Gap height={40} />

              <View style={styles.wrapperContentDesc}>
                <View style={styles.wrapperNamaProduct}>
                  <View>
                    <Text style={styles.nama}>Lapangan {lapangan.nama}</Text>
                    <Text style={styles.category}>
                      {lapangan.category === 'pagi' ? 'pagi-sore' : 'malam'}
                    </Text>
                    <Text style={styles.harga}>
                      Rp. {numberWithCommas(lapangan.harga)}/Jam
                    </Text>
                  </View>
                  <Gap width={10} />

                  <View style={styles.iconFitur}>
                    <View>
                      <IconStar width={23} height={23} />
                    </View>
                    <Text style={styles.textRating}>
                      {valueRating(lapangan.rating)}
                    </Text>
                  </View>
                </View>
                <Gap height={20} />
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Pilih Tanggal"
                  data={sevenDays()}
                  value={valueDate}
                  onChange={item => {
                    this.setState({
                      valueDate: item.value,
                      selectedFilters: this.state.selectedFilters,
                    });
                  }}
                />
                <View style={styles.jadwalTersedia}>
                  <Text style={styles.pilihanJadwal}>Jadwal yang tersedia</Text>
                  <View style={styles.lineJadwal} />
                </View>
                <View style={styles.listTimeCheckBox}>
                  {this.renderCheckboxes()}
                </View>
                <Gap height={30} />

                <View>
                  <Button
                    label="Tambah Keranjang"
                    color={colors.orangeSoft}
                    textColor={colors.dark}
                    icons="Keranjang"
                    onPress={() => this.onSubmit()}
                    loading={this.props.addKeranjangLoading}
                  />
                </View>

                <Gap height={20} />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStatetoProps = state => ({
  addKeranjangResult: state.KeranjangReducer.addKeranjangResult,
  addKeranjangLoading: state.KeranjangReducer.addKeranjangLoading,

  updateTotalHargaKeranjangResult:
    state.KeranjangReducer.updateTotalHargaKeranjangResult,
  updateTotalHargaKeranjangLoading:
    state.KeranjangReducer.updateTotalHargaKeranjangLoading,

  addFavoriteResult: state.FavoriteReducer.addFavoriteResult,

  checkFavoriteResult: state.FavoriteReducer.checkFavoriteResult,
  deleteFavoriteResult: state.FavoriteReducer.deleteFavoriteResult,

  checkPesananResult: state.PesananReducer.checkPesananResult,
  checkPesananLoading: state.PesananReducer.checkPesananLoading,

  checkKeranjangResult: state.KeranjangReducer.checkKeranjangResult,
  checkKeranjangLoading: state.KeranjangReducer.checkKeranjangLoading,
});

export default connect(mapStatetoProps, null)(Order);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  content: {
    height: '60%',
  },
  images: {
    marginTop: -10,
    width: 300,
    height: 250,
  },
  iconWrapper: {
    marginBottom: 10,
    paddingHorizontal: 23,
    paddingVertical: 22,
    backgroundColor: colors.white,
    borderRadius: 15,
    marginRight: 20,
    alignItems: 'center',
  },
  iconText: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
  },
  nama: {
    fontSize: 23,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
    textTransform: 'capitalize',
  },
  category: {
    fontSize: 20,
    fontFamily: fonts.secondary.medium,
    color: colors.grey4,
    textTransform: 'capitalize',
  },
  harga: {
    fontSize: 21,
    fontFamily: fonts.secondary.medium,
    color: colors.orange,
  },
  pilihanJadwal: {
    fontSize: 16,
    fontFamily: fonts.secondary.medium,
    color: colors.grey4,
    marginRight: 10,
  },
  love: {
    backgroundColor: colors.redSoft,
    width: 75,
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 75 / 2,
    position: 'absolute',
    zIndex: 1,
    right: 40,
    top: -20,
  },
  lineImage: {
    position: 'absolute',
    width: '100%',
    height: '80%',
    backgroundColor: colors.secondary,
  },
  iconFitur: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textRating: {
    marginHorizontal: 8,
    fontSize: 20,
    color: colors.dark,
    fontFamily: fonts.secondary.reguler,
  },
  dropdown: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.grey8,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: colors.dark,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  wrapperCheckBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'space-between',
  },
  contentCheckBox: {
    flexDirection: 'row',
    marginTop: 15,
    marginRight: 10,
  },
  listCheckBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textCheckBox: {
    marginLeft: 10,
    fontFamily: fonts.secondary.reguler,
    fontSize: 15,
  },
  wrapperImages: {
    flexDirection: 'row',
    paddingHorizontal: 30,
  },
  contentDesc: {
    backgroundColor: colors.white,
    flex: 1,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  wrapperContentDesc: {
    paddingHorizontal: 30,
    paddingBottom: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  wrapperNamaProduct: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  jadwalTersedia: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  lineJadwal: {
    flex: 1,
    height: 1,
    backgroundColor: colors.grey3,
  },
  listTimeCheckBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
});
