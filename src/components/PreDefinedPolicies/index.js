import React from 'react';
import { Icon, List, Modal } from 'antd';
import classnames from 'classnames';
import PreDefinedPolicyModel from './PreDefinedPolicyModel';
import IntlMessages from '../Misc/intlMessages';
import ltrStyles from './ltr.module.less';
import rtlStyles from './rtl.module.less';

let styles = {};
class PreDefinedPolicies extends React.Component {
  state = {
    showModel: false,
    selectedPolicy: null,
    selected: null,
  };

  handleListItemClick = (evt, index) => {
    evt.preventDefault();
    const { preDefinedPolicies } = this.props;
    this.setState({ selectedPolicy: preDefinedPolicies[index], showModel: true, selected: index });
  };

  handleCancelModel = () => {
    this.setState({ showModel: false, selected: null });
  };

  handleApplyPolicy = () => {
    this.setState({ showModel: false, selected: null });
  };

  render() {
    const { preDefinedPolicies, loading, direction } = this.props;
    const { showModel, selectedPolicy, selected } = this.state;
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;
    return (
      <React.Fragment>
        <List
          itemLayout="horizontal"
          loading={loading}
          dataSource={preDefinedPolicies}
          dir={direction}
          locale={{ emptyText: <IntlMessages id="policiesCollapse.predefinedPolicy.notFound" /> }}
          renderItem={(item, index) => {
            return (
              <List.Item
                key={item.scenarioId}
                className={index % 2 === 0 ? styles.predefinedEven : styles.predefinedOdd}
                onClick={evt => this.handleListItemClick(evt, index)}
              >
                <List.Item.Meta
                  avatar={
                    <img
                      alt="example"
                      src="/images/pre_defined_policies/saudi_aramco_policy.png"
                      className={styles.preDefinedImage}
                    />
                  }
                  title={
                    <span
                      className={
                        selected === index
                          ? classnames(styles.preDefinedTitle, styles.selectedListItem)
                          : styles.preDefinedTitle
                      }
                    >{`${item.scenarioName} - Policy`}</span>
                  }
                  description={
                    <span className={styles.preDefinedDesc}>{item.shortDescription}</span>
                  }
                />
                <Icon
                  type={direction === 'rtl' ? 'left' : 'right'}
                  className={selected === index ? styles.selectedListItem : null}
                />
              </List.Item>
            );
          }}
        />
        <Modal
          centered
          closable={false}
          visible={showModel}
          footer={null}
          okText={<IntlMessages id="policiesCollapse.predefinedPolicy.apply" />}
          cancelText={<IntlMessages id="policiesCollapse.predefinedPolicy.cancel" />}
          onOk={this.handleApplyPolicy}
          onCancel={this.handleCancelModel}
          maskClosable={false}
        >
          <PreDefinedPolicyModel
            data={selectedPolicy}
            onCancel={this.handleCancelModel}
            onApply={this.handleApplyPolicy}
            direction={direction}
          />
        </Modal>
      </React.Fragment>
    );
  }
}
export default PreDefinedPolicies;
