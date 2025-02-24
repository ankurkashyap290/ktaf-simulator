import React, { Component } from 'react';
import Joyride from 'react-joyride';
import { joyRideLocaleAr, joyRideLocaleEn } from '../../configs/app.config';

class HelpTour extends Component {
  handleCloseJoyRide = () => {
    window.joyHelper.skip();
  };

  setHelpers = helpers => {
    window.joyHelper = helpers;
    window.joyHelper.close = this.handleCloseJoyRide;
  };

  render() {
    const { tourProgress, steps, onJoyrideCallback, locale } = this.props;
    return (
      <div>
        <Joyride
          callback={onJoyrideCallback}
          continuous
          getHelpers={this.setHelpers}
          run={tourProgress}
          scrollToFirstStep
          showProgress
          showSkipButton
          disableCloseOnEsc
          disableScrollParentFix
          steps={steps}
          styles={{
            options: {
              arrowColor: '#61a24f',
              backgroundColor: '#e1e1e1',
              primaryColor: '#61a24f',
              zIndex: 1000,
            },
          }}
          locale={locale === 'ar' ? joyRideLocaleAr : joyRideLocaleEn}
        />
      </div>
    );
  }
}

export default HelpTour;
