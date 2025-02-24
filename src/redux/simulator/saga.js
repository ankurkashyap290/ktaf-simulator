/* eslint-disable func-names */
import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import { message } from 'antd';
import actions from './actions';
import { globalAPI } from '../../services/globalAPI';
import { defaultSelectedCountry, localeMessages } from '../../configs/app.config';
import {
  getDefaultSelectedParams,
  updateGlobalParamsStatus,
  getRandomColor,
  getDefaultPonderable,
} from '../../utils';

export function* fetchInitialData() {
  yield takeEvery(actions.FETCH_INITIAL_DATA, function*({ payload, updateCacheData }) {
    let foundCountry = null;
    let countryMapBau = [];
    let tempDefaultGlobal = {};
    let response = {};
    let userDetails = {};

    const {
      locale,
      selectedCountry,
      selectedParams: currentSelectedParams,
      appliedPolicies,
      compareScenariosData,
      selectedYear,
      userEncodedStr,
    } = payload;

    // const unsavedScenario = JSON.parse(sessionStorage.getItem('unsaved-scenario') || null);
    const autoSelectCountry = updateCacheData ? selectedCountry.longName : defaultSelectedCountry;

    // if (unsavedScenario) {
    //   autoSelectCountry = unsavedScenario.country.longName;
    // }

    if (userEncodedStr) {
      userDetails = yield call(globalAPI.fetchUserDetails, userEncodedStr);
    }

    // fetch countries for selected locale
    const countries = yield call(globalAPI.fetchCountries, { locale });
    const policies = yield call(globalAPI.fetchPolicies, { locale });
    // select default country read from config param defaultSelectedCountry
    if (countries && countries.data.length > 0) {
      foundCountry = countries.data.find(country => {
        return country.longName === autoSelectCountry;
      });
    }
    // country found then proceed further
    if (foundCountry) {
      const countryId = foundCountry.id;

      const preDefinedPolicies = yield call(globalAPI.fetchPreDefinedPolicies, {
        locale,
        countryId,
      });

      const globalParameters = yield call(globalAPI.fetchGlobalParameters, {
        countryId,
        locale,
      });

      const selectedParams = updateCacheData
        ? currentSelectedParams
        : getDefaultSelectedParams(globalParameters.data) || {};

      // if (unsavedScenario) {
      //   selectedParams =
      //     unsavedScenario.selectedParams || getDefaultSelectedParams(globalParameters.data);
      // }

      const chartData = yield call(globalAPI.fetchChartData, {
        selectedParams,
        countryId,
        locale,
      });

      countryMapBau = yield call(globalAPI.fetchCountryBau, {
        countryId,
        locale,
      });
      tempDefaultGlobal = { countryId, data: globalParameters.data };
      if (
        !(
          selectedParams.zoneId === 1 &&
          selectedParams.modeId === 1 &&
          selectedParams.sectorId === 1 &&
          selectedParams.technologyId === 1
        )
      ) {
        globalParameters.data = updateGlobalParamsStatus(
          'zoneId',
          selectedParams.zoneId,
          globalParameters.data
        );
      }

      response = {
        status: 'ok',
        data: {
          countries: countries.data,
          policies: policies.data,
          globalParameters: globalParameters.data,
          preDefinedPolicies: preDefinedPolicies.data,
          countryMapBau: countryMapBau.data || [],
          countryChartBau: chartData.data || [],
          selectedPonderable: getDefaultPonderable(
            globalParameters.data ? globalParameters.data.ponderables : []
          ),
          defaultGlobalParameters: { ...tempDefaultGlobal },
          selectedParams,
          changeParamValue: {
            type: 'zone',
            id: selectedParams.zoneId,
          },
          selectedCountry: { ...foundCountry },
          userDetails: userDetails.data ? { ...userDetails.data } : null,
          userEncodedStr,
        },
      };

      // when locale change then check points
      // 1. fetch map-data for appliedPolicies
      // 2. fetch chart-data if compare mode on via compare-scenario api
      if (updateCacheData) {
        response.locale = locale;
        if (appliedPolicies.length) {
          // fetch map-data again
          const mapDataResponse = yield call(globalAPI.fetchCountryMapData, {
            locale,
            countryId,
            appliedPolicies: [...appliedPolicies],
            year: selectedYear,
          });
          if (mapDataResponse.status.toLowerCase() === 'ok') {
            response.mapData = [{ ...mapDataResponse.data }];
          }
        }
        if (compareScenariosData.length) {
          // fetch compare-scenario data
          const compareScenarioResponse = yield call(globalAPI.compareSavedScenarios, {
            countryId,
            scenarios: [...compareScenariosData],
            selectedParams,
          });
          if (compareScenarioResponse.status.toLowerCase() === 'ok') {
            response.compareChartData = [{ ...compareScenarioResponse.data }];
          }
        }
      }
      //  else if (unsavedScenario) {
      //   if (unsavedScenario.appliedPolicies.length) {
      //     // fetch map-data again
      //     const mapDataResponse = yield call(globalAPI.fetchCountryMapData, {
      //       locale,
      //       countryId,
      //       appliedPolicies: [...unsavedScenario.appliedPolicies],
      //       year: unsavedScenario.selectedYear,
      //     });
      //     if (mapDataResponse.status.toLowerCase() === 'ok') {
      //       response.mapData = [{ ...mapDataResponse.data }];
      //     }
      //   }
      // }
    } else {
      response.status = 'error';
      response.error = '--API NOT RETURNING VALID DATA TO RUN THE APP---';
    }
    if (response.status.toLowerCase() === 'ok') {
      yield put(actions.fetchInitialDataReceive(response, updateCacheData));
    } else {
      yield put(actions.fetchInitialDataError(response));
    }
  });
}

