import React from 'react';
import './index.css';

class PolicyAnimation extends React.Component {
  stopAnimation = () => {
    const { onStop } = this.props;
    onStop && onStop();
  };

  getLeftPos = () => {
    const rect = document
      .querySelector('.rightDrawerPanel .ant-drawer-content-wrapper')
      .getBoundingClientRect();
    return `${rect.x}px`;
  };

  startAnimation = () => {
    const animatedBox = document.querySelector('.animatedBox');
    animatedBox.style.left = this.getLeftPos();
    animatedBox.style.transform = 'rotate(20deg)';
  };

  render() {
    const { visible } = this.props;
    if (visible) {
      setTimeout(this.stopAnimation, 1000);
      setTimeout(this.startAnimation, 10);
      return <div className="animatedBox" style={{ left: '300px', transform: 'rotate(0deg)' }} />;
    } else {
      return null;
    }
  }
}
export default PolicyAnimation;
