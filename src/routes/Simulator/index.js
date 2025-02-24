/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-shadow */
/* eslint no-unneeded-ternary: [0] */
import React from 'react';
import { connect } from 'react-redux';
import {
  Drawer,
  Icon,
  Tabs,
  List,
  Button,
  Progress,
  Row,
  Col,
  Popconfirm,
  Modal,
  Card,
  message,
} from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import { ACTIONS as JOYRIDE_ACTIONS, LIFECYCLE as JOYRIDE_LIFECYCLE } from 'react-joyride';
import WindowSizeListener from 'react-window-size-listener';
import Mapbox from '../../components/Mapbox';
import PoliciesCollapse from '../../components/PoliciesCollapse';
import PreDefinedPolicies from '../../components/PreDefinedPolicies';
// import PolicyAnimation from '../../components/PolicyAnimation';
import actions from '../../redux/simulator/actions';
import SaveScenario from '../../components/SaveScenario';
import GraphCarousel from '../../components/GraphCarousel';
import DownloadData from '../../components/Download';
import ShareByEmail from '../../components/ShareByEmail';
import OverlayLoader from '../../components/OverlayLoader';
import SaveScenarioList from '../../components/SaveScenario/SaveScenarioList';
import ColorGradientSlider from '../../components/ColorGradientSlider';
import { defaultSelectedCountry, maxYear, REDIRECT_URL } from '../../configs/app.config';
import Legend from '../../components/Legend';
import {
  getColorCodesAndRange,
  checkSelectedParamCombination,
  checkParamEqual,
  getDefaultSelectedParams,
  updateGlobalParamsStatus,
  getCountryBauMinYear,
  transformPonderableName,
  getQueryParams,
  getTotalHeaderAndFooterHeight,
} from '../../utils';
import IntlMessages from '../../components/Misc/intlMessages';
import YearSlider from '../../components/YearSlider';
import CreatePdf from '../../components/CreatePdf';
import ltrStyles from './index.module.less';
import rtlStyles from './rtl.module.less';
import HelpTour from '../../components/HelpTour';
import HeaderTabs from '../../components/HeaderTabs';
import FooterTabs from '../../components/FooterTabs';

import './animations.css';

const {
  setCountry,
  removePolicy,
  fetchCountryBau,
  applyCountryPolicyScenario,
  fetchGlobalParameters,
  saveScenario,
  applySaveScenarioPolicy,
  removeAppliedPolices,
  fetchInitialData,
  fetchCountryBauReceive,
  reApplyCountryBauData,
  saveCurrentColorSliderValue,
  setPonderable,
  compareScenarios,
  resetCompareScenario,
  updateAppliedScenarios,
  applySliderYearPolicy,
  setSelectedYear,
  shareByEmail,
  setEmailSendStatus,
  applyPolicyAnimation,
  fetchChartData,
  reApplyCountryBauChartData,
  downloadPdf,
  downloadPdfReceive,
  testScenarios,
  resetScenarios,
  setHeaderTab,
  setFooterTab,
  setSelectedPolicyToCompared,
  clearUnsavedSession,
  fetchUserDetails,
} = actions;

const shareAndDownloadData = [
  {
    value: 'choroplethMapImage',
    name: <IntlMessages id="simulator.shareAndDownload.mapImage" />,
  },
  {
    value: 'chartImage',
    name: <IntlMessages id="simulator.shareAndDownload.chartImage" />,
  },
  {
    value: 'choroplethMapData',
    name: <IntlMessages id="simulator.shareAndDownload.mapData" />,
  },
  {
    value: 'chartData',
    name: <IntlMessages id="simulator.shareAndDownload.chartData" />,
  },
];

let styles = {};
class Simulator extends React.Component {
  static contextTypes = {
    direction: PropTypes.string,
  };

  state = {
    leftCollapse: true,
    rightCollapse: false,
    bottomCollapse: false,
    policyAnimation: false,
    showSaveScenario: false,
    showDownloadModel: false,
    showShareByEmailModel: false,
    activeTabKey: '1',
    showSaveAndContinueWithOutSave: false,
    tempSelectedCountry: null,
    continueWithoutSave: false,
    selectedScenarioValue: {},
    downloadAsPdf: false,
    downloadData: [],
    downloadStarted: false,
    selectedFileType: 'pdf',
    winHeightForGraphCarousel: 100,
  };

  componentDidMount() {
    const {
      fetchInitialData,
      fetchUserDetails,
      history,
      app: { locale },
    } = this.props;
    const queryParams = getQueryParams(history);
    const newLocale = queryParams.locale || locale;
    const userEncodedStr = queryParams.userData || '';
    const unsavedSession = JSON.parse(sessionStorage.getItem('unsaved-session') || null);
    if (unsavedSession) {
      fetchUserDetails({ locale: newLocale, userEncodedStr, unsavedSession });
    } else {
      fetchInitialData({ locale: newLocale, userEncodedStr });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      app: {
        countries,
        bauForCountry,
        selectedCountry,
        appliedPolicyRequest,
        currentColorSliderValue,
        selectedPonderable,
        appliedScenario,
        selectedYear,
        locale,
        isLoginRedirect,
      },
    } = this.props;
    if (isLoginRedirect) {
      this.updateMapBox();
    } else {
      if (!prevProps.app.initialDataLoaded && prevProps.app.countries.length !== countries.length) {
        // apply default country selection
        const country = countries.find(country => country.longName === defaultSelectedCountry);
        if (country) {
          this.handleCountryItemClick(country, null);
        }
      } else if (this.resetMap && (selectedCountry && bauForCountry === selectedCountry.id)) {
        this.resetMap = false;

        this.updateMapBox();
      } else if (
        prevProps.app.appliedPolicyRequest !== appliedPolicyRequest &&
        prevProps.app.appliedPolicyRequest === true
      ) {
        this.updateMapBox();
      } else if (
        _.difference(prevProps.app.currentColorSliderValue, currentColorSliderValue).length
      ) {
        this.updateMapBox();
      } else if (prevProps.app.selectedPonderable !== selectedPonderable) {
        this.updateMapBox();
      } else if (prevProps.app.selectedYear !== selectedYear) {
        this.updateMapBox();
      } else if (prevProps.app.locale !== locale) {
        this.updateMapBox();
      }
      if (prevProps.app.appliedScenario !== appliedScenario && appliedScenario) {
        this.changeCurrentActiveKey();
      }
    }
  }

  changeCurrentActiveKey = () => {
    this.setState({ activeTabKey: '4' });
  };

  togglerContent = (whichDrawer, activeTabKey) => {
    const stateFieldName = `${whichDrawer}Collapse`;
    // eslint-disable-next-line react/destructuring-assignment
    const collapse = this.state[stateFieldName];
    const newState = {};
    newState[stateFieldName] = !collapse;
    if (activeTabKey) {
      newState.activeTabKey = activeTabKey;
    }
    this.setState(newState);
  };

  handleCountryItemClick = (country, evt) => {
    evt && evt.stopPropagation();
    const {
      app: { appliedScenario, appliedPolicies },
    } = this.props;
    if (!appliedScenario && appliedPolicies.length > 0) {
      this.setState({
        showSaveAndContinueWithOutSave: true,
        selectedScenarioValue: {},
        tempSelectedCountry: { ...country },
      });
    } else {
      this.changeCountry(country);
    }
  };

  updateMapBox = () => {
    const {
      app: { currentColorSliderValue },
    } = this.props;
    this.mapbox && this.mapbox.updateMapBox();
    this.colorSlider.handleSliderValue(currentColorSliderValue, true);
  };

  getCountryMapBoxBau = (countryId, selectedYear) => {
    const {
      app: { countryMapBau },
    } = this.props;
    selectedYear = selectedYear || getCountryBauMinYear(countryMapBau, countryId);
    const foundedData = countryMapBau.find(el => {
      return el.countryId === countryId && el.year === selectedYear;
    });
    return foundedData;
  };

  getCountryMapData = (data, countryId, selectedYear) => {
    let founded = [];
    if (data.length > 1) {
      founded = data.find(item => {
        return item.countryId === countryId && item.year === selectedYear;
      });
    } else {
      founded = data[0];
    }
    return founded;
  };

  getCountryChartBau = (countryId, selectedParams) => {
    const {
      app: { countryChartBau, compareChartData },
    } = this.props;
    let founded = {};
    if (compareChartData.length > 0) {
      founded = compareChartData.find(el => {
        return parseInt(el.countryId, 10) === countryId;
      });
    } else {
      founded = countryChartBau.find(el => {
        return (
          parseInt(el.countryId, 10) === countryId &&
          checkParamEqual(el.selectedParams, selectedParams)
        );
      });
    }
    return founded;
  };

  changeCountry = country => {
    const { setCountry } = this.props;
    const countryId = country.id;
    this.resetMap = true;
    setCountry({ ...country });
    this.applyBauData(countryId, null, true);
    this.saveScenarioList && this.saveScenarioList.handleResetScenario();
    // setTimeout(this.updateMapBox.bind(this), 200);
  };

  applyBauData = (countryId, selectedYear, getChartData) => {
    const {
      app: { locale },
      fetchCountryBau,
      reApplyCountryBauData,
    } = this.props;

    const foundBau = this.getCountryMapBoxBau(countryId, selectedYear);
    if (foundBau) {
      // apply cached bau
      reApplyCountryBauData({ countryId, reset: true, selectedYear });
    } else {
      this.resetSelectedYear = true;
      fetchCountryBau({ countryId, reset: true, selectedYear, getChartData, locale });
    }
  };