export function* fetchCountries() {
  yield takeEvery(actions.FETCH_COUNTRY_LIST, function*({ payload }) {
    const response = yield call(globalAPI.fetchCountries, payload);
    if (response.status.toLowerCase() === 'ok') {
      yield put(actions.receiveFetchCountries(response));
    } else {
      yield put(actions.errorFetchCountries(response));
    }
  });
}

export function* fetchPolicies() {
  yield takeEvery(actions.FETCH_POLICY_LIST, function*({ payload }) {
    const response = yield call(globalAPI.fetchPolicies, payload);

    if (response.status.toLowerCase() === 'ok') {
      yield put(actions.receiveFetchPolicies(response));
    } else {
      yield put(actions.errorFetchPolicies(response));
    }
  });
}

export function* fetchPreDefinedPolicies() {
  yield takeEvery(actions.FETCH_PRE_DEFINED_POLICY_LIST, function*({ payload }) {
    const response = yield call(globalAPI.fetchPreDefinedPolicies, payload);
    if (response.status.toLowerCase() === 'ok') {
      yield put(actions.receiveFetchPreDefinedPolicies(response));
    } else {
      yield put(actions.errorFetchPreDefinedPolicies(response));
    }
  });
}

export function* fetchCountryBau() {
  yield takeEvery(actions.FETCH_COUNTRY_BAU, function*({ payload }) {
    const { getChartData } = payload;
    const response = yield call(globalAPI.fetchCountryBau, payload);
    const globalParameters = yield call(globalAPI.fetchGlobalParameters, {
      countryId: payload.countryId,
      locale: payload.locale,
    });
    const selectedParams = getDefaultSelectedParams(globalParameters.data);
    if (response.status.toLowerCase() === 'ok') {
      response.getChartData = getChartData;
      if (
        !(
          selectedParams.zoneId === 1 &&
          selectedParams.modeId === 1 &&
          selectedParams.sectorId === 1 &&
          selectedParams.technologyId === 1
        )
      ) {
        response.globalParameters = updateGlobalParamsStatus(
          'zoneId',
          selectedParams.zoneId,
          globalParameters.data
        );
      } else {
        response.globalParameters = { ...globalParameters.data };
      }

      response.defaultGlobalParameters = {
        countryId: payload.countryId,
        data: globalParameters.data,
      };
      if (getChartData) {
        payload.selectedParams = selectedParams;
        const chartData = yield call(globalAPI.fetchChartData, payload);
        if (chartData.status.toLowerCase() === 'ok') {
          response.chartData = chartData.data;
          response.selectedParams = selectedParams;
        }
      }
      yield put(actions.fetchCountryBauReceive(response, payload.reset || false));
    } else {
      yield put(actions.fetchCountryBauError(response));
    }
  });
}

