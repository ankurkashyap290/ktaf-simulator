import React from 'react';
import { Table } from 'antd';

class BaseTable extends React.Component {
  render() {
    const { columns, data, title, titleStyle } = this.props;

    return data && data.length > 0 ? (
      <React.Fragment>
        {title ? <h4 style={titleStyle || { marginTop: '10px' }}>{title}</h4> : null}
        <Table columns={columns} dataSource={data} pagination={false} />
      </React.Fragment>
    ) : null;
  }
}
export default BaseTable;
