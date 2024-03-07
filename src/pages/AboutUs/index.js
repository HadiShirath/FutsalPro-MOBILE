import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import Header from '../../components/atoms/Header/index';
import {colors} from '../../utils/colors/index';
import Gap from '../../components/atoms/Gap/index';
import {fonts} from '../../utils/fonts/index';
import {Developer, LogoAboutUs, Whatsapp} from '../../assets';

export default class AboutUs extends Component {
  render() {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.page}>
          <Header
            title="Tentang Kami"
            type="page"
            onPress={() => this.props.navigation.goBack()}
          />
          <View style={styles.content}>
            <View>
              <View style={styles.logoWrapper}>
                <Image source={LogoAboutUs} style={styles.logo} />
              </View>
              <Text style={styles.desc}>
                Aplikasi Penyewaan lapangan futsal yang memudahkan pengguna
                dalam memonitor jadwal, memesan jadwal serta memberi kenyamanan
                dalam pembayaran jadwal dengan didukung banyak pilihan metode
                pembayaran di dalam satu aplikasi
              </Text>
              <Gap height={30} />
              <Text style={styles.developer}>Pengembang Aplikasi</Text>
              <View style={styles.biodataDeveloper}>
                <Image source={Developer} style={styles.images} />
                <View style={styles.bioWrapper}>
                  <Text style={styles.name}>Hadi Shirath Maulana</Text>
                  <Text style={styles.profession}>Mobile Developer</Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Whatsapp')}>
                  <Image source={Whatsapp} style={styles.whatsapp} />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={styles.version}>
                Copyright © {new Date().getFullYear()} - FutsalPro
              </Text>
              <Text style={styles.version}>App Version 1.0</Text>
            </View>
          </View>
        </View>
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
    paddingHorizontal: 35,
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: 45,
    marginBottom: 20,
  },
  logo: {
    width: 179,
    height: 200,
  },
  desc: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: fonts.primary.reguler,
    color: colors.dark,
  },
  developer: {
    fontSize: 14,
    fontFamily: fonts.primary.medium,
    color: colors.dark,
  },
  images: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    borderWidth: 1,
    borderColor: colors.grey1,
  },
  biodataDeveloper: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bioWrapper: {
    flex: 1,
  },
  name: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
  },
  profession: {
    marginLeft: 15,
    fontSize: 14,
    fontFamily: fonts.primary.reguler,
    color: colors.dark,
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fonts.primary.reguler,
    color: colors.grey4,
  },
  whatsapp: {
    width: 45,
    height: 45,
  },
});
