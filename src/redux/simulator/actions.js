const simulatorActions = {
  FETCH_COUNTRY_LIST: 'FETCH_COUNTRY_LIST',
  FETCH_COUNTRY_LIST_RECEIVE: 'FETCH_COUNTRY_LIST_RECEIVE',
  FETCH_COUNTRY_LIST_ERROR: 'FETCH_COUNTRY_LIST_ERROR',
  FETCH_POLICY_LIST: 'FETCH_POLICY_LIST',
  FETCH_POLICY_LIST_RECEIVE: 'FETCH_POLICY_LIST_RECEIVE',
  FETCH_POLICY_LIST_ERROR: 'FETCH_POLICY_LIST_ERROR',
  FETCH_PRE_DEFINED_POLICY_LIST: 'FETCH_PRE_DEFINED_POLICY_LIST',
  FETCH_PRE_DEFINED_POLICY_LIST_RECEIVE: 'FETCH_PRE_DEFINED_POLICY_LIST_RECEIVE',
  FETCH_PRE_DEFINED_POLICY_LIST_ERROR: 'FETCH_PRE_DEFINED_POLICY_LIST_ERROR',
  SET_COUNTRY: 'SET_COUNTRY',
  POLICY_APPLY: 'POLICY_APPLY',
  POLICY_APPLY_RECEIVE: 'POLICY_APPLY_RECEIVE',
  POLICY_APPLY_ERROR: 'POLICY_APPLY_ERROR',
  POLICY_REMOVE: 'POLICY_REMOVE',
  POLICY_UPDATE: 'POLICY_UPDATE',
  UPDATE_APPLIED_SCENARIOS: 'UPDATE_APPLIED_SCENARIOS',
  UPDATE_GLOBAL_LOADING: 'UPDATE_GLOBAL_LOADING',
  FETCH_COUNTRY_BAU: 'FETCH_COUNTRY_BAU',
  FETCH_COUNTRY_BAU_RECEIVE: 'FETCH_COUNTRY_BAU_RECEIVE',
  FETCH_COUNTRY_BAU_ERROR: 'FETCH_COUNTRY_BAU_ERROR',
  APPLY_COUNTRY_POLICY_SCENARIO: 'APPLY_COUNTRY_POLICY_SCENARIO',
  APPLY_COUNTRY_POLICY_SCENARIO_RECEIVE: 'APPLY_COUNTRY_POLICY_SCENARIO_RECEIVE',
  APPLY_COUNTRY_POLICY_SCENARIO_ERROR: 'APPLY_COUNTRY_POLICY_SCENARIO_ERROR',
  FETCH_GLOBAL_PARAMETERS: 'FETCH_GLOBAL_PARAMETERS',
  FETCH_GLOBAL_PARAMETERS_RECEIVE: 'FETCH_GLOBAL_PARAMETERS_RECEIVE',
  FETCH_GLOBAL_PARAMETERS_ERROR: 'FETCH_GLOBAL_PARAMETERS_ERROR',
  SAVE_SCENARIO: 'SAVE_SCENARIO',
  SAVE_SCENARIO_RECEIVE: 'SAVE_SCENARIO_RECEIVE',
  SAVE_SCENARIO_ERROR: 'SAVE_SCENARIO_ERROR',
  APPLY_SAVE_SCENARIO_POLICY: 'APPLY_SAVE_SCENARIO_POLICY',
  APPLY_SAVE_SCENARIO_POLICY_RECEIVE: 'APPLY_SAVE_SCENARIO_POLICY_RECEIVE',
  APPLY_SAVE_SCENARIO_POLICY_ERROR: 'APPLY_SAVE_SCENARIO_POLICY_ERROR',
  FETCH_INITIAL_DATA: 'FETCH_INITIAL_DATA',
  FETCH_INITIAL_DATA_RECEIVE: 'FETCH_INITIAL_DATA_RECEIVE',
  FETCH_INITIAL_DATA_ERROR: 'FETCH_INITIAL_DATA_ERROR',
  REAPPLY_COUNTRY_BAU_DATA: 'REAPPLY_COUNTRY_BAU_DATA',
  SAVE_CURRENT_COLOR_SLIDER_VALUE: 'SAVE_CURRENT_COLOR_SLIDER_VALUE',
  SET_PONDERABLE: 'SET_PONDERABLE',
  TEST_SCENARIOS: 'TEST_SCENARIOS',
  TEST_SCENARIOS_RECEIVE: 'TEST_SCENARIOS_RECEIVE',
  TEST_SCENARIOS_ERROR: 'TEST_SCENARIOS_ERROR',
  RESET_SCENARIOS: 'RESET_SCENARIOS',
  COMPARE_SCENARIOS: 'COMPARE_SCENARIOS',
  COMPARE_SCENARIOS_RECEIVE: 'COMPARE_SCENARIOS_RECEIVE',
  COMPARE_SCENARIOS_ERROR: 'COMPARE_SCENARIOS_ERROR',
  RESET_COMPARE_SCENARIO: 'RESET_COMPARE_SCENARIO',
  APPLY_SLIDER_YEAR_POLICY: 'APPLY_SLIDER_YEAR_POLICY',
  APPLY_SLIDER_YEAR_POLICY_RECEIVE: 'APPLY_SLIDER_YEAR_POLICY_RECEIVE',
  APPLY_SLIDER_YEAR_POLICY_ERROR: 'APPLY_SLIDER_YEAR_POLICY_ERROR',
  SAVE_MAP_IMAGE: 'SAVE_MAP_IMAGE',
  SET_SELECTED_YEAR: 'SET_SELECTED_YEAR',
  SHARE_BY_EMAIL: 'SHARE_BY_EMAIL',
  SHARE_BY_EMAIL_RECEIVE: 'SHARE_BY_EMAIL_RECEIVE',
  SHARE_BY_EMAIL_ERROR: 'SHARE_BY_EMAIL_ERROR',
  SET_EMAIL_SEND_STATUS: 'SET_EMAIL_SEND_STATUS',
  APPLY_POLICY_ANIMATION: 'APPLY_POLICY_ANIMATION',
  FETCH_CHART_DATA: 'FETCH_CHART_DATA',
  FETCH_CHART_DATA_RECEIVE: 'FETCH_CHART_DATA_RECEIVE',
  FETCH_CHART_DATA_ERROR: 'FETCH_CHART_DATA_ERROR',
  REAPPLY_COUNTRY_BAU_CHART_DATA: 'REAPPLY_COUNTRY_BAU_CHART_DATA',
  DOWNLOAD_PDF: 'DOWNLOAD_PDF',
  DOWNLOAD_PDF_RECEIVE: 'DOWNLOAD_PDF_RECEIVE',
  DOWNLOAD_PDF_ERROR: 'DOWNLOAD_PDF_ERROR',
  CHANGE_PARAM_DATA: 'CHANGE_PARAM_DATA',
  SET_LOCALE: 'SET_LOCALE',
  SET_HEADER_TAB: 'SET_HEADER_TAB',
  SET_FOOTER_TAB: 'SET_FOOTER_TAB',
  SELECTED_POLICIES_TO_COMPARE: 'SELECTED_POLICIES_TO_COMPARE',
  SET_QUERY_PARAMS: 'SET_QUERY_PARAMS',
  APPLY_SESSION_STORAGE_DATA: 'APPLY_SESSION_STORAGE_DATA',
  CLEAR_UNSAVED_SESSION: 'CLEAR_UNSAVED_SESSION',
  FETCH_USER_DETAILS: 'FETCH_USER_DETAILS',
  FETCH_USER_DETAILS_RECEIVE: 'FETCH_USER_DETAILS_RECEIVE',
  FETCH_USER_DETAILS_ERROR: 'FETCH_USER_DETAILS_ERROR',
  fetchCountries: payload => ({
    type: simulatorActions.FETCH_COUNTRY_LIST,
    payload,
    loading: true,
  }),
  receiveFetchCountries: response => ({
    type: simulatorActions.FETCH_COUNTRY_LIST_RECEIVE,
    ...response,
  }),
  errorFetchCountries: response => ({
    type: simulatorActions.FETCH_COUNTRY_LIST_ERROR,
    ...response,
  }),
  fetchPolicies: () => ({
    type: simulatorActions.FETCH_POLICY_LIST,
    loading: true,
  }),
  receiveFetchPolicies: response => ({
    type: simulatorActions.FETCH_POLICY_LIST_RECEIVE,
    ...response,
  }),
  errorFetchPolicies: response => ({
    type: simulatorActions.FETCH_POLICY_LIST_ERROR,
    ...response,
  }),
  setCountry: country => ({
    type: simulatorActions.SET_COUNTRY,
    country,
  }),
  applyPolicy: payload => ({
    type: simulatorActions.POLICY_APPLY,
    payload,
  }),
  policyApplyReceive: response => ({
    type: simulatorActions.POLICY_APPLY_RECEIVE,
    ...response,
  }),
  policyApplyError: response => ({
    type: simulatorActions.POLICY_APPLY_ERROR,
    ...response,
  }),
  removePolicy: policy => ({
    type: simulatorActions.POLICY_REMOVE,
    policy,
  }),
  updatePolicy: policy => ({
    type: simulatorActions.POLICY_UPDATE,
    policy,
  }),
  fetchPreDefinedPolicies: () => ({
    type: simulatorActions.FETCH_PRE_DEFINED_POLICY_LIST,
    loading: true,
  }),
  receiveFetchPreDefinedPolicies: response => ({
    type: simulatorActions.FETCH_PRE_DEFINED_POLICY_LIST_RECEIVE,
    ...response,
  }),
  errorFetchPreDefinedPolicies: response => ({
    type: simulatorActions.FETCH_PRE_DEFINED_POLICY_LIST_ERROR,
    ...response,
  }),
  updateAppliedScenarios: value => ({
    type: simulatorActions.UPDATE_APPLIED_SCENARIOS,
    value,
  }),
  updateGlobalLoading: value => ({
    type: simulatorActions.UPDATE_GLOBAL_LOADING,
    ...value,
  }),
  fetchCountryBau: payload => ({
    type: simulatorActions.FETCH_COUNTRY_BAU,
    payload,
  }),
  fetchCountryBauReceive: (response, reset) => ({
    type: simulatorActions.FETCH_COUNTRY_BAU_RECEIVE,
    ...response,
    reset,
  }),
  fetchCountryBauError: response => ({
    type: simulatorActions.FETCH_COUNTRY_BAU_ERROR,
    ...response,
  }),
  applyCountryPolicyScenario: payload => ({
    type: simulatorActions.APPLY_COUNTRY_POLICY_SCENARIO,
    payload,
  }),
  applyCountryPolicyScenarioReceive: response => ({
    type: simulatorActions.APPLY_COUNTRY_POLICY_SCENARIO_RECEIVE,
    ...response,
  }),
  applyCountryPolicyScenarioError: response => ({
    type: simulatorActions.APPLY_COUNTRY_POLICY_SCENARIO_ERROR,
    ...response,
  }),
  fetchGlobalParameters: payload => ({
    type: simulatorActions.FETCH_GLOBAL_PARAMETERS,
    loading: true,
    payload,
  }),
  fetchGlobalParametersReceive: response => ({
    type: simulatorActions.FETCH_GLOBAL_PARAMETERS_RECEIVE,
    ...response,
  }),
  fetchGlobalParametersError: response => ({
    type: simulatorActions.FETCH_GLOBAL_PARAMETERS_ERROR,
    ...response,
  }),
  saveScenario: (payload, locale) => ({
    type: simulatorActions.SAVE_SCENARIO,
    ...payload,
    locale,
  }),
  saveScenarioReceive: data => ({
    type: simulatorActions.SAVE_SCENARIO_RECEIVE,
    ...data,
  }),
  saveScenarioError: response => ({
    type: simulatorActions.SAVE_SCENARIO_ERROR,
    ...response,
  }),
  applySaveScenarioPolicy: payload => ({
    type: simulatorActions.APPLY_SAVE_SCENARIO_POLICY,
    ...payload,
  }),
  applySaveScenarioPolicyReceive: response => ({
    type: simulatorActions.APPLY_SAVE_SCENARIO_POLICY_RECEIVE,
    ...response,
  }),
  applySaveScenarioPolicyError: response => ({
    type: simulatorActions.APPLY_SAVE_SCENARIO_POLICY_ERROR,
    ...response,
  }),
  fetchInitialData: (payload, updateCacheData) => ({
    type: simulatorActions.FETCH_INITIAL_DATA,
    loading: true,
    updateCacheData,
    payload,
  }),
  fetchInitialDataReceive: (response, updateCacheData) => ({
    type: simulatorActions.FETCH_INITIAL_DATA_RECEIVE,
    updateCacheData,
    ...response,
  }),
  fetchInitialDataError: response => ({
    type: simulatorActions.FETCH_INITIAL_DATA_ERROR,
    ...response,
  }),
  reApplyCountryBauData: payload => ({
    type: simulatorActions.REAPPLY_COUNTRY_BAU_DATA,
    ...payload,
  }),
  saveCurrentColorSliderValue: value => ({
    type: simulatorActions.SAVE_CURRENT_COLOR_SLIDER_VALUE,
    ...value,
  }),
  setPonderable: selectedPonderable => ({
    type: simulatorActions.SET_PONDERABLE,
    selectedPonderable,
  }),
  testScenarios: payload => ({
    type: simulatorActions.TEST_SCENARIOS,
    ...payload,
  }),
  testScenariosReceive: response => ({
    type: simulatorActions.TEST_SCENARIOS_RECEIVE,
    ...response,
  }),
  testScenariosError: response => ({
    type: simulatorActions.FETCH_COUNTRY_BAU_ERROR,
    ...response,
  }),
  resetScenarios: () => ({
    type: simulatorActions.RESET_SCENARIOS,
  }),
  compareScenarios: payload => ({
    type: simulatorActions.COMPARE_SCENARIOS,
    ...payload,
  }),
  compareScenariosReceive: response => ({
    type: simulatorActions.COMPARE_SCENARIOS_RECEIVE,
    ...response,
  }),
  compareScenariosError: response => ({
    type: simulatorActions.FETCH_COUNTRY_BAU_ERROR,
    ...response,
  }),
  resetCompareScenario: () => ({
    type: simulatorActions.RESET_COMPARE_SCENARIO,
  }),
  applySliderYearPolicy: payload => ({
    type: simulatorActions.APPLY_SLIDER_YEAR_POLICY,
    payload,
  }),
  applySliderYearPolicyReceive: response => ({
    type: simulatorActions.APPLY_SLIDER_YEAR_POLICY_RECEIVE,
    ...response,
  }),
  applySliderYearPolicyError: response => ({
    type: simulatorActions.APPLY_SLIDER_YEAR_POLICY_ERROR,
    ...response,
  }),
  saveMapImage: item => ({
    type: simulatorActions.SAVE_MAP_IMAGE,
    item,
  }),
  setSelectedYear: value => ({
    type: simulatorActions.SET_SELECTED_YEAR,
    value,
  }),
  shareByEmail: (payload, locale) => ({
    type: simulatorActions.SHARE_BY_EMAIL,
    ...payload,
    locale,
  }),
  shareByEmailReceive: response => ({
    type: simulatorActions.SHARE_BY_EMAIL_RECEIVE,
    ...response,
  }),
  shareByEmailError: response => ({
    type: simulatorActions.SHARE_BY_EMAIL_ERROR,
    ...response,
  }),
  setEmailSendStatus: value => ({
    type: simulatorActions.SET_EMAIL_SEND_STATUS,
    value,
  }),
  applyPolicyAnimation: value => ({
    type: simulatorActions.APPLY_POLICY_ANIMATION,
    value,
  }),
  fetchChartData: payload => ({
    type: simulatorActions.FETCH_CHART_DATA,
    payload,
  }),
  fetchChartDataReceive: response => ({
    type: simulatorActions.FETCH_CHART_DATA_RECEIVE,
    ...response,
  }),
  fetchChartDataError: response => ({
    type: simulatorActions.FETCH_CHART_DATA_ERROR,
    ...response,
  }),
  reApplyCountryBauChartData: payload => ({
    type: simulatorActions.REAPPLY_COUNTRY_BAU_CHART_DATA,
    payload,
  }),
  downloadPdf: payload => ({
    type: simulatorActions.DOWNLOAD_PDF,
    payload,
  }),
  downloadPdfReceive: () => ({
    type: simulatorActions.DOWNLOAD_PDF_RECEIVE,
  }),
  downloadPdfError: response => ({
    type: simulatorActions.DOWNLOAD_PDF_ERROR,
    response,
  }),
  changeParamData: payload => ({
    type: simulatorActions.CHANGE_PARAM_DATA,
    payload,
  }),
  setLocale: locale => ({
    type: simulatorActions.SET_LOCALE,
    locale,
  }),
  setHeaderTab: visibleTab => ({
    type: simulatorActions.SET_HEADER_TAB,
    visibleTab,
  }),
  setFooterTab: visibleFooterTab => ({
    type: simulatorActions.SET_FOOTER_TAB,
    visibleFooterTab,
  }),
  setSelectedPolicyToCompared: policies => ({
    type: simulatorActions.SELECTED_POLICIES_TO_COMPARE,
    policies,
  }),
  setQueryParams: queryParams => ({
    type: simulatorActions.SET_QUERY_PARAMS,
    queryParams,
  }),

  applySessionStorageData: sessionData => ({
    type: simulatorActions.APPLY_SESSION_STORAGE_DATA,
    sessionData,
  }),
  clearUnsavedSession: () => ({
    type: simulatorActions.CLEAR_UNSAVED_SESSION,
  }),
  fetchUserDetails: payload => ({
    type: simulatorActions.FETCH_USER_DETAILS,
    payload,
  }),
  fetchUserDetailsReceive: (userDetails, userEncodedStr, unsavedSession, locale) => ({
    type: simulatorActions.FETCH_USER_DETAILS_RECEIVE,
    userDetails,
    userEncodedStr,
    unsavedSession,
    locale,
  }),
  fetchUserDetailsError: response => ({
    type: simulatorActions.FETCH_USER_DETAILS_ERROR,
    ...response,
  }),
};

export default simulatorActions;
