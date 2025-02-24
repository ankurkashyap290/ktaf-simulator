import React from 'react';
import { Provider } from 'react-redux';
import { LocaleProvider } from 'antd';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import DirectionProvider, { DIRECTIONS } from 'react-with-direction/dist/DirectionProvider';
import AppRoutes from './routes';
import AppLocaleProvider from './locales/AppLocaleProvider';
import AppLocale from './locales';
import { defaultLocale } from './configs/app.config';
import { store, history } from './redux';

class App extends React.Component {
  static contextTypes = {
    direction: PropTypes.string,
  };

  state = {
    locale: defaultLocale,
    /* eslint react/no-unused-state:0 */
    switchLocale: (locale, cb) => {
      this.setState({ locale }, () => {
        cb && cb();
      });
    },
  };

  getCurrentLanguage = () => {
    const { locale } = this.state;
    const tempLocale = 'en';
    if (locale === 'ar' || locale === 'en') {
      return AppLocale[locale];
    } else {
      return AppLocale[tempLocale];
    }
  };

  render() {
    const { locale, switchLocale } = this.state;
    return (
      <DirectionProvider direction={locale === 'ar' ? DIRECTIONS.RTL : DIRECTIONS.LTR}>
        <AppLocaleProvider.Provider value={this.state}>
          <LocaleProvider locale={this.getCurrentLanguage().antd}>
            <IntlProvider
              locale={this.getCurrentLanguage().locale}
              messages={this.getCurrentLanguage().messages}
            >
              <Provider store={store}>
                <AppRoutes
                  history={history}
                  locale={locale}
                  switchLocale={switchLocale}
                  direction={locale === 'ar' ? DIRECTIONS.RTL : DIRECTIONS.LTR}
                />
              </Provider>
            </IntlProvider>
          </LocaleProvider>
        </AppLocaleProvider.Provider>
      </DirectionProvider>
    );
  }
}

export default App;
