import React, {PureComponent} from "react";
import space from "../../res/space.jpg";
import {Parallax, Background} from "react-parallax";
import laptop from "../../res/laptop.jpeg";

const PARALLAX_BUFFER = 140;
const PADDING = {paddingTop: PARALLAX_BUFFER, paddingBottom: PARALLAX_BUFFER};

const PL = ({src, children, blur = null, ...rest}) => (
  <Parallax strength={400}>
    <Background>
      <img src={src} style={{filter: blur ? `blur(${blur})` : null, width: '100vw', minWidth: 1200}}/>
    </Background>
    {children}
  </Parallax>
);

const Card = ({title, text}) => (
  <div className="card blue-grey darken-4 z-depth-2">
    <div className="card-content white-text">
      <span className="card-title">{title}</span>
      <p>{text}</p>
    </div>
  </div>
);

export default class Home extends PureComponent {
  render() {
    return (
      <div>
        <PL src={space}>

          <div style={{...PADDING}} className="container white-text">
            <h2>
              <strong>OAuth2Cloud</strong> is the simplest way for you to authorize users
            </h2>
            <p className="flow-text">
              Create a log in page for your project in minutes
            </p>
          </div>
        </PL>


        <div className="row container" style={{marginTop: 20}}>

          <div className="col s12 m4">
            <Card title="No Passwords" text="Stop storing user passwords and worrying about breaches"/>
          </div>

          <div className="col s12 m4">
            <Card title="Customization"
                  text="Everything from the browser icon to the button colors to the client behaviors is configurable"/>
          </div>

          <div className="col s12 m4">
            <Card title="Google Log In" text="Increase your reach by enabling users to authenticate via Google"/>
          </div>

        </div>


        <PL src={laptop} blur="10px">
          <div style={{...PADDING, textAlign: 'right'}} className="container white-text">
            <h2>
              <strong>Stop</strong> rewriting code
            </h2>
            <p className="flow-text">
              OAuth2 servers have been done a hundred times in a hundred different ways. Let us do it right for you
            </p>
          </div>
        </PL>
      </div>
    );
  }
}