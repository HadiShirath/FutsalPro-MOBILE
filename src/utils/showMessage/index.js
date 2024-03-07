import React from 'react';
import {showMessage} from 'react-native-flash-message';
import {Image} from 'react-native';
import {IconCancel2, IconSuccess} from '../../assets/';

export const showError = message => {
  showMessage({
    message: message,
    // description: message,
    icon: props => <Image source={IconCancel2} {...props} />,
    type: 'danger',
  });
};

export const showSuccess = message => {
  showMessage({
    message: message,
    icon: props => <Image source={IconSuccess} {...props} />,
    type: 'success',
  });
};