  getCountryApplyMapData = (data, countryId, selectedYear) => {
    return data.find(item => {
      return item.countryId === countryId && item.year === selectedYear;
    });
  };

  applyMapData = (countryId, year) => {
    const {
      applySliderYearPolicy,
      setSelectedYear,
      app: { appliedPolicies, mapData, locale },
    } = this.props;

    const foundMapData = this.getCountryApplyMapData(mapData, countryId, year);
    if (!foundMapData) {
      applySliderYearPolicy({
        countryId,
        appliedPolicies: [...appliedPolicies],
        year,
        locale,
      });
    } else {
      setSelectedYear(year);
    }
  };

  handlePolicyUpdate = data => {
    const { rightCollapse } = this.state;
    const { mode, appliedPolicy } = data;
    const newState = { policyAnimation: true };
    if (mode === 'add' && !rightCollapse) {
      // show right Panel
      newState.rightCollapse = true;
    }
    this.setState(newState);
    setTimeout(this.scrollIntoView.bind(this, appliedPolicy), 100);
  };

  scrollIntoView = appliedPolicy => {
    const appliedPolicyEl = document.getElementById(
      `applied_policy_${appliedPolicy.policyGroup}_${appliedPolicy.policy}`
    );
    if (appliedPolicyEl) {
      appliedPolicyEl.scrollIntoView();
      appliedPolicyEl.className += ' blinkMe';
      setTimeout(this.clearBlink.bind(this, appliedPolicyEl), 1000);
    }
  };

  clearBlink = el => {
    el.className = el.className.replace('blinkMe', '');
  };

  handleAnimationStop = () => {
    this.setState({ policyAnimation: false });
  };

  handleRemovePolicy = appliedPolicy => {
    this.policiesCollapseRef.handleCountryScenario(appliedPolicy, 'remove');
  };

  handleCountryScenario = policy => {
    const {
      app: { selectedCountry, appliedPolicies, locale },
      applyCountryPolicyScenario,
    } = this.props;

    const appliedPolicy = appliedPolicies.findIndex(
      item => item.policyGroup === policy.policyGroup && item.policy === policy.policy
    );
    if (appliedPolicy >= 0) {
      appliedPolicies.splice(appliedPolicy, 1);
    }
    applyCountryPolicyScenario({
      countryId: selectedCountry.id,
      year: 2020,
      appliedPolicies,
      locale,
    });
  };

  handleLeftTabClick = activeKey => {
    const { leftCollapse } = this.state;
    if (!leftCollapse) {
      this.togglerContent('left', activeKey);
    } else {
      this.setState({ activeTabKey: activeKey });
    }
  };

  handleShowModel = () => {
    this.setState({ showSaveScenario: true, showSaveAndContinueWithOutSave: false });
  };

  handleHideModel = () => {
    const {
      app: { selectedCountry, minYear },
    } = this.props;
    const { tempSelectedCountry, selectedScenarioValue } = this.state;

    if (Object.keys(selectedScenarioValue).length) {
      this.applyBauData(selectedCountry.id, minYear, true);
      this.handleOnSaveScenario(selectedScenarioValue);
    } else {
      this.changeCountry({ ...tempSelectedCountry });
    }
    this.setState({ showSaveAndContinueWithOutSave: false, tempSelectedCountry: null });
  };

  handleChangeYearSlider = year => {
    const {
      app: { selectedCountry, appliedPolicies },
    } = this.props;
    if (selectedCountry) {
      if (appliedPolicies && appliedPolicies.length > 0) {
        this.applyMapData(selectedCountry.id, year);
      } else {
        this.applyBauData(selectedCountry.id, year, false);
      }
    }
  };

  saveSessionBeforeRedirect = (redirect, scenario) => {
    const { app } = this.props;
    sessionStorage.setItem('unsaved-session', JSON.stringify(app));
    sessionStorage.setItem('unsaved-session-scenario', JSON.stringify(scenario));
    if (redirect) {
      window.location.href = `${REDIRECT_URL}`;
    }
  };

  clearUnsavedSession = () => {
    const {
      clearUnsavedSession,
      app: { isLoginRedirect },
    } = this.props;
    if (isLoginRedirect) {
      clearUnsavedSession();
      sessionStorage.setItem('unsaved-session', '');
      sessionStorage.setItem('unsaved-session-scenario', '');
    }
  };

  renderCountries = () => {
    const {
      app: { countries, loading, selectedCountry },
      isMobile,
    } = this.props;
    const { showSaveAndContinueWithOutSave } = this.state;
    const { direction } = this.context;

    return (
      <Scrollbars
        style={{ height: isMobile ? '250px' : '325px' }}
        renderThumbVertical={this.renderThumb}
      >
        <List
          className={styles.countryList}
          loading={loading}
          itemLayout="horizontal"
          locale={{ emptyText: <IntlMessages id="simulator.leftPane.countryNotFound" /> }}
          dataSource={countries}
          dir={direction}
          renderItem={(item, index) => {
            return (
              <List.Item
                className={index % 2 === 0 ? styles.countryListEven : styles.countryListOdd}
                onClick={this.handleCountryItemClick.bind(this, item)}
              >
                <List.Item.Meta
                  avatar={
                    <img
                      alt="example"
                      src={`/images/flags/${item.flagIcon.replace('png', 'svg')}`}
                      className={styles.countryFlagIcon}
                    />
                  }
                  title={
                    <span className={styles.countryTitle}>
                      {item.name}
                      <span className={styles.countryTitleDesc} />
                    </span>
                  }
                />
                <Button
                  className={classnames(
                    selectedCountry && item.longName === selectedCountry.longName
                      ? styles.checkedButtonOn
                      : styles.checkedButtonOff,
                    'countryIcon'
                  )}
                  shape="circle"
                  icon="check"
                  onChange={this.handleCheckClick}
                />
              </List.Item>
            );
          }}
        />
        <Modal
          centered
          visible={showSaveAndContinueWithOutSave}
          maskClosable={false}
          closable={false}
          bodyStyle={{ backgroundColor: '#eee6' }}
          okText={<IntlMessages id="simulator.leftPane.notSaveScenarioModelOkText" />}
          vvvv
          cancelText={<IntlMessages id="simulator.leftPane.notSaveScenarioModelCancelText" />}
          onOk={this.handleShowModel}
          onCancel={this.handleHideModel}
          className={
            direction === 'rtl'
              ? classnames(styles.rtlModalWrapper, styles.warningModel)
              : styles.warningModel
          }
        >
          <IntlMessages id="simulator.leftPane.notSaveScenarioModelInfo" />
        </Modal>
      </Scrollbars>
    );
  };

  renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: 'rgba(240,242,245,.5)',
      border: '1px solid rgba(0,0,0,.3)',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  handleAppliedPolicyClick = item => {
    const {
      app: { policies, appliedScenario },
    } = this.props;

    if (appliedScenario) {
      return null;
    }
    const policyGroup = policies.find(policy => policy.id === item.policyGroup);
    const policy = policyGroup.policies.find(policy => policy.id === item.policy);
    this.policiesCollapseRef.handlePolicyClick({ ...policyGroup }, { ...policy });
  };

  handleSaveScenarioModel = value => {
    this.clearUnsavedSession();
    this.setState({ showSaveScenario: value });
  };

  handleDownloadModel = value => {
    this.setState({ showDownloadModel: value });
  };

  handleShareByEmailModel = value => {
    this.setState({ showShareByEmailModel: value });
  };

  handleShareByEmailModelClose = () => {
    const { setEmailSendStatus } = this.props;
    this.setState({ showShareByEmailModel: false });
    setEmailSendStatus(false);
  };

  handleShowContinueModel = (value, selectedScenarioValue) => {
    this.setState({ showSaveAndContinueWithOutSave: value, selectedScenarioValue });
  };

  handleSelectPonderable = selectedPonderable => {
    const { setPonderable } = this.props;
    setPonderable(selectedPonderable.ponderableCode);
  };

  handleDownloadPdf = (selectedData, fileType) => {
    if (selectedData.length > 0) {
      this.handleDownloadModel(false);
      this.setState({
        downloadAsPdf: true,
        downloadData: selectedData,
        selectedFileType: fileType,
      });
    } else {
      message.error(<IntlMessages id="simulator.listCheckboxErrorMsg " />);
    }
  };

  handleDownloadPdfModel = () => {
    const { downloadStarted } = this.state;

    if (!downloadStarted) {
      this.setState({ downloadStarted: true }, () => {
        this.createPdf.downloadPdfFile(this.onDownloadSuccess.bind(this));
      });
    }
  };

  onDownloadSuccess = () => {
    this.setState({ downloadStarted: false, downloadAsPdf: false });
  };

  handleCloseDownloadPdf = () => {
    this.setState({ downloadAsPdf: false });
  };

  getMapImage = () => {
    return this.mapbox.getMapImage();
  };

  getChartImages = () => {
    return this.graphCarousel.getChartImages();
  };

  includeInPdf = value => {
    const { downloadData } = this.state;
    return downloadData.includes(value);
  };

