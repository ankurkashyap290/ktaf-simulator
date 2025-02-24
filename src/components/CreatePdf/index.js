/* eslint new-cap: [0] */
/* eslint prefer-arrow-callback: [0] */
/* eslint no-unused-vars: [0] */
import React from 'react';
import { Button } from 'antd';
import jsPDF from 'jspdf-new';
// import html2canvas from 'html2canvas';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import BaseTable from '../BaseTable';
import IntlMessages from '../Misc/intlMessages';
import { logo, logoText } from '../../utils/logoBase64';
import { getThousandSeparator, transformPonderableName, filterPonderables } from '../../utils';
import styles from './index.module.less';
import { localeMessages, apiUrl, API_VERSION } from '../../configs/app.config';
import request from '../../utils/request';

const API_URL = apiUrl('');

const tempLogo =
  '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 423.543 100"><path fill="#807F83" class="light" d="M65.939,0.241c0.044-0.1-0.016-0.191-0.1-0.225L20.682,38.612l16.355,23.112c1.492-1.273,2.704-2.868,3.531-4.692"/><path fill="#807F83" class="light" d="M137.018,42.466L68.17,0.053c-0.09-0.057-0.185-0.057-0.271-0.032l29.703,38.752l39.234,4.24C137.147,43.05,137.289,42.634,137.018,42.466"/><path fill="#807F83" class="light" d="M19.271,20.372c1.852,0.049,3.674-0.349,5.337-1.159L62.913,0.582c0.084-0.041,0.124-0.14,0.095-0.225c-0.029-0.087-0.126-0.138-0.207-0.107L1.276,19.428c-0.245,0.075-0.2,0.423,0.05,0.431"/><path fill="#61A659" d="M2.58,70.36c-0.351,0.613,0.209,1.34,0.887,1.169l28.093-6.98c2.045-0.506,3.907-1.486,5.477-2.825L20.684,38.612"/><path fill="#61A659" d="M67.643,0.306L62.16,62.481c-0.156,1.817,0.312,3.561,1.236,5.014l34.205-28.722L67.898,0.021C67.769,0.057,67.664,0.158,67.643,0.306"/><path fill="#61A659" d="M70.816,0.098c-0.087-0.031-0.182,0.015-0.206,0.104c-0.038,0.085,0.009,0.183,0.088,0.227l26.146,13.266c1.618,0.824,3.353,1.405,5.141,1.726l28.973,5.133c0.152,0.031,0.285-0.064,0.316-0.206c0.045-0.147-0.037-0.295-0.177-0.336L100.278,8.61"/><path fill="#FFD200" d="M65.691,0.019L0.155,39.392c-0.283,0.169-0.15,0.603,0.178,0.578l20.351-1.358L65.84,0.016C65.798-0.004,65.747-0.007,65.691,0.019"/><path fill="#FFD200" d="M67.879,70.852l45.59,13.364c0.734,0.213,1.388-0.494,1.139-1.206L97.601,38.772L63.397,67.495C64.413,69.071,65.972,70.299,67.879,70.852"/><path fill="#FFD200" d="M108.973,19.474c-0.043,0.157,0.029,0.323,0.174,0.399l43.859,22.258c0.129,0.066,0.285-0.003,0.326-0.145c0.051-0.169,0.004-0.352-0.112-0.472l-10.999-11.9c-1.213-1.319-2.777-2.267-4.507-2.725l-28.402-7.615C109.16,19.241,109.011,19.324,108.973,19.474"/><path fill="#807F83" class="light" d="M205.129,50.842c-0.133-0.215-0.448-0.215-0.588,0L183.68,82.595c-0.136,0.192,0.004,0.431,0.244,0.431h7.204c0.334,0,0.635-0.157,0.824-0.431l5.071-7.715h15.632l5.066,7.715c0.177,0.274,0.485,0.431,0.811,0.431h7.224c0.229,0,0.377-0.239,0.243-0.431 M200.49,69.596l4.345-6.616l4.355,6.616H200.49z"/><path fill="#807F83" class="light" d="M326.19,50.842c-0.148-0.215-0.449-0.215-0.585,0l-20.879,31.753c-0.132,0.192,0.018,0.431,0.24,0.431h7.226c0.332,0,0.632-0.157,0.816-0.431l5.065-7.715h15.632l5.065,7.715c0.176,0.274,0.497,0.431,0.832,0.431h7.213c0.232,0,0.359-0.239,0.232-0.431 M321.551,69.596l4.341-6.616l4.34,6.616H321.551z"/><path fill="#807F83" class="light" d="M407.818,57.555h15.19c0.296,0,0.534-0.237,0.534-0.54V52.79c0-0.286-0.238-0.523-0.534-0.523h-18.524c-8.478,0-15.387,6.883-15.387,15.396c0,8.481,6.909,15.363,15.387,15.363h18.524c0.312,0,0.534-0.23,0.534-0.534v-4.186c0-0.29-0.238-0.528-0.534-0.528h-15.19c-5.588,0-10.127-4.503-10.127-10.106C397.69,62.076,402.229,57.555,407.818,57.555"/><path fill="#807F83" class="light" d="M173.525,52.267c-0.335,0-0.661,0.12-0.925,0.348l-19.245,17.059V52.789c0-0.286-0.247-0.522-0.541-0.522h-7.016c-0.292,0-0.524,0.236-0.524,0.522v31.692c0,0.208,0.234,0.318,0.391,0.185l16.279-14.14l9.939,12.1c0.227,0.256,0.541,0.4,0.878,0.4h9.009c0.201,0,0.313-0.239,0.188-0.388L167.391,65.86l15.207-13.245c0.118-0.114,0.049-0.348-0.138-0.348"/><path fill="#807F83" class="light" d="M377.12,70.157c1.552-0.155,2.816-0.437,4.008-0.918c3.009-1.265,4.712-4.155,4.712-7.927c0-2.489-0.822-4.588-2.41-6.213c-1.99-2.063-4.566-2.839-9.093-2.839h-23.556c-0.303,0-0.531,0.241-0.531,0.525v29.722c0,0.287,0.228,0.519,0.531,0.519h7.003c0.296,0,0.535-0.232,0.535-0.519V70.299h10.302l8.324,12.301c0.189,0.265,0.494,0.426,0.824,0.426h8.2c0.224,0,0.35-0.232,0.208-0.414 M371.65,65.037h-12.805c-0.29,0-0.526-0.237-0.526-0.531v-6.428c0-0.291,0.236-0.523,0.526-0.523h14.056c3.409,0,5.084,1.178,5.084,3.67C377.985,64.028,376.31,65.037,371.65,65.037"/><path fill="#807F83" class="light" d="M253.181,52.26H229.63c-0.304,0-0.535,0.241-0.535,0.525v29.727c0,0.287,0.231,0.514,0.535,0.514h7.013c0.303,0,0.534-0.227,0.534-0.514V70.284h16.004c2.986,0,4.937-0.302,6.775-1.045c3.013-1.265,4.714-4.155,4.714-7.927c0-2.489-0.821-4.588-2.401-6.213C260.293,53.036,257.689,52.26,253.181,52.26M250.492,65.037H237.71c-0.298,0-0.533-0.237-0.533-0.531v-6.428c0-0.291,0.235-0.523,0.533-0.523h14.034c3.416,0,5.076,1.178,5.076,3.67C256.82,64.028,255.16,65.037,250.492,65.037"/><path fill="#807F83" class="light" d="M291.784,65.003h-10.12c-3.422,0-5.087-1.187-5.087-3.682c0-2.796,1.665-3.799,6.324-3.799h17.189c0.289,0,0.533-0.244,0.533-0.528V52.79c0-0.286-0.244-0.523-0.533-0.523h-19.872c-3.007,0-4.928,0.305-6.787,1.05c-3.005,1.266-4.706,4.155-4.706,7.92c0,2.498,0.819,4.585,2.397,6.222c1.985,2.052,4.58,2.84,9.096,2.84h10.143c3.422,0,5.076,1.177,5.076,3.683c0,2.793-1.654,3.789-6.324,3.789H269.78c-0.282,0-0.519,0.255-0.519,0.535v4.206c0,0.287,0.237,0.514,0.519,0.514h22.003c3.005,0,4.947-0.3,6.799-1.048c2.986-1.268,4.696-4.148,4.696-7.915c0-2.501-0.825-4.587-2.394-6.22C298.896,65.789,296.318,65.003,291.784,65.003"/></svg>';

