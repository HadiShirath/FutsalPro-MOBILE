import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  Platform,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {Component} from 'react';
import Header from '../../components/atoms/Header/index';
import {colors} from '../../utils/colors/index';
import {IconEdit, IconCancel} from '../../assets';
import Button from '../../components/atoms/Button/index';
import {fonts} from '../../utils/fonts/index';
import {avatars} from '../../data/avatars/index';
import {connect} from 'react-redux';
import {getData} from '../../utils/localStorage';
import {updatePhoto, getDefaultPhoto} from '../../actions/ProfileAction';
import ImagePicker from 'react-native-image-crop-picker';
import {showError} from '../../utils/showMessage/index';

class UploadPhoto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profiles: false,
      uid: '',
      photo: '',
      defaultPhoto: '',
      changePhoto: false,
    };
  }

  componentDidMount() {
    getData('user').then(res => {
      this.setState({
        profiles: res,
      });
    });
    this.props.dispatch(getDefaultPhoto(Math.floor(Math.random() * 16)));
  }

  componentDidUpdate(prevProps) {
    const {defaultPhotoResult, updatePhotoResult} = this.props;

    if (
      defaultPhotoResult &&
      prevProps.defaultPhotoResult !== defaultPhotoResult
    ) {
      this.setState({
        photo: defaultPhotoResult,
        defaultPhoto: defaultPhotoResult,
      });
    }
    if (
      updatePhotoResult &&
      prevProps.updatePhotoResult !== updatePhotoResult
    ) {
      this.props.navigation.replace('MainApp');
    }
  }

  getImage = () => {
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
          changePhoto: true,
        });
      })
      .catch(error => {
        if (error.code === 'E_PICKER_CANCELLED') {
          return showError('Oops, Anda Belum Memilih Foto');
        }
      });
  };

  onSubmit = () => {
    const {profiles, photo, defaultPhoto} = this.state;

    if (photo) {
      this.props.dispatch(updatePhoto(profiles.uid, defaultPhoto, photo));
    } else {
      this.props.dispatch(updatePhoto(profiles.uid, defaultPhoto));
    }
  };

  render() {
    const {profiles, photo, defaultPhoto, changePhoto} = this.state;
    const {defaultPhotoResult, defaultPhotoLoading, updatePhotoLoading} =
      this.props;

    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.page}>
          <Header title="Upload Photo" />
          <View style={styles.content}>
            <View style={styles.biodata}>
              <View style={styles.imageWrapper}>
                {defaultPhotoResult ? (
                  <Image
                    source={
                      photo
                        ? {uri: 'data:image/jpeg;base64,' + photo}
                        : {uri: 'data:image/jpeg;base64,' + defaultPhoto}
                    }
                    style={styles.image}
                  />
                ) : defaultPhotoLoading ? (
                  <View>
                    <ActivityIndicator size={60} color={colors.grey6} />
                  </View>
                ) : (
                  []
                )}

                <View style={styles.icon}>
                  {changePhoto ? (
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({photo: false, changePhoto: false})
                      }>
                      <IconCancel />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={this.getImage}>
                      <IconEdit />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <Text style={styles.name}>{profiles.fullName}</Text>
              <Text style={styles.profession}>{profiles.profession}</Text>
            </View>
            <View>
              {changePhoto ? (
                <Button
                  label="Selanjutnya"
                  onPress={this.onSubmit}
                  loading={updatePhotoLoading}
                />
              ) : (
                <Button
                  label="Selanjutnya"
                  disabled
                  color={colors.grey6}
                  textColor={colors.grey4}
                  onPress={this.onSubmit}
                  loading={updatePhotoLoading}
                />
              )}

              <Text style={styles.skip} onPress={this.onSubmit}>
                Lewati
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStatetoProps = state => ({
  defaultPhotoResult: state.ProfileReducer.defaultPhotoResult,
  defaultPhotoLoading: state.ProfileReducer.defaultPhotoLoading,
  updatePhotoResult: state.ProfileReducer.updatePhotoResult,
  updatePhotoLoading: state.ProfileReducer.updatePhotoLoading,
});

export default connect(mapStatetoProps, null)(UploadPhoto);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 40,
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: 40,
  },
  biodata: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  imageWrapper: {
    width: 230,
    height: 230,
    borderRadius: 230 / 2,
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
  name: {
    marginTop: 20,
    fontSize: 23,
    color: colors.dark,
    fontFamily: fonts.primary.medium,
  },
  profession: {
    marginTop: 5,
    fontSize: 18,
    color: colors.grey4,
    fontFamily: fonts.primary.reguler,
  },
  skip: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 18,
    color: colors.dark,
    fontFamily: fonts.primary.medium,
  },
});
