/* eslint no-unneeded-ternary: [0] */
/* eslint-disable no-shadow */
import React from 'react';
import { List, Checkbox, Button } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from 'classnames';
import IntlMessages from '../Misc/intlMessages';
import { getRandomColor } from '../../utils';
import styles from './index.module.less';

class SaveScenarioList extends React.Component {
  state = {
    selected: [],
  };

  handleCheckboxChange = (evt, item) => {
    evt.stopPropagation();
    let tempSelected = [];
    const { selected } = this.state;
    const { setSelectedPolicyToCompared } = this.props;
    tempSelected = [...selected];
    if (evt.target.checked) {
      tempSelected.push({
        name: item.name,
        appliedPolicies: item.appliedPolicies,
        stokeColor: getRandomColor(),
      });
    } else {
      const foundedIndex = selected.findIndex(el => el.name === item.name);
      tempSelected.splice(foundedIndex, 1);
    }

    this.setState({ selected: tempSelected });
    setSelectedPolicyToCompared(tempSelected);
  };

  handleCompareScenario = resetSelectedParams => {
    const { selected } = this.state;
    const tempSelected = [...selected];
    const {
      compareScenarios,
      selectedCountry,
      selectedParams,
      appliedPolicies,
      testScenarios,
      appliedScenario,
    } = this.props;

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

    if (appliedPolicies.length && appliedPolicies.length > 0 && !appliedScenario) {
      tempSelected.push({
        name: 'Test (Real-time)',
        appliedPolicies: [...appliedPolicies],
        stokeColor: getRandomColor(),
      });
      const payload = {
        countryId: selectedCountry.id,
        scenarios: [...tempSelected],
        selectedParams,
      };

      testScenarios({ payload });
    } else {
      compareScenarios({ payload });
    }
  };

  handleSelectedState = () => {
    const { selected } = this.state;
    return selected;
  };

  handleResetScenario = () => {
    const {
      resetCompareScenario,
      appliedPolicies,
      selectedCountry,
      selectedParams,
      testScenarios,
      appliedScenario,
      resetScenarios,
      setSelectedPolicyToCompared,
    } = this.props;
    const tempSelected = [];

    if (appliedPolicies.length && appliedPolicies.length > 0 && !appliedScenario) {
      tempSelected.push({
        name: 'Test (Real-time)',
        appliedPolicies: [...appliedPolicies],
        stokeColor: getRandomColor(),
      });
      const payload = {
        countryId: selectedCountry.id,
        scenarios: [...tempSelected],
        selectedParams,
      };
      this.setState({ selected: [] });
      testScenarios({ payload });
      resetScenarios();
      setSelectedPolicyToCompared([]);
    } else {
      this.setState({ selected: [] });
      resetCompareScenario();
      setSelectedPolicyToCompared([]);
    }
  };

  renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: 'rgba(240,242,245,.5)',
      border: '1px solid rgba(0,0,0,.3)',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  handleListItemClick = (evt, item) => {
    evt.stopPropagation();
    const {
      applySaveScenarioPolicy,
      appliedScenario,
      showContinueModel,
      appliedPolicies,
      updateAppliedScenarios,
    } = this.props;
    if (!appliedScenario && appliedPolicies.length > 0) {
      showContinueModel(true, item);
    } else if (appliedScenario === item.name) {
      updateAppliedScenarios('');
    } else {
      applySaveScenarioPolicy(item);
    }
  };

  render() {
    const {
      savedScenarios,
      loading,
      appliedScenario,
      selectedCountry,

      direction,
      isComparedScenario,
      isMobile,
    } = this.props;
    const { selected } = this.state;
    const rootHeight = isMobile ? 200 : 325 - 45;
    return (
      <React.Fragment>
        <Scrollbars style={{ height: `${rootHeight}px` }} renderThumbVertical={this.renderThumb}>
          <List
            itemLayout="horizontal"
            loading={loading}
            locale={{ emptyText: <IntlMessages id="saveScenario.notFound" /> }}
            dataSource={savedScenarios.filter(
              scenario => scenario.countryId === selectedCountry.id
            )}
            dir={direction}
            renderItem={(item, index) => {
              return (
                <List.Item
                  key={item.id}
                  className={index % 2 === 0 ? styles.predefinedEven : styles.predefinedOdd}
                  onClick={evt => this.handleListItemClick(evt, item)}
                >
                  <List.Item.Meta
                    title={
                      <span
                        className={
                          appliedScenario === item.name
                            ? classnames(styles.preDefinedTitle, styles.selectedListItem)
                            : styles.preDefinedTitle
                        }
                      >{`${item.name}`}</span>
                    }
                    description={<span className={styles.preDefinedDesc}>{item.description}</span>}
                  />
                  <Checkbox
                    onChange={evt => this.handleCheckboxChange(evt, item)}
                    onClick={evt => evt.stopPropagation()}
                    checked={
                      selected.length && selected.find(checkItem => checkItem.name === item.name)
                        ? true
                        : false
                    }
                  />
                </List.Item>
              );
            }}
          />
        </Scrollbars>
        <div style={{ width: '100%', textAlign: 'right' }}>
          <Button
            onClick={this.handleResetScenario}
            disabled={!isComparedScenario}
            className={styles.blueButton}
            style={{ width: '30%' }}
          >
            <IntlMessages id="saveScenario.reset" />
          </Button>
          <Button
            onClick={this.handleCompareScenario}
            className={styles.greenButton}
            disabled={!selected.length}
            style={{ width: '30%' }}
          >
            <IntlMessages id="saveScenario.compare" />
          </Button>
        </div>
      </React.Fragment>
    );
  }
}
export default SaveScenarioList;
