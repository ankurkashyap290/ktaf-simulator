import React from 'react';
// eslint-disable-next-line import/newline-after-import

import HelpModalEn from './HelpModalEn';
import HelpModalAr from './HelpModalAr';

class ModalSteps extends React.Component {
  render() {
    const { locale } = this.props;

    return (
      <React.Fragment>
        {locale === 'ar' ? <HelpModalAr {...this.props} /> : <HelpModalEn {...this.props} />}
      </React.Fragment>
    );
  }
}

export default ModalSteps;
