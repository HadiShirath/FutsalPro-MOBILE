import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import React, {Component} from 'react';
import {colors} from '../../utils/colors/index';
import Header from '../../components/atoms/Header/index';
import BannerSlider from '../../components/molecules/BannerSlider/index';
import ListCategory from '../../components/molecules/ListCategory/index';
import Gap from '../../components/atoms/Gap/index';
import {dummyCategories} from '../../data/dummyCategories/index';
import ListToday from '../../components/molecules/ListToday/index';
import {fonts} from '../../utils/fonts/index';
import ListLapangan from '../../components/molecules/ListLapangan/index';
import {getData} from '../../utils/localStorage';
import {
  getListFields,
  getRecommendedListField,
} from '../../actions/FieldAction';
import {connect} from 'react-redux';
import {getListKeranjang} from '../../actions/KeranjangAction';
import {checkSchedule} from '../../actions/PesananAction';
import PushNotification from 'react-native-push-notification';
import {
  requestUserPermission,
  notificationListener,
} from '../../utils/pushNotification';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      date: new Date().toLocaleDateString('en-CA'),
    };
  }

  componentDidMount() {
    requestUserPermission();
    notificationListener();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      this.props.dispatch(getListFields());
      this.props.dispatch(getRecommendedListField());
      this.props.dispatch(checkSchedule(this.state.date));
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    setTimeout(() => {
      this.props.dispatch(getListFields());
      this.props.dispatch(getRecommendedListField());
      this.props.dispatch(checkSchedule(this.state.date));
      this.setState({refreshing: false});
    }, 500);
  };

  render() {
    return (
      <View style={styles.page}>
        <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <View style={styles.content}>
            <Header type="Header-Home" navigation={this.props.navigation} />
            <BannerSlider />
            <Gap height={30} />

            {/* <ListCategory navigation={this.props.navigation} />
            <Gap height={20} /> */}
            <ListToday navigation={this.props.navigation} />
            <View style={styles.recomended}>
              <Text style={styles.textRecomended}>Rekomendasi</Text>
              <Text onPress={() => this.props.navigation.navigate('Lapangan')}>
                Lihat Semua >>{' '}
              </Text>
            </View>
            <View style={styles.listLapangan}>
              <ListLapangan
                navigation={this.props.navigation}
                recomendedFields
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default connect()(Home);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {},
  dotStyle: {
    width: 20,
    height: 3,
    borderRadius: 15,
  },
  recomended: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  textRecomended: {
    fontSize: 18,
    color: colors.dark,
    fontFamily: fonts.secondary.medium,
  },
  listLapangan: {
    marginLeft: 5,
    paddingHorizontal: 20,
  },
});