function createChartImage(el) {
  return new Promise((resolve, reject) => {
    const clonedSvg = el.getElementsByClassName('recharts-surface')[0].cloneNode(true);
    clonedSvg.setAttribute('width', '1280');
    clonedSvg.setAttribute('height', '600');
    const svgXml = new XMLSerializer().serializeToString(clonedSvg);
    const svg64 = btoa(svgXml);
    const img = new Image();
    const canvasEl = document.createElement('canvas');
    canvasEl.width = 1280;
    canvasEl.height = 700;
    img.src = `data:image/svg+xml;base64,${svg64}`;
    img.addEventListener(
      'load',
      () => {
        console.log('Image loaded');
        canvasEl.getContext('2d').drawImage(img, 0, 0);
      },
      false
    );
    setTimeout(() => {
      console.log('Image not loaded');
      resolve(canvasEl);
    }, 2000);
  });
}

class TempCreatePdf extends React.Component {
  state = {
    chartImagesPath: [],
  };

  componentDidMount() {
    const {
      chartImages,
      globalParameters: { ponderables },
      locale,
      selectedParams,
      compareScenariosData,
    } = this.props;
    if (chartImages.length > 0) {
      chartImages.map((el, index) => {
        return createChartImage(el).then(canvas => {
          const { chartImagesPath } = this.state;
          const ponderableText =
            locale === 'ar'
              ? `${localeMessages[`graphCarouselCardTitle_${locale}`]} ${transformPonderableName(
                  ponderables[index],
                  true
                )}  -  ${ponderables[index].unit}`
              : `${localeMessages[`graphCarouselCardTitle_${locale}`]} ${transformPonderableName(
                  ponderables[index],
                  true
                )}( ${ponderables[index].unit} )`;
          const zoneName = this.getSelectedParam(selectedParams.zoneId, 'zones', 'zoneName');
          const modeName = this.getSelectedParam(selectedParams.modeId, 'modes', 'modeName');
          const sectorName = this.getSelectedParam(
            selectedParams.sectorId,
            'sectors',
            'sectorName'
          );
          const technologyName = this.getSelectedParam(
            selectedParams.technologyId,
            'technology',
            'technologyName'
          );

          const legends =
            compareScenariosData.length > 0
              ? compareScenariosData.map(data => {
                  return {
                    name: data.name,
                    color: data.stokeColor,
                  };
                })
              : [];
          legends.push({ name: localeMessages[`baseLine_${locale}`], color: '#8884d8' });
          const selectedParamsText = `${localeMessages[`ponderableZone_${locale}`]}: ${zoneName}, ${
            localeMessages[`ponderableMode_${locale}`]
          }: ${modeName}, ${localeMessages[`ponderableSector_${locale}`]} : ${sectorName}, ${
            localeMessages[`ponderableTechnology_${locale}`]
          } : ${technologyName}`;

          const tempCanvas = this.watermarkedDataURL(
            canvas,
            ponderableText,
            selectedParamsText,
            legends
          );
          this.setState({
            chartImagesPath: [...chartImagesPath, tempCanvas.toDataURL('image/png')],
          });
        });
      });
    }
  }

