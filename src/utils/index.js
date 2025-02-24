import React from 'react';
import moment from 'moment';
import html2canvas from 'html2canvas';
import queryString from 'query-string';
// import jwtDecode from 'jwt-decode';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!');
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // Whether included
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);

    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  console.log('utils router data', routerData, 'path', path);
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact,
    };
  });
  return renderRoutes;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

// export function decodeJWTToken(token) {
//   return jwtDecode(token);
// }

/**
 * Generates a random moment.js object
 *
 * @param {any} end - END date [Anything a moment constructor accepts]
 * @param {any} start - START date [Anything a moment constructor accepts]
 * @returns
 */
export function momentRandom(end = moment(), start) {
  const endTime = +moment(end);
  const randomNumber = (to, from = 0) => Math.floor(Math.random() * (to - from) + from);

  if (start) {
    const startTime = +moment(start);
    if (startTime > endTime) {
      throw new Error('End date is before start date!');
    }
    return moment(randomNumber(endTime, startTime));
  }
  return moment(randomNumber(endTime));
}

const colorStepSize = 10;
const colorStepCount = Math.ceil((255 - 30) / colorStepSize);

function sortPonderable(selectedPonderable, a, b) {
  return a[selectedPonderable] - b[selectedPonderable];
}
export function getColorCodesAndRange(mapData, selectedPonderable) {
  const newData = { ...mapData };
  const data = newData.data.sort(sortPonderable.bind(this, selectedPonderable));
  let min = Math.min(data[0][selectedPonderable], data[data.length - 1][selectedPonderable]);
  const max = Math.max(data[0][selectedPonderable], data[data.length - 1][selectedPonderable]);
  if (max === min) {
    min = 0;
  }
  const rangeLength = max - min;
  const length = Math.ceil(rangeLength / colorStepCount);
  const colorStops = [];
  let colorStep = 30;
  let sliderValue = colorStepCount * colorStepSize;
  for (let index = 1; index < colorStepCount; index += 1) {
    colorStops.push({ range: rangeLength - length * index, color: colorStep, sliderValue });
    colorStep += colorStepSize;
    sliderValue -= colorStepSize;
  }
  colorStops.push({
    range: min,
    color: colorStep,
    sliderValue,
  });
  // console.log('colorStops', colorStops, length, max);
  return colorStops;
}

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getThousandSeparator(value) {
  return !isNaN(value) ? parseFloat(value).toLocaleString() : '';
}

export function getExponentialValue(value) {
  return value; // value.toExponential(2);
}

export async function getHtmlToImg(el) {
  const imgData = await html2canvas(el).then(async canvas => {
    const tempImgData = await canvas.toDataURL('image/png');
    return tempImgData;
  });
  return imgData;
}

export function getSvgDataUrl(el) {
  const xml = new XMLSerializer().serializeToString(el);
  return `data:image/svg+xml;utf8,${encodeURIComponent(xml)}`;
}

export function getDefaultSelectedParams(globalParameters) {
  const selectedParams = {
    zoneId: null,
    sectorId: null,
    modeId: null,
    technologyId: null,
  };
  const zones = globalParameters.zones;
  const modes = globalParameters.modes;
  const sectors = globalParameters.sectors;
  const technologies = globalParameters.technology;

  for (let index = 0; index < zones.length; index += 1) {
    if (zones[index].status) {
      selectedParams.zoneId = zones[index].id;
      break;
    }
  }
  for (let index = 0; index < modes.length; index += 1) {
    if (modes[index].status) {
      selectedParams.modeId = modes[index].id;
      break;
    }
  }
  for (let index = 0; index < sectors.length; index += 1) {
    if (sectors[index].status) {
      selectedParams.sectorId = sectors[index].id;
      break;
    }
  }
  for (let index = 0; index < technologies.length; index += 1) {
    if (technologies[index].status) {
      selectedParams.technologyId = technologies[index].id;
      break;
    }
  }

  return selectedParams;
}

export function checkSelectedParamCombination(
  selectedParams,
  possibleCombination,
  changedParamName
) {
  let tempSelectedParams = {
    zoneId: possibleCombination[0].zoneId,
    modeId: possibleCombination[0].modeId,
    sectorId: possibleCombination[0].sectorId,
    technologyId: possibleCombination[0].technologyId,
  };
  for (let index = 0; index < possibleCombination.length; index += 1) {
    if (checkParamEqual(possibleCombination[index], selectedParams)) {
      tempSelectedParams = possibleCombination[index];
    }
  }
  if (checkParamEqual(possibleCombination[0], tempSelectedParams)) {
    const foundFirstChangedCombination = possibleCombination.find(
      item => item[changedParamName] === selectedParams[changedParamName]
    );
    if (foundFirstChangedCombination) {
      tempSelectedParams = { ...foundFirstChangedCombination };
    }
  }
  return tempSelectedParams;
}

