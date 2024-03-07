import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
  Modal,
  Text,
  Animated,
  Dimensions,
} from 'react-native';
import React, {Component} from 'react';
import {colors} from '../../utils/colors/index';
import Header from '../../components/atoms/Header/index';
import {IconEdit, avatar8} from '../../assets';
import Input from '../../components/atoms/Input/index';
import Gap from '../../components/atoms/Gap/index';
import Button from '../../components/atoms/Button/index';
import {getData} from '../../utils/localStorage';
import {updateProfile} from '../../actions/ProfileAction';
import {connect} from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import {showError} from '../../utils/showMessage/index';
import {fonts} from '../../utils/fonts/index';
import {IconCancelDark, IconDelete, IconChangePhoto} from '../../assets';

class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: '',
      fullName: '',
      email: '',
      username: '',
      noHp: '',
      address: '',
      profession: '',
      photo: '',
      defaultPhoto: '',
      isModalVisible: false,
      scaleValue: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  componentDidUpdate(prevProps) {
    const {updateProfileResult} = this.props;
    if (
      updateProfileResult &&
      prevProps.updateProfileResult !== updateProfileResult
    ) {
      this.props.navigation.navigate('MainApp');
    }
  }

  handlePresentModalPress = () => {
    this.bottomSheetModalRef.current?.present();
  };

  getUserData = () => {
    getData('user').then(res => {
      const data = res;

      this.setState({
        uid: data.uid,
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        noHp: data.noHp,
        address: data.address,
        profession: data.profession,
        photo: data.photo,
        defaultPhoto: data.defaultPhoto,
      });
    });
  };

  onSubmit = () => {
    const {fullName, email, username, noHp, address, profession} = this.state;
    if (fullName && email && username && noHp && address && profession) {
      this.props.dispatch(updateProfile(this.state));
    } else {
      Alert.alert(
        'Perhatian',
        'Nama Lengkap, email, Nama Panggilan, No. Hp, Alamat, Profesi harus diisi',
      );
    }
  };

  toggleModal = () => {
    const {isModalVisible, scaleValue} = this.state;

    if (!isModalVisible) {
      this.setState({isModalVisible: !isModalVisible});
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      this.setState({
        isModalVisible: !isModalVisible,
        scaleValue: new Animated.Value(0),
      });
    }
  };

  getImage = () => {
    const {isModalVisible} = this.state;
    this.setState({
      isModalVisible: !isModalVisible,
      scaleValue: new Animated.Value(0),
    });

    ImagePicker.openPicker({
      quality: 1,
      width: 400,
      height: 400,
      cropping: true,
      includeBase64: true,
    })
      .then(image => {
        //Mengubah avatar
        this.setState({
          photo: image.data,
        });
      })
      .catch(error => {
        if (error.code === 'E_PICKER_CANCELLED') {
          return showError('Oops, Anda Belum Memilih Foto');
        }
      });
  };

  render() {
    const {
      fullName,
      email,
      username,
      noHp,
      address,
      profession,
      photo,
      isModalVisible,
      scaleValue,
      defaultPhoto,
    } = this.state;
    const {updateProfileLoading} = this.props;

    return (
      <SafeAreaView style={styles.page}>
        <ScrollView style={styles.page}>
          <Header
            title="Edit profile"
            type="page"
            onPress={() => this.props.navigation.goBack()}
          />

          <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
              this.setState({isModalVisible: !isModalVisible});
            }}>
            <View style={styles.centeredView}>
              <Animated.View
                style={[styles.modal, {transform: [{scale: scaleValue}]}]}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.titleModal}>Ganti Foto Profil</Text>
                  <TouchableOpacity
                    style={styles.cancel}
                    onPress={() => this.toggleModal()}>
                    <IconCancelDark />
                  </TouchableOpacity>
                </View>
                <Gap height={5} />
                <View style={{height: 2, backgroundColor: colors.grey6}} />
                <Gap height={15} />

                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={() => {
                    this.toggleModal();
                    this.setState({photo: defaultPhoto});
                  }}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 40 / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.redSoft,
                    }}>
                    <View style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}>
                      <IconDelete />
                    </View>
                  </View>
                  <Text
                    style={{fontSize: 16, marginLeft: 10, color: colors.grey5}}>
                    Hapus Foto
                  </Text>
                </TouchableOpacity>
                <Gap height={10} />
                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center'}}
                  onPress={this.getImage}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 40 / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.secondary,
                    }}>
                    <IconChangePhoto />
                  </View>
                  <Text
                    style={{
                      fontSize: 16,
                      marginLeft: 10,
                      color: colors.grey5,
                    }}>
                    Foto Dari Galeri
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Modal>

          <View style={styles.content}>
            <View style={styles.containerImage}>
              <View style={styles.imageWrapper}>
                {photo ? (
                  <Image
                    source={{uri: 'data:image/jpeg;base64,' + photo}}
                    style={styles.image}
                  />
                ) : (
                  []
                )}
                <TouchableOpacity
                  onPress={this.toggleModal}
                  style={styles.icon}>
                  <IconEdit />
                </TouchableOpacity>
              </View>
            </View>
            <Gap height={35} />
            <Input
              label="Nama Lengkap"
              value={fullName}
              onChangeText={fullName => this.setState({fullName})}
            />
            <Gap height={25} />
            <Input label="Email" value={email} disabled />
            <Gap height={25} />
            <Input
              label="Nama Panggilan"
              value={username}
              onChangeText={username => this.setState({username})}
            />
            <Gap height={25} />
            <Input
              label="No. Hp / Whatsapp"
              value={noHp}
              onChangeText={noHp => this.setState({noHp})}
            />
            <Gap height={25} />
            <Input
              label="Alamat"
              value={address}
              onChangeText={address => this.setState({address})}
            />
            <Gap height={25} />
            <Input
              label="Profesi"
              value={profession}
              onChangeText={profession => this.setState({profession})}
            />
            <Gap height={50} />
            <Button
              label="Submit"
              icon
              onPress={this.onSubmit}
              loading={updateProfileLoading}
            />
            <Gap height={40} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStatetoProps = state => ({
  updateProfileResult: state.ProfileReducer.updateProfileResult,
  updateProfileLoading: state.ProfileReducer.updateProfileLoading,
});

export default connect(mapStatetoProps, null)(EditProfile);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 35,
  },
  containerImage: {
    alignItems: 'center',
  },
  imageWrapper: {
    width: 240,
    height: 240,
    borderRadius: 240 / 2,
    borderWidth: 2,
    borderColor: colors.grey1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
  },
  centeredView: {
    flex: 1,
    paddingHorizontal: 60,
    justifyContent: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.6)',
  },
  modal: {
    backgroundColor: colors.white,
    paddingHorizontal: 40,
    paddingVertical: 30,
    borderRadius: 30,
  },
  titleModal: {
    fontSize: 18,
    fontFamily: fonts.primary.medium,
    color: colors.dark,
  },
  cancel: {
    position: 'absolute',
    right: -10,
    top: -5,
    transform: [{scaleX: 1.2}, {scaleY: 1.2}],
  },
});