  handleShareByEmail = (checked, email, subject, desc, name, chartImages, fileType) => {
    const {
      app: { selectedCountry, globalParameters, selectedParams, locale },
      shareByEmail,
    } = this.props;

    const chartImageData = [];
    if (checked.chartImage) {
      globalParameters.ponderables.map((pondreable, index) => {
        chartImageData.push({
          image: (chartImages[index] || '').replace('data:image/png;base64,', ''),
          ponderableName: transformPonderableName(pondreable),
        });
        return true;
      });
    }

    let mapImage = '';
    if (checked.choroplethMapImage) {
      mapImage = this.getMapImage();
    }
    let mapData = null;
    if (checked.choroplethMapData) {
      mapData = this.getMapData();
    }

    let countryChartData = null;
    if (checked.chartData) {
      countryChartData = this.getCountryChartBau(selectedCountry.id, selectedParams);
    }

    const payload = {
      chartData: countryChartData ? JSON.stringify(countryChartData) : '',
      chartImages: chartImageData,
      description: desc,
      mapData: mapData ? JSON.stringify(mapData) : '',
      mapImage: mapImage.replace('data:image/png;base64,', ''),
      recipientEmail: email,
      recipientName: name,
      subject,
      fileType,
    };
    shareByEmail({ payload }, locale);
  };

  getMapData = () => {
    const {
      app: { mapData, selectedCountry, selectedYear },
    } = this.props;
    const countryMapData = selectedCountry
      ? mapData.length
        ? this.getCountryMapData(mapData, selectedCountry.id, selectedYear)
        : this.getCountryMapBoxBau(selectedCountry.id, selectedYear)
      : null;
    return countryMapData;
  };

  getAppliedPolicyData = () => {
    const {
      app: { appliedPolicies, appliedPolicyAnimation },
    } = this.props;
    const tempAppliedPolicies = [...appliedPolicies];
    if (appliedPolicyAnimation) {
      tempAppliedPolicies.push({
        policyGroup: 0,
        policy: 0,
        sliderValue: 0,
        policyName: '',
        year: 0,
        type: 'animation',
      });
    }
    return tempAppliedPolicies;
  };

  handleOpenRightCollapse = () => {
    const { rightCollapse } = this.state;
    if (!rightCollapse) {
      this.setState({ rightCollapse: true });
      return true;
    }
    return false;
  };

  handleOnSaveScenario = item => {
    const {
      applySaveScenarioPolicy,
      app: { locale },
    } = this.props;
    applySaveScenarioPolicy({ payload: { ...item, locale } });
  };

  handleFetchChartData = value => {
    const {
      app: {
        selectedParams,
        compareChartData,
        selectedCountry,
        compareScenariosData,
        globalParameters,
        defaultGlobalParameters,
      },
      fetchChartData,
      reApplyCountryBauChartData,
    } = this.props;
    const { paramsCombinations } = globalParameters;
    let mode = 'countryChartData';
    let founded = null;
    let paramName = '';
    const scenarios = [...compareScenariosData];
    const nSelectedParams = { ...selectedParams };
    if (compareChartData.length > 0) {
      mode = 'compareScenario';
    }
    if (value.type === 'zones') {
      nSelectedParams.zoneId = value.id;
      paramName = 'zoneId';
    } else if (value.type === 'modes') {
      nSelectedParams.modeId = value.id;
      paramName = 'modeId';
    } else if (value.type === 'technology') {
      nSelectedParams.technologyId = value.id;
      paramName = 'technologyId';
    } else if (value.type === 'sector') {
      nSelectedParams.sectorId = value.id;
      paramName = 'sectorId';
    }

    const tempSelectedData = checkSelectedParamCombination(
      nSelectedParams,
      paramsCombinations,
      paramName
    );
    let tempGlobalParameters;
    if (
      !(
        tempSelectedData.zoneId === 1 &&
        tempSelectedData.modeId === 1 &&
        tempSelectedData.sectorId === 1 &&
        tempSelectedData.technologyId === 1
      )
    ) {
      tempGlobalParameters = updateGlobalParamsStatus(paramName, value.id, globalParameters);
    } else {
      const foundedGlobals = defaultGlobalParameters.find(rec => {
        return rec.countryId === selectedCountry.id;
      });
      tempGlobalParameters = { ...foundedGlobals.data };
    }

    if (mode === 'countryChartData') {
      founded = this.getCountryChartBau(selectedCountry.id, tempSelectedData);
    }

    if (founded) {
      reApplyCountryBauChartData({
        selectedParams: tempSelectedData,
        globalParameters: tempGlobalParameters,
      });
    } else {
      const payload = {
        mode,
        selectedParams: tempSelectedData,
        countryId: selectedCountry.id,
        userId: 0,
        scenarios,
        globalParameters: tempGlobalParameters,
      };
      fetchChartData({ payload });
    }
  };

  handleResetToDefaults = evt => {
    evt.stopPropagation();
    const {
      app: { defaultGlobalParameters, selectedCountry, compareChartData, isComparedScenario },
      reApplyCountryBauChartData,
    } = this.props;

    const founded = defaultGlobalParameters.find(rec => {
      return rec.countryId === selectedCountry.id;
    });
    const globalParameters = founded.data;
    const selectedParams = getDefaultSelectedParams(globalParameters);
    let tempGlobalParameters = { ...globalParameters };
    if (
      !(
        selectedParams.zoneId === 1 &&
        selectedParams.modeId === 1 &&
        selectedParams.sectorId === 1 &&
        selectedParams.technologyId === 1
      )
    ) {
      tempGlobalParameters = updateGlobalParamsStatus(
        'zoneId',
        selectedParams.zoneId,
        globalParameters
      );
    }

    reApplyCountryBauChartData({ selectedParams, globalParameters: tempGlobalParameters });
    if (compareChartData.length > 0 && isComparedScenario) {
      this.saveScenarioList.handleCompareScenario(true);
    } else if (compareChartData.length > 0 && !isComparedScenario) {
      this.policiesCollapseRef.handleTestScenario(true);
    }
  };

  renderAppliedPolicies = () => {
    const {
      app: {
        appliedPolicies,
        loading,
        appliedScenario,
        selectedCountry,
        savedScenarios,
        locale,
        userDetails,
        userEncodedStr,
        isLoginRedirect,
      },
      saveScenario,
      emailSend,
      setFooterTab,
      isMobile,
    } = this.props;
    const { showSaveScenario, showDownloadModel, showShareByEmailModel } = this.state;
    const { direction } = this.context;
    const appliedPoliciesData = this.getAppliedPolicyData();
    return (
      <React.Fragment>
        <Scrollbars
          style={{ height: isMobile ? '215px' : '295px' }}
          renderThumbVertical={this.renderThumb}
        >
          <List
            id="viewAppliedPolicyHelp"
            bordered={false}
            className={styles.appliedPolicyList}
            loading={loading}
            itemLayout="horizontal"
            dir={direction}
            locale={{ emptyText: <IntlMessages id="simulator.rightPane.noPolicyApplied" /> }}
            dataSource={appliedPoliciesData}
            renderItem={(item, index) => (
              <List.Item
                id={`applied_policy_${item.policyGroup}_${item.policy}`}
                className={
                  item.type === 'animation'
                    ? `appliedPolicyAnimation ${styles.appliedPolicyListOdd}`
                    : index % 2 === 0
                    ? styles.appliedPolicyListEven
                    : styles.appliedPolicyListOdd
                }
                onClick={this.handleAppliedPolicyClick.bind(this, item)}
              >
                <List.Item.Meta
                  title={
                    direction === 'rtl' ? (
                      <Row>
                        <Col span={18}>
                          <div className={styles.policyTitle}>
                            {item.type === 'animation' ? (
                              <span>
                                <IntlMessages id="simulator.rightPane.applyingPolicy" />
                              </span>
                            ) : (
                              <span>
                                {item.policyName}
                                <span className={styles.policyYear}>
                                  (<IntlMessages id="simulator.rightPane.policyYear" /> :{item.year}
                                  )
                                </span>
                              </span>
                            )}
                          </div>
                        </Col>
                        <Col span={6}>
                          <Progress
                            type="circle"
                            status="active"
                            percent={item.sliderValue}
                            width={isMobile ? 50 : 67}
                            strokeLinecap="square"
                            strokeWidth={13}
                            className={
                              item.type === 'animation'
                                ? styles.hideEmptyPolicy
                                : classnames(styles.policyCircleProgress, 'rotatePolicy')
                            }
                            format={percent => `${percent}%`}
                          />
                        </Col>
                      </Row>
                    ) : (
                      <Row>
                        <Col span={6}>
                          <Progress
                            type="circle"
                            status="active"
                            percent={item.sliderValue}
                            width={isMobile ? 50 : 67}
                            strokeLinecap="square"
                            strokeWidth={13}
                            className={
                              item.type === 'animation'
                                ? styles.hideEmptyPolicy
                                : classnames(styles.policyCircleProgress, 'rotatePolicy')
                            }
                            format={percent => `${percent}%`}
                          />
                        </Col>
                        <Col span={18}>
                          <div className={styles.policyTitle}>
                            {item.type === 'animation' ? (
                              <span>
                                <IntlMessages id="simulator.rightPane.applyingPolicy" />
                              </span>
                            ) : (
                              <span>
                                {item.policyName}
                                <span className={styles.policyYear}>
                                  (<IntlMessages id="simulator.rightPane.policyYear" /> :{item.year}
                                  )
                                </span>
                              </span>
                            )}
                          </div>
                        </Col>
                      </Row>
                    )
                  }
                />
                {!appliedScenario ? (
                  <Popconfirm
                    placement="top"
                    title={<IntlMessages id="simulator.rightPane.policyDeleteConfirmationMsg" />}
                    onConfirm={evt => {
                      evt.stopPropagation();
                      this.handleRemovePolicy(item);
                    }}
                    okText={<IntlMessages id="simulator.rightPane.policyDeleteYes" />}
                    cancelText={<IntlMessages id="simulator.rightPane.policyDeleteNo" />}
                    onCancel={evt => evt.stopPropagation()}
                    className={styles.popConfirmStyle}
                  >
                    <div
                      onClick={evt => {
                        evt.stopPropagation();
                      }}
                    >
                      <Icon
                        className={item.type === 'animation' ? styles.hideEmptyPolicy : null}
                        type="close-square"
                        theme="filled"
                      />
                    </div>
                  </Popconfirm>
                ) : (
                  ''
                )}
              </List.Item>
            )}
          />
        </Scrollbars>
        <div className={classnames(styles.rightPanelActions, 'rightPanelActionsCt')}>
          <Row>
            <Col span={2} />
            <Col span={10}>
              <Button
                id="savePolicyHelp"
                onClick={() => this.handleSaveScenarioModel(true)}
                className={styles.greenButton}
                disabled={appliedPolicies.length > 0 ? false : true}
              >
                <IntlMessages id="simulator.rightPane.saveScenario" />
              </Button>
            </Col>
            <Col span={10}>
              <Button
                id="downloadHelp"
                onClick={() => this.handleDownloadModel(true)}
                className={styles.blueButton}
              >
                <IntlMessages id="simulator.rightPane.download" />
              </Button>
              <DownloadData
                data={shareAndDownloadData}
                showModel={showDownloadModel}
                onCancel={this.handleDownloadModel}
                onDownload={this.handleDownloadPdf}
                direction={direction}
                isMobile={isMobile}
              />
            </Col>
            <Col span={2} />
          </Row>
          <Row>
            <Col span={2} />
            <Col span={20}>
              <Button
                id="shareByEmailHelp"
                onClick={() => this.handleShareByEmailModel(true)}
                className={styles.blueButton}
              >
                <IntlMessages id="simulator.rightPane.shareByEmail" />
              </Button>
              {showShareByEmailModel ? (
                <ShareByEmail
                  data={shareAndDownloadData}
                  showModel={showShareByEmailModel}
                  onCancel={this.handleShareByEmailModelClose}
                  onShare={this.handleShareByEmail}
                  chartImages={this.getChartImages}
                  emailSend={emailSend}
                  direction={direction}
                  isMobile={isMobile}
                  setFooterTab={setFooterTab}
                />
              ) : null}
            </Col>
            <Col span={2} />
          </Row>
        </div>
        <div>
          <SaveScenario
            showModel={showSaveScenario || isLoginRedirect}
            onCancel={this.handleSaveScenarioModel}
            appliedPolicies={appliedPolicies}
            saveScenario={saveScenario}
            savedScenarios={savedScenarios}
            country={selectedCountry}
            direction={direction}
            locale={locale}
            userDetails={userDetails}
            userEncodedStr={userEncodedStr}
            saveSessionBeforeRedirect={this.saveSessionBeforeRedirect}
          />
        </div>
      </React.Fragment>
    );
  };

