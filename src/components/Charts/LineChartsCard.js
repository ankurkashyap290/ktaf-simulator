/* eslint-disable no-unneeded-ternary */
import React from 'react';
import { Card, Select, Row, Col, Modal } from 'antd';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  // Bar,
  // ComposedChart,
  // Label,
  // ReferenceArea,
  LineChart,
} from 'recharts';
// import { Scrollbars } from 'react-custom-scrollbars';
import IntlMessages from '../Misc/intlMessages';
import { getThousandSeparator } from '../../utils';
import ltrStyles from './ltr.module.less';
import rtlStyles from './rtl.module.less';
import './lineChart.css';

const Option = Select.Option;
let styles = {};
let canvasCtx = null;
const measureText = text => {
  if (!canvasCtx) {
    canvasCtx = document.createElement('canvas').getContext('2d');
    canvasCtx.font = '14px "Helvetica Neue"';
  }
  return canvasCtx.measureText(text).width;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload.length) {
    return (
      <div
        className="recharts-default-tooltip"
        style={{
          margin: '0px',
          padding: '10px',
          backgroundColor: '#FFF',
          border: '1px solid rgb(204, 204, 204)',
          whiteSpace: 'nowrap',
        }}
      >
        <p className="recharts-tooltip-label">
          <IntlMessages id="policiesCollapse.year" />: {payload[0].payload.year}
        </p>
        {payload.map(item => {
          return (
            <p
              className="recharts-tooltip-label"
              key={`custom-tooltip-${item.dataKey}`}
              style={{ color: `${item.stroke}` }}
            >
              {item.dataKey === 'value' ? (
                <IntlMessages id="global.chart.baseLine" />
              ) : (
                item.dataKey
              )}
              : {getThousandSeparator(item.value)}
            </p>
          );
        })}
      </div>
    );
  }

  return null;
};

class LineChartCard extends React.Component {
  state = {
    modelOpen: null,
    chartZoomHeight: 600,
    opacity: {},
  };

  componentDidMount() {
    const { compareScenariosData } = this.props;
    const opacity = {
      value: 1,
    };
    if (compareScenariosData.length > 0) {
      compareScenariosData.map(item => {
        opacity[item.name] = 1;
        return opacity;
      });
    }
    this.setState({ opacity });
  }

