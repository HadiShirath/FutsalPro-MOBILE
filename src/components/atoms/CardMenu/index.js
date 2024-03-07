import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Animated,
} from 'react-native';
import React, {Component} from 'react';
import {IconNextDark} from '../../../assets';
import {colors} from '../../../utils/colors/index';
import {fonts} from '../../../utils/fonts/index';
import {clearStorage} from '../../../utils/localStorage/index';
import {signOut} from 'firebase/auth';
import {auth} from '../../../config/Firebase/index';
import {connect} from 'react-redux';
import Gap from '../Gap/index';
import Button from '../Button/index';

class CardMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ulasanLength: [],
      isCancelModalVisible: false,
      scaleValue: new Animated.Value(0),
    };
  }

  componentDidUpdate(prevProps) {
    const {listUlasanResult} = this.props;
    if (listUlasanResult && prevProps.listUlasanResult !== listUlasanResult) {
      this.setState({
        ulasanLength: listUlasanResult.waitings
          ? Object.keys(listUlasanResult.waitings)
          : [],
      });
    }
  }

  navigateHalaman = () => {
    const {menu, navigation} = this.props;
    if (menu.halaman === 'Login') {
      this.toggleModalCancel();
    } else {
      navigation.navigate(menu.halaman);
    }
  };

  logOut = () => {
    const {navigation} = this.props;

    signOut(auth)
      .then(() => {
        // Sign-out successful.
        this.toggleModalCancel();
        clearStorage();
        navigation.replace('Login');
      })
      .catch(error => {
        // An error happened.
        Alert.alert('Error', error);
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
    const {ulasanLength, isCancelModalVisible} = this.state;
    const {menu} = this.props;

    return (
      <>
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
                <View
                  style={{
                    paddingHorizontal: 70,
                    paddingTop: 10,
                    paddingBottom: 8,
                  }}>
                  <Text
                    style={{
                      color: colors.dark,
                      fontSize: 25,
                      fontFamily: fonts.secondary.medium,
                      textAlign: 'center',
                    }}>
                    Keluar Akun
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
                    label="Iya, Keluar"
                    fontSize={15}
                    padding={13}
                    color={colors.red}
                    onPress={() => this.logOut()}
                  />
                </View>
              </View>

              <Gap height={10} />
            </Animated.View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.wrapper}
          onPress={() => this.navigateHalaman()}>
          {menu.gambar}
          <View style={styles.content}>
            <Text style={styles.name}>{menu.nama}</Text>
            {menu.nama === 'Ulasan' && ulasanLength.length !== 0 ? (
              <View style={styles.ulasanWrapper}>
                <Text style={styles.textUlasan}>{ulasanLength.length}</Text>
              </View>
            ) : (
              []
            )}
          </View>
          {menu.nama !== 'Keluar' ? <IconNextDark /> : []}
        </TouchableOpacity>
      </>
    );
  }
}

const mapStatetoProps = state => ({
  listUlasanResult: state.UlasanReducer.listUlasanResult,
});

export default connect(mapStatetoProps, null)(CardMenu);

const styles = StyleSheet.create({
  wrapper: {
    padding: 21,
    borderRadius: 15,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: colors.grey2,
    marginTop: 15,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontFamily: fonts.primary.regular,
    marginLeft: 16,
    color: colors.dark,
  },
  ulasanWrapper: {
    backgroundColor: colors.red,
    width: 20,
    height: 20,
    position: 'absolute',
    right: 20,
    borderRadius: 20 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textUlasan: {
    color: colors.white,
    fontFamily: fonts.primary.medium,
    fontSize: 14,
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
});
