import React from 'react';
import { List, Icon } from 'antd';
import classnames from 'classnames';
import WindowSizeListener from 'react-window-size-listener';
import LineChartsCard from '../Charts/LineChartsCard';
import IntlMessages from '../Misc/intlMessages';
import ltrStyles from './ltr.module.less';
import rtlStyles from './rtl.module.less';
import { transformPonderableName, filterPonderables } from '../../utils';

let styles = {};
class GraphCarousel extends React.Component {
  state = {
    translate: 0,
    steps: 0,
    listWidth: '100vw',
  };

  handleMoveSliderRight = () => {
    const { translate, steps } = this.state;
    const valueToTranslate = this.getCarouselLiWidth();
    const totalSteps = this.getTotalSteps();
    if (totalSteps && steps < totalSteps) {
      this.setState({ translate: translate + valueToTranslate, steps: steps + 1 });
    }
  };

  getTotalSteps = () => {
    const { carouselGlobalParameters } = this.props;
    const ponderables = filterPonderables(carouselGlobalParameters.ponderables);

    let totalSteps = 0;
    if (ponderables && ponderables.length) {
      const totalListItem = ponderables.length;
      const maxShownCarouselItem =
        ponderables.length > 3 && ponderables.length < 0 ? ponderables.length - 1 : 3;
      totalSteps = totalListItem - maxShownCarouselItem;
    }

    return totalSteps;
  };

  handleMoveSliderLeft = () => {
    const { translate, steps } = this.state;
    const valueToTranslate = this.getCarouselLiWidth();
    if (translate !== 0) {
      this.setState({ translate: translate - valueToTranslate, steps: steps - 1 });
    }
  };

  getChartImages = () => {
    const chartElements = document.getElementsByClassName(styles.graphCarouselSliderListLi);

    const chartImages = [];
    for (let index = 0; index < chartElements.length; index += 1) {
      // eslint-disable-next-line no-await-in-loop
      const element = chartElements[index];
      chartImages.push(element);
    }

    return chartImages;
  };

  getCarouselLiWidth = () => {
    const {
      carouselGlobalParameters: { ponderables },
    } = this.props;
    const { listWidth } = this.state;
    const chartListWidth = listWidth;
    let widthLi = 607;
    if (chartListWidth && ponderables) {
      const maxShownCarouselItem =
        ponderables.length > 3 && ponderables.length < 0 ? ponderables.length - 1 : 3;
      widthLi = chartListWidth / maxShownCarouselItem - 13;
    }
    return widthLi;
  };

  render() {
    const { translate, steps } = this.state;
    const {
      carouselGlobalParameters,
      graphData,
      compareScenariosData,
      saveGraphImage,
      fetchChartData,
      selectedParams,
      direction,
      locale,
      isMobile,
      scrollHeightForGraphCarousel,
    } = this.props;

    const graphHeight = 260;
    const totalSteps = this.getTotalSteps();
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;
    return (
      <React.Fragment>
        <div className={styles.graphCarouselWrapper}>
          <div
            className={styles.graphCarouselSlider}
            style={{ height: isMobile ? `${scrollHeightForGraphCarousel}px` : '277px' }}
          >
            {steps < totalSteps ? (
              <div className={classnames(styles.shift, styles.right)}>
                <div style={{ top: '50%', position: 'absolute' }}>
                  <Icon
                    type="right"
                    onClick={this.handleMoveSliderRight}
                    className={styles.graphCarouselArrow}
                  />
                </div>
              </div>
            ) : null}
            {translate > 0 ? (
              <div className={classnames(styles.shift, styles.left)}>
                <div style={{ top: '50%', position: 'absolute' }}>
                  <Icon
                    type="left"
                    onClick={this.handleMoveSliderLeft}
                    className={styles.graphCarouselArrow}
                  />
                </div>
              </div>
            ) : null}
            <WindowSizeListener
              onResize={windowSize => {
                this.setState({ listWidth: windowSize.windowWidth });
              }}
            />

            <div
              style={{
                transform: `translateX(-${translate}px)`,
              }}
              className={styles.graphCarouselSliderList}
            >
              <List
                itemLayout="horizontal"
                dataSource={filterPonderables(carouselGlobalParameters.ponderables)}
                style={{
                  width: '100%',
                  height: isMobile ? `${scrollHeightForGraphCarousel}px` : `${graphHeight}px`,
                }}
                renderItem={(item, index) => (
                  <List.Item
                    className={styles.graphCarouselSliderListLi}
                    style={{
                      backgroundColor: '#fff',
                      width: isMobile ? '100%' : `${this.getCarouselLiWidth()}px`,
                    }}
                  >
                    <LineChartsCard
                      cardTitle={
                        locale === 'ar' ? (
                          <div
                            style={{
                              fontWeight: '600',
                              textAlign: 'right',
                              paddingRight: '20px',
                            }}
                          >
                            <IntlMessages id="graphCarousel.cardTitle" />{' '}
                            {transformPonderableName(item)}
                            {'        '}
                            {'  -  '}
                            {'        '}
                            {item.unit}
                          </div>
                        ) : (
                          <div
                            style={{ fontWeight: '600', textAlign: 'left', paddingLeft: '20px' }}
                          >
                            <IntlMessages id="graphCarousel.cardTitle" />{' '}
                            {transformPonderableName(item)} ({item.unit})
                          </div>
                        )
                      }
                      cardHeight={isMobile ? 164 : 230}
                      menuData={carouselGlobalParameters}
                      graphData={
                        graphData
                          ? graphData.ponderables.find(
                              graph => item.ponderableCode === graph.ponderableCode
                            )
                          : null
                      }
                      compareScenariosData={compareScenariosData}
                      saveGraphImage={saveGraphImage}
                      fetchChartData={fetchChartData}
                      selectedParams={selectedParams}
                      selectedCard={index}
                      direction={direction}
                      isMobile={isMobile}
                    />
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default GraphCarousel;