  componentDidUpdate(prevProps) {
    const { compareScenariosData } = this.props;
    const { opacity } = this.state;
    if (compareScenariosData.length !== prevProps.compareScenariosData.length) {
      compareScenariosData.map(item => {
        opacity[item.name] = 1;
        return opacity;
      });

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ opacity });
    }
  }

  handleChange = (type, value) => {
    const { fetchChartData } = this.props;
    const tempSelect = {
      type,
      id: value,
    };
    fetchChartData(tempSelect);
  };

  handleMagnify = value => {
    this.setState({ modelOpen: value });
  };

  handleModel = () => {
    this.setState({ modelOpen: null, chartZoomHeight: 500 });
  };

  getSelectedParam = (value, entityName, entityFieldName) => {
    const { menuData } = this.props;
    const founded = menuData[entityName].find(rec => rec.id === value);
    if (founded) {
      return founded[entityFieldName];
    } else {
      return 'All';
    }
  };

  handleZoomIn = () => {
    const { chartZoomHeight } = this.state;
    this.setState({ chartZoomHeight: chartZoomHeight + 200 });
  };

  handleZoomOut = () => {
    const { chartZoomHeight } = this.state;
    if (chartZoomHeight > 500) {
      this.setState({ chartZoomHeight: chartZoomHeight - 200 });
    }
  };

  handleLegendClick = value => {
    const { opacity } = this.state;
    const { compareScenariosData } = this.props;
    if (compareScenariosData.length > 0) {
      if (opacity[value.dataKey] === 1) {
        opacity[value.dataKey] = 0;
      } else {
        opacity[value.dataKey] = 1;
      }
    }
    this.setState({ opacity });
  };

  getLeftMargin = data => {
    let leftMargin = 0;
    data.forEach(item => {
      const textWidth = measureText(item.value);
      if (textWidth > leftMargin) {
        leftMargin = textWidth;
      }
    });
    // We have pixel-perfect measurements for the width of our labels, but we also need to account for the default spacing.
    leftMargin = Math.max(0, leftMargin - 50);
    return leftMargin;
  };

  render() {
    const {
      cardTitle,
      cardHeight,
      graphData,
      menuData,
      compareScenariosData,
      selectedParams,
      selectedCard,
      direction,
      isMobile,
    } = this.props;

    const { modelOpen, chartZoomHeight, opacity } = this.state;
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;
    const chartData = graphData && Object.keys(graphData).length ? graphData.chartData : [];
    return (
      <React.Fragment>
        {direction === 'rtl' ? (
          <Row gutter={0} style={{ paddingBottom: '7px' }}>
            <Col span={2} style={{ paddingLeft: '17px' }}>
              {!isMobile ? (
                <img
                  src="/images/zoom.png"
                  alt="zoom.png"
                  onClick={() => this.handleMagnify(selectedCard)}
                  width="20px"
                  height="20px"
                  style={{ cursor: 'pointer' }}
                  data-html2canvas-ignore
                />
              ) : null}
            </Col>
            <Col span={22} data-html2canvas-ignore>
              {cardTitle}
            </Col>
          </Row>
        ) : (
          <Row gutter={0} style={{ paddingBottom: '7px' }}>
            <Col span={22} data-html2canvas-ignore>
              {cardTitle}
            </Col>
            <Col span={2}>
              {!isMobile ? (
                <img
                  src="/images/zoom.png"
                  alt="zoom.png"
                  onClick={() => this.handleMagnify(selectedCard)}
                  width="20px"
                  height="20px"
                  style={{ cursor: 'pointer' }}
                  data-html2canvas-ignore
                />
              ) : null}
            </Col>
          </Row>
        )}
        <Row gutter={0} style={{ padding: '0px 10px 10px 10px' }} data-html2canvas-ignore>
          <Col span={24}>
            <Row gutter={4}>
              <Col span={6}>
                <div className={styles.cardSelectLabel}>
                  <IntlMessages id="global.chart.ponderable.zone" />
                </div>
                <Select
                  value={selectedParams.zoneId || null}
                  placeholder={<IntlMessages id="global.chart.dropDown.placeholder" />}
                  className={styles.cardSelectMenu}
                  onChange={value => this.handleChange('zones', value)}
                >
                  {menuData.zones.map(zone => (
                    <Option value={zone.id} key={`zone_${zone.id}`} disabled={!zone.status}>
                      {zone.zoneName}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <div className={styles.cardSelectLabel}>
                  <IntlMessages id="global.chart.ponderable.mode" />
                </div>
                <Select
                  value={selectedParams.modeId || null}
                  className={styles.cardSelectMenu}
                  onChange={value => this.handleChange('modes', value)}
                  placeholder={<IntlMessages id="global.chart.dropDown.placeholder" />}
                >
                  {menuData.modes.map(mode => (
                    <Option value={mode.id} key={`mode_${mode.id}`} disabled={!mode.status}>
                      {mode.modeName}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <div className={styles.cardSelectLabel}>
                  <IntlMessages id="global.chart.ponderable.technology" />
                </div>
                <Select
                  value={selectedParams.technologyId || null}
                  placeholder={<IntlMessages id="global.chart.dropDown.placeholder" />}
                  className={styles.cardSelectMenu}
                  onChange={value => this.handleChange('technology', value)}
                >
                  {menuData.technology.map(technology => (
                    <Option
                      value={technology.id}
                      key={`technology_${technology.id}`}
                      disabled={!technology.status}
                    >
                      {technology.technologyName}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <div className={styles.cardSelectLabel}>
                  <IntlMessages id="global.chart.ponderable.sector" />
                </div>
                <Select
                  value={selectedParams.sectorId || null}
                  placeholder={<IntlMessages id="global.chart.dropDown.placeholder" />}
                  className={styles.cardSelectMenu}
                  onChange={value => this.handleChange('sector', value)}
                >
                  {menuData.sectors.map(sector => (
                    <Option value={sector.id} key={`sector_${sector.id}`} disabled={!sector.status}>
                      {sector.sectorName}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={0}>
          <Card
            loading={chartData.length <= 0}
            style={{ width: '100%', height: `${cardHeight}px`, border: '0px' }}
            headStyle={{ minHeight: '0px', padding: '0px', border: '0px' }}
            bodyStyle={{ padding: '0px 10px 0px 0px' }}
          >
            {chartData.length > 0 ? (
              <ResponsiveContainer
                height={isMobile ? cardHeight : cardHeight - 60}
                width="100%"
                ref={ref => (this.chartRef = ref)}
              >
                <LineChart
                  data={graphData.chartData}
                  margin={{ top: 5, left: this.getLeftMargin(graphData.chartData) }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    type="number"
                    dataKey="value"
                    interval={0}
                    tickFormatter={tickItem => getThousandSeparator(tickItem)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    formatter={value =>
                      value === 'value' ? <IntlMessages id="global.chart.baseLine" /> : value
                    }
                    onClick={e => this.handleLegendClick(e)}
                    data-html2canvas-ignore
                  />
                  <Line
                    type="monotone"
                    stackId="1"
                    strokeOpacity={opacity.value}
                    dataKey="value"
                    stroke="#8884d8"
                    strokeWidth="2"
                    activeDot={{ r: opacity.value }}
                  />
                  {compareScenariosData.length > 0
                    ? compareScenariosData.map(item => (
                        <Line
                          type="monotone"
                          stackId="1"
                          key={item.name}
                          dataKey={item.name}
                          stroke={item.stokeColor}
                          strokeWidth="2"
                          strokeOpacity={opacity[item.name]}
                          activeDot={{ r: opacity[item.name] }}
                        />
                      ))
                    : null}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <intlMessages id="global.loading" />
            )}
          </Card>
        </Row>
        <Modal
          closable
          visible={modelOpen === selectedCard ? true : false}
          onCancel={this.handleModel}
          width="80vw"
          footer={null}
        >
          <Card
            loading={chartData.length <= 0}
            style={{ width: '100%', border: '0px' }}
            headStyle={{ minHeight: '0px', padding: '0px', border: '0px' }}
            bodyStyle={{ padding: '0px 16px 0px 0px' }}
            title={
              <div style={{ display: 'flex' }}>
                <div className={styles.cardTitle} dir={direction}>
                  {cardTitle}
                  <span style={{ paddingLeft: '20px' }}>
                    <IntlMessages id="global.chart.ponderable.zone" />:{' '}
                    {this.getSelectedParam(selectedParams.zoneId, 'zones', 'zoneName')}
                    {', '}
                    <IntlMessages id="global.chart.ponderable.mode" />:{' '}
                    {this.getSelectedParam(selectedParams.modeId, 'modes', 'modeName')}
                    {', '}
                    <IntlMessages id="global.chart.ponderable.sector" />:{' '}
                    {this.getSelectedParam(selectedParams.sectorId, 'sectors', 'sectorName')}
                    {', '}
                    <IntlMessages id="global.chart.ponderable.technology" />:{' '}
                    {this.getSelectedParam(
                      selectedParams.technologyId,
                      'technology',
                      'technologyName'
                    )}
                  </span>
                </div>
              </div>
            }
          >
            {chartData.length > 0 ? (
              <ResponsiveContainer height={chartZoomHeight} width="100%">
                <LineChart
                  data={graphData.chartData}
                  margin={{ top: 5, left: this.getLeftMargin(graphData.chartData) }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    type="number"
                    interval={0}
                    dataKey="value"
                    tickFormatter={tickItem => getThousandSeparator(tickItem)}
                    width={140}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    formatter={value =>
                      value === 'value' ? <IntlMessages id="global.chart.baseLine" /> : value
                    }
                    onClick={e => this.handleLegendClick(e)}
                    data-html2canvas-ignore
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stackId="1"
                    stroke="#8884d8"
                    strokeWidth="2"
                    strokeOpacity={opacity.value}
                    activeDot={{ r: opacity.value }}
                  />

                  {compareScenariosData.length > 0
                    ? compareScenariosData.map(item => (
                        <Line
                          type="monotone"
                          stackId="1"
                          key={item.name}
                          dataKey={item.name}
                          stroke={item.stokeColor}
                          strokeWidth="2"
                          strokeOpacity={opacity[item.name]}
                          activeDot={{ r: opacity[item.name] }}
                        />
                      ))
                    : null}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <intlMessages id="global.loading" />
            )}
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}
export default LineChartCard;
