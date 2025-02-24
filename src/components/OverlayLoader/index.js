import React from 'react';
import IntlMessages from '../Misc/intlMessages';
import styles from './index.module.less';

class OverlayLoader extends React.Component {
  render() {
    const { loading, fullWidth } = this.props;
    return loading ? (
      <div className={fullWidth ? styles.FullWidthLoading : styles.loading}>
        <IntlMessages id="global.loading" />
        &#8230;
      </div>
    ) : (
      ''
    );
  }
}
export default OverlayLoader;
