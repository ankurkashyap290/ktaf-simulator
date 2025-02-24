import React from 'react';
import { List, Tag, Icon } from 'antd';
import styles from './index.module.less';
import { transformPonderableName, filterPonderables } from '../../utils';
// import { CheckIcon } from '../customIcon';

class Legend extends React.Component {
  handleListItemClick = (item, evt) => {
    const { onClick } = this.props;
    evt.stopPropagation();
    onClick(item);
  };

  render() {
    const {
      data,
      selectedPonderable,
      title,
      direction,
      selectedYear,
      selectedCountry,
    } = this.props;
    let ponderables = data;
    if (selectedCountry && selectedCountry.id === 1 && selectedYear > 2017) {
      ponderables = filterPonderables(data);
    }
    return (
      <React.Fragment>
        {title && <div className={styles.listTitle}>{title}</div>}
        <List
          direction={direction}
          loading={selectedPonderable === ''}
          itemLayout="vertical"
          dataSource={ponderables}
          className={styles.legendPonderableList}
          renderItem={item => (
            <List.Item onClick={evt => this.handleListItemClick(item, evt)}>
              <List.Item.Meta
                avatar={
                  <Tag
                    color={
                      selectedPonderable && selectedPonderable === item.ponderableCode
                        ? '#000'
                        : '#ddd'
                    }
                    className={styles.legendTag}
                  >
                    {selectedPonderable && selectedPonderable === item.ponderableCode ? (
                      <Icon
                        style={{
                          verticalAlign: '0px',
                        }}
                        type="check"
                      />
                    ) : null}
                  </Tag>
                }
                title={
                  <span>
                    {transformPonderableName(item)}{' '}
                    {direction === 'ltr' ? ` (${item.unit})` : ` - ${item.unit}`}
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </React.Fragment>
    );
  }
}
export default Legend;
