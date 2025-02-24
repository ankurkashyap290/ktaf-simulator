import { Map } from 'immutable';
import actions from './actions';
import { minYear } from '../../configs/app.config';
import {
  getDefaultSelectedParams,
  updateGlobalParamsStatus,
  getCountryBauMinYear,
  getDefaultPonderable,
  filterPonderables,
} from '../../utils';

// eslint-disable-next-line func-names
const getPolicyMinYear = function(appliedPolicies) {
  const tempAppliedPolicy = [...appliedPolicies];
  let tempSelectedYear = minYear;
  if (tempAppliedPolicy.length > 1) {
    tempAppliedPolicy.sort((a, b) => (a.year > b.year ? 1 : b.year > a.year ? -1 : 0));
    tempSelectedYear = tempAppliedPolicy[0].year;
  } else if (tempAppliedPolicy.length === 1) {
    tempSelectedYear = tempAppliedPolicy[0].year;
  }
  return tempSelectedYear;
};
// eslint-disable-next-line func-names
const updatePolicyName = function(appliedPolicies, policies, transformPolicy, isSaved) {
  transformPolicy = transformPolicy || false;
  isSaved = isSaved || false;
  return appliedPolicies.map(item => {
    if (transformPolicy && item.policyId) {
      item.policy = item.policyId;
      item.policyGroup = item.policyGroupId;
      item.sliderValue = item.percentageImplementation;
      delete item.policyId;
      delete item.policyGroupId;
      delete item.percentageImplementation;
    }
    if (isSaved) {
      item.isSaved = true;
    }

    const policyGroup = policies.find(policy => policy.id === item.policyGroup);
    const policy = policyGroup.policies.find(item2 => item2.id === item.policy);
    item.policyName = policy.policyName;
    return item;
  });
};
// eslint-disable-next-line func-names
const fillSavedScenariosFromUserDetails = function(savedScenarios, countryId, policies) {
  return (
    savedScenarios
      // .filter(scenario => scenario.countryId === countryId)
      .map(scenario => {
        scenario.appliedPolicies = updatePolicyName(scenario.appliedPolicies, policies, true, true);
        if (scenario.scenarioName) {
          scenario.name = scenario.scenarioName;
          delete scenario.scenarioName;
        }
        return scenario;
      })
  );
};

const initState = new Map({
  loading: false,
  countries: [],
  policies: [],
  selectedCountry: null,
  appliedPolicies: [],
  preDefinedPolicies: [],
  appliedScenarios: null,
  globalLoading: false,
  countryMapBau: [],
  globalParameters: {},
  savedScenarios: [],
  isSaveScenarioApplied: false,
  appliedScenario: '',
  initialDataLoaded: false,
  bauForCountry: null,
  mapData: [],
  appliedPolicyRequest: false,
  appliedPolicyMode: '',
  countryChartBau: [],
  currentColorSliderValue: [10, 230],
  selectedPonderable: '',
  compareChartData: [],
  compareScenariosData: [],
  selectedYear: minYear,
  minYear,
  mapImage: '',
  emailSend: false,
  appliedPolicyAnimation: false,
  selectedParams: {
    zoneId: null,
    sectorId: null,
    modeId: null,
    technologyId: null,
  },
  defaultGlobalParameters: [],
  changeParamValue: {},
  locale: 'en',
  updateCacheData: false,
  isComparedScenario: false,
  testScenario: true,
  visibleTab: 'home',
  visibleFooterTab: '',
  userDetails: null,
  userEncodedStr: '',
  selectedPoliciesToCompare: [],
  queryParams: '',
  isLoginRedirect: false,
});