  handleJoyrideCallback = data => {
    const { step, lifecycle, action } = data;
    const { direction } = this.context;
    if (action === JOYRIDE_ACTIONS.NEXT && lifecycle === JOYRIDE_LIFECYCLE.COMPLETE) {
      console.log('active action', action);
    } else if (lifecycle === JOYRIDE_LIFECYCLE.READY) {
      if (direction === 'rtl') {
        document.querySelector(
          '.react-joyride__tooltip button[data-action=primary]'
        ).style.direction = 'rtl';
      }

      if (step.stepKey === 'countryTab') {
        this.setState({ activeTabKey: '1' });
      } else if (step.stepKey === 'policyTab') {
        this.setState({ activeTabKey: '2' });
      } else if (step.stepKey === 'policyExpander') {
        let target = document.querySelector(step.target);
        if (target && target.classList.contains('anticon-plus-circle')) {
          document.querySelector(step.target).click();
        }
        target = document.querySelector('.viewAppliedPolicies');
        if (
          target &&
          ((direction === 'rtl' && target.querySelector('.anticon-right')) ||
            (direction === 'ltr' && target.querySelector('.anticon-left')))
        ) {
          target.click();
        }
      } else if (step.stepKey === 'saveScenarioModal') {
        const target = document.querySelector('#viewScenarioAnalysis');
        if (target && target.querySelector('.anticon-up')) {
          target.click();
        }
      } else if (step.stepKey === 'compareScenario') {
        this.setState({ activeTabKey: '4' });
      }
    }

    if (action === JOYRIDE_ACTIONS.PREV && lifecycle === JOYRIDE_LIFECYCLE.READY) {
      if (step.stepKey === 'viewAppliedPolicies') {
        this.setState({ activeTabKey: '2' });
      } else if (step.stepKey === 'countryTab') {
        this.setState({ activeTabKey: '1' });
      } else if (step.stepKey === 'selectCountry') {
        this.setState({ activeTabKey: '1' });
      }
    }
  };

  handleMobileDrawerClose = () => {
    const {
      app: { visibleTab, visibleFooterTab },
      setHeaderTab,
      setFooterTab,
    } = this.props;
    if (visibleTab !== 'home') {
      setHeaderTab('home');
    }
    if (visibleFooterTab !== '') {
      setFooterTab('');
    }
  };

