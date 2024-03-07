import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, {Component} from 'react';
import {colors} from '../../utils/colors/index';
import {fonts} from '../../utils/fonts/index';
import Header from '../../components/atoms/Header/index';
import Gap from '../../components/atoms/Gap/index';
import {dummyMenus} from '../../data/dummyMenus/index';
import ListMenu from '../../components/molecules/ListMenu/index';
import {getData} from '../../utils/localStorage/index';
import {BackgroundProfile} from '../../assets';
import {getListUlasan} from '../../actions/UlasanAction';
import {connect} from 'react-redux';
import {animation} from '../../assets/images/animation.json';
import {WaveBlue, WaveBlueKanan} from '../../assets/';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profiles: false,
      menu: dummyMenus,
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      // this.getUserData();
      getData('user').then(res => {
        this.setState({profiles: res});
        this.props.dispatch(getListUlasan(res.uid));
      });
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getUserData = () => {
    getData('user').then(res => {
      this.setState({profiles: res});
    });
  };

  render() {
    const {menu, profiles} = this.state;
    return (
      <SafeAreaView style={styles.page}>
        <ScrollView style={styles.page}>
          <View>
            <View style={styles.backgroundWrapper}>
              <View style={styles.wave}>
                <WaveBlue />
              </View>
              <View style={styles.wave2}>
                <WaveBlueKanan />
              </View>
              <Header title="Profil" type="menu" color={colors.white} />
              <Gap height={30} />
              <View style={styles.profileWrapper}>
                {profiles.photo ? (
                  <View>
                    <Image
                      source={{uri: 'data:image/jpeg;base64,' + profiles.photo}}
                      style={styles.image}
                    />
                  </View>
                ) : (
                  []
                )}
              </View>
              <Gap height={20} />
              <View style={styles.profileWrapper}>
                <Text style={styles.name}>{profiles.fullName}</Text>
                <Text style={styles.profession}>{profiles.profession}</Text>
              </View>
            </View>
            <Gap height={30} />
            <View style={{marginHorizontal: 30, marginTop: -70}}>
              <ListMenu menu={menu} navigation={this.props.navigation} />
            </View>
            <Gap height={30} />
            <Text style={styles.version}>App Version 1.0</Text>
          </View>
          <Gap height={30} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default connect()(Profile);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.grey,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    borderWidth: 6,
    borderColor: colors.white,
  },
  profileWrapper: {
    alignItems: 'center',
  },
  name: {
    fontSize: 30,
    fontFamily: fonts.secondary.medium,
    color: colors.white,
    textTransform: 'capitalize',
  },
  profession: {
    fontSize: 20,
    fontFamily: fonts.secondary.reguler,
    color: colors.white,
    paddingBottom: 80,
  },
  line: {
    marginTop: 10,
    backgroundColor: colors.grey6,
    height: 2,
  },
  version: {
    fontSize: 14,
    fontFamily: fonts.primary.reguler,
    color: colors.grey4,
    marginHorizontal: 30,
  },
  backgroundWrapper: {
    width: '100%',
    backgroundColor: colors.primary,
  },
  backgroundPhoto: {
    height: '100%',
    width: '100%',
  },
  profilesPhoto: {
    width: 170,
    height: 170,
    borderRadius: 170 / 2,
    borderColor: colors.white,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  wave2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
