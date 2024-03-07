import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {Component} from 'react';
import {colors} from '../../../utils/colors/index';
import Gap from '../Gap/index';
import {connect} from 'react-redux';
import {
  saveKeywordField,
  getFieldsByCategory,
} from '../../../actions/FieldAction';
import {
  IconSearch,
  IconFavorite,
  IconNotification,
  IconCart,
} from '../../../assets';
import {getData} from '../../../utils/localStorage';
import {getListKeranjang} from '../../../actions/KeranjangAction';
import {getListNotification} from '../../../actions/NotificationAction';

class HeaderHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      getData('user').then(res => {
        const uid = res.uid;
        this.props.dispatch(getListKeranjang(uid));
        this.props.dispatch(getListNotification(uid));
      });
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  selesaiCari = () => {
    const {search} = this.state;
    const {navigation} = this.props;

    this.setState({
      search: '',
    });
    this.props.dispatch(saveKeywordField(search));
    this.props.dispatch(getFieldsByCategory(''));
    navigation.navigate('Lapangan');
  };

  render() {
    const {search} = this.state;
    const {listKeranjangResult, listNotificationResult} = this.props;

    let totalNotification;
    if (listNotificationResult) {
      const itemWaitings = 'waitings';
      const itemAll = 'all';
      const warningNotification = listNotificationResult[itemWaitings]
        ? Object.values(listNotificationResult[itemWaitings]).length
        : 0;
      const allNotification = listNotificationResult[itemAll]
        ? Object.values(listNotificationResult[itemAll]).filter(
            item => item.unread,
          ).length
        : 0;

      totalNotification = warningNotification + allNotification;
    }

    let totalKeranjang;
    if (listKeranjangResult) {
      totalKeranjang = Object.keys(listKeranjangResult.pesanans).length;
    }

    return (
      <SafeAreaView>
        <View style={styles.page}>
          <View style={styles.searchBarWrapper}>
            <IconSearch />

            <TextInput
              style={styles.searchBar}
              placeholder="Cari Lapangan"
              value={search}
              onChangeText={search => this.setState({search})}
              onSubmitEditing={this.selesaiCari}
            />
          </View>
          <Gap width={10} />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => this.props.navigation.navigate('Favorite')}>
            <IconFavorite />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => this.props.navigation.navigate('Notification')}>
            <IconNotification />
            {totalNotification ? (
              <View style={styles.numberNotification}>
                <Text style={styles.numberText}>{totalNotification}</Text>
              </View>
            ) : (
              []
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconCart}
            onPress={() => this.props.navigation.navigate('Keranjang')}>
            <IconCart />
            {totalKeranjang ? (
              <View style={styles.number}>
                <Text style={styles.numberText}>{totalKeranjang}</Text>
              </View>
            ) : (
              []
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStatetoProps = state => ({
  listNotificationResult: state.NotificationReducer.listNotificationResult,
  listKeranjangResult: state.KeranjangReducer.listKeranjangResult,
});

export default connect(mapStatetoProps, null)(HeaderHome);

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    paddingVertical: 15,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.grey7,
    borderRadius: 18,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    paddingHorizontal: 12,
    alignItems: 'center',
    flex: 1,
  },
  searchBar: {
    flex: 1,
    marginLeft: 5,
  },
  icon: {
    paddingHorizontal: 10,
  },
  iconCart: {
    paddingLeft: 10,
    paddingRight: 3,
  },
  number: {
    position: 'absolute',
    top: -5,
    right: 0,
    backgroundColor: colors.red,
    width: 16,
    height: 16,
    borderRadius: 18 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberNotification: {
    position: 'absolute',
    top: -5,
    right: 6,
    backgroundColor: colors.red,
    width: 16,
    height: 16,
    borderRadius: 16 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: colors.white,
    fontSize: 10,
  },
});