  renderCountriesAndPoliciesTabs = () => {
    const {
      leftCollapse,
      rightCollapse,

      activeTabKey,
      continueWithoutSave,
    } = this.state;
    const {
      app: {
        selectedCountry,
        loading,
        appliedScenario,
        savedScenarios,
        preDefinedPolicies,
        appliedPolicies,
        compareScenariosData,
        selectedParams,
        locale,
        isComparedScenario,

        visibleTab,
        selectedPoliciesToCompare,
      },
      compareScenarios,
      resetCompareScenario,
      updateAppliedScenarios,
      applyPolicyAnimation,
      testScenarios,
      resetScenarios,
      setSelectedPolicyToCompared,
      isMobile,
    } = this.props;
    const { direction } = this.context;
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;
    const renderCountriesAndPoliciesTabPanesArr = [
      {
        name: 'country',
        data: (
          <Tabs.TabPane
            tab={
              <div id="countryHelp">
                <i
                  className={classnames(
                    styles.leftTabIcon,
                    activeTabKey === '1' ? styles.leftTabIconSelected : ''
                  )}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400.21 431">
                    <title>
                      {' '}
                      <IntlMessages id="simulator.leftPane.country" />
                    </title>
                    <path
                      className={styles.iconFill}
                      d="M241.09,40c-56.28,0-102.46,44-102.46,101.34a137.74,137.74,0,0,0,8,43.93Q189.1,273.82,232,362.45a10.26,10.26,0,0,0,18.6,0c28.1-59.19,57.44-117.95,85.3-177.18a137.12,137.12,0,0,0,8-43.93C343.87,84,297.37,40,241.09,40Zm0,20.52c45.74,0,82.26,34.37,82.26,80.82,0,9.89-3.46,27.46-6.74,36.23-24.88,52.31-50.2,104.58-75.36,156.82-24.26-52.64-51.66-104-75.36-156.82-3.27-8.79-6.74-26.36-6.74-36.23C159.15,94.86,195.35,60.52,241.09,60.52Zm.16,25.66a56.44,56.44,0,1,0,56.44,56.44A56.6,56.6,0,0,0,241.25,86.18Zm0,20.52a35.92,35.92,0,1,1-35.92,35.92A35.77,35.77,0,0,1,241.25,106.7ZM51.4,245.24c-6,0-10.13,5.64-10.26,10.26V460.74A10.66,10.66,0,0,0,51.4,471H431.1a10.66,10.66,0,0,0,10.26-10.26V255.5a10.66,10.66,0,0,0-10.26-10.26H329.92c-3.3,6.83-6.63,13.7-9.94,20.52H420.83v41.05H300.1c-4.55,9.36-9.12,18.71-13.63,28.06L379,450.48H225.7l-63.82-79.85,36.4-30.79q-4.56-9.46-9.14-18.92l-40.09,33.83-71.19-89h84.82c-3.29-6.85-6.65-13.67-9.94-20.52Zm10.27,33L199.4,450.48H61.67Zm245,49.06H420.83v51.31H347.72Zm57.56,71.84h56.6v51.31H405.28Z"
                      transform="translate(-41.14 -40)"
                    />
                  </svg>
                </i>
                <IntlMessages id="simulator.leftPane.country" />
                <br /> &nbsp;
              </div>
            }
            key="1"
          >
            {this.renderCountries()}
          </Tabs.TabPane>
        ),
      },
      {
        name: 'policyHelp',
        data: (
          <Tabs.TabPane
            tab={
              <div id="policyHelp">
                <i
                  className={classnames(
                    styles.leftTabIcon,
                    activeTabKey === '2' ? styles.leftTabIconSelected : ''
                  )}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 470.23 469.21">
                    <path
                      className={styles.iconFill}
                      d="M243,27h6c25.21,5.76,49.22,15.26,73.43,24,49.65,18,98.65,37.67,147.65,57.37a34.06,34.06,0,0,1,5.85,2.78c3,1.92,5,4.37,4.55,8.21,0,2.43,0,4.85,0,7.27.27,2.1-.57,4.29.52,6.33v8c-1.19,5.38-.75,10.9-.86,16.31-.65,30.44-5.27,60.33-11.87,90a385.74,385.74,0,0,1-37.9,101.79A327.35,327.35,0,0,1,385.55,412c-20.43,22.57-43.89,41.21-69.9,56.81a263.79,263.79,0,0,1-57.49,25.34,36,36,0,0,1-9.35,1.32h-5.5c-11.68-.86-22.24-5.58-32.82-10a284.21,284.21,0,0,1-71.22-42.9A314.47,314.47,0,0,1,64,352.83c-25.11-44.37-39.56-92.27-47.18-142.41-2.68-17.6-4.67-35.26-4.92-53.12-.08-5.4.34-10.92-.85-16.3v-3c1.09-2,.25-4.18.52-6.26,0-1.63,0-3.27,0-4.9,0-2.74,0-5.48,0-8.21-.1-5.42,3.86-7.36,8-9,19.13-7.73,38.25-15.48,57.46-23C120.6,69.45,164.28,52.32,208.7,37.15,220,33.29,231.22,29.21,243,27Z"
                      transform="translate(-10.87 -26.9)"
                    />
                    <path
                      className={styles.iconBgFill}
                      d="M11,141c2.08,1.27.95,3.31,1,4.94,2.67,61.78,13.05,121.93,39,178.57C83.72,395.8,134.3,449.66,206.36,482.27A218.39,218.39,0,0,0,243,495.1c.36.18.48.38.38.58s-.22.32-.33.32q-114,0-228,.1c-3.42,0-4.1-.68-4.1-4.1Q11.08,316.5,11,141Z"
                      transform="translate(-10.87 -26.9)"
                    />
                    <path
                      className={styles.iconBgFill}
                      d="M249.06,495.14c39.77-10.06,74.63-29.59,105.91-55.67,50.74-42.3,83.24-96.56,103-159,11-34.89,17.42-70.68,20.19-107.13.76-10,1.24-19.95,1.87-29.92.06-.89-.39-2.07,1-2.43q0,175.35.09,350.7c0,3.46-.54,4.42-4.28,4.41Q362.9,495.89,249,496c-.34-.22-.44-.42-.31-.6A.48.48,0,0,1,249.06,495.14Z"
                      transform="translate(-10.87 -26.9)"
                    />
                    <path
                      className={styles.iconBgFill}
                      d="M243,27c-14.56,4.92-29.16,9.72-43.66,14.79C138.42,63.1,78.63,87.33,18.7,111.18c-3.26,1.3-5.73,3.32-6.79,6.78-.28.48-.58.5-.91,0,0-29,.11-57.91-.13-86.86,0-3.92,1.18-4.22,4.48-4.21Q129.17,27.07,243,27Z"
                      transform="translate(-10.87 -26.9)"
                    />
                    <path
                      className={styles.iconBgFill}
                      d="M480.21,118.9c-.68-4.05-3.36-6.32-7-7.76C399.63,81.82,326.34,51.61,250.61,28A7.61,7.61,0,0,1,249,27q114,0,228-.1c3.42,0,4.12.67,4.1,4.1-.17,29.33-.1,58.67-.1,88C480.67,119.49,480.42,119.43,480.21,118.9Z"
                      transform="translate(-10.87 -26.9)"
                    />
                    <path
                      className={styles.iconFill}
                      d="M11,118a1.87,1.87,0,0,0,.91,0L11.84,127c-.29.45-.57.42-.84,0Z"
                      transform="translate(-10.87 -26.9)"
                    />
                    <path
                      className={styles.iconFill}
                      d="M480.21,118.9a.48.48,0,0,1,.79.1v8c-.27.45-.55.44-.84,0C480.18,124.31,480.2,121.61,480.21,118.9Z"
                      transform="translate(-10.87 -26.9)"
                    />
                    <path
                      className={styles.iconFill}
                      d="M11.84,132c-.27,2,1.32,4.26-.84,6v-6C11.29,131.56,11.57,131.54,11.84,132Z"
                      transform="translate(-10.87 -26.9)"
                    />
                    <path
                      className={styles.iconFill}
                      d="M480.16,127a7.85,7.85,0,0,0,.84,0v6C478.88,131.26,480.4,129,480.16,127Z"
                      transform="translate(-10.87 -26.9)"
                    />
                    <path
                      className={styles.iconFill}
                      d="M249.06,495.14a2.08,2.08,0,0,0-.06.86h-6a1.22,1.22,0,0,0-.05-.9Z"
                      transform="translate(-10.87 -26.9)"
                    />
                    <path
                      className={styles.iconFill}
                      d="M11.84,132H11v-5h.84Z"
                      transform="translate(-10.87 -26.9)"
                    />
                    <path
                      className={styles.iconBgFill}
                      d="M461.48,142.66c-2.25,54.55-10.32,108-30.51,159-27.63,69.86-72.47,124.63-140.63,158.62a223.2,223.2,0,0,1-39.95,15.29,15,15,0,0,1-8.76-.09c-55.62-17.13-100.23-50-135.71-95.55-31.93-41-51.3-87.87-62.85-138.2-8.41-36.66-11.95-73.89-12.72-111.44,0-2.42.32-3.86,2.91-4.9,68.58-27.49,137-55.33,207.35-78.16a17.12,17.12,0,0,1,11.11.15c59.32,19.07,117.13,42.2,175,65.17,10.34,4.11,20.58,8.46,31,12.4,3.25,1.23,4.24,2.83,3.87,6.23C461.16,135,461.48,138.83,461.48,142.66Z"
                      transform="translate(-10.87 -26.9)"
                    />
                    <path
                      className={styles.iconFill}
                      d="M432.74,151.39C429,216.49,416.54,278,383.91,334c-29.44,50.46-70.38,87.95-125.31,109.51-8.82,3.46-16.51,3.36-25.28-.06-48.78-19-86.77-51.18-115.77-94.3C90.86,309.43,75.62,265.24,67,218.52c-4-21.64-6.19-43.49-7.62-65.43-.37-5.64,1.73-8.63,8-11.08,32.45-12.72,64.89-25.5,97.41-38q36.47-14.07,73.56-26.47a22.3,22.3,0,0,1,15-.1c55.76,18.65,110.36,40.37,165,62,2.78,1.1,5.52,2.29,8.29,3.42A9.18,9.18,0,0,1,432.74,151.39Z"
                      transform="translate(-10.87 -26.9)"
                    />
                    <path
                      className={styles.iconBgFill}
                      d="M413.14,164.62c-4.68,57.14-17,112-46.61,161.65-27.6,46.34-65.5,81-116.58,100.15a10.66,10.66,0,0,1-8.06-.06c-47.27-17.7-83.38-49.05-110.75-90.89-23.35-35.71-37-75.25-45.1-116.91a469.79,469.79,0,0,1-7.35-56.92c-.19-2.71.12-4.13,2.91-5.23,52.39-20.58,104.65-41.53,158-59.6a18.82,18.82,0,0,1,12.9,0c53.37,18,105.59,39,158,59.67C415.64,158.54,412.21,162,413.14,164.62Z"
                      transform="translate(-10.87 -26.9)"
                    />
                    <path
                      className={styles.iconFill}
                      d="M226.41,274.8l74.44-96.7c4.06-5.27,8-10.6,12.21-15.81s8.48-5.8,14-2.22c8.5,5.55,16.91,11.22,25.34,16.87,7.25,4.85,8.05,9.63,2.74,16.59L248.33,333.18c-4.35,5.69-8.62,11.43-13.07,17-4.59,5.78-10.19,6.22-15.36,1.08Q187.67,319.22,155.57,287c-4.7-4.73-4.69-9.69,0-14.45q13.32-13.54,26.86-26.86c4.95-4.87,9.79-4.78,14.81.16C207,255.41,216.6,265.05,226.41,274.8Z"
                      transform="translate(-10.87 -26.9)"
                    />
                    <path
                      className={styles.iconBgFill}
                      d="M226.31,331.21c-16.83-16.83-33.29-33.32-49.8-49.75-1.4-1.39-1.35-2.18.06-3.52,3.75-3.55,7.47-7.15,10.92-11,1.91-2.12,3-1.5,4.62.19,8.51,8.67,17.12,17.25,25.71,25.86,7.75,7.77,12.48,7.5,19.06-1.06q41.67-54.21,83.28-108.47c2.39-3.13,3.92-3.1,6.92-1,8.43,5.88,8.53,5.75,2.31,13.88Z"
                      transform="translate(-10.87 -26.9)"
                    />
                  </svg>
                </i>
                <IntlMessages id="simulator.leftPane.policies" />
                <br /> &nbsp;
              </div>
            }
            key="2"
          >
            <Scrollbars
              style={{ height: isMobile ? '250px' : '325px' }}
              renderThumbVertical={this.renderThumb}
            >
              <PoliciesCollapse
                ref={ref => {
                  this.policiesCollapseRef = ref;
                }}
                onPolicyUpdate={this.handlePolicyUpdate}
                openRightCollapse={this.handleOpenRightCollapse}
                onRemovePolicy={this.handleRemovePolicy}
                applyPolicyAnimation={applyPolicyAnimation}
                rightCollapse={rightCollapse}
                direction={direction}
                testScenariosData={compareScenariosData}
                resetCompareScenario={resetCompareScenario}
                selectedParams={selectedParams}
                comparedData={this.saveScenarioList && this.saveScenarioList.handleSelectedState()}
                isMobile={isMobile}
              />
            </Scrollbars>
          </Tabs.TabPane>
        ),
      },
      {
        name: 'preDefinePolicies',
        data: (
          <Tabs.TabPane
            tab={
              <div>
                <i
                  className={classnames(
                    styles.leftTabIcon,
                    activeTabKey === '3' ? styles.leftTabIconSelected : ''
                  )}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 431.47 419">
                    <path
                      className={styles.iconFill}
                      d="M168.74,215.84H85.86a51.1,51.1,0,0,1-51.1-51.1V88.1A51.1,51.1,0,0,1,85.86,37h82.88a51.1,51.1,0,0,1,51.1,51.1v76.64A51.1,51.1,0,0,1,168.74,215.84ZM85.86,57.44A30.66,30.66,0,0,0,55.2,88.1v76.64A30.66,30.66,0,0,0,85.86,195.4h82.88a30.66,30.66,0,0,0,30.66-30.66V88.1a30.66,30.66,0,0,0-30.66-30.66Z"
                      transform="translate(-34.76 -37)"
                    />
                    <path
                      className={styles.iconFill}
                      d="M120.86,157.44a10.18,10.18,0,0,1-6.23-2.15L91.84,137.61a10.22,10.22,0,1,1,12.08-16.49l.44.34,15.33,11.81L149,99.8a10.22,10.22,0,1,1,16.3,12.33,11.33,11.33,0,0,1-1,1.11l-35.77,40.88A10.29,10.29,0,0,1,120.86,157.44Z"
                      transform="translate(-34.76 -37)"
                    />
                    <path
                      className={styles.iconFill}
                      d="M456,136.64H277.63a10.22,10.22,0,1,1,0-20.44H456a10.22,10.22,0,1,1,0,20.44Z"
                      transform="translate(-34.76 -37)"
                    />
                    <path
                      className={styles.iconFill}
                      d="M163.63,456H91a56.21,56.21,0,0,1-56.21-56.21V333.37A56.21,56.21,0,0,1,91,277.16h72.66a56.21,56.21,0,0,1,56.21,56.21v66.42A56.21,56.21,0,0,1,163.63,456ZM91,297.6A35.77,35.77,0,0,0,55.2,333.37v66.42A35.77,35.77,0,0,0,91,435.56h72.66a35.76,35.76,0,0,0,35.77-35.77V333.37a35.76,35.76,0,0,0-35.77-35.77Z"
                      transform="translate(-34.76 -37)"
                    />
                    <path
                      className={styles.iconFill}
                      d="M120.86,397.6a10.25,10.25,0,0,1-6.23-2.15L91.84,377.77a10.22,10.22,0,1,1,12.08-16.49l.44.34,15.33,11.81L149,340a10.22,10.22,0,1,1,16.3,12.33,11.33,11.33,0,0,1-1,1.11l-35.77,40.87A10.26,10.26,0,0,1,120.86,397.6Z"
                      transform="translate(-34.76 -37)"
                    />
                    <path
                      className={styles.iconFill}
                      d="M456,376.8H277.63a10.22,10.22,0,1,1,0-20.44H456a10.22,10.22,0,1,1,0,20.44Z"
                      transform="translate(-34.76 -37)"
                    />
                  </svg>
                </i>
                {locale === 'ar' ? (
                  <div>
                    <IntlMessages id="simulator.leftPane.scenario" />
                    <br />
                    <IntlMessages id="simulator.leftPane.preDefined" />
                  </div>
                ) : (
                  <div>
                    <IntlMessages id="simulator.leftPane.preDefined" />
                    <br />
                    <IntlMessages id="simulator.leftPane.scenario" />
                  </div>
                )}
              </div>
            }
            key="3"
          >
            <Scrollbars
              style={{ height: isMobile ? '305px' : '325px' }}
              renderThumbVertical={this.renderThumb}
            >
              <PreDefinedPolicies
                preDefinedPolicies={preDefinedPolicies}
                loading={loading}
                direction={direction}
              />
            </Scrollbars>
          </Tabs.TabPane>
        ),
      },
      {
        name: 'savedScenario',
        data: (
          <Tabs.TabPane
            id="compareScenarioHelp"
            tab={
              <div>
                <i
                  className={classnames(
                    styles.leftTabIcon,
                    activeTabKey === '4' ? styles.leftTabIconSelected : ''
                  )}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430.53 452">
                    <path
                      className={styles.iconFill}
                      d="M328.59,378H170.39c-6.78,0-11.3-4.52-11.3-11.3s4.52-11.3,11.3-11.3h158.2c6.78,0,11.3,4.52,11.3,11.3S335.37,378,328.59,378Z"
                      transform="translate(-34.79 -39)"
                    />
                    <path
                      className={styles.iconFill}
                      d="M328.59,423.2H170.39c-6.78,0-11.3-4.52-11.3-11.3s4.52-11.3,11.3-11.3h158.2c6.78,0,11.3,4.52,11.3,11.3S335.37,423.2,328.59,423.2Z"
                      transform="translate(-34.79 -39)"
                    />
                    <path
                      className={styles.iconFill}
                      d="M328.59,332.8H170.39c-6.78,0-11.3-4.52-11.3-11.3s4.52-11.3,11.3-11.3h158.2c6.78,0,11.3,4.52,11.3,11.3S335.37,332.8,328.59,332.8Z"
                      transform="translate(-34.79 -39)"
                    />
                    <path
                      className={styles.iconFill}
                      d="M460.8,100l-56.5-56.5h0c-1.13-1.13-1.13-1.13-2.27-1.13A6.19,6.19,0,0,0,396.38,39H77.73A42.92,42.92,0,0,0,34.79,81.94V449.19C34.79,471.79,54,491,77.73,491H422.37a42.92,42.92,0,0,0,42.94-42.94V107.93A18.2,18.2,0,0,0,460.8,100ZM113.89,61.6H385.08v54.24c0,7.91-5.65,13.56-13.56,13.56H328.59V95.5a11.3,11.3,0,1,0-22.6,0v33.9H127.45c-7.91,0-13.56-5.65-13.56-13.56ZM385.08,468.4H113.89V291a15,15,0,0,1,14.69-14.69H369.26A15,15,0,0,1,384,291V468.4Zm56.5-19.21a20.25,20.25,0,0,1-20.33,20.34H407.68V291A37.62,37.62,0,0,0,370.4,253.7H128.58A37.62,37.62,0,0,0,91.29,291V468.4H77.73a20.26,20.26,0,0,1-20.34-20.34V81.94A20.26,20.26,0,0,1,77.73,61.6H91.29v54.24A35.7,35.7,0,0,0,127.45,152H371.52a35.7,35.7,0,0,0,36.16-36.16V77.42l33.9,35Z"
                      transform="translate(-34.79 -39)"
                    />
                  </svg>
                </i>
                {locale === 'ar' ? (
                  <div>
                    <IntlMessages id="simulator.leftPane.scenario" />
                    <br />
                    <IntlMessages id="simulator.leftPane.saved" />
                  </div>
                ) : (
                  <div>
                    <IntlMessages id="simulator.leftPane.saved" />
                    <br />
                    <IntlMessages id="simulator.leftPane.scenario" />
                  </div>
                )}
              </div>
            }
            key="4"
          >
            <SaveScenarioList
              applySaveScenarioPolicy={this.handleOnSaveScenario}
              loading={loading}
              appliedScenario={appliedScenario}
              savedScenarios={savedScenarios}
              selectedCountry={selectedCountry}
              appliedPolicies={appliedPolicies}
              showContinueModel={this.handleShowContinueModel}
              continueWithoutSave={continueWithoutSave}
              compareScenarios={compareScenarios}
              compareScenariosData={compareScenariosData}
              resetCompareScenario={resetCompareScenario}
              updateAppliedScenarios={updateAppliedScenarios}
              selectedParams={selectedParams}
              ref={ref => (this.saveScenarioList = ref)}
              direction={direction}
              testScenarios={testScenarios}
              isComparedScenario={isComparedScenario}
              resetScenarios={resetScenarios}
              isMobile={isMobile}
              setSelectedPolicyToCompared={setSelectedPolicyToCompared}
              selectedPoliciesToCompare={selectedPoliciesToCompare}
            />
          </Tabs.TabPane>
        ),
      },
    ];
    return (
      <Drawer
        visible={isMobile ? (visibleTab === 'country' ? true : false) : true}
        width={isMobile ? 305 : 427}
        className={classnames(
          styles.appSideDrawer,
          !leftCollapse ? styles.appLeftSiderClose : '',
          isMobile
            ? visibleTab === 'country'
              ? styles.countryTabDisplay
              : styles.countryVisibleTab
            : ''
        )}
        placement={direction === 'rtl' ? 'right' : 'left'}
        handler={
          isMobile ? null : (
            <div className={styles.leftHandle}>
              {direction === 'rtl' ? (
                <Icon
                  type={leftCollapse ? 'right' : 'left'}
                  style={{
                    color: '#fff',
                    fontSize: 20,
                  }}
                />
              ) : (
                <Icon
                  type={leftCollapse ? 'left' : 'right'}
                  style={{
                    color: '#fff',
                    fontSize: 20,
                  }}
                />
              )}
            </div>
          )
        }
        onHandleClick={() => this.togglerContent('left')}
        style={{
          zIndex: 999,
        }}
      >
        <Tabs
          type="card"
          tabPosition={!leftCollapse ? 'left' : 'top'}
          onChange={this.handleLeftTabClick}
          activeKey={activeTabKey}
        >
          {direction === 'rtl'
            ? renderCountriesAndPoliciesTabPanesArr.reverse().map(item => {
                return item.data;
              })
            : renderCountriesAndPoliciesTabPanesArr.map(item => {
                return item.data;
              })}
        </Tabs>
      </Drawer>
    );
  };

