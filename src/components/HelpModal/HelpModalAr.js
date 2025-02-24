import React from 'react';
// eslint-disable-next-line import/newline-after-import
import { Col, Row, Alert, Icon } from 'antd';
import styles from './index.module.less';
import { helpSteps } from '../../configs/app.config';
import IntlMessages from '../Misc/intlMessages';

class HelpModalAr extends React.Component {
  render() {
    const { isMobile } = this.props;
    return (
      <React.Fragment>
        {isMobile ? (
          <Row>
            {isMobile ? (
              <Col span={24}>
                <Alert
                  message={<IntlMessages id="helpModal.noticeForMobile" />}
                  type="info"
                  showIcon
                  className={styles.mobileNoticeAr}
                  icon={<Icon type="info-circle" />}
                />
              </Col>
            ) : null}
            <Col span={24}>
              <h3 className={styles.modalDownloadRtl}>
                <IntlMessages id="helpModal.title1" />
              </h3>
              {helpSteps.content.length || helpSteps.content.length > 0
                ? helpSteps.content.map((content, index) => {
                    return (
                      <p key={`step_content_${index + 1}`} className={styles.modalContentRtl}>
                        <IntlMessages id={content} />
                      </p>
                    );
                  })
                : null}
            </Col>
            <Col span={24}>
              <h3 className={styles.modalDownloadRtlTitle}>
                <IntlMessages id="helpModal.title2" />
              </h3>
              <div className={styles.modalDownloadRtl}>
                <ul>
                  <li>
                    <a href={helpSteps.doczAR} target="blank">
                      <IntlMessages id="helpModal.KTAF_methodology" />
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col span={12} style={{ padding: '20px' }}>
              <h3 className={styles.modalDownloadRtlTitle}>
                <IntlMessages id="helpModal.title2" />
              </h3>
              <div className={styles.modalDownloadRtl}>
                <ul>
                  <li>
                    <a href={helpSteps.doczAR} target="blank">
                      <IntlMessages id="helpModal.KTAF_methodology" />
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
            <Col span={12} style={{ padding: '20px' }}>
              <h3 className={styles.modalDownloadRtl}>
                <IntlMessages id="helpModal.title1" />
              </h3>
              {helpSteps.content.length || helpSteps.content.length > 0
                ? helpSteps.content.map((content, index) => {
                    return (
                      <p key={`step_content_${index + 1}`} className={styles.modalContentRtl}>
                        <IntlMessages id={content} />
                      </p>
                    );
                  })
                : null}
            </Col>
          </Row>
        )}
      </React.Fragment>
    );
  }
}
export default HelpModalAr;
