/* eslint-disable no-shadow */
import React from 'react';
import { connect } from 'react-redux';
import {
  List,
  Slider,
  Collapse,
  Switch,
  Modal,
  Tooltip,
  InputNumber,
  Icon,
  Row,
  Col,
  Select,
  //  Card,
} from 'antd';
import moment from 'moment';
import classnames from 'classnames';
import actions from '../../redux/simulator/actions';
import IntlMessages from '../Misc/intlMessages';
import { maxYear } from '../../configs/app.config';
import ltrStyles from './index.module.less';
import rtlStyles from './rtl.module.less';
import { getRandomColor } from '../../utils';

import './animation.css';

const {
  applyPolicy,
  removePolicy,
  updatePolicy,
  applyCountryPolicyScenario,
  testScenarios,
} = actions;

const Panel = Collapse.Panel;
const marks = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  60: 60,
  70: 70,
  80: 80,
  90: 90,
  100: 100,
};
let styles = {};
class PoliciesCollapse extends React.Component {
  state = {
    collapseShow: null,
    selectedPolicyGroup: null,
    selectedPolicy: null,
    showPolicyModel: false,
    policySliderValue: 0,
    selectedYear: moment().year() + 1,
  };

  componentDidMount() {
    const { selectedPolicyGroupIndex, policies } = this.props;
    this.setState({ selectedPolicyGroup: policies[selectedPolicyGroupIndex] });
  }

  componentDidUpdate(prevProps) {
    const { appliedPolicyRequest, onPolicyUpdate } = this.props;
    if (
      this.actionPolicy &&
      (prevProps.appliedPolicyRequest !== appliedPolicyRequest &&
        prevProps.appliedPolicyRequest === true)
    ) {
      onPolicyUpdate && onPolicyUpdate({ mode: 'add', appliedPolicy: { ...this.actionPolicy } });
      this.actionPolicy = null;
    }
  }

  onChangeSliderValue = value => {
    this.setState({
      policySliderValue: value,
    });
  };

  handleCollapseClick = key => {
    this.setState({
      collapseShow: key,
    });
  };

  getAppliedPolicy = (policyGroup, policy) => {
    const { appliedPolicies, appliedScenario } = this.props;
    if (appliedScenario) {
      return null;
    }
    return (
      appliedPolicies.find(item => item.policyGroup === policyGroup && item.policy === policy) ||
      null
    );
  };

  handlePolicyClick = (policyGroup, policy, evt) => {
    evt && evt.stopPropagation();
    const appliedPolicy = this.getAppliedPolicy(policyGroup.id, policy.id);
    this.setState({
      selectedPolicyGroup: { ...policyGroup },
      selectedPolicy: { ...policy },
      showPolicyModel: true,
      policySliderValue: appliedPolicy ? appliedPolicy.sliderValue : 0,
      selectedYear: appliedPolicy ? appliedPolicy.year : 2020,
    });
  };

  handlePolicySwitchToggle = (checked, policyGroup, policy) => {
    if (!checked) {
      const appliedPolicy = this.getAppliedPolicy(policyGroup.id, policy.id);
      if (appliedPolicy) {
        this.handleCountryScenario(appliedPolicy, 'remove');
      }
    } else {
      this.handlePolicyClick(policyGroup, policy);
    }
  };

  handleCancelModel = () => {
    this.setState({
      showPolicyModel: false,
      selectedPolicy: null,
      selectedPolicyGroup: null,
      policySliderValue: 0,
    });
  };

  handleApplyPolicy = () => {
    const { policySliderValue, selectedPolicy, selectedPolicyGroup, selectedYear } = this.state;
    const { openRightCollapse } = this.props;
    const newPolicy = {
      policyGroup: selectedPolicyGroup.id,
      policy: selectedPolicy.id,
      sliderValue: policySliderValue || 0,
      policyName: selectedPolicy.policyName,
      year: selectedYear,
      isSaved: false,
    };
    if (newPolicy.sliderValue > 0) {
      const timeout = openRightCollapse() ? 300 : 200;
      setTimeout(this.handleApplyPolicyAnimation.bind(this, newPolicy), timeout);
    } else {
      const appliedPolicy = this.getAppliedPolicy(newPolicy.policyGroup, newPolicy.policy);

      if (appliedPolicy) {
        this.handleCountryScenario(appliedPolicy, 'remove');
      }
    }
  };

