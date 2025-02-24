/* eslint-disable no-shadow */
import React from 'react';
import { Select } from 'antd';
import ltrStyles from './index.module.less';
import rtlStyles from './rtl.module.less';
import { minYear } from '../../configs/app.config';

// const style = {
//   height: 230,
// };

const { Option } = Select;
let styles = {};
class YearSlider extends React.Component {
  state = {
    startYear: minYear,
  };

  componentDidMount() {
    const { minYear } = this.props;
    this.setState({ startYear: minYear });
  }

  handleSliderValue = value => {
    const { onChangeSelectedYear } = this.props;
    onChangeSelectedYear(value);
    this.setState({ startYear: value });
  };

  getSliderValue = (startYearProps, lastYear) => {
    const { startYear } = this.state;
    let result = [];
    if (startYear >= startYearProps) {
      result = [startYear, lastYear];
    } else {
      result = [startYearProps, lastYear];
    }
    return result;
  };

  getSliderMarks = (startYearProps, lastYear) => {
    const result = {};
    for (let index = startYearProps; index <= lastYear; index += 1) {
      result[index] = index;
    }
    return result;
  };

  getYearArr = () => {
    const { minYear, maxYear } = this.props;
    const tempArr = [];
    for (let index = minYear; index <= maxYear; index += 1) {
      tempArr.push(
        <Option key={`select_year_${index}`} value={index}>
          {index}
        </Option>
      );
    }
    return tempArr;
  };

  render() {
    const { title, selectedYear, direction } = this.props;
    const yearArr = this.getYearArr();
    styles = direction === 'rtl' ? rtlStyles : ltrStyles;
    return (
      <div
        // style={appliedPolicies.length > 0 ? style : { height: '430px' }}
        className={styles.gradientSlider}
      >
        {title && <div style={{ marginBottom: '5px' }}>{title}</div>}
        <Select
          defaultValue={selectedYear}
          value={selectedYear}
          // style={{ width: 120 }}
          onChange={this.handleSliderValue}
        >
          {yearArr}
        </Select>
        {/* <Slider
            tooltipVisible={false}
            vertical
            value={selectedYear}
            step={1}
            max={maxYear}
            marks={this.getSliderMarks(minYear, maxYear)}
            min={minYear}
            onChange={this.handleSliderValue}
          /> */}
      </div>
    );
  }
}
export default YearSlider;
