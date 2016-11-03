import React, {PropTypes, PureComponent} from "react";
import join from "url-join";
import {Link} from "react-router";

export default ({application:{id, name, description, supportEmail}, onEdit, onDelete}) => (
  <div className="card" key={id}>
    <div className="card-content">
      <span className="card-title">
        {name}
        <small style={{marginLeft: 4}}>{supportEmail}</small>
      </span>
      <p>{description}</p>
    </div>
    <div className="card-action">
      <Link to={join('applications', id, 'clients')}>Clients</Link>
      <Link to={join('applications', id, 'scopes')}>Scopes</Link>
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