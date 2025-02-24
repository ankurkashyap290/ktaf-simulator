import React from 'react';
import { Modal } from 'antd';

export function showMessage(title, message) {
  Modal.success({
    title,
    content: <pre>{message}</pre>,
  });
}

export function getTabMode(isMobile) {
  let mode = 'left'; // left / top
  if (isMobile) {
    mode = 'top';
  }
  return mode;
}
