import {
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import React, {Component} from 'react';
import {colors} from '../../utils/colors/index';
import {Header} from '../../components';
import {
  RumputPreview,
  VinylPreview,
  IconLoveOutline,
  IconLove,
  IconWifi,
  IconCctv,
  IconStar,
} from '../../assets';
import {fonts} from '../../utils/fonts/index';
import Button from '../../components/atoms/Button/index';
import Gap from '../../components/atoms/Gap/index';
import {numberWithCommas} from '../../utils/numberFormat/index';
import {valueRating, totalReview} from '../../utils/numberRating/index';
import {
  addFavorite,
  checkFavorite,
  deleteFavorite,
} from '../../actions/FavoriteAction';
import {connect} from 'react-redux';
import {getData} from '../../utils/localStorage';

class DetailLapangan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      love: false,
      favIconScale: new Animated.Value(0.1),
      lapangan: this.props.route.params,
      uid: '',
    };
  }

  componentDidMount() {
    const {favIconScale, lapangan} = this.state;

    Animated.timing(favIconScale, {
      toValue: 1,
      duration: 3000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    getData('user').then(res => {
      const dataBaru = {
        ...lapangan,
        uid: res.uid,
      };
      this.props.dispatch(checkFavorite(dataBaru));
      this.setState({uid: res.uid});
    });
  }

  componentDidUpdate(prevProps) {
    const {addFavoriteResult, checkFavoriteResult, deleteFavoriteResult} =
      this.props;
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
  }

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

  continueOrder = () => {
    const {lapangan} = this.state;

    this.props.navigation.navigate('Order', lapangan);
  };

  render() {
    const {love, lapangan} = this.state;

    return (
      <View style={styles.page}>
        <ScrollView>
          <StatusBar
            backgroundColor={colors.secondary}
            barStyle="dark-content"
          />
          <View style={styles.lineImage} />

          <Header
            title="Informasi Lapangan"
            type="page"
            onPress={() => this.props.navigation.goBack()}
          />

          <Image
            source={lapangan.nama === 'vinyl' ? VinylPreview : RumputPreview}
            style={styles.images}
          />
          <View style={styles.content}>
            <View style={styles.nameProduct}>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>Lapangan {lapangan.nama}</Text>
                <Text style={styles.desc}>
                  {lapangan.category === 'pagi' ? 'pagi-sore' : 'malam'}
                </Text>
              </View>
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
            </View>
            <View>
              <View style={styles.ratingWrapper}>
                <View>
                  <IconStar width={23} height={23} />
                </View>
                <Text style={styles.textRating}>
                  {valueRating(lapangan.rating)} ({totalReview(lapangan.rating)}{' '}
                  Review )
                </Text>
              </View>
            </View>
            <View style={styles.lineSecond}>
              <Text style={styles.descTitle}>Fasilitas</Text>
              <View style={styles.iconFitur}>
                <View style={styles.iconWrapper}>
                  <View style={styles.iconContent}>
                    <IconWifi />
                    <Text style={styles.iconText}>WIFI</Text>
                  </View>
                  <View style={styles.iconContent}>
                    <IconCctv />
                    <Text style={styles.iconText}>CCTV</Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.descTitle}>Deskripsi</Text>
            <Text style={styles.description}>
              Merasakan permainan yang lebih alami layaknya seperti bermain di
              lapangan sepak bola namun versi yang lebih kecil
            </Text>
            <Text style={styles.descTitle}>Ketentuan</Text>
            <Text style={styles.description}>
              Pemesanan jadwal lapangan futsal dapat dilakukan hingga maksimal
              <Text style={styles.hari}> 30 Hari </Text>kedepan
            </Text>
            <Gap height={30} />
          </View>
        </ScrollView>
        <View style={styles.bottom}>
          <View style={styles.priceWrapper}>
            <Text style={styles.price}>
              Rp.
              {numberWithCommas(lapangan.harga)}
            </Text>
            <Text style={styles.textPrice}>Per Jam</Text>
          </View>
          <View style={styles.buttonBottom}>
            <Button
              padding={16}
              label="Pesan Jadwal"
              onPress={this.continueOrder}
            />
          </View>
        </View>
      </View>
    );
  }
}

const mapStatetoProps = state => ({
  addFavoriteResult: state.FavoriteReducer.addFavoriteResult,
  addFavoriteLoading: state.FavoriteReducer.addFavoriteLoading,

  checkFavoriteResult: state.FavoriteReducer.checkFavoriteResult,
  checkFavoriteLoading: state.FavoriteReducer.checkFavoriteLoading,

  deleteFavoriteResult: state.FavoriteReducer.deleteFavoriteResult,
  deleteFavoriteLoading: state.FavoriteReducer.deleteFavoriteLoading,
});

export default connect(mapStatetoProps, null)(DetailLapangan);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  images: {
    marginTop: 15,
    marginLeft: 30,
    width: 320,
    height: 220,
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  nameProduct: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  love: {
    backgroundColor: colors.redSoft,
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 68 / 2,
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
    textTransform: 'capitalize',
  },
  desc: {
    marginTop: 5,
    fontSize: 22,
    fontFamily: fonts.secondary.medium,
    color: colors.grey4,
    textTransform: 'capitalize',
  },
  price: {
    fontSize: 23,
    fontFamily: fonts.secondary.medium,
    color: colors.orange,
  },
  lineImage: {
    position: 'absolute',
    width: '100%',
    height: '30%',
    backgroundColor: colors.secondary,
  },
  lineSecond: {
    marginVertical: 15,
  },
  descTitle: {
    marginTop: 10,
    fontFamily: fonts.secondary.medium,
    fontSize: 18,
    color: colors.dark,
  },
  description: {
    marginTop: 9,
    fontFamily: fonts.secondary.light,
    fontSize: 15,
    color: colors.dark,
  },
  hari: {
    fontFamily: fonts.secondary.medium,
    color: colors.red,
  },
  ratingWrapper: {
    marginTop: 10,
    flexDirection: 'row',
  },
  textRating: {
    marginLeft: 8,
    fontSize: 18,
    fontFamily: fonts.secondary.reguler,
    color: colors.dark,
  },
  iconWrapper: {
    flexDirection: 'row',
  },
  iconContent: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  iconText: {
    marginLeft: 15,
    fontSize: 14,
    fontFamily: fonts.primary.medium,
    color: colors.dark,
  },
  bottom: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderTopWidth: 1.5,
    borderTopColor: colors.grey6,
  },
  priceWrapper: {
    marginRight: 25,
    justifyContent: 'center',
  },
  buttonBottom: {
    flex: 1,
  },
  textPrice: {
    fontSize: 18,
    fontFamily: fonts.secondary.reguler,
    color: colors.dark,
  },
});