  renderAppliedPoliciesTab = () => {
    const { rightCollapse } = this.state;
    const {
      app: { visibleTab, isLoginRedirect },
      isMobile,
    } = this.props;
    const { direction } = this.context;
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;
    const isDrawerVisible =
      (isMobile ? (visibleTab === 'tools' ? true : false) : rightCollapse) || isLoginRedirect;
    return (
      <Drawer
        visible={isDrawerVisible}
        width={isMobile ? 300 : 345}
        className={classnames(
          styles.appSideDrawer,
          'rightDrawerPanel',
          !isDrawerVisible ? (!isMobile ? styles.appRightSiderClose : '') : '',
          isMobile
            ? visibleTab === 'tools'
              ? styles.appliedPoliciesTabDisplay
              : styles.appliedPoliciesVisibleTab
            : ''
        )}
        placement={direction === 'rtl' ? 'left' : 'right'}
        handler={
          isMobile ? null : (
            <div className={classnames(styles.rightHandle, 'viewAppliedPolicies')}>
              {direction === 'rtl' ? (
                <Icon
                  type={isDrawerVisible ? 'left' : 'right'}
                  style={{
                    color: '#fff',
                    fontSize: 20,
                  }}
                />
              ) : (
                <Icon
                  type={isDrawerVisible ? 'right' : 'left'}
                  style={{
                    color: '#fff',
                    fontSize: 20,
                  }}
                />
              )}
            </div>
          )
        }
        onHandleClick={() => this.togglerContent('right')}
        style={{
          zIndex: 999,
        }}
      >
        {isMobile ? (
          this.renderAppliedPolicies()
        ) : !isDrawerVisible ? (
          <Tabs type="card" tabPosition="left">
            <Tabs.TabPane
              tab={
                <div>
                  <IntlMessages id="simulator.rightPane.applied" />
                  <br /> &nbsp; <IntlMessages id="simulator.rightPane.policies" />
                </div>
              }
              key="1"
            />
            <Tabs.TabPane
              tab={
                <div>
                  <IntlMessages id="simulator.rightPane.save" />
                  <br /> &nbsp; <IntlMessages id="simulator.rightPane.scenario" />
                </div>
              }
              key="2"
            />
            <Tabs.TabPane
              tab={
                <div>
                  <IntlMessages id="simulator.rightPane.download" />
                  <br />
                  &nbsp; <IntlMessages id="simulator.rightPane.pdf" />
                </div>
              }
              key="3"
            />
            <Tabs.TabPane
              tab={
                <div>
                  <IntlMessages id="simulator.rightPane.shareBy" />
                  <br /> <IntlMessages id="simulator.rightPane.email" />
                </div>
              }
              key="4"
            />
          </Tabs>
        ) : (
          this.renderAppliedPolicies()
        )}
      </Drawer>
    );
  };

