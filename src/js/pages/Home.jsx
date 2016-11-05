import React, {PureComponent} from "react";
import space from "../../res/space.jpg";
import {Parallax, Background} from "react-parallax";
import laptop from "../../res/blurred-laptop.jpeg";
import {Link} from "react-router";

const PARALLAX_BUFFER = 140;
const PADDING = {paddingTop: PARALLAX_BUFFER, paddingBottom: PARALLAX_BUFFER};

const Plx = ({src, children, ...rest}) => (
  <Parallax strength={100}>
    <Background>
      <div style={{width: '100vw', minWidth: 1200}}>
        <img className="black" src={src} style={{width: '100%'}}/>
      </div>
    </Background>
    {children}
  </Parallax>
);

const Card = ({icon, title, text}) => (
  <div className="card blue-grey darken-4 z-depth-2">
    <div className="card-content white-text">
      <div style={{textAlign: 'center', fontSize: 80}}>
        <i className={`fa fa-${icon}`}/>
      </div>
      <span className="card-title">{title}</span>
      <p>{text}</p>
    </div>
  </div>
);

export default class Home extends PureComponent {
  render() {
    return (
      <div>
        <Plx src={space}>

          <div style={{...PADDING}} className="container white-text">
            <h2>
              <strong>OAuth2Cloud</strong> is the simplest way for you to authorize users
            </h2>
            <p className="flow-text">
              Create a log in page for your project in minutes
            </p>
          </div>
        </Plx>

        <div className="row container" style={{marginTop: 20}}>

          <div className="col s12 m6">
            <Card icon="shield" title="No Passwords" text="Stop storing user passwords and worrying about breaches"/>
          </div>

          <div className="col s12 m6">
            <Card icon="fort-awesome" title="Customization"
                  text="Everything from the browser icon to the button colors to the client behaviors is configurable"/>
          </div>

          <div className="col s12 m6">
            <Card icon="google" title="Google Log In"
                  text="Increase your reach by enabling users to authenticate via Google with minimal effort"/>
          </div>

          <div className="col s12 m6">
            <Card icon="book" title="Documentation"
                  text="Code with confidence against an API that has comprehensive documentation and tests"/>
          </div>

        </div>


        <Plx src={laptop} blur="10px">
          <div style={{...PADDING, textAlign: 'right'}} className="container white-text">
            <h2>
              <strong>Stop</strong> rewriting code
            </h2>
            <p className="flow-text">
              OAuth2 servers have been done a hundred times in a hundred different ways. Let us do it right for you
            </p>
            <p>
              <Link to="docs"><i className="fa fa-book"/> Learn More</Link>
            </p>
          </div>
        </Plx>
      </div>
    );
  }
}