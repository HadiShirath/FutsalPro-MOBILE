import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Modal,
  Text,
  Animated,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import Header from '../../components/atoms/Header/index';
import {colors} from '../../utils/colors/index';
import {fonts} from '../../utils/fonts/index';
import {connect} from 'react-redux';
import {getListHistory} from '../../actions/HistoryAction';
import {getData} from '../../utils/localStorage';
import ListHistory from '../../components/molecules/ListHistory/index';
import Gap from '../../components/atoms/Gap/index';
import LottieView from 'lottie-react-native';
import {BgFutsalPro} from '../../assets/';

class History extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: '',
      fullName: '',
      alamat: '',
      email: '',
      isSuccesReminderVisible: false,
      isSuccesUlasanVisible: false,
      isDeleteVisible: false,
      scaleValue: new Animated.Value(0),
      refreshing: false,
      status: 'semua',
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      getData('user').then(res => {
        this.props.dispatch(getListHistory(res.uid));

        this.setState({
          uid: res.uid,
          fullName: res.fullName,
          alamat: res.address,
          email: res.email,
        });
      });
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  componentDidUpdate(prevProps) {
    const {uid} = this.state;
    const {
      alarmsResult,
      deleteAlarmResult,
      addUlasanResult,
      cancelPesananResult,
    } = this.props;

    if (alarmsResult && prevProps.alarmsResult !== alarmsResult) {
      this.props.dispatch(getListHistory(uid));

      this.setState({
        isSuccesReminderVisible: true,
      });

      setTimeout(() => {
        this.setState({
          isSuccesReminderVisible: false,
        });
      }, 1200);
    }
    if (addUlasanResult && prevProps.addUlasanResult !== addUlasanResult) {
      this.props.dispatch(getListHistory(uid));

      this.setState({
        isSuccesUlasanVisible: true,
      });

      setTimeout(() => {
        this.setState({
          isSuccesUlasanVisible: false,
        });

        this.props.navigation.replace('MainApp');
        this.props.navigation.navigate('Ulasan');
      }, 1200);
    }
    if (
      deleteAlarmResult &&
      prevProps.deleteAlarmResult !== deleteAlarmResult
    ) {
      this.props.dispatch(getListHistory(uid));

      this.setState({
        isDeleteVisible: true,
      });

      setTimeout(() => {
        this.setState({
          isDeleteVisible: false,
        });
      }, 1200);
    }
    if (
      cancelPesananResult &&
      prevProps.cancelPesananResult !== cancelPesananResult
    ) {
      this.props.dispatch(getListHistory(uid));
    }
  }

  modalSuccess = (visible, title, desc) => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          this.setState({visible: !visible});
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modal]}>
            <View>
              <Gap height={10} />
              <View style={{alignItems: 'center'}}>
                <LottieView
                  source={require('../../assets/images/animationSuccess.json')}
                  style={{width: 150, height: 150}}
                  autoPlay
                />
                <Text style={{fontSize: 16}}>{title}</Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: fonts.secondary.medium,
                    color: colors.dark,
                    paddingHorizontal: 30,
                  }}>
                  {desc}
                </Text>

                <Gap height={10} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  onRefresh = () => {
    const {uid} = this.state;

    this.setState({refreshing: true});
    setTimeout(() => {
      this.setState({refreshing: false});
      this.props.dispatch(getListHistory(uid));
    }, 500);
  };

  render() {
    const {
      isSuccesUlasanVisible,
      isSuccesReminderVisible,
      isDeleteVisible,
      status,
    } = this.state;
    const {navigation} = this.props;

    const listTab = ['semua', 'pending', 'lunas', 'gagal'];
    const colorStatus =
      status === 'pending'
        ? colors.orange
        : status === 'lunas'
        ? colors.green
        : status === 'gagal'
        ? colors.red
        : colors.primary;

    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.page}>
          {this.modalSuccess(
            isSuccesReminderVisible,
            'Pesan Pengingat',
            'Berhasil Ditambahkan',
          )}
          {this.modalSuccess(
            isSuccesUlasanVisible,
            'Jadwal Selesai',
            'Berhasil Diselesaikan',
          )}

          <Modal
            animationType="fade"
            transparent={true}
            visible={isDeleteVisible}
            onRequestClose={() => {
              this.setState({isDeleteVisible: !isDeleteVisible});
            }}>
            <View style={styles.centeredView}>
              <View style={[styles.modal]}>
                <View>
                  <Gap height={10} />
                  <View style={{alignItems: 'center'}}>
                    <LottieView
                      source={require('../../assets/images/animationDelete.json')}
                      style={{width: 150, height: 150}}
                      autoPlay
                    />
                    <Gap height={30} />
                    <Text style={{fontSize: 16}}>Pesan Pengingat</Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: fonts.secondary.medium,
                        color: colors.dark,
                        paddingHorizontal: 40,
                      }}>
                      Berhasil Dihapus
                    </Text>

                    <Gap height={10} />
                  </View>
                </View>
              </View>
            </View>
          </Modal>
          <View style={styles.content}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }>
              <View
                style={{
                  backgroundColor: colors.primary,
                  height: 120,
                }}>
                <Text
                  style={{
                    // textAlign: 'center',
                    marginLeft: 20,
                    fontSize: 23,
                    color: colors.white,
                    marginTop: 40,
                    fontFamily: fonts.primary.medium,
                    zIndex: 1,
                  }}>
                  Riwayat
                </Text>

                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    zIndex: 0,
                  }}>
                  <BgFutsalPro />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-between',
                  paddingHorizontal: 35,
                  paddingVertical: 20,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  marginTop: -20,
                  backgroundColor: colors.white,
                }}>
                {listTab.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => this.setState({status: item})}>
                      <Text
                        style={[
                          styles.textMenu,
                          status === item && styles.textActive(colorStatus),
                        ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <ListHistory {...this.state} navigation={navigation} />
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  alarmsResult: state.AlarmReducer.alarmsResult,
  deleteAlarmResult: state.AlarmReducer.deleteAlarmResult,

  addUlasanResult: state.UlasanReducer.addUlasanResult,
  cancelPesananResult: state.PesananReducer.cancelPesananResult,
});

export default connect(mapStateToProps, null)(History);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.grey7,
  },
  content: {
    flexDirection: 'row',
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
  textMenu: {
    fontSize: 16.5,
    fontFamily: fonts.secondary.medium,
    color: colors.grey6,
    textTransform: 'capitalize',
  },
  textActive: colorStatus => ({
    color: colorStatus,
  }),
});
