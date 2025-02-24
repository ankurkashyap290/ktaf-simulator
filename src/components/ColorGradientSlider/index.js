import React from 'react';
import { Slider } from 'antd';
import { getThousandSeparator } from '../../utils';
import ltrStyles from './ltr.module.less';
import rtlStyles from './rtl.module.less';

const style = {
  height: 80,
};

let styles = {};

class ColorGradientSlider extends React.Component {
  handleSliderValue = (value, notToSet) => {
    notToSet = notToSet || false;
    const { saveCurrentColorSliderValue, isMobile } = this.props;
    const dom = document.querySelector(`.${styles.gradientSlider} .ant-slider-track`);
    if (dom) {
      dom.style.background = `linear-gradient(to right, rgb(0, ${this.getColorBySlideValue(
        value[0]
      )}, 0), rgb(0, ${this.getColorBySlideValue(value[1])}, 0
      ))`;
      const handleSlider1 = document.querySelector(
        `.${styles.gradientSlider} .ant-slider-handle-1`
      );
      const handleSlider2 = document.querySelector(
        `.${styles.gradientSlider} .ant-slider-handle-2`
      );

      handleSlider1.innerHTML = `<div>${getThousandSeparator(this.getColorRange(value[0]))}</div>`;

      handleSlider2.innerHTML = `<div style='position:absolute;right:${
        isMobile ? '39px' : '9px'
      }'>${getThousandSeparator(this.getColorRange(value[1]))}</div>`;
    }

    if (!notToSet) {
      saveCurrentColorSliderValue({ value });
    }
  };

  getColorRange = value => {
    const { colorStops } = this.props;
    const founded = colorStops.find(stop => stop.sliderValue === value);
    if (founded) {
      return founded.range;
    }

    return colorStops.length ? colorStops[colorStops.length - 1].range : '';
  };

  getColorBySlideValue = value => {
    const { colorStops } = this.props;
    const founded = colorStops.find(stop => stop.sliderValue === value);
    if (founded) {
      return founded.color;
    }
    return colorStops.length ? colorStops[colorStops.length - 1].color : '';
  };

  getSliderMinMax = () => {
    const { colorStops } = this.props;
    const arrLen = colorStops.length;
    let result = {
      min: 10,
      max: 230,
    };
    if (arrLen) {
      result = {
        min: colorStops[arrLen - 1].sliderValue,
        max: colorStops[0].sliderValue,
      };
    }
    return result;
  };

  render() {
    const { currentColorSliderValue, title, direction } = this.props;
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;
    const { min, max } = this.getSliderMinMax();
    return (
      <div style={style} className={styles.gradientSlider}>
        {title && <div className={styles.colorSliderTitle}>{title}</div>}
        <Slider
          tooltipVisible={false}
          value={currentColorSliderValue}
          range
          step={10}
          max={max}
          min={min}
          className={styles.colorSlider}
          onChange={this.handleSliderValue}
        />
      </div>
    );
  }
}
export default ColorGradientSlider;
