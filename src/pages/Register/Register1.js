import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  Alert,
} from 'react-native';
import React, {Component} from 'react';
import {colors} from '../../utils/colors/index';
import {LogoText} from '../../assets';
import {fonts} from '../../utils/fonts/index';
import {Input, Button, Gap} from '../../components/';

export default class Register1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fullName: '',
      email: '',
      password: '',
      hidePassword: 'hide',
    };
  }

  register1 = () => {
    const {fullName, email, password} = this.state;
    if (fullName && email && password) {
      this.props.navigation.navigate('Register2', this.state);
    } else {
      Alert.alert('Gagal', 'Nama Lengkap, Email dan Password harus di isi');
    }
  };

  render() {
    const {fullName, email, password} = this.state;
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
                <View style={styles.indicatorActive} />
                <View style={styles.indicator} />
              </View>
            </View>
            <View>
              <Input
                label="Nama Lengkap"
                placeholder="Nama Lengkap Kamu"
                value={fullName}
                onChangeText={fullName => this.setState({fullName})}
              />
              <Gap height={20} />
              <Input
                label="Email"
                placeholder="example@gmail.com"
                value={email}
                onChangeText={email => this.setState({email})}
              />
              <Gap height={20} />
              <Input
                label="Password"
                placeholder="Min. 8 Karakter"
                value={password}
                onChangeText={password => this.setState({password})}
                secureTextEntry
                hidePassword
              />
              <Gap height={30} />
            </View>
            <View>
              <Button label="Selanjutnya" onPress={this.register1} />
              <Gap height={10} />
              <Text style={styles.link}>
                Sudah punya akun?{' '}
                <Text
                  style={styles.daftar}
                  onPress={() => {
                    this.props.navigation.navigate('Login');
                  }}>
                  Masuk
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

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
  indicatorActive: {
    height: 4,
    width: 35,
    backgroundColor: colors.primary,
    borderRadius: 5,
    marginRight: 10,
  },
  indicator: {
    height: 4,
    width: 35,
    backgroundColor: colors.grey1,
    borderRadius: 5,
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
  link: {
    fontSize: 15,
    textAlign: 'center',
    color: colors.black,
  },
  daftar: {
    fontFamily: fonts.primary.medium,
    color: colors.primary,
  },
});