  componentWillUnmount() {
    this.setState({ chartImagesPath: [] });
  }

  watermarkedDataURL = (canvas, ponderableText, selectedParamsText, legends) => {
    const { locale } = this.props;
    const tempCanvas = canvas;
    const tempCtx = tempCanvas.getContext('2d');
    if (locale === 'ar') {
      tempCtx.font = '16px Amiri';
      tempCtx.textAlign = 'right';
      tempCtx.fillText(ponderableText, tempCanvas.width - 10, 20);
      tempCtx.fillText(selectedParamsText, tempCanvas.width - 10, 50);
    } else {
      tempCtx.font = '16px  Arial';
      tempCtx.fillText(ponderableText, 10, 20);
      tempCtx.fillText(selectedParamsText, 10, 50);
    }
    if (legends.length > 0) {
      let labelWidth = 50;
      let labelY = 470;
      if (locale === 'ar') {
        labelWidth = tempCanvas.width - 10;
      }
      for (let index = legends.length - 1; index >= 0; index -= 1) {
        tempCtx.fillStyle = legends[index].color;
        if (labelWidth >= tempCanvas.width) {
          labelWidth = 50;
          labelY += 50;
          if (locale === 'ar') {
            labelWidth = tempCanvas.width - 10;
          }
        }
        if (locale === 'ar') {
          tempCtx.fillRect(labelWidth, labelY - 10, 10, 10);
          tempCtx.fillText(legends[index].name, labelWidth - 10, labelY);
          labelWidth -= tempCtx.measureText(legends[index].name).width + 20;
        } else {
          tempCtx.fillRect(labelWidth - 10, labelY - 30, 10, 10);
          tempCtx.fillText(legends[index].name, labelWidth + 10, labelY);
          labelWidth += tempCtx.measureText(legends[index].name).width + 20;
        }
      }
    }
    return tempCanvas;
  };

