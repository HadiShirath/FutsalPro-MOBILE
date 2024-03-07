import {Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import {updatePesanan} from '../../actions/PesananAction';
import {colors} from '../../utils/colors/index';

class Midtrans extends Component {
  componentDidMount() {
    if (this.props.route.params.order_id) {
      this.props.dispatch(updatePesanan(this.props.route.params));
    }
  }

  onMessage = event => {
    if (event.nativeEvent.data === 'Selesai') {
      this.props.navigation.replace('MainApp');
    }
  };

  render() {
    const {updatePesananLoading} = this.props;

    return (
      <>
        {updatePesananLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <WebView
            source={{uri: this.props.route.params.url}}
            style={styles.content}
            onMessage={event => this.onMessage(event)}
          />
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  loading: {
    flex: 1,
    marginTop: 10,
    marginBottom: 50,
  },
});

const mapStatetoProps = state => ({
  updatePesananLoading: state.PesananReducer.updatePesananLoading,
});

export default connect(mapStatetoProps, null)(Midtrans);
