import { stringify } from 'qs';
import request from '../utils/request';
import { apiUrl, API_VERSION, localeMessages } from '../configs/app.config';

const API_URL = apiUrl(''); // ""

// any changes need in api data
function transformServerData(data, mode) {
  mode = mode || '';
  if (mode === 'compare') {
    data.ponderables.map(ponderable => {
      ponderable.chartData = ponderable.chartData.map(item => {
        const newItem = {};
        Object.keys(item).map(keyItem => {
          newItem[decodeURI(keyItem)] = item[keyItem];
          return newItem;
        });
        return newItem;
      });
      return ponderable;
    });
  } else if (mode === 'globalParams') {
    // data.ponderables.map(ponderable => {
    //   if (ponderable.ponderableCode === 'co2') {
    //     ponderable.ponderableName = 'CO<sub>2</sub>';
    //   }
    //   return ponderable;
    // });
  }
  return data;
}

function getSelectedParams(selectedParams) {
  const tempSelectedParams = {};
  for (const key in selectedParams) {
    if (selectedParams[key]) {
      tempSelectedParams[key] = selectedParams[key];
    }
  }
  return tempSelectedParams;
}

export const globalAPI = {
  async fetchUserDetails(payload) {
    const userToken = payload;
    const params = {};
    const response = await request(
      `${API_URL}/api/${API_VERSION}user-details?${stringify(params)}`,
      {
        headers: { 'x-user-data': userToken },
      }
    );
    if (response.status.toLowerCase() !== 'ok') {
      response.data = [];
    }
    const result = {
      data: transformServerData(response.data),
      status: 'OK',
    };

    return result;
  },
  async fetchCountries(payload) {
    const { locale } = payload;
    const params = {};
    const response = await request(`${API_URL}/api/${API_VERSION}countries?${stringify(params)}`, {
      headers: { locale },
    });
    if (response.status.toLowerCase() !== 'ok') {
      response.data = [];
    }
    const result = {
      data: transformServerData(response.data),
      status: 'OK',
    };
    return result;
  },
  async fetchPolicies(payload) {
    const { locale } = payload;
    const params = {};
    const response = await request(
      `${API_URL}/api/${API_VERSION}policygroups?${stringify(params)}`,
      { headers: { locale } }
    );
    if (response.status.toLowerCase() !== 'ok') {
      response.data = [];
    }
    const result = {
      data: transformServerData(response.data),
      status: 'OK',
    };
    return result;
  },
  async fetchPreDefinedPolicies() {
    const params = {};
    const response = await request(
      `${API_URL}/api/${API_VERSION}scenarios/predefined?${stringify(params)}`
    );
    if (response.status.toLowerCase() !== 'ok') {
      response.data = [];
    }
    const result = {
      data: transformServerData(response.data),
      status: 'OK',
    };
    return result;
  },
  async fetchCountryBau(payload) {
    const { countryId, selectedYear, locale } = payload;
    const queryParams = { year: selectedYear };
    const response = await request(
      `${API_URL}/api/${API_VERSION}map-data/${countryId}?${stringify(queryParams)}`,
      { headers: { locale } }
    );
    if (response.status.toLowerCase() !== 'ok') {
      response.data = {};
    }
    const result = {
      data: transformServerData(response.data),
      status: 'OK',
    };
    return result;
  },
  async fetchCountryMapData(payload) {
    const { countryId, appliedPolicies, locale } = payload;
    const year = payload.year ? payload.year : null;
    let response = [];
    const policies = appliedPolicies.map(appliedPolicy => {
      return {
        policyId: appliedPolicy.policy,
        year: appliedPolicy.year,
        percentageImplementation: appliedPolicy.sliderValue,
      };
    });
    if (year) {
      response = await request(
        `${API_URL}/api/${API_VERSION}map-data/${countryId}?policies=${escape(
          JSON.stringify(policies)
        )}&year=${year}`,
        { headers: { locale } }
      );
    } else {
      response = await request(
        `${API_URL}/api/${API_VERSION}map-data/${countryId}?policies=${escape(
          JSON.stringify(policies)
        )}`,
        { headers: { locale } }
      );
    }
    if (response.status.toLowerCase() !== 'ok') {
      response.data = {};
    }
    const result = {
      data: transformServerData(response.data),
      status: 'OK',
    };
    return result;
  },
  async fetchGlobalParameters(payload) {
    const { countryId, locale, ...params } = payload;
    const response = await request(
      `${API_URL}/api/${API_VERSION}params-data/${countryId}?${stringify(params)}`,
      { headers: { locale } }
    );
    if (response.status.toLowerCase() !== 'ok') {
      response.data = {};
    }
    const result = {
      data: transformServerData(response.data, 'globalParams'),
      status: 'OK',
    };
    return result;
  },

  async fetchChartData(payload) {
    let countryId = 1;
    let selectedParams = {};
    if (payload) {
      countryId = payload.countryId;
      selectedParams = getSelectedParams(payload.selectedParams);
    }
    const response = await request(
      `${API_URL}/api/${API_VERSION}bau-charts/${countryId}?${stringify(selectedParams)}`
    );
    if (response.status.toLowerCase() !== 'ok') {
      response.data = [];
    }
    const result = {
      data: transformServerData(response.data),
      status: 'OK',
    };
    return result;
  },

  async compareSavedScenarios(payload) {
    const { countryId, scenarios, selectedParams } = payload;
    const userId = 0;
    const scenariosData = scenarios.map(scenario => {
      return {
        scenarioName: encodeURI(scenario.name),
        policies: scenario.appliedPolicies.map(appliedPolicy => {
          return {
            policyId: appliedPolicy.policy,
            year: appliedPolicy.year,
            percentageImplementation: appliedPolicy.sliderValue,
          };
        }),
      };
    });
    const response = await request(
      `${API_URL}/api/${API_VERSION}compare-scenarios/${countryId}/${userId}?scenarios=${escape(
        JSON.stringify(scenariosData)
      )}&${stringify(getSelectedParams(selectedParams))}`
    );
    if (response.status.toLowerCase() !== 'ok') {
      response.data = [];
    }
    const result = {
      data: transformServerData(response.data, 'compare'),
      status: 'OK',
    };
    return result;
  },

  async shareByEmail(payload, locale) {
    const response = await request(`${API_URL}/api/${API_VERSION}send-mail`, {
      method: 'POST',
      body: {
        ...payload,
      },
    });
    let result = [];
    if (response.status.toLowerCase() === 'ok') {
      result = {
        msg: localeMessages[`emailSentSuccess_${locale}`],
        status: 'OK',
      };
    } else {
      result = {
        msg: localeMessages[`emailSentError_${locale}`],
        status: 'Error',
      };
    }
    return result;
  },

  async fetchCountryChartData(payload) {
    const {
      payload: { countryId, userId, selectedParams, scenarios, mode },
    } = payload;
    let response = [];
    if (mode === 'compareScenario') {
      const scenariosData = scenarios.map(scenario => {
        return {
          scenarioName: encodeURI(scenario.name),
          policies: scenario.appliedPolicies.map(appliedPolicy => {
            return {
              policyId: appliedPolicy.policy,
              year: appliedPolicy.year,
              percentageImplementation: appliedPolicy.sliderValue,
            };
          }),
        };
      });
      response = await request(
        `${API_URL}/api/${API_VERSION}compare-scenarios/${countryId}/${userId}?scenarios=${escape(
          JSON.stringify(scenariosData)
        )}&${stringify(getSelectedParams(selectedParams))}`
      );
    } else if (mode === 'countryChartData') {
      response = await request(
        `${API_URL}/api/${API_VERSION}bau-charts/${countryId}?${stringify(
          getSelectedParams(selectedParams)
        )}`
      );
    }
    if (response.status.toLowerCase() !== 'ok') {
      response.data = [];
    }
    const result = {
      data: transformServerData(response.data, 'compare'),
      status: 'OK',
    };
    return result;
  },

  async downloadPdf(payload) {
    const { locale } = payload;
    const response = await request(
      `${API_URL}/api/${API_VERSION}files`,
      {
        method: 'POST',
        body: {
          ...payload,
        },
      },
      { headers: { locale } },
      'blob'
    );
    return response;
  },

  async saveScenario(scenario, userEncodedStr, locale) {
    const response = await request(`${API_URL}/api/${API_VERSION}scenarios`, {
      headers: { 'x-user-data': userEncodedStr, locale },
      method: 'POST',
      body: { ...scenario },
    });
    const result = {};
    if (response.status.toLowerCase() !== 'ok') {
      result.status = 'Error';
      result.msg = 'Server Error';
    } else {
      result.status = 'OK';
      result.data = transformServerData(response.data);
    }
    return result;
  },
};
