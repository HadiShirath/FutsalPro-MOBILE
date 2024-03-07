import {StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native';
import React, {Component} from 'react';
import {colors} from '../../../utils/colors/index';
import {connect} from 'react-redux';
import {IllustrationEmpty} from '../../../assets';
import CardNotification from '../../atoms/CardNotification/index';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

class ListNotification extends Component {
  pageLoader = () => {
    const views = [];

    for (let i = 0; i < 10; i++) {
      views.push(
        <View style={styles.loading} key={i}>
          <SkeletonPlaceholder borderRadius={15} backgroundColor={colors.grey8}>
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
      status,
      listNotificationResult,
      listNotificationLoading,
      navigation,
    } = this.props;

    const data =
      listNotificationResult && listNotificationResult[status]
        ? Object.keys(listNotificationResult[status]).map(
            key => listNotificationResult[status][key],
          )
        : [];

    const dataNotification = data.reverse();

    return (
      <View style={{paddingBottom: 40}}>
        {listNotificationResult[status] ? (
          dataNotification.map((item, index) => {
            return (
              <CardNotification
                key={index}
                data={item}
                uid={uid}
                status={status}
                navigation={navigation}
              />
            );
          })
        ) : listNotificationLoading ? (
          <View>{this.pageLoader()}</View>
        ) : (
          <View style={styles.empty}>
            <Image source={IllustrationEmpty} />
            <Text style={styles.emptyText}>
              {status === 'waitings'
                ? 'Menunggu Pembayaran'
                : 'Informasi Notifikasi'}{' '}
              Kosong
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const mapStatetoProps = state => ({
  listNotificationResult: state.NotificationReducer.listNotificationResult,
  listNotificationLoading: state.NotificationReducer.listNotificationLoading,
});

export default connect(mapStatetoProps, null)(ListNotification);

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 17,
    maxWidth: '60%',
    textAlign: 'center',
    color: colors.grey4,
  },
  loading: {
    paddingHorizontal: 20,
  },
  loaderPage: {
    width: '100%',
    height: 120,
    marginBottom: 20,
  },
});
