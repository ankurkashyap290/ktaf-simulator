import React, { Component } from 'react';
// eslint-disable-next-line

import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

import draftToHtml from 'draftjs-to-html';
// eslint-disable-next-line
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from './index.module.less';

class SimpleEditorToHtml extends Component {
  state = {
    editorState: EditorState.createEmpty(),
  };

  onEditorStateChange = editorState => {
    this.setState({
      editorState,
    });
  };

  render() {
    const { editorState } = this.state;
    const { textArea } = this.props;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName={styles['demo-wrapper']}
          editorClassName={styles['demo-editor']}
          onEditorStateChange={this.onEditorStateChange}
        />
        {textArea !== false ? (
          <textarea
            className={styles['demo-content']}
            disabled
            value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
          />
        ) : null}
      </div>
    );
  }
}

export default SimpleEditorToHtml;
