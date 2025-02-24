import React from 'react';
// eslint-disable-next-line import/newline-after-import
import { Col, Row, Icon, Alert } from 'antd';
import styles from './index.module.less';
import { helpSteps } from '../../configs/app.config';
import IntlMessages from '../Misc/intlMessages';

class HelpModalEn extends React.Component {
  render() {
    const { isMobile } = this.props;
    return (
      <React.Fragment>
        <Row>
          {isMobile ? (
            <Col span={24}>
              <Alert
                message={<IntlMessages id="helpModal.noticeForMobile" />}
                type="info"
                showIcon
                className={styles.mobileNoticeEn}
                icon={<Icon type="info-circle" />}
              />
            </Col>
          ) : null}
          <Col span={isMobile ? 24 : 12} style={!isMobile ? { padding: '20px' } : null}>
            <h3 className={styles.modalDownload}>
              <IntlMessages id="helpModal.title1" />
            </h3>
            {helpSteps.content.length || helpSteps.content.length > 0
              ? helpSteps.content.map((content, index) => {
                  return (
                    <p key={`step_content_${index + 1}`} className={styles.modalContent}>
                      <IntlMessages id={content} />
                    </p>
                  );
                })
              : null}
          </Col>

          <Col span={isMobile ? 24 : 12} style={!isMobile ? { padding: '20px' } : null}>
            <h3 className={styles.modalDownloadTitle}>
              <IntlMessages id="helpModal.title2" />
            </h3>
            <ul>
              <li>
                <a href={helpSteps.doczEN} target="blank" className={styles.modalDownload}>
                  <IntlMessages id="helpModal.KTAF_methodology" />
                </a>
              </li>
            </ul>
            {/* {helpSteps.imageEn ? (
              <img src={helpSteps.imageEn} alt="setupModal" width="100%" />
            ) : null} */}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
export default HelpModalEn;
