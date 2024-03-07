import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import React, {Component} from 'react';
import {colors} from '../../utils/colors/index';
import {LogoText} from '../../assets';
import {fonts} from '../../utils/fonts/index';
import {Input, Button, Gap} from '../../components/';
import {connect} from 'react-redux';
import {registerUser} from '../../actions/AuthAction';

class Register2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      noHp: '',
      address: '',
      profession: '',
    };
  }

  componentDidUpdate(prevProps) {
    const {registerResult} = this.props;
    if (registerResult && prevProps.registerResult !== registerResult) {
      this.setState({
        username: '',
        noHp: '',
        address: '',
        profession: '',
      });
      this.props.navigation.navigate('UploadPhoto');
    }
  }

  onContinue = () => {
    const {username, noHp, address, profession} = this.state;
    if ((username, noHp, address, profession)) {
      if (username.length < 8) {
        const data = {
          fullName: this.props.route.params.fullName,
          email: this.props.route.params.email,
          username: username,
          noHp: noHp,
          address: address,
          profession: profession,
        };
        this.props.dispatch(
          registerUser(data, this.props.route.params.password),
        );
      } else {
        Alert.alert('Perhatian', 'Username maksimal 7 karakter');
      }
    } else {
      Alert.alert(
        'Perhatian',
        'Nama Panggilan, No. HP, Alamat dan Profesi harus diisi',
      );
    }
  };

  render() {
    const {username, noHp, address, profession} = this.state;
    const {registerLoading} = this.props;

    return (
      <SafeAreaView style={styles.page}>
        <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Gap height={45} />
            <View style={styles.header}>
              <LogoText />
              <Gap height={10} />
              <Text style={styles.label}>Daftar Akun</Text>
              <Gap height={30} />
              <View style={styles.wrapperIndicator}>
                <View style={styles.indicator} />
                <View style={styles.indicatorActive} />
              </View>
            </View>
            <View>
              <Input
                label="Nama Panggilan"
                placeholder="Maks. 7 Karakter"
                value={username}
                onChangeText={username => this.setState({username})}
              />
              <Gap height={20} />
              <Input
                label="No. Hp / Whatsapp"
                placeholder="08xxxxxxxxx"
                keyboardType="number-pad"
                value={noHp}
                onChangeText={noHp => this.setState({noHp})}
              />
              <Gap height={20} />
              <Input
                label="Alamat"
                placeholder="Jln Syiah Kuala, Banda Aceh"
                value={address}
                onChangeText={address => this.setState({address})}
              />
              <Gap height={20} />
              <Input
                label="Profesi"
                placeholder="Misal : Mahasiswa"
                value={profession}
                onChangeText={profession => this.setState({profession})}
              />
              <Gap height={30} />
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                label="Kembali"
                onPress={() => this.props.navigation.goBack()}
                color={colors.secondary}
                textColor={colors.primary}
              />
              <View style={styles.daftarAkun}>
                <Button
                  label="Daftar Akun"
                  onPress={this.onContinue}
                  loading={registerLoading}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStatetoProps = state => ({
  registerResult: state.AuthReducer.registerResult,
  registerLoading: state.AuthReducer.registerLoading,
});

export default connect(mapStatetoProps, null)(Register2);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  wrapperIndicator: {
    flexDirection: 'row',
  },
  indicator: {
    height: 4,
    width: 35,
    backgroundColor: colors.grey1,
    borderRadius: 5,
  },
  indicatorActive: {
    height: 4,
    width: 35,
    backgroundColor: colors.primary,
    borderRadius: 5,
    marginLeft: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  label: {
    fontSize: 25,
    fontFamily: fonts.primary.medium,
    color: colors.primary,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    fontSize: 15,
    textAlign: 'center',
    color: colors.black,
  },
  daftar: {
    fontFamily: fonts.primary.medium,
    color: colors.primary,
  },
  daftarAkun: {
    flex: 1,
    marginLeft: 20,
  },
});
