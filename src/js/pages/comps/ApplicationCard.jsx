import React, {PropTypes, PureComponent} from "react";
import {Link} from "react-router";
import join from "url-join";

export default ({
  onEdit, onDelete,
  application:{
    logoUrl,
    id, name, description, supportEmail, googleCredentials, facebookCredentials
  }
}) => {

  const title = (
    <span className="card-title truncate">
      { name }
      { googleCredentials ? <i className="fa fa-google red-text" style={{marginLeft: 6}}/> : null }
      { facebookCredentials ? <i className="fa fa-facebook-square blue-text" style={{marginLeft: 6}}/> : null }
    </span>
  );

  return (
    <div className="card" key={id}>
      {
        logoUrl ? (
          <div className="card-image">
            <img src={logoUrl}/>
            {title}
          </div>
        ) : null
      }

      <div className="card-content">
        {
          logoUrl ? null : (
            <span>
              {title}
              <hr/>
            </span>
          )
        }

        <div>
          <label>Application ID</label>
          <div className="truncate">{id}</div>
        </div>
        <div>
          <label>Support E-mail</label>
          <div>{supportEmail}</div>
        </div>

        <div>
          <label>Description</label>
          <p>{description && description.length ? description : <em className="grey-text text-lighten-1">N/A</em>}</p>
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
};