import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';
import qs from 'query-string';
import AsyncComponent from '../utils/AsyncComponent';

const AppLayout = AsyncComponent({
  name: 'AppLayout',
  resolve: () => import('../layouts/AppLayout'),
});

class AppRoutes extends React.Component {
  componentDidMount = () => {
    const { switchLocale } = this.props;
    const urlObject = qs.parseUrl(window.location.href, { decode: false });
    if (urlObject.query.locale) {
      return switchLocale(urlObject.query.locale);
    } else {
      const ref = document.referrer;
      if (ref.indexOf('/ar/') !== -1) {
        urlObject.query.locale = 'ar';
      } else {
        urlObject.query.locale = 'en';
      }
      return (window.location.href = `${urlObject.url}?${qs.stringify(urlObject.query, {
        encode: false,
      })}`);
    }
  };

  render() {
    const { history, locale, switchLocale, direction } = this.props;
    return (
      <ConnectedRouter history={history}>
        <Switch>
          <Route
            path="/"
            render={props => (
              <AppLayout
                {...props}
                locale={locale}
                switchLocale={switchLocale}
                direction={direction}
                history={history}
              />
            )}
          />
        </Switch>
      </ConnectedRouter>
    );
  }
}
export default AppRoutes;
