import React from 'react';
import { Tabs, Icon } from 'antd';
import classnames from 'classnames';
import ltrStyles from './index.module.less';
import rtlStyles from './rtl.module.less';
import { ChoroplethMapIcon } from '../customIcon';
import IntlMessages from '../Misc/intlMessages';

const { TabPane } = Tabs;
let styles = {};
class FooterTabs extends React.Component {
  handleTabChange = key => {
    const { setFooterTab } = this.props;
    setFooterTab(key);
  };

  onClose = () => {
    const { setFooterTab } = this.props;
    setFooterTab('');
  };

  render() {
    const { direction, visibleFooterTab } = this.props;
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;
    const tabPanesArr = [
      {
        name: 'choropleth',
        data: (
          <TabPane
            tab={
              <div id="choropleth">
                <ChoroplethMapIcon />
                <br />
                <IntlMessages id="footerTabs.choropleth" />
              </div>
            }
            key="choropleth"
          />
        ),
      },
      {
        name: 'scenario',
        data: (
          <TabPane
            tab={
              <div id="scenario">
                <Icon type="area-chart" />
                <br />
                <IntlMessages id="footerTabs.scenarioAnalysis" />
              </div>
            }
            key="scenario"
          />
        ),
      },
    ];
    return (
      <div style={{ backgroundColor: '#fafafa', position: 'relative', direction: 'ltr' }}>
        <Tabs
          defaultActiveKey="0"
          onTabClick={this.handleTabChange}
          className={classnames(styles.footerTabs, 'footerTabs')}
          tabPosition="bottom"
          activeKey={visibleFooterTab}
        >
          {direction === 'ltr'
            ? tabPanesArr.map(item => {
                return item.data;
              })
            : tabPanesArr.reverse().map(item => {
                return item.data;
              })}
        </Tabs>
      </div>
    );
  }
}

export default FooterTabs;
