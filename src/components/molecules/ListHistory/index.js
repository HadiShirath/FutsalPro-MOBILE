import {
  Text,
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {colors} from '../../../utils/colors/index';
import {IllustrationEmpty, IconAddSmall} from '../../../assets';
import CardHistory from '../../atoms/CardHistory/index';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Button from '../../atoms/Button/index';
import Gap from '../../atoms/Gap/index';
import {fonts} from '../../../utils/fonts/index';

class ListHistory extends Component {
  pageLoader = () => {
    const views = [];

    for (let i = 0; i < 10; i++) {
      views.push(
        <View style={styles.loading} key={i}>
          <SkeletonPlaceholder borderRadius={10} backgroundColor={colors.grey8}>
            <View style={styles.loaderPage} />
          </SkeletonPlaceholder>
        </View>,
      );
    }

    return views;
  };

  render() {
    const {
      uid,
      fullName,
      alamat,
      email,
      listHistoryResult,
      listHistoryLoading,
      addUlasanResult,
      addUlasanLoading,
      navigation,
      status,
    } = this.props;

    const dataUser = {
      fullName: fullName,
      alamat: alamat,
      email: email,
    };

    var dataBaru;

    if (status === 'semua') {
      dataBaru = listHistoryResult ? {...listHistoryResult} : [];
    } else {
      dataBaru = listHistoryResult
        ? listHistoryResult.filter(filter => filter.status === status)
        : [];
    }

    const colorStatus =
      status === 'pending'
        ? colors.orange
        : status === 'lunas'
        ? colors.green
        : status === 'gagal'
        ? colors.red
        : colors.primary;

    return (
      <View>
        <Gap height={20} />
        {dataBaru.length !== 0 ? (
          Object.keys(dataBaru).map((pesanan, index) => {
            return (
              <CardHistory
                key={index}
                data={dataBaru[pesanan]}
                tanggal={pesanan}
                orderId={pesanan}
                uid={uid}
                dataUser={dataUser}
                navigation={navigation}
              />
            );
          })
        ) : listHistoryLoading ? (
          <View>{this.pageLoader()}</View>
        ) : (
          <View style={styles.empty}>
            <Image source={IllustrationEmpty} />
            {status !== 'semua' ? (
              <Text style={styles.emptyText}>
                Data Riwayat Status{' '}
                <Text style={{textTransform: 'capitalize', color: colorStatus}}>
                  {status}
                </Text>{' '}
                Tidak Tersedia
              </Text>
            ) : (
              <>
                <Text style={styles.emptyText}>
                  Data Riwayat Tidak Tersedia
                </Text>
                <Gap height={12} />
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: colors.orange,
                    alignItems: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 15,
                  }}
                  onPress={() => navigation.navigate('Lapangan')}>
                  <IconAddSmall />
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: fonts.secondary.medium,
                      color: colors.white,
                      marginLeft: 10,
                    }}>
                    Pesan Jadwal
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    );
  }
}

const mapStatetoProps = state => ({
  listHistoryResult: state.HistoryReducer.listHistoryResult,
  listHistoryLoading: state.HistoryReducer.listHistoryLoading,

  addUlasanResult: state.UlasanReducer.addUlasanResult,
  addUlasanLoading: state.UlasanReducer.addUlasanLoading,
});

export default connect(mapStatetoProps)(ListHistory);

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  emptyText: {
    fontSize: 17,
    maxWidth: '60%',
    textAlign: 'center',
    color: colors.grey4,
  },
  loading: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  loaderPage: {
    width: '100%',
    height: 120,
  },
});
