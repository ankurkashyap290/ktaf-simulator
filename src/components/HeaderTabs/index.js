import React from 'react';
import { Tabs, Icon } from 'antd';
import classnames from 'classnames';
import ltrStyles from './index.module.less';
import rtlStyles from './rtl.module.less';
import { GlobeIcon, ToolsIcon } from '../customIcon';
import IntlMessages from '../Misc/intlMessages';

const { TabPane } = Tabs;
let styles = {};
class HeaderTabs extends React.Component {
  handleTabChange = key => {
    const { setHeaderTab } = this.props;
    setHeaderTab(key);
  };

  render() {
    const { direction, visibleTab } = this.props;
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;
    const tabPanesArr = [
      {
        name: 'home',
        data: (
          <TabPane
            tab={
              <div id="home">
                <Icon type="home" />
                <br />
                <IntlMessages id="headerTabs.home" />
              </div>
            }
            key="home"
          />
        ),
      },
      {
        name: 'country',
        data: (
          <TabPane
            tab={
              <div id="country">
                <GlobeIcon />
                <br />
                <IntlMessages id="headerTabs.countryAndPolicy" />
              </div>
            }
            key="country"
          />
        ),
      },
      {
        name: 'tool',
        data: (
          <TabPane
            tab={
              <div id="tool">
                <ToolsIcon />
                <br />
                <IntlMessages id="headerTabs.appliedPoliciesAndDownloads" />
              </div>
            }
            key="tools"
          />
        ),
      },
    ];
    return (
      <div style={{ backgroundColor: '#fafafa', direction: 'ltr' }}>
        <Tabs
          defaultActiveKey={visibleTab}
          onTabClick={this.handleTabChange}
          className={classnames(styles.headerTabs, 'headerTabs')}
          activeKey={visibleTab}
          direction={direction}
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

export default HeaderTabs;
