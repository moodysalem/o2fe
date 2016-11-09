import React, {PropTypes, PureComponent} from "react";
import CopyToClipboard from 'react-copy-to-clipboard';

export default function CopyRow({label, value, onCopy}) {
  return (
    <div>
      <label>{label}</label>
      <div className="display-flex align-items-center">
        <div className="flex-grow-1 flex-shrink-1"
             style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{value}</div>
        <div className="flex-shrink-0">
          <CopyToClipboard text={value} onCopy={onCopy}>
            <button className="btn btn-flat"><i className="fa fa-clipboard"/></button>
          </CopyToClipboard>
        </div>
      </div>
    </div>
  );
}