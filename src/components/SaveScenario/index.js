/* eslint-disable no-shadow */
import React from 'react';
import { Modal, Input, Row, Col, Button, Form, message } from 'antd';
import IntlMessages from '../Misc/intlMessages';
import ltrStyles from './index.module.less';
import rtlStyles from './rtl.module.less';

const { TextArea } = Input;
let styles = {};
class SaveScenario extends React.Component {
  componentDidMount() {
    const unsavedScenario = JSON.parse(sessionStorage.getItem('unsaved-session-scenario') || null);
    if (unsavedScenario) {
      const {
        form: { setFieldsValue },
      } = this.props;
      setFieldsValue({ ...unsavedScenario });
    }
  }

  handleFormCancel = () => {
    const { onCancel } = this.props;
    onCancel(false);
  };

  checkForDuplicateName = (rule, value, callback) => {
    const { savedScenarios, country } = this.props;
    const founded = savedScenarios.find(
      item => item.name === value && country.id === item.countryId
    );
    if (founded) {
      callback(<IntlMessages id="saveScenario.uniqueScenarioErrorMsg" />);
    } else {
      callback();
    }
  };

  handleSubmit = () => {
    const {
      form: { validateFields, setFieldsValue },
      saveScenario,
      appliedPolicies,
      onCancel,
      country,
      locale,
      saveSessionBeforeRedirect,
      userDetails,
      userEncodedStr,
    } = this.props;
    validateFields((err, values) => {
      if (err) {
        message.error(err);
      } else {
        const newAppliedPolicies = appliedPolicies.map(policy => {
          policy.isSaved = true;
          return policy;
        });
        let savedFor = '';
        if (userDetails) {
          savedFor = 'user';
        } else {
          savedFor = 'session';
        }
        const payload = {
          countryId: country.id,
          userId: '',
          name: values.scenarioName,
          description: values.aboutScenario || '',
          appliedPolicies: [...newAppliedPolicies],
          userEncodedStr,
          savedFor,
        };

        let isSave = true;
        if (savedFor === 'user' && !userDetails) {
          isSave = false;
          saveSessionBeforeRedirect(true, { ...values });
        }
        if (isSave) {
          saveScenario({ payload }, locale);
          onCancel(false);
          setFieldsValue({ scenarioName: '', aboutScenario: '' });
        }
      }
    });
  };

  render() {
    const {
      showModel,
      form: { getFieldDecorator },
      direction,
    } = this.props;
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;
    return (
      <React.Fragment>
        <Modal
          title={<IntlMessages id="saveScenario.title" />}
          centered
          closable={false}
          visible={showModel}
          footer={null}
          maskClosable={false}
          className={styles.saveScenarioModel}
          bodyStyle={{ backgroundColor: '#eee6' }}
        >
          <div className={styles.saveScenarioForm}>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <div>
                <div className={styles.saveScenarioFormLabel}>
                  <IntlMessages id="saveScenario.scenarioName" />:
                </div>
                <Form.Item>
                  {getFieldDecorator('scenarioName', {
                    rules: [
                      { required: true, message: <IntlMessages id="saveScenario.nameErrorMsg" /> },
                      {
                        type: 'Duplicate name',
                        required: true,
                        validator: this.checkForDuplicateName,
                      },
                    ],
                  })(<Input placeholder="Scenario name" />)}
                </Form.Item>
              </div>
              <div style={{ marginTop: '10px' }}>
                <div className={styles.saveScenarioFormLabel}>
                  {' '}
                  <IntlMessages id="saveScenario.aboutScenario" />:
                </div>
                <Form.Item>
                  {getFieldDecorator('aboutScenario', {
                    rules: [
                      { required: false, message: <IntlMessages id="saveScenario.descErrorMsg" /> },
                    ],
                  })(<TextArea rows={8} />)}
                </Form.Item>
              </div>
              {/* <div style={{ marginTop: '10px' }}>

                <Form.Item>
                  {getFieldDecorator('savedFor', {
                    rules: [
                      {
                        required: true,
                        message: <IntlMessages id="saveScenario.savedForErrorMsg" />,
                      },
                    ],
                  })(
                    <Radio.Group>
                      <Radio value="session">Save Only For Session</Radio>
                      <Radio value="user">Save Under User</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </div> */}
            </Form>
          </div>
          <Row gutter={4} style={{ marginTop: '20px' }}>
            <Col span={4} />
            <Col span={8} style={{ textAlign: 'right' }}>
              {direction === 'rtl' ? (
                <Button onClick={this.handleSubmit} className={styles.greenButton}>
                  <IntlMessages id="saveScenario.saveButton" />
                </Button>
              ) : (
                <Button onClick={() => this.handleFormCancel()} className={styles.grayButton}>
                  <IntlMessages id="saveScenario.cancelButton" />
                </Button>
              )}
            </Col>
            <Col span={8}>
              {direction === 'rtl' ? (
                <Button onClick={() => this.handleFormCancel()} className={styles.grayButton}>
                  <IntlMessages id="saveScenario.cancelButton" />
                </Button>
              ) : (
                <Button onClick={this.handleSubmit} className={styles.greenButton}>
                  <IntlMessages id="saveScenario.saveButton" />
                </Button>
              )}
            </Col>
            <Col span={4} />
          </Row>
        </Modal>
      </React.Fragment>
    );
  }
}
export default Form.create()(SaveScenario);