  handleApplyPolicyAnimation = newPolicy => {
    const { applyPolicyAnimation } = this.props;
    applyPolicyAnimation(true);
    document.getElementsByClassName('appliedPolicyAnimation')[0].scrollIntoView();
    document.getElementsByClassName('appliedPolicyAnimation')[0].style.opacity = 0;
    const animationEl = document.getElementById('appliedAnimation');
    const dropEl = document.getElementsByClassName('appliedPolicyAnimation')[0]
      ? document.getElementsByClassName('appliedPolicyAnimation')[0].getClientRects()
      : [];
    const startEl = document.getElementById('startAnimation')
      ? document.getElementById('startAnimation').getClientRects()
      : [];

    if (animationEl) {
      if (animationEl.animate === undefined) {
        setTimeout(this.clearAnimation.bind(this, animationEl, newPolicy), 300);
      } else {
        animationEl.animate(
          [
            // keyframes
            {
              left: startEl.length ? `${startEl[0].left}px` : '10%',
              top: startEl.length ? `${startEl[0].top}px` : '10%',
              opacity: 1,
              zIndex: 999,
            },
            {
              left: dropEl.length ? `${dropEl[0].left}px` : '1043px',
              top: dropEl.length ? `${dropEl[0].top}px` : '105px',
              opacity: 0.2,
              transition: 'opacity .3s ease-in-out',
              zIndex: 9999,
            },
          ],
          {
            // timing options
            duration: 300,
            iterations: 1,
          }
        );
        setTimeout(this.clearAnimation.bind(this, animationEl, newPolicy), 300);
      }

      this.handleCancelModel();
    }
  };

  clearAnimation = (el, newPolicy) => {
    el.className = el.className.replace('applyPolicyAnimation', '');
    document.getElementsByClassName('appliedPolicyAnimation')[0].style.opacity = '';
    // applyPolicyAnimation(false);
    this.handleCountryScenario(newPolicy, 'add');
  };

  handleCountryScenario = (policy, mode) => {
    const {
      selectedCountry,
      appliedPolicies,
      applyPolicy,
      locale,
      isComparedScenario,
      comparedData,
      selectedParams,
    } = this.props;
    const newAppliedPolicies = [...appliedPolicies];

    const appliedPolicy = newAppliedPolicies.findIndex(
      item => item.policyGroup === policy.policyGroup && item.policy === policy.policy
    );

    if (appliedPolicy >= 0) {
      if (mode === 'remove') {
        newAppliedPolicies.splice(appliedPolicy, 1);
      } else {
        newAppliedPolicies[appliedPolicy] = { ...policy };
      }
    } else {
      newAppliedPolicies.push(policy);
    }
    this.actionPolicy = { ...policy };

    applyPolicy({
      applyPolicy: {
        countryId: selectedCountry.id,
        mode,
        appliedPolicies: [...newAppliedPolicies],
        policy,
        locale,
      },
      isComparedScenario,

      selectedParams,
      comparedData,
    });
  };

  handleTestScenario = resetSelectedParams => {
    const {
      testScenarios,
      resetCompareScenario,
      selectedParams,
      selectedCountry,
      comparedData,
      appliedPolicies,
    } = this.props;
    const tempSelected = [];

    if (comparedData && comparedData.length) {
      comparedData.map(element => {
        return tempSelected.push(element);
      });
    }
    tempSelected.push({
      name: 'Test (Real-time)',
      appliedPolicies: [...appliedPolicies],
      stokeColor: getRandomColor(),
    });

    if (resetSelectedParams) {
      selectedParams.zoneId = 1;
      selectedParams.modeId = 1;
      selectedParams.technologyId = 1;
      selectedParams.sectorId = 1;
    }
    const payload = {
      countryId: selectedCountry.id,
      scenarios: [...tempSelected],
      selectedParams,
    };
    if (appliedPolicies.length && appliedPolicies.length > 0) {
      testScenarios({ payload });
    } else {
      resetCompareScenario();
    }
  };

  renderYearList = () => {
    const currentYear = moment().year();
    const list = [];
    // eslint-disable-next-line no-plusplus
    for (let year = currentYear; year <= maxYear; year++) {
      list.push(
        <Select.Option key={`year_${year}`} value={year}>
          {year}
        </Select.Option>
      );
    }
    return list;
  };

  handleYearChange = selectedYear => {
    this.setState({ selectedYear });
  };

