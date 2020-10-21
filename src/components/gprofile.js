import React, { Component } from "react";
import profile from "../resources/profile.png";
var CLIENT_ID =
  "1086063754312-nhg5ngofkljkftuuu0so344oqpucdfqp.apps.googleusercontent.com";
var SCOPES = "profile";
const gapi = window.gapi;
class Gprofile extends Component {
  static theme() {
    return {
      button: {
        background: "#df2f32",
        border: "solid 2px white",
      },
      page: {
        "--theme-foreground-primary-color": "#df2f32",
        "--theme-background-primary-color": "rgba(251, 234, 172, 0.96)",
        "--theme-page-background":
          "url(https://cdn.vox-cdn.com/thumbor/p01ezbiuDHgRFQ-htBCd7QxaYxo=/0x105:2012x1237/1600x900/cdn.vox-cdn.com/uploads/chorus_image/image/47070706/google2.0.0.jpg)",
      },
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      profile: null,
    };
  }
  loginChanged(state) {
    if (state == true) {
      var profile = gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getBasicProfile();
      this.setState({
        isLogged: true,
        profile: {
          name: profile.getName(),
          pic: profile.getImageUrl() || profile,
          email: profile.getEmail(),
        },
      });
    } else
      this.setState({
        isLogged: false,
        profile: null,
      });
  }
  async componentDidMount() {
    await new Promise((res) => gapi.load("client:auth2", res));
    await gapi.client.init({
      clientId: CLIENT_ID,
      scope: SCOPES,
    });
    gapi.auth2
      .getAuthInstance()
      .isSignedIn.listen((val) => this.loginChanged(val));
    this.loginChanged(gapi.auth2.getAuthInstance().isSignedIn.get());
  }

  render() {
    return (
      <div className="container">
        {!this.state.isLogged && (
          <div className="login-Page">
            <div
              className="profile-item profile-logout button"
              onClick={() => gapi.auth2.getAuthInstance().signIn()}
            >
              Login with Google
            </div>
          </div>
        )}

        {this.state.isLogged && (
          <div className="profile">
            <div className="profile-item profile-pic">
              <img src={this.state.profile.pic} alt="profile" />
            </div>
            <div className="profile-item profile-name">
              <label>Name:</label>
              {this.state.profile.name}
            </div>
            <div className="profile-item profile-email">
              <label>Email:</label>
              {this.state.profile.email}
            </div>
            <div
              className="profile-item profile-logout button"
              onClick={() => gapi.auth2.getAuthInstance().signOut()}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Gprofile;
