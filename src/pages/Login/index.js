import {
  Text,
  StyleSheet,
  StatusBar,
  View,
  SafeAreaView,
  Alert,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import React, {Component} from 'react';
import {colors} from '../../utils/colors/index';
import {LogoText} from '../../assets/images';
import {fonts} from '../../utils/fonts/index';
import {Input} from '../../components';
import Gap from '../../components/atoms/Gap/index';
import Button from '../../components/atoms/Button/index';
import {connect} from 'react-redux';
import {loginUser} from '../../actions/AuthAction';
import {LoginBg, LogoColor} from '../../assets';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  login = () => {
    const {email, password} = this.state;
    if (email && password) {
      this.props.dispatch(loginUser(email, password));
    } else {
      Alert.alert('Perhatian', 'Email dan Password harus diisi');
    }
  };

  componentDidUpdate(prevProps) {
    const {loginResult} = this.props;
    if (loginResult && prevProps.loginResult !== loginResult) {
      this.props.navigation.navigate('MainApp');
    }
  }

  render() {
    const {email, password} = this.state;
    const {loginLoading} = this.props;

    return (
      <SafeAreaView style={styles.page}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
          <ImageBackground source={LoginBg} style={styles.page}>
            <View style={styles.content}>
              <Gap height={130} />
              <View>
                <View style={styles.header}>
                  <Image
                    source={LogoColor}
                    style={{width: 45, height: 45, marginBottom: 10}}
                  />
                  <LogoText />
                  <Text style={styles.label}>Welcome Back!</Text>
                </View>
                <View>
                  <Input
                    label="Email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChangeText={email => this.setState({email})}
                  />
                  <Gap height={20} />
                  <Input
                    label="Password"
                    placeholder="*******"
                    value={password}
                    onChangeText={password => this.setState({password})}
                    secureTextEntry
                    hidePassword
                  />
                </View>
              </View>
              <View style={styles.buttonWrapper}>
                <Button
                  label="Masuk"
                  onPress={this.login}
                  loading={loginLoading}
                />
                <Gap height={10} />
                <Text style={styles.link}>
                  Belum punya akun?{' '}
                  <Text
                    style={styles.daftar}
                    onPress={() => {
                      this.props.navigation.replace('Register1');
                    }}>
                    Daftar
                  </Text>
                </Text>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStatetoProps = state => ({
  loginResult: state.AuthReducer.loginResult,
  loginLoading: state.AuthReducer.loginLoading,
});

export default connect(mapStatetoProps, null)(Login);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    paddingHorizontal: 40,
    paddingVertical: 50,
    justifyContent: 'space-between',
    flex: 1,
  },
  header: {
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.primary.bold,
    color: colors.primary,
    fontSize: 29,
    marginBottom: 15,
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
  buttonWrapper: {
    marginTop: 40,
  },
});