  render() {
    const { policies, appliedScenario, direction, isMobile } = this.props;
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;
    const {
      collapseShow,
      showPolicyModel,
      selectedPolicy,
      selectedPolicyGroup,
      policySliderValue,
      selectedYear,
    } = this.state;
    return (
      <React.Fragment>
        <Collapse
          bordered={false}
          onChange={key => this.handleCollapseClick(key)}
          accordion
          className={styles.policyCollapseEl}
        >
          {policies.map(policy => {
            const key = `pol_colpse_pnl_${policy.id}`;
            return (
              <Panel
                showArrow={false}
                header={<span className={styles.policyGroupTitle}>{policy.name}</span>}
                key={key}
                className={styles.extraElement}
                extra={
                  !appliedScenario && collapseShow === key ? (
                    <Icon
                      className="policyExpander"
                      type="minus-circle"
                      theme="filled"
                      style={{ color: '#06477D' }}
                    />
                  ) : (
                    <Icon
                      className="policyExpander"
                      type="plus-circle"
                      theme="filled"
                      style={{ color: '#4A4A4A' }}
                    />
                  )
                }
              >
                <List
                  itemLayout="horizontal"
                  dataSource={policy.policies}
                  locale={{ emptyText: <IntlMessages id="policiesCollapse.noPolicyFound" /> }}
                  className={styles.policyList}
                  dir={direction}
                  renderItem={item => {
                    const appliedPolicy = this.getAppliedPolicy(policy.id, item.id);
                    const switchButton = !appliedScenario && appliedPolicy !== null;
                    return (
                      <List.Item key={item.id}>
                        <List.Item.Meta
                          onClick={this.handlePolicyClick.bind(this, policy, item)}
                          title={<span className={styles.policyTitle}>{item.policyName}</span>}
                        />
                        <Switch
                          className="policySwitch"
                          checked={switchButton}
                          onClick={checked => {
                            this.handlePolicySwitchToggle(checked, policy, item);
                          }}
                        />
                      </List.Item>
                    );
                  }}
                />
              </Panel>
            );
          })}
        </Collapse>
        <Modal
          centered
          closable={false}
          visible={showPolicyModel}
          okText={<IntlMessages id="policiesCollapse.apply" />}
          cancelText={<IntlMessages id="policiesCollapse.cancel" />}
          onOk={this.handleApplyPolicy}
          onCancel={this.handleCancelModel}
          maskClosable={false}
          className={classnames(styles.modelWrapClass, 'policyModal')}
        >
          <div style={{ textAlign: 'center' }}>
            <p className={styles.policyModelGroupName}>
              {selectedPolicyGroup ? selectedPolicyGroup.name : ''}{' '}
              <Tooltip
                title={
                  selectedPolicy && selectedPolicy.description
                    ? selectedPolicy.description
                    : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                }
                trigger="hover"
              >
                <Icon type="info-circle" theme="filled" />
              </Tooltip>
            </p>
            <p className={styles.policyModelPolicyName}>
              {selectedPolicy ? selectedPolicy.policyName : ''}
            </p>
            <span>
              <IntlMessages id="policiesCollapse.year" />:{' '}
            </span>
            <Select
              defaultValue={selectedYear}
              onChange={this.handleYearChange}
              value={selectedYear}
              className="policyModalSetYear"
            >
              {this.renderYearList()}
            </Select>
          </div>
          <div className={classnames(styles.policyModelSliderCt, 'policyModalSetPercentage')}>
            <Row>
              <Col span={20} style={{ paddingRight: '8px' }}>
                <Slider
                  tooltipVisible={showPolicyModel}
                  marks={marks}
                  min={0}
                  max={100}
                  value={typeof policySliderValue === 'number' ? policySliderValue : 0}
                  onChange={this.onChangeSliderValue}
                />
              </Col>
              <Col span={4} style={!isMobile ? { paddingLeft: '10px' } : null}>
                <InputNumber
                  min={0}
                  max={100}
                  value={policySliderValue || 0}
                  onChange={this.onChangeSliderValue}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </div>
          <div id="startAnimation" />
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(
  state => ({
    ...state.simulator.toJS(),
  }),
  {
    applyPolicy,
    removePolicy,
    updatePolicy,
    applyCountryPolicyScenario,
    testScenarios,
  },
  null,
  { forwardRef: true }
)(PoliciesCollapse);
