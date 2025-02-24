import React from 'react';
import { Modal, List, Checkbox, Input, Form, message, Select } from 'antd';
import html2canvas from 'html2canvas';
import classnames from 'classnames';
import IntlMessages from '../Misc/intlMessages';
// import ComposerAutoComplete from './ComposerAutoComplete';
// import SimpleEditorToHtml from '../SimpleEditorToHtml';
import styles from './index.module.less';

const { Option } = Select;
class ShareByEmail extends React.Component {
  state = {
    chartImagesPath: [],
    selectedFileType: 'pdf',
  };

  componentDidUpdate(prevProps) {
    const {
      emailSend,
      onCancel,
      form: { setFieldsValue },
    } = this.props;
    if (prevProps.emailSend !== emailSend && emailSend) {
      onCancel(false);
      setFieldsValue({
        email: '',
        subject: '',
        message: '',
      });
    }
  }

  componentWillUnmount() {
    this.setState({ chartImagesPath: [] });
  }

  getChartImages = () => {
    const { chartImages } = this.props;
    const tempChartImages = chartImages();
    if (tempChartImages.length > 0) {
      tempChartImages.map(el => {
        return html2canvas(el).then(canvas => {
          const { chartImagesPath } = this.state;
          this.setState({ chartImagesPath: [...chartImagesPath, canvas.toDataURL('image/png')] });
        });
      });
    }
  };

  handleCheckboxChange = (evt, value) => {
    if (value === 'chartImage' && evt.target.checked === true) {
      this.getChartImages();
    }
  };

  handleEmailCancel = () => {
    const { onCancel, setFooterTab } = this.props;

    onCancel(false);
    setFooterTab('');
  };

  handleFileTypeChange = value => {
    this.setState({ selectedFileType: value });
  };

  handleSubmit = () => {
    const {
      form: { validateFields },
      onShare,
      data,
      setFooterTab,
    } = this.props;
    const { chartImagesPath, selectedFileType } = this.state;
    let checkedBoxItem = false;
    validateFields((err, values) => {
      if (!err) {
        data.map(item => {
          if (values[item.value]) {
            checkedBoxItem = values[item.value];
          }
          return item;
        });
        if (checkedBoxItem) {
          onShare(
            values,
            values.email,
            values.subject,
            values.message,
            '',
            chartImagesPath,
            selectedFileType
          );
        } else {
          message.error(<IntlMessages id="shareByEmail.listCheckboxErrorMsg" />);
        }
      }
    });
    setFooterTab('');
  };

  render() {
    const {
      showModel,
      data,
      form: { getFieldDecorator },
      direction,
    } = this.props;
    return (
      <React.Fragment>
        <Modal
          title={
            <div>
              <IntlMessages id="shareByEmail.title" />
              &nbsp;
              <Select
                defaultValue="pdf"
                style={{ width: 90 }}
                onChange={this.handleFileTypeChange}
                className={styles.selectFileType}
              >
                <Option value="pdf">PDF</Option>
                <Option value="excel">Excel</Option>
              </Select>
            </div>
          }
          centered
          closable={false}
          visible={showModel}
          maskClosable={false}
          bodyStyle={{ padding: '0px' }}
          okText={<IntlMessages id="shareByEmail.okText" />}
          cancelText={<IntlMessages id="shareByEmail.cancelText" />}
          onCancel={this.handleEmailCancel}
          onOk={this.handleSubmit}
          className={classnames(
            styles.modelWrapClass,
            direction === 'rtl' ? styles.rtlModalWrapper : ''
          )}
        >
          <Form onSubmit={this.handleSubmit}>
            <List
              dir={direction}
              itemLayout="vertical"
              dataSource={data}
              className={styles.listRoot}
              renderItem={(item, index) => (
                <List.Item
                  className={index % 2 === 0 ? styles.predefinedEven : styles.predefinedOdd}
                >
                  <List.Item.Meta
                    avatar={
                      <Form.Item>
                        {getFieldDecorator(item.value, {
                          valuePropName: 'checked',
                        })(
                          <Checkbox onChange={evt => this.handleCheckboxChange(evt, item.value)} />
                        )}
                      </Form.Item>
                    }
                    title={item.name}
                  />
                </List.Item>
              )}
            />
            <div className={styles.shareByEmailField}>
              <div
                className={
                  direction === 'rtl' ? styles.rtlShareByEmailLabel : styles.shareByEmailLabel
                }
              >
                <IntlMessages id="shareByEmail.emailPlaceholder" />:
              </div>
              <Form.Item>
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: true,
                      message: <IntlMessages id="shareByEmail.emailError" />,
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </div>
            <div className={styles.shareByEmailField}>
              <div
                className={
                  direction === 'rtl' ? styles.rtlShareByEmailLabel : styles.shareByEmailLabel
                }
              >
                <IntlMessages id="shareByEmail.subject" />:
              </div>
              <Form.Item>
                {getFieldDecorator('subject', {
                  rules: [
                    {
                      required: true,
                      message: <IntlMessages id="shareByEmail.emailSubjectError" />,
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </div>
            <div className={styles.shareByEmailField}>
              <div
                className={
                  direction === 'rtl' ? styles.rtlShareByEmailLabel : styles.shareByEmailLabel
                }
              >
                <IntlMessages id="shareByEmail.messagePlaceholder" />:
              </div>
              <Form.Item>
                {getFieldDecorator('message', {
                  rules: [
                    {
                      required: false,
                      message: <IntlMessages id="shareByEmail.messageErrorMsg" />,
                    },
                  ],
                })(<Input.TextArea rows={5} />)}
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}
export default Form.create()(ShareByEmail);
