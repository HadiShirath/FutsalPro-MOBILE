import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import React, {Component} from 'react';
import {colors} from '../../utils/colors/index';
import Carousel from 'react-native-snap-carousel';
import {fonts} from '../../utils/fonts/index';
import Gap from '../../components/atoms/Gap/index';
import {namaBulan} from '../../utils/namaBulan/index';
import {listDataSchedule} from '../../utils/listDateSchedule/index';
import ListSchedule from '../../components/molecules/ListSchedule/index';
import {IconAdd} from '../../assets';
import {connect} from 'react-redux';
import {checkPesanan} from '../../actions/PesananAction';
import {BackgroundProfile} from '../../assets';

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 1, // Inisialisasi nilai awal
      dataTanggal: listDataSchedule(),
      activeItem: listDataSchedule()[1],
      refreshing: false,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      this.props.dispatch(checkPesanan(this.state.activeItem));
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  componentDidUpdate(prevProps, prevState) {
    const {activeItem} = this.state;
    if (activeItem && prevState.activeItem !== activeItem) {
      this.props.dispatch(checkPesanan(activeItem));
    }
  }

  onSnapToItem = index => {
    // Ketika slide berubah, perbarui nilai activeSlide
    this.setState({
      activeSlide: index,
      activeItem: this.state.dataTanggal[index],
    });
  };

  renderItem = item => {
    item = item.item;
    return (
      <View style={styles.card}>
        <View style={styles.contentCard}>
          <Text style={styles.tanggal}>{item.split('-')[2]}</Text>

          <Text style={styles.namaBulan}>{namaBulan(item.split('-')[1])}</Text>
        </View>
      </View>
    );
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    setTimeout(() => {
      this.props.dispatch(checkPesanan(this.state.activeItem));
      this.setState({refreshing: false});
    }, 500);
  };

  render() {
    const {dataTanggal, activeItem} = this.state;

    return (
      <SafeAreaView style={styles.page}>
        <TouchableOpacity
          style={styles.buttonAdd}
          onPress={() => this.props.navigation.navigate('Lapangan')}>
          <IconAdd />
        </TouchableOpacity>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>
          <View style={styles.backgroundWrapper}>
            <Image source={BackgroundProfile} style={styles.backgroundPhoto} />
          </View>
          <Text style={styles.title}>Jadwal Futsal</Text>
          <View style={styles.wrapperCarousel}>
            <Carousel
              containerCustomStyle={{}}
              data={dataTanggal}
              renderItem={item => this.renderItem(item)}
              inactiveSlideOpacity={0.3}
              inactiveSlideScale={0.77}
              sliderWidth={280}
              itemWidth={88}
              firstItem={1}
              slideStyle={styles.slideStyle}
              onSnapToItem={this.onSnapToItem}
            />
          </View>
          <Gap height={30} />

          <ListSchedule tanggal={activeItem} {...this.props} />

          <Gap height={40} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStatetoProps = state => ({
  checkPesananResult: state.PesananReducer.checkPesananResult,
  checkPesananLoading: state.PesananReducer.checkPesananLoading,
});

export default connect(mapStatetoProps, null)(Schedule);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  schedule: {
    paddingTop: 20,
    backgroundColor: colors.grey8,
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    color: colors.dark,
    fontFamily: fonts.secondary.bold,
    marginTop: 25,
    marginBottom: 20,
  },
  wrapperCarousel: {
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  slideStyle: {
    display: 'flex',
  },
  tanggal: {
    fontSize: 40,
    color: colors.primary,
    fontFamily: fonts.secondary.bold,
  },
  namaBulan: {
    marginTop: -10,
    fontSize: 23,
    color: colors.dark,
    fontFamily: fonts.secondary.medium,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    width: 90,
    height: 100,
    borderRadius: 15,
  },
  contentCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonAdd: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 70 / 2,
  },
  backgroundWrapper: {
    width: '100%',
    height: 230,
    position: 'absolute',
  },
  backgroundPhoto: {
    height: '100%',
    width: '100%',
  },
});