  renderChoroplethCard = () => {
    const {
      app: {
        globalParameters,
        appliedPolicies,
        currentColorSliderValue,
        selectedPonderable,
        selectedYear,
        minYear,
        selectedCountry,
        mapData,
        isLoginRedirect,
        visibleTab,
      },
      saveCurrentColorSliderValue,
      isMobile,
      setSelectedYear,
    } = this.props;
    const { direction } = this.context;
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;
    const countryMapData = selectedCountry
      ? mapData.length
        ? this.getCountryMapData(mapData, selectedCountry.id, selectedYear)
        : this.getCountryMapBoxBau(selectedCountry.id, selectedYear)
      : null;
    const colorStops = countryMapData
      ? getColorCodesAndRange(countryMapData, selectedPonderable)
      : [];
    return (
      <div
        className={classnames(
          styles.yearSliderContainer,
          isMobile
            ? visibleTab === 'choropleth'
              ? styles.choroplethTabDisplay
              : styles.choroplethVisibleTab
            : ''
        )}
      >
        <div style={{ margin: '0px 30px' }} dir={direction}>
          <YearSlider
            appliedPolicies={appliedPolicies}
            maxYear={maxYear}
            title={<IntlMessages id="simulator.setting.choroplethYear" />}
            onChangeSelectedYear={this.handleChangeYearSlider}
            setSelectedYear={setSelectedYear}
            selectedYear={selectedYear}
            minYear={minYear}
            direction={direction}
          />
        </div>
        <div style={{ margin: '10px 0px ' }} dir={direction}>
          <Legend
            title={<IntlMessages id="simulator.setting.ponderables" />}
            data={globalParameters.ponderables}
            onClick={this.handleSelectPonderable}
            selectedPonderable={selectedPonderable}
            direction={direction}
            selectedYear={selectedYear}
            selectedCountry={selectedCountry}
          />
        </div>
        <div dir={direction}>
          <ColorGradientSlider
            title={<IntlMessages id="simulator.setting.choroplethSlider" />}
            ref={ref => (this.colorSlider = ref)}
            colorStops={colorStops}
            saveCurrentColorSliderValue={saveCurrentColorSliderValue}
            currentColorSliderValue={currentColorSliderValue}
            direction={direction}
            isMobile={isMobile}
            isLoginRedirect={isLoginRedirect}
          />
        </div>
      </div>
    );
  };

  renderGraphCarousel = () => {
    const {
      app: {
        selectedCountry,
        globalParameters,
        compareScenariosData,
        selectedParams,

        locale,
      },
      isMobile,
    } = this.props;
    const { winHeightForGraphCarousel } = this.state;
    const { direction } = this.context;
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;
    const scrollHeightForGraphCarousel =
      winHeightForGraphCarousel - getTotalHeaderAndFooterHeight(isMobile);
    return (
      <Scrollbars
        style={{ height: `${scrollHeightForGraphCarousel}px` }}
        renderThumbVertical={this.renderThumb}
      >
        <GraphCarousel
          carouselGlobalParameters={globalParameters}
          graphData={
            selectedCountry ? this.getCountryChartBau(selectedCountry.id, selectedParams) : null
          }
          compareScenariosData={compareScenariosData}
          ref={ref => (this.graphCarousel = ref)}
          fetchChartData={this.handleFetchChartData}
          selectedParams={selectedParams}
          direction={direction}
          locale={locale}
          isMobile={isMobile}
          scrollHeightForGraphCarousel={scrollHeightForGraphCarousel}
        />
      </Scrollbars>
    );
  };