export function* applyCountryPolicyScenario() {
  yield takeEvery(actions.POLICY_APPLY, function*({ payload }) {
    const response = yield call(globalAPI.fetchCountryMapData, payload.applyPolicy);

    if (response.status.toLowerCase() === 'ok') {
      response.policy = payload.applyPolicy.policy;
      response.mode = payload.applyPolicy.mode;

      yield put(actions.policyApplyReceive(response));

      const tempSelected = [];
      let tempPayload = null;
      if (
        payload.applyPolicy.appliedPolicies.length &&
        payload.applyPolicy.appliedPolicies.length > 0 &&
        !payload.isComparedScenario
      ) {
        tempSelected.push({
          name: 'Test (Real-time)',
          appliedPolicies: [...payload.applyPolicy.appliedPolicies],
          stokeColor: getRandomColor(),
        });

        tempPayload = {
          countryId: payload.applyPolicy.countryId,
          scenarios: [...tempSelected],
          selectedParams: payload.selectedParams,
        };

        yield put(actions.testScenarios({ payload: { ...tempPayload } }));
      } else if (
        payload.applyPolicy.appliedPolicies.length &&
        payload.applyPolicy.appliedPolicies.length > 0 &&
        payload.isComparedScenario
      ) {
        if (payload.comparedData && payload.comparedData.length) {
          payload.comparedData.map(element => {
            return tempSelected.push(element);
          });
        }
        const tempPolicies = [];
        payload.applyPolicy.appliedPolicies.map(policy => {
          if (policy.isSaved === false) {
            return tempPolicies.push(policy);
          }
          return policy;
        });
        tempSelected.push({
          name: 'Test (Real-time)',
          appliedPolicies: [...tempPolicies],
          stokeColor: getRandomColor(),
        });

        tempPayload = {
          countryId: payload.applyPolicy.countryId,
          scenarios: [...tempSelected],
          selectedParams: payload.selectedParams,
        };

        yield put(actions.testScenarios({ payload: { ...tempPayload } }));
      } else if (payload.applyPolicy.appliedPolicies.length === 0 && payload.isComparedScenario) {
        if (payload.comparedData && payload.comparedData.length) {
          payload.comparedData.map(element => {
            return tempSelected.push(element);
          });
        }
        tempPayload = {
          countryId: payload.applyPolicy.countryId,
          scenarios: [...tempSelected],
          selectedParams: payload.selectedParams,
        };

        yield put(actions.testScenarios({ payload: { ...tempPayload } }));
      } else if (payload.applyPolicy.appliedPolicies.length === 0 && !payload.isComparedScenario) {
        yield put(actions.resetCompareScenario());
      }
    } else {
      yield put(actions.policyApplyError(response));
    }
  });
}

export function* fetchGlobalParameters() {
  yield takeEvery(actions.FETCH_GLOBAL_PARAMETERS, function*(payload) {
    const response = yield call(globalAPI.fetchGlobalParameters, payload);
    if (response.status.toLowerCase() === 'ok') {
      const selectedParams = getDefaultSelectedParams(response.data) || {};
      response.selectedParams = selectedParams;
      yield put(actions.fetchGlobalParametersReceive(response));
    } else {
      yield put(actions.fetchGlobalParametersError(response));
    }
  });
}
export function* saveScenario() {
  yield takeEvery(actions.SAVE_SCENARIO, function*({ payload, locale }) {
    const { savedFor, userEncodedStr, countryId, description, name, appliedPolicies } = payload;
    const scenario = {
      countryId,
      description,
      scenarioName: name,
      policies: appliedPolicies.map(policy => {
        return {
          appliedPolicyId: 0,
          percentageImplementation: policy.sliderValue,
          policyGroupId: policy.policyGroup,
          policyId: policy.policy,
          year: policy.year,
        };
      }),
    };

    const response = {
      status: 'OK',
      data: {
        scenario,
        savedFor,
      },
    };
    if (savedFor === 'user') {
      const apiResponse = yield call(globalAPI.saveScenario, scenario, userEncodedStr, locale);
      if (apiResponse.status.toLowerCase() === 'ok') {
        response.data.scenario = { ...apiResponse.data };
      }
    }

    if (response.status.toLowerCase() === 'ok') {
      delete response.data.scenario.policies;
      delete response.data.scenario.scenarioName;
      response.data.scenario.appliedPolicies = [...appliedPolicies];
      response.data.scenario.name = name;
      yield put(actions.saveScenarioReceive(response.data));
      yield call(message.success, localeMessages[`scenarionSavedSuccess_${locale}`], 1);
    } else {
      yield put(actions.saveScenarioError(response));
    }
  });
}

export function* applySavePolicyScenario() {
  yield takeEvery(actions.APPLY_SAVE_SCENARIO_POLICY, function*({ payload }) {
    const response = yield call(globalAPI.fetchCountryMapData, payload);
    if (response.status.toLowerCase() === 'ok') {
      response.appliedPolicies = payload.appliedPolicies;
      response.name = payload.name;
      yield put(actions.applySaveScenarioPolicyReceive(response));
    } else {
      yield put(actions.applySaveScenarioPolicyError(response));
    }
  });
}

