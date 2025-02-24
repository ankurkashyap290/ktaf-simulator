import React from 'react';
import { Modal, List, Checkbox, Select } from 'antd';
import classnames from 'classnames';
import IntlMessages from '../Misc/intlMessages';
import styles from './index.module.less';

const { Option } = Select;
class DownloadData extends React.Component {
  state = {
    downloadData: [],
    selectAllOpt: false,
    selectedFileType: 'pdf',
  };

  handleCheckboxChange = (evt, value) => {
    const { downloadData } = this.state;
    const tempDownloadData = [...downloadData];
    if (evt.target.checked) {
      tempDownloadData.push(value);
    } else {
      const foundedIndex = tempDownloadData.findIndex(item => item === value);
      if (foundedIndex >= 0) {
        tempDownloadData.splice(foundedIndex, 1);
      }
    }
    this.setState({ downloadData: tempDownloadData });
  };

  handleCancelButton = () => {
    const { onCancel } = this.props;
    this.setState({ downloadData: [], selectAllOpt: false });
    onCancel(false);
  };

  handleOkButton = () => {
    const { onDownload } = this.props;
    const { downloadData, selectedFileType } = this.state;
    if (downloadData.length > 0) {
      onDownload(downloadData, selectedFileType);
    }
    this.setState({ downloadData: [], selectAllOpt: false });
  };

  handleFileTypeChange = value => {
    this.setState({ selectedFileType: value });
  };

  handleSelectAll = evt => {
    const { data } = this.props;
    const tempDownloadData = [];
    if (evt.target.checked) {
      data.map(item => {
        tempDownloadData.push(item.value);
        return item.value;
      });
    }
    this.setState({ downloadData: [...tempDownloadData], selectAllOpt: evt.target.checked });
  };

  render() {
    const { showModel, data, direction } = this.props;

    const { downloadData, selectAllOpt } = this.state;
    return (
      <React.Fragment>
        <Modal
          title={
            direction === 'rtl' ? (
              <div style={{ display: 'flex', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  <Checkbox onChange={evt => this.handleSelectAll(evt)} checked={selectAllOpt}>
                    <IntlMessages id="createPdf.selectAll" />
                  </Checkbox>
                </div>
                <Select
                  defaultValue="pdf"
                  style={{ width: 90, top: -4 }}
                  onChange={this.handleFileTypeChange}
                  className={styles.selectFileType}
                >
                  <Option value="pdf">PDF</Option>
                  <Option value="excel">Excel</Option>
                </Select>
                &nbsp;
                <p style={{ textAlign: 'right' }}>
                  <IntlMessages id="createPdf.title" />
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', width: '100%' }}>
                <p>
                  <IntlMessages id="createPdf.title" />
                </p>
                &nbsp;
                <Select
                  defaultValue="pdf"
                  style={{ width: 90, top: -4 }}
                  onChange={this.handleFileTypeChange}
                  className={styles.selectFileType}
                >
                  <Option value="pdf">PDF</Option>
                  <Option value="excel">Excel</Option>
                </Select>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <Checkbox onChange={evt => this.handleSelectAll(evt)} checked={selectAllOpt}>
                    <IntlMessages id="createPdf.selectAll" />
                  </Checkbox>
                </div>
              </div>
            )
          }
          centered
          closable={false}
          visible={showModel}
          maskClosable={false}
          bodyStyle={{ padding: '0px' }}
          okText={<IntlMessages id="createPdf.download" />}
          cancelText={<IntlMessages id="createPdf.cancel" />}
          onCancel={this.handleCancelButton}
          onOk={this.handleOkButton}
          className={classnames(
            styles.modelWrapClass,
            direction === 'rtl' ? styles.rtlModalWrapper : ''
          )}
        >
          <List
            dir={direction}
            itemLayout="vertical"
            dataSource={data}
            style={{ width: '100%', padding: '20px' }}
            renderItem={(item, index) => (
              <List.Item className={index % 2 === 0 ? styles.predefinedEven : styles.predefinedOdd}>
                <List.Item.Meta
                  avatar={
                    <Checkbox
                      onChange={evt => this.handleCheckboxChange(evt, item.value)}
                      checked={downloadData.includes(item.value)}
                    />
                  }
                  title={item.name}
                />
              </List.Item>
            )}
          />
        </Modal>
      </React.Fragment>
    );
  }
}
export default DownloadData;
