import React, {PropTypes, PureComponent} from "react";
import join from "url-join";
import {Link} from "react-router";

export default ({application:{id, name, description, supportEmail, googleCredentials, facebookCredentials}, onEdit, onDelete}) => (
  <div className="card" key={id}>
    <div className="card-content">
      <span className="card-title truncate">
        {name}
        <small style={{marginLeft: 4}}>{supportEmail}</small>
        { googleCredentials ? <i className="fa fa-google red-text" style={{marginLeft: 6}}/> : null }
        { facebookCredentials ? <i className="fa fa-facebook-square blue-text" style={{marginLeft: 6}}/> : null }
      </span>
      <p>{description}</p>
      <hr />
      <div>
        <label>Application ID</label>
        <div className="truncate">{id}</div>
      </div>
    </div>
    <div className="card-action">
      <Link to={join('applications', id, 'scopes')}>Scopes</Link>
      <Link to={join('applications', id, 'users')}>Users</Link>
      <Link to={join('applications', id, 'clients')}>Clients</Link>
      <a href="#" onClick={(e) => {
        e.preventDefault();
        onEdit();
      }}>Edit</a>
      <a href="#" className="red-text" onClick={(e) => {
        e.preventDefault();
        onDelete();
      }}>Delete</a>
    </div>
  </div>
);