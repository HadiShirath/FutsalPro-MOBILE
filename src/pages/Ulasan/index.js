import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import React, {Component} from 'react';
import {colors} from '../../utils/colors/index';
import {dummyUlasan} from '../../data/dummyUlasan/index';
import Header from '../../components/atoms/Header/index';
import {fonts} from '../../utils/fonts/index';
import Gap from '../../components/atoms/Gap/index';
import ListUlasan from '../../components/molecules/ListUlasan/index';
import {connect} from 'react-redux';
import {getListUlasan} from '../../actions/UlasanAction';
import {getData} from '../../utils/localStorage';

class Ulasan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'waitings',
    };
  }

  componentDidMount() {
    getData('user').then(res => {
      this.props.dispatch(getListUlasan(res.uid));
    });
  }

  listTab = ['waitings', 'ratings'];

  render() {
    const {status} = this.state;

    return (
      <SafeAreaView style={styles.page}>
        <StatusBar backgroundColor={colors.grey2} barStyle="dark-content" />
        <View style={styles.page}>
          <Header
            type="page"
            title="Ulasan"
            onPress={() => this.props.navigation.goBack()}
          />

          <View style={styles.tab}>
            {this.listTab.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={[status === item && styles.btnTabActive]}
                  onPress={() => this.setState({status: item})}>
                  <Text
                    style={[
                      styles.textTab,
                      status === item && styles.textTabActive,
                    ]}>
                    {item === 'waitings' ? 'Menunggu Ulasan' : 'Ulasan Saya'}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <Gap width={'25%'} />
          </View>
          <View style={styles.line} />
          <ScrollView>
            <ListUlasan status={status} />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

export default connect()(Ulasan);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.grey2,
  },
  content: {
    paddingHorizontal: 30,
  },
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
  btnTabActive: {
    borderBottomWidth: 2,
    borderColor: colors.primary,
    paddingBottom: 8,
  },
  tanggal: {
    fontSize: 17,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
    marginTop: 20,
  },
  orderId: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
  },
  images: {
    width: 65,
    height: 53,
  },
  productWrapper: {
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nama: {
    fontSize: Platform.OS === 'ios' ? 15 : 14,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
    textTransform: 'capitalize',
  },
  category: {
    marginTop: 2,
    fontSize: 14,
    fontFamily: fonts.secondary.medium,
    color: colors.grey4,
  },
  namaWrapper: {
    flex: 1,
  },
  modal: {
    marginHorizontal: 30,
    paddingTop: 50,
    paddingHorizontal: 30,
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
    height: 1,
    backgroundColor: colors.grey1,
  },
  lapangan: {
    marginLeft: 10,
    fontSize: 17,
    textTransform: 'capitalize',
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
  },
  desc: {
    marginTop: 5,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: fonts.secondary.medium,
    color: colors.grey4,
  },
  order_id: {
    fontSize: 18,
    textTransform: 'uppercase',
    fontFamily: fonts.secondary.medium,
    marginBottom: 20,
    color: colors.dark,
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
});
