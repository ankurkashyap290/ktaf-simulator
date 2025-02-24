import { addLocaleData } from 'react-intl';
import EnLanguage from './en-US';
import ArLanguage from './ar-EG';

const AppLocale = {
  en: EnLanguage,
  ar: ArLanguage,
};
addLocaleData(AppLocale.en.data);
addLocaleData(AppLocale.ar.data);

export default AppLocale;
