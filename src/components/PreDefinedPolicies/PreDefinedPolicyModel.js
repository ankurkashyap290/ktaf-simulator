import React from 'react';
import { Row, Col, Button } from 'antd';
import classnames from 'classnames';
import IntlMessages from '../Misc/intlMessages';
import ltrStyles from './ltr.module.less';
import rtlStyles from './rtl.module.less';

let styles = {};

class PreDefinedPolicyModel extends React.Component {
  render() {
    const { data, onApply, onCancel, direction } = this.props;
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;
    return (
      <React.Fragment>
        {direction === 'rtl' ? (
          <Row gutter={2}>
            <Col span={18}>
              <div className={classnames(styles.preDefinedTitle, styles.preDefinedModelTitle)}>
                {data.scenarioName} - POLICY
              </div>
              <div className={styles.preDefinedDescription}>{data.description}</div>
              <div className={classnames(styles.preDefinedTitle, styles.preDefinedModelSubTitle)}>
                <IntlMessages id="policiesCollapse.predefinedPolicy.about" />
              </div>
              <div className={styles.subDescription}>{data.about}</div>
              <div className={styles.modelAction}>
                <Row gutter={3}>
                  <Col span={8}>
                    <Button onClick={onApply} className={styles.greenButton}>
                      <IntlMessages id="policiesCollapse.predefinedPolicy.apply" />
                    </Button>
                  </Col>
                  <Col span={8}>
                    <Button onClick={onCancel} className={styles.grayButton}>
                      <IntlMessages id="policiesCollapse.predefinedPolicy.cancel" />
                    </Button>
                  </Col>
                  <Col span={8} />
                </Row>
              </div>
            </Col>
            <Col span={6}>
              <div className={styles.preDefinedModelImg}>
                <img
                  alt="example"
                  src={`/images/pre_defined_policies/${data.image}`}
                  className={styles.preDefinedImage}
                />
              </div>
            </Col>
          </Row>
        ) : (
          <Row gutter={2}>
            <Col span={6}>
              <div className={styles.preDefinedModelImg}>
                <img
                  alt="example"
                  src={`/images/pre_defined_policies/${data.image}`}
                  className={styles.preDefinedImage}
                />
              </div>
            </Col>
            <Col span={18}>
              <div className={classnames(styles.preDefinedTitle, styles.preDefinedModelTitle)}>
                {data.scenarioName} - POLICY
              </div>
              <div className={styles.preDefinedDescription}>{data.description}</div>
              <div className={classnames(styles.preDefinedTitle, styles.preDefinedModelSubTitle)}>
                <IntlMessages id="policiesCollapse.predefinedPolicy.about" />
              </div>
              <div className={styles.subDescription}>{data.about}</div>
              <div className={styles.modelAction}>
                <Row gutter={3}>
                  <Col span={8}>
                    <Button onClick={onCancel} className={styles.grayButton}>
                      <IntlMessages id="policiesCollapse.predefinedPolicy.cancel" />
                    </Button>
                  </Col>
                  <Col span={8}>
                    <Button onClick={onApply} className={styles.greenButton}>
                      <IntlMessages id="policiesCollapse.predefinedPolicy.apply" />
                    </Button>
                  </Col>
                  <Col span={8} />
                </Row>
              </div>
            </Col>
          </Row>
        )}
      </React.Fragment>
    );
  }
}
export default PreDefinedPolicyModel;