export function simulatorReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_COUNTRY_LIST:
      return state.set('loading', action.loading).set('error', null);

    case actions.FETCH_COUNTRY_LIST_RECEIVE:
      return state
        .set('loading', false)
        .set('countries', [...action.data])
        .set('selectedCountry', { ...action.data[0] })
        .set('error', null);
    case actions.FETCH_COUNTRY_LIST_ERROR:
      return state.set('loading', false).set('error', action.error);

    case actions.FETCH_POLICY_LIST:
      return state.set('loading', action.loading).set('error', null);
    case actions.FETCH_POLICY_LIST_RECEIVE:
      return state
        .set('loading', false)
        .set('policies', [...action.data])
        .set('error', null);
    case actions.FETCH_POLICY_LIST_ERROR:
      return state.set('loading', false).set('error', action.error);
    case actions.SET_COUNTRY:
      return state.set('selectedCountry', action.country).set('selectedYear', minYear);
    case actions.POLICY_APPLY:
      return state
        .set('globalLoading', true)
        .set('appliedPolicyRequest', true)
        .set('appliedPolicyMode', action.payload.mode)
        .set('visibleTab', 'tools');
    case actions.POLICY_APPLY_RECEIVE: {
      let appliedPolicies = [...state.get('appliedPolicies')];
      const appliedScenario = state.get('appliedScenario');
      if (action.mode === 'remove') {
        const appliedPolicy = appliedPolicies.findIndex(
          item =>
            item.policyGroup === action.policy.policyGroup && item.policy === action.policy.policy
        );
        if (appliedPolicy >= 0) {
          appliedPolicies.splice(appliedPolicy, 1);
        }
      } else {
        if (appliedScenario) {
          appliedPolicies = [];
        }
        const appliedPolicy = appliedPolicies.findIndex(
          item =>
            item.policyGroup === action.policy.policyGroup && item.policy === action.policy.policy
        );
        if (appliedPolicy >= 0) {
          appliedPolicies[appliedPolicy] = { ...action.policy };
        } else {
          appliedPolicies.push(action.policy);
        }
      }
      const mapData = [...state.get('mapData')];
      if (appliedPolicies.length) {
        mapData.push(action.data);
      }
      const tempSelectedYear = getPolicyMinYear(appliedPolicies);
      let newState = state
        .set('globalLoading', false)
        .set('appliedPolicyRequest', false)
        .set('appliedPolicies', [...appliedPolicies])
        .set('appliedScenario', '')
        .set('appliedPolicyAnimation', false)
        .set('selectedYear', tempSelectedYear)
        .set('minYear', tempSelectedYear)
        .set('visibleFooterTab', '');
      if (appliedPolicies.length) {
        newState = newState.set('mapData', [...mapData]);
      } else {
        const tempMinYear =
          getCountryBauMinYear(state.get('countryMapBau'), state.get('selectedCountry').id) ||
          minYear;
        newState = newState
          .set('mapData', [])
          .set('selectedYear', tempMinYear)
          .set('minYear', tempMinYear);
      }
      return newState;
    }

    case actions.POLICY_APPLY_ERROR:
      return state
        .set('globalLoading', false)
        .set('appliedPolicyRequest', false)
        .set('error', action.error);
    case actions.FETCH_PRE_DEFINED_POLICY_LIST:
      return state.set('loading', action.loading).set('error', null);
    case actions.FETCH_PRE_DEFINED_POLICY_LIST_RECEIVE:
      return state
        .set('loading', false)
        .set('preDefinedPolicies', [...action.data])
        .set('error', null);
    case actions.FETCH_PRE_DEFINED_POLICY_LIST_ERROR:
      return state.set('loading', false).set('error', action.error);
    case actions.UPDATE_APPLIED_SCENARIOS: {
      const tempMinYear =
        getCountryBauMinYear(state.get('countryMapBau'), state.get('selectedCountry').id) ||
        minYear;
      return state
        .set('appliedScenario', action.value)
        .set('appliedPolicies', [])
        .set('minYear', tempMinYear)
        .set('selectedYear', tempMinYear)
        .set('mapData', []);
    }

    case actions.UPDATE_GLOBAL_LOADING:
      return state.set('globalLoading', action.value);
    case actions.FETCH_COUNTRY_BAU:
      return state.set('globalLoading', true).set('error', null);
    case actions.FETCH_COUNTRY_BAU_RECEIVE: {
      const countryMapBau = [...state.get('countryMapBau')];
      countryMapBau.push(action.data);
      let tempCountryChartBau = [];
      const tempMinYear = getCountryBauMinYear(countryMapBau, action.data.countryId) || minYear;
      const tempDefaultGlobalParameters = [...state.get('defaultGlobalParameters')];
      let ponderables = action.globalParameters.ponderables;
      const founded = tempDefaultGlobalParameters.find(rec => {
        return rec.countryId === action.data.countryId;
      });

      if (!founded) {
        tempDefaultGlobalParameters.push({ ...action.defaultGlobalParameters });
      }
      let newState = state
        .set('globalLoading', false)
        .set('countryMapBau', [...countryMapBau])
        .set('bauForCountry', action.data.countryId)
        .set('selectedYear', action.data.year || tempMinYear)
        .set('globalParameters', { ...action.globalParameters })
        .set('defaultGlobalParameters', [...tempDefaultGlobalParameters])
        .set('visibleTab', 'home')
        .set(
          'selectedPonderable',
          getDefaultPonderable(action.globalParameters.ponderables, state.get('selectedPonderable'))
        )
        .set('error', null);

      if (action.data.countryId === 1 && action.data.year > 2017) {
        ponderables = filterPonderables(action.globalParameters.ponderables);
        newState = newState.set(
          'selectedPonderable',
          getDefaultPonderable(ponderables, state.get('selectedPonderable'))
        );
      }
      if (action.getChartData) {
        tempCountryChartBau = [...state.get('countryChartBau')];
        action.chartData.selectedParams = action.selectedParams;
        tempCountryChartBau.push(action.chartData);
        newState = newState
          .set('countryChartBau', [...tempCountryChartBau])
          .set('selectedParams', { ...action.selectedParams });
      }
      if (action.reset) {
        if (!action.data.year) {
          newState = newState.set('selectedYear', tempMinYear).set('minYear', tempMinYear);
        }
        if (state.get('appliedPolicies').length) {
          newState = newState
            .set('appliedPolicies', [])
            .set('appliedScenario', '')
            .set('mapData', [])
            .set('compareChartData', [])
            .set('compareScenariosData', []);
        }
      }
      return newState;
    }
    case actions.FETCH_COUNTRY_BAU_ERROR:
      return state.set('globalLoading', false).set('error', action.error);
    case actions.APPLY_COUNTRY_POLICY_SCENARIO:
      return state.set('globalLoading', true).set('error', null);
    case actions.APPLY_COUNTRY_POLICY_SCENARIO_RECEIVE: {
      const mapData = [...state.get('mapData')];
      mapData.push(action.data);
      return state
        .set('globalLoading', false)
        .set('mapData', [...mapData])
        .set('error', null);
    }
    case actions.APPLY_COUNTRY_POLICY_SCENARIO_ERROR:
      return state.set('globalLoading', false).set('error', action.error);
    case actions.FETCH_GLOBAL_PARAMETERS:
      return state.set('globalLoading', action.loading).set('error', null);
    case actions.FETCH_GLOBAL_PARAMETERS_RECEIVE:
      return state
        .set('globalLoading', false)
        .set('globalParameters', action.data)
        .set('selectedParams', action.selectedParams)
        .set('error', null);
    case actions.FETCH_GLOBAL_PARAMETERS_ERROR:
      return state.set('globalLoading', false).set('error', action.error);
    case actions.SAVE_SCENARIO:
      return state
        .set('globalLoading', true)
        .set('error', null)
        .set('visibleTab', 'country');
    case actions.SAVE_SCENARIO_RECEIVE: {
      let newState = state;
      const savedScenarios = [...state.get('savedScenarios')];
      savedScenarios.push({ ...action.scenario });
      const appliedPolicies = action.scenario.appliedPolicies;
      const tempSelectedYear = getPolicyMinYear(appliedPolicies);
      if (action.savedFor === 'user') {
        const userDetails = { ...state.get('userDetails') };
        userDetails.savedScenarios.push({ ...action.scenario });
        newState = newState.set('userDetails', { ...userDetails });
      }
      newState = newState
        .set('globalLoading', false)
        .set('savedScenarios', [...savedScenarios])
        .set('appliedPolicies', [...appliedPolicies])
        .set('minYear', tempSelectedYear)
        .set('selectedYear', tempSelectedYear)
        .set('appliedScenario', action.scenario.name)
        .set('visibleFooterTab', '')
        .set('error', null);
      return newState;
    }
    case actions.SAVE_SCENARIO_ERROR:
      return state.set('globalLoading', false).set('error', null);
    case actions.APPLY_SAVE_SCENARIO_POLICY:
      return state
        .set('globalLoading', true)
        .set('appliedPolicyRequest', true)
        .set('error', null);
    case actions.APPLY_SAVE_SCENARIO_POLICY_RECEIVE: {
      const mapData = [...state.get('mapData')];

      mapData.push(action.data);
      const tempSelectedYear = getPolicyMinYear(action.appliedPolicies);
      return state
        .set('globalLoading', false)
        .set('appliedPolicies', [...action.appliedPolicies])
        .set('appliedScenario', action.name)
        .set('minYear', tempSelectedYear)
        .set('selectedYear', tempSelectedYear)
        .set('mapData', [...mapData])
        .set('appliedPolicyRequest', false);
    }
    case actions.APPLY_SAVE_SCENARIO_POLICY_ERROR: {
      return state
        .set('globalLoading', false)
        .set('appliedPolicyRequest', false)
        .set('error', action.error);
    }
    case actions.FETCH_INITIAL_DATA:
      return state
        .set('globalLoading', true)
        .set('loading', true)
        .set('error', null);
    case actions.FETCH_INITIAL_DATA_RECEIVE: {
      const {
        countries,
        policies,
        preDefinedPolicies,
        countryMapBau,
        globalParameters,
        countryChartBau,
        selectedPonderable,
        selectedParams,
        defaultGlobalParameters,
        changeParamValue,
        selectedCountry,
        userDetails,
        userEncodedStr,
      } = action.data;

      const tempCountryBauMapData = [];
      tempCountryBauMapData.push(countryMapBau);
      const tempCountryBauChartData = [];
      countryChartBau.selectedParams = selectedParams;
      tempCountryBauChartData.push(countryChartBau);
      let savedScenarios = [];
      if (userDetails) {
        savedScenarios = fillSavedScenariosFromUserDetails(
          [...userDetails.savedScenarios],
          selectedCountry.id,
          policies
        );
      }

      let newState = state
        .set('globalLoading', false)
        .set('loading', false)
        .set('countries', [...countries])
        .set('policies', [...policies])
        .set('preDefinedPolicies', [...(preDefinedPolicies || [])])
        .set('countryMapBau', [...tempCountryBauMapData])
        .set('minYear', countryMapBau.year)
        .set('globalParameters', { ...globalParameters })
        .set('initialDataLoaded', true)
        .set('countryChartBau', [...tempCountryBauChartData])
        .set('selectedPonderable', selectedPonderable)
        .set('selectedParams', { ...selectedParams })
        .set('defaultGlobalParameters', [{ ...defaultGlobalParameters }])
        .set('changeParamValue', { ...changeParamValue })
        .set('selectedCountry', { ...selectedCountry })
        .set('userDetails', userDetails ? { ...userDetails } : null)
        .set('userEncodedStr', userEncodedStr || '')
        .set('savedScenarios', [...savedScenarios])
        .set('error', null);

      if (action.updateCacheData) {
        const compareScenariosData = [...state.get('compareScenariosData')];
        compareScenariosData.map(scenario => {
          scenario.appliedPolicies = [...updatePolicyName(scenario.appliedPolicies, policies)];
          return scenario;
        });

        // TODO: ----check savedScenarios---------

        savedScenarios = [...state.get('savedScenarios')];
        savedScenarios.map(scenario => {
          scenario.appliedPolicies = [...updatePolicyName(scenario.appliedPolicies, policies)];
          return scenario;
        });

        const newAppliedPolicies = updatePolicyName(state.get('appliedPolicies'), policies);

        newState = newState
          .set('appliedPolicies', [...newAppliedPolicies])
          .set('compareScenariosData', [...compareScenariosData])
          .set('savedScenarios', [...savedScenarios])
          .set('mapData', action.mapData || [])
          .set('compareChartData', action.compareChartData || [])
          .set('locale', action.locale);
        if (newAppliedPolicies.length) {
          newState = newState.set('minYear', getPolicyMinYear(newAppliedPolicies));
        }
      }
      return newState;
    }
    case actions.FETCH_INITIAL_DATA_ERROR:
      return state
        .set('globalLoading', false)
        .set('loading', false)
        .set('error', action.error);
    case actions.REAPPLY_COUNTRY_BAU_DATA: {
      const countryMapBau = state.get('countryMapBau');
      const tempMinYear = getCountryBauMinYear(countryMapBau, action.countryId) || minYear;
      const tempDefaultGlobalParameters = state.get('defaultGlobalParameters');
      const founded = tempDefaultGlobalParameters.find(rec => {
        return rec.countryId === action.countryId;
      });
      const selectedParams = getDefaultSelectedParams(founded.data);
      let newGlobalParameters = { ...founded.data };
      if (
        !(
          selectedParams.zoneId === 1 &&
          selectedParams.modeId === 1 &&
          selectedParams.sectorId === 1 &&
          selectedParams.technologyId === 1
        )
      ) {
        newGlobalParameters = {
          ...updateGlobalParamsStatus('zoneId', selectedParams.zoneId, founded.data),
        };
      }

      let newState = state
        .set('bauForCountry', action.countryId)
        .set('appliedScenario', '')
        .set('mapData', [])
        .set('selectedYear', action.selectedYear || tempMinYear)
        .set('globalParameters', newGlobalParameters)
        .set('selectedParams', { ...selectedParams })
        .set(
          'selectedPonderable',
          getDefaultPonderable(newGlobalParameters.ponderables, state.get('selectedPonderable'))
        )
        .set('visibleTab', 'home')
        .set('error', null);
      if (action.reset) {
        if (!action.selectedYear) {
          newState = newState.set('selectedYear', tempMinYear).set('minYear', tempMinYear);
        }
        if (state.get('appliedPolicies').length) {
          newState = newState
            .set('appliedPolicies', [])
            .set('appliedScenario', '')
            .set('compareChartData', [])
            .set('compareScenariosData', []);
        }
      }
      return newState;
    }
    case actions.SAVE_CURRENT_COLOR_SLIDER_VALUE:
      return state.set('currentColorSliderValue', action.value);
    case actions.SET_PONDERABLE:
      return state.set('selectedPonderable', action.selectedPonderable);
    case actions.TEST_SCENARIOS:
      return state
        .set('globalLoading', true)
        .set('compareScenariosData', [...action.payload.scenarios])
        .set('error', null);
    case actions.TEST_SCENARIOS_RECEIVE:
      return state
        .set('globalLoading', false)
        .set('compareChartData', [{ ...action.data }])
        .set('selectedParams', { ...action.selectedParams })
        .set('testScenario', true)
        .set('visibleFooterTab', '')
        .set('visibleTab', 'tools')
        .set('error', null);
    case actions.TEST_SCENARIOS_ERROR:
      return state.set('globalLoading', false).set('error', action.error);
    case actions.RESET_SCENARIOS:
      return state.set('isComparedScenario', false);

    case actions.COMPARE_SCENARIOS:
      return state
        .set('globalLoading', true)
        .set('compareScenariosData', [...action.payload.scenarios])
        .set('error', null);
    case actions.COMPARE_SCENARIOS_RECEIVE:
      return state
        .set('globalLoading', false)
        .set('compareChartData', [{ ...action.data }])
        .set('selectedParams', { ...action.selectedParams })
        .set('isComparedScenario', true)
        .set('testScenario', false)
        .set('error', null)
        .set('visibleFooterTab', 'scenario')
        .set('visibleTab', 'home');

    case actions.COMPARE_SCENARIOS_ERROR:
      return state.set('globalLoading', false).set('error', action.error);
    case actions.RESET_COMPARE_SCENARIO: {
      const tempDefaultGlobalParameters = state.get('defaultGlobalParameters');
      const selectedCountry = state.get('selectedCountry');
      const founded = tempDefaultGlobalParameters.find(rec => {
        return rec.countryId === selectedCountry.id;
      });
      let tempGlobalParameters = state.get('globalParameters');
      let selectedParams = {};
      if (founded) {
        tempGlobalParameters = founded.data;
        selectedParams = getDefaultSelectedParams(founded.data);
      }

      return state
        .set('compareChartData', [])
        .set('compareScenariosData', [])
        .set('globalParameters', { ...tempGlobalParameters })
        .set('selectedParams', { ...selectedParams })
        .set('isComparedScenario', false)
        .set('testScenario', true)
        .set('error', null);
    }

    case actions.APPLY_SLIDER_YEAR_POLICY:
      return state.set('globalLoading', true).set('error', null);
    case actions.APPLY_SLIDER_YEAR_POLICY_RECEIVE: {
      const tempMapData = [...state.get('mapData')];
      tempMapData.push(action.data);
      return state
        .set('mapData', [...tempMapData])
        .set('selectedYear', action.selectedYear)
        .set('globalLoading', false)
        .set('error', null);
    }
    case actions.APPLY_SLIDER_YEAR_POLICY_ERROR:
      return state.set('globalLoading', false).set('error', action.error);
    case actions.SAVE_MAP_IMAGE:
      return state.set('mapImage', action.item);
    case actions.SET_SELECTED_YEAR:
      return state.set('selectedYear', action.value);
    case actions.SHARE_BY_EMAIL:
      return state.set('globalLoading', true).set('error', null);
    case actions.SHARE_BY_EMAIL_RECEIVE:
      return state
        .set('globalLoading', false)
        .set('emailSend', true)
        .set('error', false);
    case actions.SHARE_BY_EMAIL_ERROR:
      return state
        .set('globalLoading', false)
        .set('emailSend', false)
        .set('error', action.error);
    case actions.SET_EMAIL_SEND_STATUS:
      return state.set('emailSend', action.value);
    case actions.APPLY_POLICY_ANIMATION:
      return state.set('appliedPolicyAnimation', action.value).set('visibleTab', 'tools');
    case actions.FETCH_CHART_DATA:
      return state.set('globalLoading', true).set('error', action.error);
    case actions.FETCH_CHART_DATA_RECEIVE: {
      let newState = state
        .set('globalLoading', false)
        .set('selectedParams', { ...action.selectedParams })
        .set('globalParameters', { ...action.globalParameters })
        .set('error', false);
      if (action.mode === 'compareScenario') {
        newState = newState.set('compareChartData', [{ ...action.data }]);
      } else {
        const tempCountryChartBau = [...newState.get('countryChartBau')];
        tempCountryChartBau.push(action.data);

        newState = newState.set('countryChartBau', [...tempCountryChartBau]);
      }
      return newState;
    }
    case actions.FETCH_CHART_DATA_ERROR:
      return state.set('globalLoading', false, 'error', action.error);
    case actions.REAPPLY_COUNTRY_BAU_CHART_DATA:
      return state
        .set('selectedParams', { ...action.payload.selectedParams })
        .set('globalParameters', { ...action.payload.globalParameters });

    case actions.DOWNLOAD_PDF:
      return state.set('globalLoading', true).set('error', null);
    case actions.DOWNLOAD_PDF_RECEIVE:
      return (
        state
          .set('globalLoading', false)
          // .set('emailSend', true)
          .set('error', false)
      );
    case actions.DOWNLOAD_PDF_ERROR:
      return (
        state
          .set('globalLoading', false)
          // .set('emailSend', false)
          .set('error', action.error)
      );

    case actions.CHANGE_PARAM_DATA:
      return state.set('changeParamValue', { ...action.payload.data });
    case actions.SET_LOCALE:
      return state.set('locale', action.locale);
    case actions.SET_HEADER_TAB: {
      let visibleTab = '';
      const preVisibleTab = state.get('visibleTab');
      if (preVisibleTab === action.visibleTab) {
        visibleTab = 'home';
      } else {
        visibleTab = action.visibleTab;
      }

      return state.set('visibleTab', visibleTab).set('visibleFooterTab', '');
    }
    case actions.SET_FOOTER_TAB: {
      let visibleFooterTab = '';
      const previsibleFooterTab = state.get('visibleFooterTab');
      if (previsibleFooterTab === action.visibleFooterTab) {
        visibleFooterTab = '';
      } else {
        visibleFooterTab = action.visibleFooterTab;
      }
      return state.set('visibleFooterTab', visibleFooterTab).set('visibleTab', 'home');
    }
    case actions.SET_QUERY_PARAMS:
      return state.set('queryParams', action.queryParams);
    case actions.SELECTED_POLICIES_TO_COMPARE:
      return state.set('selectedPoliciesToCompare', [...action.policies]);
    // case actions.APPLY_SESSION_STORAGE_DATA: {
    //   let newState = state;
    //   Object.keys(action.sessionData.unsavedSession).map(key => {
    //     newState = newState.set(key, action.sessionData.unsavedSession[key]);
    //     return key;
    //   });
    //   newState = newState.set('isLoginRedirect', true).set('isLoginRedirect', true);
    //   return newState;
    // }
    case actions.CLEAR_UNSAVED_SESSION: {
      return state.set('isLoginRedirect', false);
    }
    case actions.FETCH_USER_DETAILS:
      return state.set('globalLoading', true).set('error', action.error);
    case actions.FETCH_USER_DETAILS_RECEIVE: {
      let newState = state;
      Object.keys(action.unsavedSession).map(key => {
        newState = newState.set(key, action.unsavedSession[key]);
        return key;
      });
      newState = newState.set('isLoginRedirect', true);
      const savedScenarios = fillSavedScenariosFromUserDetails(
        [...newState.get('savedScenarios'), ...action.userDetails.savedScenarios],
        newState.get('selectedCountry').id,
        newState.get('policies')
      );
      newState = newState
        .set('globalLoading', false)
        .set('userDetails', { ...action.userDetails })
        .set('userEncodedStr', action.userEncodedStr)
        .set('savedScenarios', [...savedScenarios])
        .set('error', false);
      return newState;
    }
    case actions.FETCH_USER_DETAILS_ERROR:
      return state.set('globalLoading', false, 'error', action.error);
    default:
      return state;
  }
}