export function checkParamEqual(newParams, oldParams) {
  let check = false;
  if (
    newParams.zoneId === oldParams.zoneId &&
    newParams.modeId === oldParams.modeId &&
    newParams.sectorId === oldParams.sectorId &&
    newParams.technologyId === oldParams.technologyId
  ) {
    check = true;
  }
  return check;
}

function isParamCombinationFound(paramName, id, entityId, entityValue, combination) {
  return (
    combination.filter(item => item[paramName] === id && item[entityId] === entityValue).length > 0
  );
}

function updateSingleParamStatus(
  paramName,
  id,
  entityName,
  entityId,
  globalParameters,
  paramsCombinations
) {
  return globalParameters[entityName].map(node => {
    return {
      ...node,
      status: isParamCombinationFound(paramName, id, entityId, node.id, paramsCombinations),
    };
  });
}

export function updateGlobalParamsStatus(paramName, paramValue, defaults) {
  const globalParameters = { ...defaults };
  const paramsCombinations = defaults.paramsCombinations;

  if (paramName !== 'zoneId') {
    globalParameters.zones = updateSingleParamStatus(
      paramName,
      paramValue,
      'zones',
      'zoneId',
      globalParameters,
      paramsCombinations
    );
  }

  if (paramName !== 'modeId') {
    globalParameters.modes = updateSingleParamStatus(
      paramName,
      paramValue,
      'modes',
      'modeId',
      globalParameters,
      paramsCombinations
    );
  }

  if (paramName !== 'technologyId') {
    globalParameters.technology = updateSingleParamStatus(
      paramName,
      paramValue,
      'technology',
      'technologyId',
      globalParameters,
      paramsCombinations
    );
  }

  if (paramName !== 'sectorId') {
    globalParameters.sectors = updateSingleParamStatus(
      paramName,
      paramValue,
      'sectors',
      'sectorId',
      globalParameters,
      paramsCombinations
    );
  }

  return globalParameters;
}

export function getCountryBauMinYear(countryBauData, countryId) {
  const founded = countryBauData
    .filter(bauData => bauData.countryId === countryId)
    .sort((a, b) => (a.year > b.year ? 1 : b.year > a.year ? -1 : 0));
  if (founded.length) {
    return founded[0].year;
  } else {
    return null;
  }
}

export function isBrowserIE() {
  const navigatorObject = window.navigator;
  const sUsrAg = navigatorObject.userAgent;
  console.log('browser', sUsrAg);
  if (sUsrAg.indexOf('Edge') > -1 || sUsrAg.indexOf('Trident') > -1) {
    return true;
  }
  return false;
}

export function transformPonderableName(ponderable, byPass = false) {
  if (!byPass) {
    if (ponderable.ponderableCode === 'co2') {
      return (
        <span>
          CO<sub>2</sub>
        </span>
      );
    } else {
      return ponderable.ponderableName;
    }
  } else {
    return ponderable.ponderableName;
  }
}

export function getQueryParams(history) {
  const search = history.location.search;
  let userData = '';
  let locale = '';
  if (search) {
    const values = queryString.parse(search, { decode: false });
    userData = values.user_data;
    locale = values.locale;
  }
  return { userData, locale };
}

export function getTotalHeaderAndFooterHeight(isMobile) {
  let headerHeight = document.getElementsByClassName('appHeader');
  let headerTabsHeight = 0;
  let footerTabsHeight = 0;

  headerHeight = headerHeight.length ? headerHeight[0].clientHeight : 50;
  if (isMobile) {
    headerTabsHeight = document.getElementsByClassName('headerTabs');
    footerTabsHeight = document.getElementsByClassName('footerTabs');

    headerTabsHeight = headerTabsHeight.length ? headerTabsHeight[0].clientHeight : 42;
    footerTabsHeight = footerTabsHeight.length ? footerTabsHeight[0].clientHeight : 45;
  }

  return headerHeight + headerTabsHeight + footerTabsHeight;
}

export function filterPonderables(ponderables) {
  if (!ponderables) return [];
  // available charts only for
  const chartsPonderables = ['fuel', 'co2', 'freight'];
  return ponderables.filter(item => {
    return chartsPonderables.includes(item.ponderableCode);
  });
}

export function getDefaultPonderable(ponderables, selectedPonderable) {
  selectedPonderable = selectedPonderable || '';
  if (ponderables) {
    let ponderable = '';
    if (selectedPonderable) {
      ponderable = ponderables.find(item => item.ponderableCode === selectedPonderable);
    }
    if (!ponderable) {
      ponderable = ponderables.find(item => item.defaultPonderable === true);
    }
    if (ponderable) {
      return ponderable.ponderableCode;
    }
  }
  return 'freight';
}
