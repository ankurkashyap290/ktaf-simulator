import antd from 'antd/lib/locale-provider/ar_EG';
import data from 'react-intl/locale-data/ar.js';
import global from './global.json';
import appHeader from './appHeader.json';
import simulator from './simulator.json';
import createPdf from './createPdf.json';
import policiesCollapse from './policiesCollapse.json';
import saveScenario from './saveScenario.json';
import shareByEmail from './shareByEmail.json';
import helpModal from './helpModal.json';
import headerTabs from './headerTabs.json';
import footerTabs from './footerTabs.json';

const ArLanguage = {
  messages: {
    ...global,
    ...appHeader,
    ...simulator,
    ...createPdf,
    ...policiesCollapse,
    ...saveScenario,
    ...shareByEmail,
    ...helpModal,
    ...footerTabs,
    ...headerTabs,
  },
  antd,
  locale: 'ar-EG',
  data,
};
export default ArLanguage;
