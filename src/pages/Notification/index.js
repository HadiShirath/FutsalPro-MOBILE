import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {Component} from 'react';
import Header from '../../components/atoms/Header/index';
import {colors} from '../../utils/colors/index';
import {fonts} from '../../utils/fonts/index';
import Gap from '../../components/atoms/Gap/index';
import ListNotification from '../../components/molecules/ListNotification/index';
import {connect} from 'react-redux';
import {getData} from '../../utils/localStorage';
import {getListNotification} from '../../actions/NotificationAction';

class Notification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'waitings',
      uid: '',
      refreshing: false,
    };
  }

  listTab = ['waitings', 'all'];

  componentDidMount() {
    getData('user').then(res => {
      this.props.dispatch(getListNotification(res.uid));
      this.setState({uid: res.uid});
    });
  }

  labelNew = item => {
    const {listNotificationResult} = this.props;

    if (item === 'waitings') {
      return listNotificationResult[item] &&
        Object.values(listNotificationResult[item]).length !== 0 ? (
        <View
          style={{
            backgroundColor: colors.red,
            width: 10,
            height: 10,
            borderRadius: 10 / 2,
            alignItems: 'center',
            justifyContent: 'center',
            top: -6,
          }}
        />
      ) : (
        []
      );
    } else {
      return listNotificationResult[item] &&
        Object.values(listNotificationResult[item]).filter(item => item.unread)
          .length !== 0 ? (
        <View
          style={{
            backgroundColor: colors.red,
            width: 10,
            height: 10,
            borderRadius: 10 / 2,
            alignItems: 'center',
            justifyContent: 'center',
            top: -6,
          }}
        />
      ) : (
        []
      );
    }
  };

  onRefresh = () => {
    const {uid} = this.state;

    this.setState({refreshing: true});
    setTimeout(() => {
      this.props.dispatch(getListNotification(uid));
      this.setState({refreshing: false});
    }, 500);
  };

  render() {
    const {status} = this.state;
    const {navigation} = this.props;

    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.page}>
          <View style={styles.header}>
            <Header
              title="Notifikasi"
              type="page"
              onPress={() => this.props.navigation.goBack()}
            />

            <View style={styles.wrapperMenu}>
              {this.listTab.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.buttonMenu,
                      status === item && styles.btnActive,
                    ]}
                    onPress={() => this.setState({status: item})}>
                    <Text
                      style={[
                        styles.textMenu,
                        status === item && styles.textActive,
                      ]}>
                      {item === 'waitings' ? 'Menunggu Pembayaran' : 'Semua'}
                    </Text>
                    {this.labelNew(item)}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <ScrollView
            style={styles.content}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }>
            <Text style={styles.textTitle}>
              {status === 'waitings'
                ? 'Menunggu Pembayaran'
                : 'Semua Notifikasi'}
            </Text>
            <Gap height={20} />
            <ListNotification {...this.state} navigation={navigation} />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
const mapStatetoProps = state => ({
  listNotificationResult: state.NotificationReducer.listNotificationResult,
});

export default connect(mapStatetoProps, null)(Notification);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.grey,
  },
  wrapperMenu: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  buttonMenu: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.grey,
    borderRadius: 30,
    marginRight: 10,
    alignItems: 'center',
  },
  textMenu: {
    fontSize: 14,
    fontFamily: fonts.secondary.medium,
    color: colors.dark,
    marginRight: 6,
  },
  content: {
    paddingTop: 20,
    backgroundColor: colors.grey,
  },
  textTitle: {
    paddingHorizontal: 20,
    fontSize: 18,
    fontFamily: fonts.secondary.medium,
    color: colors.primary,
  },
  btnActive: {
    backgroundColor: colors.orangeSoft,
  },
  textActive: {
    color: colors.dark,
  },
  header: {
    backgroundColor: colors.white,
    borderBottomWidth: 2,
    borderColor: colors.orangeSoft,
  },
});
