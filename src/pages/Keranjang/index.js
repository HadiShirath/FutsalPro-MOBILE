import {Text, StyleSheet, View, ScrollView, SafeAreaView} from 'react-native';
import React, {Component} from 'react';
import Header from '../../components/atoms/Header/index';
import {colors} from '../../utils/colors/index';
import {fonts} from '../../utils/fonts/index';
import ListKeranjang from '../../components/molecules/ListKeranjang/index';
import Button from '../../components/atoms/Button/index';
import Gap from '../../components/atoms/Gap/index';
import {numberWithCommas} from '../../utils/numberFormat/index';
import {connect} from 'react-redux';
import {getData} from '../../utils/localStorage';
import {getListKeranjang} from '../../actions/KeranjangAction';
import {updatePesanan} from '../../actions/PesananAction';
import {snapTransactions} from '../../actions/PaymentAction';

class Keranjang extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: '',
      username: '',
      photo: '',
      email: '',
      noHp: '',
      order_id: '',
    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      getData('user').then(res => {
        this.props.dispatch(getListKeranjang(res.uid));
        this.setState({
          uid: res.uid,
          username: res.username,
          photo: res.photo,
          email: res.email,
          noHp: res.noHp,
          order_id: `FSL-${new Date().getTime()}-${res.uid}`,
        });
      });
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  componentDidUpdate(prevProps) {
    const {order_id} = this.state;
    const {deleteKeranjangResult, updatePesananResult, snapTransactionsResult} =
      this.props;

    if (
      deleteKeranjangResult &&
      prevProps.deleteKeranjangResult !== deleteKeranjangResult
    ) {
      getData('user').then(res => {
        this.props.dispatch(getListKeranjang(res.uid));
      });
    }

    if (
      snapTransactionsResult &&
      prevProps.snapTransactionsResult !== snapTransactionsResult
    ) {
      const param = {
        url: snapTransactionsResult.redirect_url,
        order_id: order_id,
      };

      this.props.navigation.navigate('MainApp');
      this.props.navigation.navigate('Midtrans', param);
    }
  }

  onSubmit = () => {
    const {username, email, noHp, order_id} = this.state;
    const {listKeranjangResult} = this.props;

    const dataMidtrans = {
      transaction_details: {
        order_id: order_id,
        gross_amount: listKeranjangResult.totalHarga,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: username,
        email: email,
        phone: noHp,
      },
    };

    this.props.dispatch(snapTransactions(dataMidtrans));
  };

  render() {
    const {listKeranjangResult, updatePesananLoading} = this.props;

    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.page}>
          <View style={styles.content}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Header
                title="Keranjang"
                type="page"
                onPress={() => this.props.navigation.navigate('MainApp')}
              />
              <Gap height={10} />
              <View style={styles.desc}>
                <Text style={styles.pesanan}>Pesanan Anda</Text>
              </View>
              <ListKeranjang {...this.props} />
            </ScrollView>
            <View style={styles.contentPrice}>
              <View style={styles.priceWrapper}>
                <Text style={styles.harga}>Total Harga</Text>
                <Text style={styles.hargaNumber}>
                  Rp.{' '}
                  {listKeranjangResult
                    ? numberWithCommas(listKeranjangResult.totalHarga)
                    : '-'}
                </Text>
              </View>
              <View style={{flex: 1}}>
                {listKeranjangResult ? (
                  <Button
                    label="Bayar"
                    icons="Money"
                    color={colors.orangeSoft}
                    textColor={colors.dark}
                    padding={15}
                    fontSize={20}
                    onPress={this.onSubmit}
                    loading={updatePesananLoading}
                  />
                ) : (
                  <Button
                    label="Bayar"
                    icons="MoneyDisabled"
                    color={colors.grey6}
                    textColor={colors.grey4}
                    fontSize={20}
                    padding={15}
                    loading={updatePesananLoading}
                    disabled
                  />
                )}
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStatetoProps = state => ({
  listKeranjangResult: state.KeranjangReducer.listKeranjangResult,
  listKeranjangLoading: state.KeranjangReducer.listKeranjangLoading,

  deleteKeranjangResult: state.KeranjangReducer.deleteKeranjangResult,

  updatePesananResult: state.PesananReducer.updatePesananResult,
  updatePesananLoading: state.PesananReducer.updatePesananLoading,

  snapTransactionsLoading: state.PaymentReducer.snapTransactionsLoading,
  snapTransactionsResult: state.PaymentReducer.snapTransactionsResult,
});

export default connect(mapStatetoProps, null)(Keranjang);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  pesanan: {
    fontFamily: fonts.primary.reguler,
    fontSize: 16,
    color: colors.grey4,
  },
  desc: {
    paddingHorizontal: 30,
    flexDirection: 'row',
  },
  contentPrice: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    paddingTop: 25,
    borderTopWidth: 1.5,
    borderTopColor: colors.grey6,
  },
  harga: {
    fontSize: 17.5,
    fontFamily: fonts.primary.reguler,
    color: colors.dark,
  },
  hargaNumber: {
    fontSize: 20,
    fontFamily: fonts.primary.medium,
    color: colors.orange,
  },
  priceWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
});
