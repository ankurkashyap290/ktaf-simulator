import React from 'react';

const AppLocaleProvider = React.createContext({
  locale: null,
  switchLanguage: () => {},
});

export default AppLocaleProvider;
