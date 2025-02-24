import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { ContainerQuery } from 'react-container-query';
import classnames from 'classnames';
import { Layout, Modal, Button } from 'antd';
import Media from 'react-media';
import PropTypes from 'prop-types';
import AppHeader from '../components/AppHeader';
import NotFound from '../routes/Exception/404';
import AsyncComponent from '../utils/AsyncComponent';
import styles from './AppLayout.module.less';
import SetupModal from '../components/HelpModal';
import IntlMessages from '../components/Misc/intlMessages';
import OverlayLoader from '../components/OverlayLoader';

const { Header, Content } = Layout;

const Simulator = AsyncComponent({
  name: 'Simulator',
  LoadingComponent: () => <OverlayLoader loading />,
  resolve: () => import('../routes/Simulator'),
});

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

class AppLayout extends PureComponent {
  static childContextTypes = {
    direction: PropTypes.string,
  };

  state = {
    collapsed: false,
    setupModalVisible: true,
    tourProgress: false,
  };

  checkDomAvailableInterval = null;

  getChildContext() {
    const { direction } = this.props;
    return {
      direction,
    };
  }

  componentDidMount() {
    const unsavedSession = JSON.parse(sessionStorage.getItem('unsaved-session') || null);
    if (unsavedSession) {
      this.setState({ setupModalVisible: false });
    }
  }

  toggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  handleSkip = () => {
    this.setState({ setupModalVisible: false });
  };

  checkDomAvailable = () => {
    if (this.checkDomAvailableTimeoutId) {
      clearTimeout(this.checkDomAvailableTimeoutId);
    }
    const { countries } = this.props;
    if (countries.length) {
      this.setState({ tourProgress: true });
    } else {
      this.checkDomAvailableTimeoutId = setTimeout(this.checkDomAvailable.bind(this), 100);
    }
  };

  handleStartTour = () => {
    const { countries } = this.props;
    if (countries.length) {
      this.setState({ setupModalVisible: false, tourProgress: true });
    } else {
      this.setState({ setupModalVisible: false });
      this.checkDomAvailableTimeoutId = setTimeout(this.checkDomAvailable.bind(this), 100);
    }
  };

  showSetupModal = () => {
    this.setState({ setupModalVisible: true, tourProgress: false });
  };

  footerButtons = () => {
    const { isMobile } = this.props;
    return (
      <div>
        <Button type="primary" key="skip" onClick={this.handleSkip}>
          <IntlMessages id="helpModal.done" />
        </Button>
        {!isMobile ? (
          <Button
            type="primary"
            key="tour"
            onClick={this.handleStartTour}
            style={isMobile ? { width: '114px' } : { width: '135px' }}
          >
            <IntlMessages id="helpModal.startTour" />
          </Button>
        ) : null}
      </div>
    );
  };

  renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: 'rgba(240,242,245,.5)',
      border: '1px solid rgba(0,0,0,.3)',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  renderLayout = () => {
    const { locale, switchLocale, direction, history, isMobile } = this.props;
    const { setupModalVisible, tourProgress } = this.state;
    const localeClass = `root-${locale}`;
    return (
      <Layout className={styles[localeClass] ? styles[localeClass] : ''}>
        <Header>
          <AppHeader
            locale={locale}
            switchLocale={switchLocale}
            direction={direction}
            history={history}
            showSetupModal={this.showSetupModal.bind(this)}
            isMobile={isMobile}
          />
        </Header>
        <Content style={{ margin: '0', flexShrink: 0, flex: 'auto', paddingTop: 0 }}>
          <Switch>
            <Route
              path="/"
              render={props => (
                <Simulator {...props} tourProgress={tourProgress} isMobile={isMobile} />
              )}
              exact
            />
            <Route render={NotFound} />
          </Switch>
        </Content>

        <Modal
          visible={setupModalVisible}
          header={null}
          closable={false}
          width={isMobile ? '80vw' : '60vw'}
          margin="auto"
          wrapClassName={styles.modelWrapClass}
          footer={this.footerButtons()}
        >
          <SetupModal
            location={history.location}
            locale={locale}
            ref={ref => (this.nextRef = ref)}
            isMobile={isMobile}
          />
        </Modal>
      </Layout>
    );
  };

  render() {
    return (
      <DocumentTitle title="KAPSARC | KAPSARC Transport Analysis Framework (KTAF)">
        <ContainerQuery query={query}>
          {params => <div className={classnames(params)}>{this.renderLayout()}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(
  state => ({
    ...state.simulator.toJS(),
  }),
  {}
)(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <AppLayout {...props} isMobile={isMobile} />}
  </Media>
));
