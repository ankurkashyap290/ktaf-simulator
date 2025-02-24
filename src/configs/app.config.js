const siteConfig = {
  siteName: 'Simulator',
  siteIcon: 'ion-flash',
  runWithMockServer: false,
  gtmId: '',
  tokenSalt: 'kapsarc',
  copyrightYear: 2019,
};

const themeConfig = {
  sider: {
    '@msa-layout-sider-background': '#011529',
    '@msa-layout-sider-menu-background': '#011529',
    '@msa-layout-sider-submenu-background': '#011529',
  },
  header: {
    '@msa-layout-header-background': '#011529',
  },
  logo: {
    '@msa-header-logo-background': '#011529',
  },
};

const exceptions = {
  403: {
    img: '/images/wZcnGqRDyhPOEYFcZDnb.svg',
    title: '403',
    desc: 'Sorry, you do not have permission to access this page',
  },
  404: {
    img: '/images/KpnpchXsobRgLElEozzI.svg',
    title: '404',
    desc: 'Sorry, the page you visited does not exist',
  },
  500: {
    img: '/images/RVRUAYdCGeYNBWoKiIwB.svg',
    title: '500',
    desc: 'Sorry, some issue in server',
  },
  100: {
    img: '/images/RVRUAYdCGeYNBWoKiIwB.svg',
    title: '500',
    desc: 'To Be Done',
  },
};

const newEntities = {};

const apiUrl = () => {
  // return 'http://51.144.53.230:8080';
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'https://as-weu-test-ktaf.azurewebsites.net';
    default:
      return 'https://as-weu-test-ktaf.azurewebsites.net';
  }
  // return 'http://192.168.4.20:8181';
  // return 'http://localhost:8181';
};

const API_VERSION = 'v1/';

const defaultSelectedCountry = 'sau';

const maxYear = 2030;
const minYear = 2010;

const locales = {
  ar: 'Ar',
  en: 'En',
};

const helpSteps = {
  imageEn: '/images/help_modal/helpModalEn.png',
  imageAr: '/images/help_modal/helpModalAr.png',
  content: ['helpModal.content1', 'helpModal.content2', 'helpModal.content3'],
  doczEN:
    'https://www.kapsarc.org/research/publications/estimating-freight-transport-activity-using-nighttime-lights-satellite-data-in-china-india-and-saudi-arabia/',
  doczAR:
    'https://www.kapsarc.org/ar/research/publications/estimating-freight-transport-activity-using-nighttime-lights-satellite-data-in-china-india-and-saudi-arabia/',
};

const localeMessages = {
  choroplethMap_en: 'Choropleth map of',
  choroplethMap_ar: 'خريطه ل',
  choroplethYear_en: 'Choropleth Year',
  choroplethYear_ar: 'عام',
  ponderable_en: 'Ponderable',
  ponderable_ar: 'قابل للقياس',
  scenarionSavedSuccess_en: 'Scenario saved successfully',
  scenarionSavedSuccess_ar: 'تم حفظ السيناريو بنجاح',
  emailSentSuccess_en: 'Email sent successfully',
  emailSentSuccess_ar: 'تم إرسال البريد الإلكتروني بنجاح',
  emailSentError_en: 'Failed to send email',
  emailSentError_ar: 'فشل إرسال البريد الإلكتروني',
  policyName_en: 'Policy Name',
  policyName_ar: 'اسم السياسة',
  year_en: 'Year',
  year_ar: 'عام',
  percentage_en: 'Percentage',
  percentage_ar: 'النسبة المئوية',
  value_en: 'Value',
  value_ar: 'القيمة',
  region_en: 'Region',
  region_ar: 'منطقة',
  graphCarouselCardTitle_en: 'Scenario analysis of',
  graphCarouselCardTitle_ar: 'تحليل السيناريو',
  ponderableZone_en: 'Zone',
  ponderableZone_ar: 'منطقة',
  ponderableMode_en: 'Mode',
  ponderableMode_ar: 'النقل وسيلة',
  ponderableTechnology_en: 'Technology',
  ponderableTechnology_ar: 'تقنية',
  ponderableSector_en: 'Sector',
  ponderableSector_ar: 'قطاع',
  baseLine_en: 'Baseline',
  baseLine_ar: 'خط الأساس',
};

const joyRideLocaleEn = { back: 'Back', close: 'Close', last: 'Last', next: 'Next', skip: 'Skip' };
const joyRideLocaleAr = {
  back: 'عودة',
  close: 'أغلق',
  last: 'أخر',
  next: 'التالى',
  skip: 'تخطى',
};

const REDIRECT_URL = 'https://test.kapsarc.org/sign-in/?ref=ktaf';

module.exports = {
  defaultLocale: 'en',
  siteConfig,
  exceptions,
  themeConfig,
  newEntities,
  apiUrl,
  API_VERSION,
  defaultSelectedCountry,
  maxYear,
  minYear,
  locales,
  helpSteps,
  localeMessages,
  joyRideLocaleAr,
  joyRideLocaleEn,
  REDIRECT_URL,
};