  render() {
    const {
      bottomCollapse,
      downloadAsPdf,
      downloadData,
      downloadStarted,
      selectedFileType,
      winHeightForGraphCarousel,
    } = this.state;

    const {
      app: {
        selectedCountry,
        globalLoading,
        globalParameters,
        appliedScenario,
        savedScenarios,
        mapData,
        appliedPolicies,
        currentColorSliderValue,
        selectedPonderable,
        compareScenariosData,
        selectedYear,
        selectedParams,
        locale,
        visibleTab,
        visibleFooterTab,
      },
      tourProgress,
      downloadPdfReceive,
      setHeaderTab,
      setFooterTab,
      isMobile,
    } = this.props;

    const countryMapData = selectedCountry
      ? mapData.length
        ? this.getCountryMapData(mapData, selectedCountry.id, selectedYear)
        : this.getCountryMapBoxBau(selectedCountry.id, selectedYear)
      : null;
    const colorStops = countryMapData
      ? getColorCodesAndRange(countryMapData, selectedPonderable)
      : [];
    const { direction } = this.context;
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;
    const steps = [
      {
        content: <IntlMessages id="simulator.helpTour.clickOnCountryTab" />,
        placement: 'bottom',
        target: '#countryHelp',
        stepKey: 'countryTab',
        disableBeacon: true,
      },
      {
        content: <IntlMessages id="simulator.helpTour.selectCountry" />,
        target: '.countryIcon',
        placement: direction === 'rtl' ? 'left' : 'right',
        stepKey: 'selectCountry',
        disableBeacon: false,
      },
      // {
      //   content: 'Hover on choropleth map for details',
      //   target: '#mapRegion',
      //   placement: 'right',
      //   stepKey: 'hoverMap',
      // },
      {
        content: <IntlMessages id="simulator.helpTour.clickOnPolicyTab" />,
        placement: 'bottom',
        target: '#policyHelp',
        stepKey: 'policyTab',
        disableBeacon: false,
      },
      {
        content: <IntlMessages id="simulator.helpTour.policyExpender" />,
        placement: direction === 'rtl' ? 'left' : 'right',
        target: '.policyExpander',
        stepKey: 'policyExpander',
        disableBeacon: false,
      },
      {
        content: (
          <React.Fragment>
            <IntlMessages id="simulator.helpTour.selectPolicy" />
            <img
              src="/images/help_tour/applyPolicyModal.png"
              alt="Apply Policy Modal"
              width="100%"
              style={{ boxShadow: '1px 1px 5px 5px #ccc', marginTop: '10px' }}
            />
            <ol type="a" style={{ marginTop: '10px', textAlign: 'left' }}>
              <li>
                <IntlMessages id="simulator.helpTour.setPolicyStartYear" />
              </li>
              <li>
                <IntlMessages id="simulator.helpTour.setPolicyPercentage" />
              </li>
              <li>
                <IntlMessages id="simulator.helpTour.clickOnApplyPolicy" />
              </li>
            </ol>
          </React.Fragment>
        ),
        placement: direction === 'rtl' ? 'left' : 'right',
        target: '.policySwitch',
        stepKey: 'policySwitch',
        disableBeacon: false,
      },

      {
        content: <IntlMessages id="simulator.helpTour.expendRightPanel" />,
        placement: direction === 'rtl' ? 'right' : 'left',
        target: '.viewAppliedPolicies',
        stepKey: 'viewAppliedPolicies',
        disableBeacon: false,
      },
      {
        content: (
          <React.Fragment>
            <IntlMessages id="simulator.helpTour.clickOnSaveScenario" />
            <img
              src="/images/help_tour/saveScenarioModal.png"
              alt="Save Scenario Modal"
              width="100%"
              style={{ boxShadow: '1px 1px 5px 5px #ccc', marginTop: '10px' }}
            />
            <ol type="a" style={{ marginTop: '10px', textAlign: 'left' }}>
              <li>
                <IntlMessages id="simulator.helpTour.fillScenarioName" />
              </li>
              <li>
                {' '}
                <IntlMessages id="simulator.helpTour.inputDescription" />
              </li>
              <li>
                <IntlMessages id="simulator.helpTour.saveScenarioButton" />
              </li>
            </ol>
          </React.Fragment>
        ),
        placement: direction === 'rtl' ? 'right' : 'left',
        target: '#savePolicyHelp',
        stepKey: 'saveScenarioModal',
        disableBeacon: false,
      },
      {
        content: (
          <React.Fragment>
            <img
              src="/images/help_tour/compareScenarioModal.png"
              alt="Compare Scenario Modal"
              width="100%"
              style={{ boxShadow: '1px 1px 5px 5px #ccc', marginTop: '10px' }}
            />
            <ol type="a" style={{ marginTop: '10px', textAlign: 'left' }}>
              <li>
                <IntlMessages id="simulator.helpTour.clickCompareScenario" />
              </li>
              <li>
                <IntlMessages id="simulator.helpTour.clickCompareScenarioWithBaseLine" />
              </li>
            </ol>
          </React.Fragment>
        ),
        placement: direction === 'rtl' ? 'left' : 'right',
        target: '#compareScenarioHelp',
        stepKey: 'compareScenario',
        disableBeacon: false,
      },
      {
        content: <IntlMessages id="simulator.helpTour.openScenarioAnalysis" />,
        placement: 'top',
        target: '#viewScenarioAnalysis',
        stepKey: 'viewScenarioAnalysis',
        disableBeacon: false,
      },
      {
        content: (
          <React.Fragment>
            <p>
              <IntlMessages id="simulator.helpTour.clickDownloadPdf" />
            </p>
            <p>
              <IntlMessages id="simulator.helpTour.clickShareByEmail" />
            </p>
          </React.Fragment>
        ),
        placement: direction === 'rtl' ? 'right' : 'left',
        target: '.rightPanelActionsCt',
        stepKey: 'downloadHelp',
        disableBeacon: false,
      },
      // {
      //   content: 'Click "Share by email" to send data and graph via email',
      //   placement: 'left',
      //   target: '#shareByEmailHelp',
      //   stepKey: 'shareByEmailHelp',
      //   disableBeacon: false,
      // },
    ];
    const scrollHeightForGraphCarousel =
      winHeightForGraphCarousel - getTotalHeaderAndFooterHeight(isMobile);

    return (
      <React.Fragment>
        <HelpTour
          tourProgress={tourProgress}
          steps={steps}
          onJoyrideCallback={this.handleJoyrideCallback}
          locale={locale}
        />
        <WindowSizeListener
          onResize={windowSize => {
            this.setState({ winHeightForGraphCarousel: windowSize.windowHeight });
          }}
        />
        {isMobile ? (
          <HeaderTabs setHeaderTab={setHeaderTab} direction={direction} visibleTab={visibleTab} />
        ) : null}

        <div className={direction === 'rtl' ? styles.rtlSimulatorRoot : ''}>
          {this.renderCountriesAndPoliciesTabs()}
          {this.renderAppliedPoliciesTab()}
          <Mapbox
            ref={ref => (this.mapbox = ref)}
            selectedCountry={selectedCountry}
            countryMapBau={countryMapData}
            globalParameters={globalParameters}
            colorStops={colorStops}
            currentColorSliderValue={currentColorSliderValue}
            selectedPonderable={selectedPonderable}
            direction={direction}
            locale={locale}
            selectedYear={selectedYear}
            isMobile={isMobile}
            mobileDrawerClose={this.handleMobileDrawerClose}
          />

          <Drawer
            visible={isMobile ? (visibleFooterTab === 'scenario' ? true : false) : bottomCollapse}
            height={isMobile ? `${scrollHeightForGraphCarousel}px` : 277}
            className={
              isMobile
                ? visibleFooterTab === 'scenario'
                  ? styles.graphDrawer
                  : styles.graphDrawerNotVisible
                : styles.appBottomDrawer
            }
            placement="bottom"
            handler={
              isMobile ? (
                <div style={{ position: 'absolute', bottom: '-50px' }}>&nbsp;</div>
              ) : (
                <div className={styles.bottomHandle}>
                  <div className={styles.bottomHandleText}>
                    <IntlMessages id="simulator.bottomPane.scenarioAnalysis" />
                  </div>
                  <div
                    id="viewScenarioAnalysis"
                    className={bottomCollapse ? styles.bottomHandlerOpen : styles.bottomHandler}
                  >
                    <Icon
                      type={bottomCollapse ? 'down' : 'up'}
                      style={{
                        color: '#fff',
                        fontSize: 20,
                      }}
                    />
                  </div>
                  {bottomCollapse ? (
                    <div className={styles.bottomHandlerReset}>
                      <Button type="primary" onClick={evt => this.handleResetToDefaults(evt)}>
                        <IntlMessages id="simulator.bottomPane.resetToDefaults" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              )
            }
            onHandleClick={() => this.togglerContent('bottom')}
            style={{
              zIndex: 999,
            }}
            bodyStyle={{
              padding: '0px',
              backgroundColor: '#dfdfdf',
            }}
            mask={false}
            closable={false}
          >
            <div style={{ overflow: 'hidden' }}>{this.renderGraphCarousel()}</div>
          </Drawer>
          <OverlayLoader loading={globalLoading} />
          {isMobile ? (
            <Drawer
              placement="bottom"
              closable={false}
              onClose={this.onClose}
              visible={visibleFooterTab === 'choropleth'}
              className={
                visibleFooterTab === 'choropleth'
                  ? styles.choroplethDrawer
                  : styles.choroplethDrawerNotVisible
              }
              height={280}
              mask={false}
              handler={<div>&nbsp;</div>}
            >
              {this.renderChoroplethCard()}
            </Drawer>
          ) : (
            <div className={styles.ktafSettingBox}>
              <Card style={{ borderRadius: '5px', minWidth: '290px' }} className="showHideBackCard">
                {this.renderChoroplethCard()}
              </Card>
            </div>
          )}

          <div
            style={{ position: 'absolute', zIndex: 99, top: '25vh', left: '-335px', opacity: 0 }}
            id="appliedAnimation"
          >
            <Card style={{ width: 335, height: 96 }} loading />
          </div>

          <Modal
            centered
            title={<IntlMessages id="simulator.createPdf.pdfSimulationView" />}
            visible={downloadAsPdf}
            maskClosable={false}
            closable={false}
            bodyStyle={{ textAlign: direction === 'rtl' ? 'right' : '' }}
            okText={
              downloadStarted ? (
                <IntlMessages id="simulator.createPdf.pleaseWait" />
              ) : (
                <IntlMessages id="simulator.createPdf.download" />
              )
            }
            cancelText={<IntlMessages id="simulator.createPdf.cancel" />}
            onCancel={this.handleCloseDownloadPdf}
            onOk={this.handleDownloadPdfModel}
            width={743}
            okButtonDisabled
          >
            {downloadAsPdf ? (
              <CreatePdf
                ref={ref => (this.createPdf = ref)}
                selectedCountry={selectedCountry}
                savedScenarios={savedScenarios}
                mapData={this.includeInPdf('choroplethMapData') ? countryMapData : null}
                countryChartBau={
                  this.includeInPdf('chartData')
                    ? this.getCountryChartBau(selectedCountry.id, selectedParams)
                    : null
                }
                appliedPolicies={appliedPolicies}
                appliedScenario={appliedScenario}
                selectedPonderable={selectedPonderable}
                compareScenariosData={compareScenariosData}
                mapImage={
                  this.includeInPdf('choroplethMapImage') ? this.getMapImage.bind(this) : null
                }
                chartImages={this.includeInPdf('chartImage') ? this.getChartImages() : []}
                downloadData={downloadData}
                selectedFileType={selectedFileType}
                closeModal={this.handleCloseDownloadPdf}
                globalParameters={globalParameters}
                selectedYear={selectedYear}
                locale={locale}
                direction={direction}
                downloadPdfReceive={downloadPdfReceive}
                onDownloadSuccess={this.onDownloadSuccess}
                selectedParams={selectedParams}
              />
            ) : null}
          </Modal>
        </div>
        {isMobile ? (
          <FooterTabs
            direction={direction}
            setFooterTab={setFooterTab}
            visibleFooterTab={visibleFooterTab}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default connect(
  state => ({
    app: { ...state.simulator.toJS() },
  }),
  {
    setCountry,
    removePolicy,
    fetchCountryBau,
    applyCountryPolicyScenario,
    fetchGlobalParameters,
    saveScenario,
    applySaveScenarioPolicy,
    removeAppliedPolices,
    fetchInitialData,
    fetchCountryBauReceive,
    reApplyCountryBauData,
    saveCurrentColorSliderValue,
    setPonderable,
    compareScenarios,
    resetCompareScenario,
    updateAppliedScenarios,
    applySliderYearPolicy,
    setSelectedYear,
    shareByEmail,
    setEmailSendStatus,
    applyPolicyAnimation,
    fetchChartData,
    reApplyCountryBauChartData,
    downloadPdf,
    downloadPdfReceive,
    testScenarios,
    resetScenarios,
    setHeaderTab,
    setFooterTab,
    setSelectedPolicyToCompared,
    clearUnsavedSession,
    fetchUserDetails,
  }
)(Simulator);