  getSelectedParam = (value, entityName, entityFieldName) => {
    const { globalParameters } = this.props;
    const founded = globalParameters[entityName].find(rec => rec.id === value);
    return founded[entityFieldName];
  };

  downloadPdfFile = () => {
    const {
      selectedCountry,
      countryChartBau,
      mapData,
      appliedScenario,
      mapImage,
      selectedPonderable,
      chartImages,
      direction,
      selectedYear,
      downloadPdfReceive,
      locale,
      onDownloadSuccess,
      selectedFileType,
    } = this.props;

    const mapImagePath = mapImage ? mapImage() : null;
    const { chartImagesPath } = this.state;
    const chartData =
      countryChartBau && countryChartBau.ponderables.length > 0
        ? countryChartBau.ponderables.map(item => {
            return { ponderable: item.ponderableCode, chartData: item.chartData };
          })
        : [];
    let chartImage = null;
    if (chartImagesPath.length > 0) {
      chartImage = {
        fuelImage: chartImagesPath[0].replace('data:image/png;base64,', ''),
        co2Image: chartImagesPath[1].replace('data:image/png;base64,', ''),
        freightImage: chartImagesPath[2].replace('data:image/png;base64,', ''),
      };
    }

    const appliedPolicyData = appliedScenario
      ? this.getSavedScenarioData()
      : this.getAppliedPoliciesData();
    const payload = {
      countryId: selectedCountry.id,
      mapImage: mapImagePath ? mapImagePath.replace('data:image/png;base64,', '') : null,
      mapData: mapData ? mapData.data : [],
      chartsImage: chartImage || null,
      chartsData: chartData,
      locale,
      appliedPolicies: appliedPolicyData,
      scenario: appliedScenario,
      fileType: selectedFileType,
    };

    request(
      `${API_URL}/api/${API_VERSION}files`,
      {
        method: 'POST',
        body: {
          ...payload,
        },
        headers: { locale },
      },
      'string'
    )
      .then(async response => {
        if (response.data) {
          const linkSource = `data:application/pdf;base64,${response.data}`;
          const link = document.createElement('a');
          link.href = linkSource;
          link.setAttribute('download', `download.pdf`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          downloadPdfReceive();
          onDownloadSuccess();
        } else {
          onDownloadSuccess();
        }
      })
      .catch(error => {
        downloadPdfReceive();
        onDownloadSuccess();
      });
  };

  getAppliedPoliciesColumns = () => {
    const { locale } = this.props;
    const columns = [
      {
        title: localeMessages[`policyName_${locale}`],
        dataIndex: 'policyName',
        key: 'policyName',
      },
      {
        title: localeMessages[`year_${locale}`],
        dataIndex: 'year',
        key: 'year',
      },
      {
        title: localeMessages[`percentage_${locale}`],
        dataIndex: 'percentage',
        key: 'percentage',
      },
    ];

    return columns;
  };

  getAppliedPoliciesData = () => {
    const { appliedPolicies } = this.props;
    const data = [];
    if (appliedPolicies && appliedPolicies.length > 0) {
      appliedPolicies.map((policy, index) => {
        const tempData = {
          key: `appliedPolicy_${index}`,
          policyName: policy.policyName,
          year: policy.year,
          percentage: policy.sliderValue,
        };
        data.push(tempData);
        return tempData;
      });
    }
    return data;
  };

  getSavedScenarioData = () => {
    const { savedScenarios, appliedScenario } = this.props;
    const data = [];
    let foundedPolicies = [];
    if (savedScenarios && savedScenarios.length > 0) {
      const matchedScenario = savedScenarios.find(scenario => scenario.name === appliedScenario);
      if (matchedScenario) {
        foundedPolicies = [...matchedScenario.appliedPolicies];
      }
    } else {
      foundedPolicies = [];
    }
    if (foundedPolicies.length > 0) {
      foundedPolicies.map((policy, index) => {
        const tempData = {
          key: `savedScenario-${index}`,
          policyName: policy.policyName,
          year: policy.year,
          percentage: policy.sliderValue,
        };
        data.push(tempData);
        return tempData;
      });
    }

    return data;
  };

  getChartTableColumns = () => {
    const { compareScenariosData, locale } = this.props;
    const columns = [
      {
        title: localeMessages[`year_${locale}`],
        dataIndex: 'year',
        key: 'year',
      },
      {
        title: localeMessages[`value_${locale}`],

        dataIndex: 'value',
        key: 'value',
      },
    ];
    if (compareScenariosData.length) {
      compareScenariosData.map((scenario, index) => {
        const newColumn = {
          title: scenario.name,
          dataIndex: scenario.name,
          key: `scenario_col_${+new Date() * index}`,
        };
        columns.push({ ...newColumn });
        return newColumn;
      });
    }
    return columns;
  };

  getMapTableData = () => {
    const { mapData } = this.props;
    console.log('mapData', mapData);
    const data = [];
    if (mapData && mapData.data.length > 0) {
      mapData.data.map((map, index) => {
        const tempData = {
          key: `mapData_${index}`,
          region: map.region,
          freight: getThousandSeparator(map.freight),
          co2: getThousandSeparator(map.co2),
          fuel: getThousandSeparator(map.fuel),
          gdp: getThousandSeparator(map.gdp),
          employment: getThousandSeparator(map.employment),
        };
        data.push(tempData);
        return tempData;
      });
    }

    return data;
  };

  getMapTableColumns = () => {
    const {
      globalParameters: { ponderables },
      locale,
      selectedCountry,
      selectedYear,
    } = this.props;
    let tempPonderables = ponderables;
    if (selectedCountry && selectedCountry.id === 1 && selectedYear > 2017) {
      tempPonderables = filterPonderables(ponderables);
    }
    const columns = [];
    columns.push({ title: localeMessages[`region_${locale}`], dataIndex: 'region' });

    tempPonderables.map((rec, index) => {
      const newColumn = {
        title: transformPonderableName(rec),
        dataIndex: rec.ponderableCode,
        key: `ponderable_col_${+new Date() * index}`,
      };
      columns.push(newColumn);
      return true;
    });

    return columns;
  };

  getChartTableData = chartData => {
    const { compareScenariosData } = this.props;
    const data = [];
    if (chartData && chartData.length > 0) {
      chartData.map((chart, index) => {
        const tempData = {
          key: `chartData_${index}`,
          year: chart.year,
          value: getThousandSeparator(chart.value),
        };
        if (compareScenariosData.length) {
          compareScenariosData.map(scenario => {
            tempData[scenario.name] = chart[scenario.name] || '';
            return scenario.name;
          });
        }
        data.push(tempData);
        return tempData;
      });
    }
    return data;
  };

  getPonderableName = ponderableCode => {
    const {
      globalParameters: { ponderables },
    } = this.props;
    const ponderable = ponderables.find(item => item.ponderableCode === ponderableCode);
    return transformPonderableName(ponderable);
  };

  renderChartImages = chartImagesPath => {
    const {
      compareScenariosData,
      globalParameters: { ponderables },
      locale,
    } = this.props;
    if (chartImagesPath.length > 0)
      return (
        <React.Fragment>
          <h4 style={{ marginTop: '10px' }}>
            <IntlMessages id="createPdf.chartImage.heading" /> {` `}
            {compareScenariosData.length ? (
              <IntlMessages id="createPdf.chartImage.heading.compareScenario" />
            ) : (
              ''
            )}
          </h4>
          <div>
            {chartImagesPath.map((chart, index) => {
              return (
                <img
                  key={`chart_img_${+new Date() * index}`}
                  src={chart}
                  alt="chart.png"
                  style={{ width: '100%' }}
                />
              );
            })}
          </div>
        </React.Fragment>
      );
    else {
      return null;
    }
  };

  render() {
    const {
      selectedCountry,
      countryChartBau,
      mapData,
      appliedScenario,
      mapImage,
      selectedPonderable,
      chartImages,
      direction,
    } = this.props;

    const mapImagePath = mapImage ? mapImage() : null;
    const { chartImagesPath } = this.state;
    const date = moment(new Date());

    return chartImages.length === chartImagesPath.length ? (
      <React.Fragment>
        <Scrollbars style={{ height: '700px' }} renderThumbVertical={this.renderThumb}>
          <div
            id="html2pdf"
            style={{ width: '100%', backgroundColor: '#fff', fontSize: '14px' }}
            className={styles.html2pdf}
          >
            <header>
              <div style={{ width: '100%' }} dir={direction}>
                <img src={logo} alt="kapsrac-logo" style={{ width: '180px', float: 'left' }} />
                <img
                  src={logoText}
                  alt="kapsrac-logoText"
                  style={{ width: '180px', float: 'right' }}
                />
              </div>
              <div style={{ clear: 'both' }}>&nbsp;</div>
            </header>
            <h1 dir={direction} style={{ textAlign: 'center' }}>
              <IntlMessages id="createPdf.heading" /> - {selectedCountry && selectedCountry.name}
              <br />
              <span style={{ fontSize: '14px' }}>{date.format('YYYY MMM D H:mm:ss')}</span>
            </h1>
            <div>
              {appliedScenario ? (
                <BaseTable
                  columns={this.getAppliedPoliciesColumns()}
                  data={this.getSavedScenarioData()}
                  title={
                    <div dir={direction} style={{ textAlign: 'center' }}>
                      <IntlMessages id="createPdf.listOfAppliedPoliciesFor" />
                      {`, ${appliedScenario}`}
                    </div>
                  }
                />
              ) : (
                <BaseTable
                  columns={this.getAppliedPoliciesColumns()}
                  data={this.getAppliedPoliciesData()}
                  title={
                    <div dir={direction} style={{ textAlign: 'center' }}>
                      <IntlMessages id="createPdf.listOfAppliedPolicies" />{' '}
                    </div>
                  }
                />
              )}
            </div>
            {mapImagePath ? (
              <div>
                <h4 style={{ textAlign: 'center', marginTop: '10px' }} dir={direction}>
                  {this.getPonderableName(selectedPonderable)} &nbsp;
                  <IntlMessages id="createPdf.choroPlethPondreableMapImage" />
                </h4>
                <img src={mapImagePath} alt="map.png" style={{ width: '100%' }} />
              </div>
            ) : null}
            <div style={{ marginTop: '20px' }}>
              {mapData && mapData.data.length > 0 ? (
                <BaseTable
                  columns={this.getMapTableColumns()}
                  data={this.getMapTableData()}
                  title={
                    <div dir={direction} style={{ textAlign: 'center' }}>
                      <IntlMessages id="createPdf.choroPlethMapImage" />
                    </div>
                  }
                />
              ) : null}
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              {this.renderChartImages(chartImagesPath)}
            </div>
            <div>
              {countryChartBau && countryChartBau.ponderables && countryChartBau.ponderables.length
                ? countryChartBau.ponderables.map((ponderable, index) => {
                    return (
                      <div
                        style={{ marginTop: '20px' }}
                        key={`ponderable_data_key_${ponderable.ponderableCode}_${+new Date() *
                          index}`}
                      >
                        <BaseTable
                          columns={this.getChartTableColumns()}
                          data={this.getChartTableData(ponderable.chartData)}
                          title={
                            <div dir={direction} style={{ textAlign: 'center' }}>
                              <IntlMessages id="createPdf.choroPlethChartDataTitle" /> -{' '}
                              {this.getPonderableName(ponderable.ponderableCode)}{' '}
                              <IntlMessages id="createPdf.consumptionData" />
                            </div>
                          }
                        />
                      </div>
                    );
                  })
                : null}
            </div>
            <footer style={{ marginTop: '20px' }}>
              <p
                style={{
                  fontSize: '8px',
                }}
              >
                King Abdullah Petroleum Studies and Research Center
                <br />
                P.O. Box 88550 Riyadh 11672 Saudi Arabia
              </p>
              <p style={{ fontSize: '8px' }}>www.kapsarc.org</p>
            </footer>
          </div>
        </Scrollbars>
      </React.Fragment>
    ) : (
      <div>
        <IntlMessages id="simulator.createPdf.pleaseWait" />
      </div>
    );
  }
}
export default TempCreatePdf;
