/* eslint-disable no-shadow */
import React from 'react';
import { connect } from 'react-redux';
import { Menu, Icon, Avatar, Tooltip } from 'antd';
import qs from 'query-string';
import classnames from 'classnames';
import { defaultLocale, locales } from '../../configs/app.config';
import logo from '../../assets/logo.svg';
import IntlMessages from '../Misc/intlMessages';
import actions from '../../redux/simulator/actions';
import ltrStyles from './ltr.module.less';
import rtlStyles from './rtl.module.less';

const { setLocale, fetchInitialData } = actions;
let styles = {};
class AppHeader extends React.Component {
  getUserMenu = () => {
    return (
      <Menu className={styles.profileMenu}>
        <Menu.Item>
          <a href="/user/profile">
            <Icon type="setting" />
            <span>
              {' '}
              <IntlMessages id="appHeader.myProfile" />
            </span>
          </a>
        </Menu.Item>
        <Menu.Item>
          <a href="/user/sign-out">
            <Icon type="logout" />
            <span>
              {' '}
              <IntlMessages id="appHeader.signOut" />
            </span>
          </a>
        </Menu.Item>
      </Menu>
    );
  };

  handleLocalChange = () => {
    const {
      switchLocale,
      fetchInitialData,
      locale,
      selectedCountry,
      selectedParams,
      appliedPolicies,
      compareScenariosData,
      selectedYear,
      history,
      userEncodedStr,
    } = this.props;

    let newLocale = locale || defaultLocale;
    if (newLocale === 'en') {
      newLocale = locales.ar.toLowerCase();
    } else {
      newLocale = locales.en.toLowerCase();
    }
    switchLocale(newLocale, () => {
      fetchInitialData(
        {
          locale: newLocale,
          selectedCountry,
          selectedParams,
          appliedPolicies,
          compareScenariosData,
          selectedYear,
          userEncodedStr,
        },
        true
      );
    });

    const urlObject = qs.parseUrl(window.location.href, { decode: false });
    urlObject.query.locale = newLocale;
    history.push({ search: `?${qs.stringify(urlObject.query, { encode: false })}` });
  };

  handleModalShow = () => {
    const { showSetupModal } = this.props;
    showSetupModal();
  };

  render() {
    const { direction, selectedCountry, locale, isMobile, userDetails } = this.props;
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;

    return (
      <div className={classnames(styles.appHeader, 'appHeader')}>
        <span className={styles.headerLogoCt}>
          <img
            src={logo}
            className={styles.mainLogo}
            width={isMobile ? '130px' : '155px'}
            alt="Kapsarc - Transport Analysis Framework"
          />
          <span className={styles.logoHeadline}>Transport Analysis Framework</span>{' '}
        </span>
        <div className={styles.headerRightCt}>
          {userDetails && userDetails.user ? (
            <div className={styles.userProfileMenu}>
              <span className={styles.userProfileName}>{userDetails.user.userName}</span>
              {/* <span className={styles.userProfileName}>MD ABDUL SAIKH</span>
            <Dropdown overlay={this.getUserMenu()} trigger={['click']}>
              <span>
                <Avatar
                  size="large"
                  className={styles.userAvatar}
                  src={userAvatar}
                  alt="Md Abdul Saikh"
                  style={{ width: '49px', height: '49px' }}
                />
                <Icon type="down" style={{ color: '#60a14d' }} />
              </span>
            </Dropdown> */}
            </div>
          ) : null}

          <span className={styles.countryAvatar} style={{ display: 'none' }}>
            {selectedCountry ? (
              <Avatar
                size="large"
                shape="square"
                src={`/images/flags/${selectedCountry.flagIcon}`}
                alt={selectedCountry.name}
              />
            ) : (
              <Avatar size="large" shape="square" src={null} alt="not selected" />
            )}
          </span>
          <span className={styles.localeChange} onClick={this.handleLocalChange}>
            {locale === 'ar' ? 'English' : 'العربية'}
          </span>
          <span className={styles.help} onClick={this.handleModalShow}>
            <Tooltip placement="bottom" title="Help">
              <Icon
                type="question-circle"
                theme="filled"
                style={{ fontSize: '16px', color: '#60a14d' }}
              />
            </Tooltip>
          </span>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.simulator.toJS(),
  }),
  {
    setLocale,
    fetchInitialData,
  }
)(AppHeader);