export function* testScenarios() {
  yield takeEvery(actions.TEST_SCENARIOS, function*({ payload }) {
    const response = yield call(globalAPI.compareSavedScenarios, payload);
    if (response.status.toLowerCase() === 'ok') {
      response.selectedParams = payload.selectedParams;
      yield put(actions.testScenariosReceive(response));
    } else {
      yield put(actions.testScenariosError(response));
    }
  });
}

export function* compareScenarios() {
  yield takeEvery(actions.COMPARE_SCENARIOS, function*({ payload }) {
    const response = yield call(globalAPI.compareSavedScenarios, payload);
    if (response.status.toLowerCase() === 'ok') {
      response.selectedParams = payload.selectedParams;
      yield put(actions.compareScenariosReceive(response));
    } else {
      yield put(actions.compareScenariosError(response));
    }
  });
}

export function* applySliderYearPolicy() {
  yield takeEvery(actions.APPLY_SLIDER_YEAR_POLICY, function*({ payload }) {
    const response = yield call(globalAPI.fetchCountryMapData, payload);
    if (response.status.toLowerCase() === 'ok') {
      response.selectedYear = payload.year;
      yield put(actions.applySliderYearPolicyReceive(response));
    } else {
      yield put(actions.applySliderYearPolicyError(response));
    }
  });
}

export function* shareByEmail() {
  yield takeEvery(actions.SHARE_BY_EMAIL, function*({ payload, locale }) {
    const response = yield call(globalAPI.shareByEmail, payload, locale);
    if (response.status.toLowerCase() === 'ok') {
      yield put(actions.shareByEmailReceive(response));
      yield call(message.success, response.msg, 2);
    } else {
      yield put(actions.shareByEmailError(response));
      yield call(message.error, response.msg, 2);
    }
  });
}

export function* fetchChartData() {
  yield takeEvery(actions.FETCH_CHART_DATA, function*({ payload }) {
    const response = yield call(globalAPI.fetchCountryChartData, payload);
    if (response.status.toLowerCase() === 'ok') {
      const {
        payload: { selectedParams, mode, globalParameters },
      } = payload;
      response.globalParameters = globalParameters;
      response.selectedParams = selectedParams;
      response.data.selectedParams = selectedParams;
      response.mode = mode;
      yield put(actions.fetchChartDataReceive(response));
    } else {
      yield put(actions.fetchChartDataError(response));
    }
  });
}

export function* downloadPdf() {
  yield takeEvery(actions.DOWNLOAD_PDF, function*({ payload }) {
    const response = yield call(globalAPI.downloadPdf, payload);
    if (response.status.toLowerCase() === 'ok') {
      // Create a Blob from the PDF Stream
      // const file = new Blob([response.data], { type: 'application/pdf', name: 'download.pdf' });
      // Build a URL from the file
      // const fileURL = URL.createObjectURL(file);
      // Open the URL on new Window
      // window.open(fileURL);

      yield put(actions.downloadPdfReceive());
      yield call(message.success, response.msg, 2);
    } else {
      yield put(actions.downloadPdfError(response));
      yield call(message.error, response.msg, 2);
    }
  });
}

export function* fetchUserDetails() {
  yield takeEvery(actions.FETCH_USER_DETAILS, function*({ payload }) {
    const { userEncodedStr, locale, unsavedSession } = payload;
    const response = yield call(globalAPI.fetchUserDetails, userEncodedStr, locale);
    if (response.status.toLowerCase() === 'ok') {
      yield put(
        actions.fetchUserDetailsReceive(response.data, userEncodedStr, unsavedSession, locale)
      );
      // yield put(actions.applySessionStorageData({ locale, userEncodedStr, unsavedSession }));
    } else {
      yield put(actions.fetchUserDetailsError(response));
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(fetchCountries),
    fork(fetchPolicies),
    fork(fetchPreDefinedPolicies),
    fork(fetchCountryBau),
    fork(applyCountryPolicyScenario),
    fork(fetchGlobalParameters),
    fork(saveScenario),
    fork(fetchInitialData),
    fork(applySavePolicyScenario),
    fork(testScenarios),
    fork(compareScenarios),
    fork(applySliderYearPolicy),
    fork(shareByEmail),
    fork(fetchChartData),
    fork(downloadPdf),
    fork(fetchUserDetails),
  ]);
}
