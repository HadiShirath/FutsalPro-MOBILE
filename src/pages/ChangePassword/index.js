import {StyleSheet, View, SafeAreaView, Alert, ScrollView} from 'react-native';
import React, {Component} from 'react';
import Header from '../../components/atoms/Header/index';
import Gap from '../../components/atoms/Gap/index';
import Input from '../../components/atoms/Input/index';
import Button from '../../components/atoms/Button/index';
import {colors} from '../../utils/colors/index';
import {getData} from '../../utils/localStorage';
import {connect} from 'react-redux';
import {changePassword} from '../../actions/ProfileAction';

class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      newPassword: '',
      newPasswordConfirmation: '',
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    const {changePasswordResult} = this.props;

    if (
      changePasswordResult &&
      prevProps.changePasswordResult !== changePasswordResult
    ) {
      this.props.navigation.navigate('MainApp');
    }
  }

  updatePassword = () => {
    const {password, newPassword, newPasswordConfirmation} = this.state;

    if (newPassword !== newPasswordConfirmation) {
      Alert.alert(
        'Perhatian',
        'Password Baru dan Konfirmasi Password Baru harus sama',
      );
    } else if (password && newPassword && newPasswordConfirmation) {
      //ambil data email dari data user
      getData('user').then(res => {
        const parameter = {
          email: res.email,
          password: password,
          newPassword: newPassword,
        };
        this.props.dispatch(changePassword(parameter));
      });
    } else {
      Alert.alert(
        'Perhatian',
        'Password, Password Baru dan Konfirmasi Password Baru harus diisi',
      );
    }
  };

  render() {
    const {password, newPassword, newPasswordConfirmation} = this.state;
    const {changePasswordLoading} = this.props;

    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.page}>
          <Header
            title="Ganti Password"
            type="page"
            onPress={() => this.props.navigation.goBack()}
          />
          <View style={styles.content}>
            <View>
              <Input
                label="Password Lama"
                placeholder="* * * * * * * *"
                value={password}
                onChangeText={password => this.setState({password})}
                secureTextEntry
                hidePassword
              />
              <Gap height={20} />
              <Input
                label="Password Baru"
                placeholder="* * * * * * * *"
                value={newPassword}
                onChangeText={newPassword => this.setState({newPassword})}
                secureTextEntry
                hidePassword
              />
              <Gap height={20} />
              <Input
                label="Konfirmasi Password Baru"
                placeholder="* * * * * * * *"
                value={newPasswordConfirmation}
                onChangeText={newPasswordConfirmation =>
                  this.setState({newPasswordConfirmation})
                }
                secureTextEntry
                hidePassword
              />
            </View>
            <Button
              label="Update Password"
              icon
              onPress={this.updatePassword}
              loading={changePasswordLoading}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStatetoProps = state => ({
  changePasswordResult: state.ProfileReducer.changePasswordResult,
  changePasswordLoading: state.ProfileReducer.changePasswordLoading,
});

export default connect(mapStatetoProps, null)(ChangePassword);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 30,
    flex: 1,
    justifyContent: 'space-between',
  },
});
