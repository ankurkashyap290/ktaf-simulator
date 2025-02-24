import antd from 'antd/lib/locale-provider/en_US';
import data from 'react-intl/locale-data/en';
import global from './global.json';
import appHeader from './appHeader.json';
import simulator from './simulator.json';
import creatPdf from './createPdf.json';
import policiesCollapse from './policiesCollapse.json';
import saveScenario from './saveScenario.json';
import shareByEmail from './shareByEmail.json';
import helpModal from './helpModal.json';
import headerTabs from './headerTabs.json';
import footerTabs from './footerTabs.json';

const EnLanguage = {
  messages: {
    ...global,
    ...appHeader,
    ...simulator,
    ...creatPdf,
    ...policiesCollapse,
    ...saveScenario,
    ...shareByEmail,
    ...helpModal,
    ...headerTabs,
    ...footerTabs,
  },
  antd,
  locale: 'en-US',
  data,
};
export default EnLanguage;
