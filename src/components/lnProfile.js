import React, { Component } from "react";
import { linkedInAuth } from "../Oauth";
const client_id = "78mv65deb478ft";
const IN = new linkedInAuth({ client_id });
class LnProfile extends Component {
  static theme() {
    return {
      button: {
        background: "skyblue",
        border: "solid 2px white",
      },
      page: {
        "--theme-foreground-primary-color": "#0b7bab",
        "--theme-background-primary-color": "white",
        "--theme-page-background":
          "url(https://images.unsplash.com/photo-1596720314513-eb7c6d334b7a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80)",
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
  async componentDidMount() {
    this.IN = IN;
    this.IN.on("loginChanged", (val) => this.loginChanged(val.detail));
    this.loginChanged(this.IN.islogin());
  }
  async loginChanged(state) {
    if (state == true) {
      var [profile, email] = await Promise.all([
        this.IN.currentUser(),
        this.IN.getEmail(),
      ]);
      this.setState({
        isLogged: true,
        profile: { ...profile, email },
      });
    } else
      this.setState({
        isLogged: false,
        profile: null,
      });
  }
  render() {
    return (
      <div className="container">
        {!this.state.isLogged && (
          <div className="login-Page">
            <div
              className="profile-item profile-logout button"
              onClick={() => this.IN.login()}
            >
              Login with LinkedIn
            </div>
          </div>
        )}

        {this.state.isLogged && (
          <div className="profile">
            <div className="profile-item profile-pic">
              <img src={this.state.profile.profilePicture} alt="profile" />
            </div>
            <div className="profile-item profile-name">
              <label>Name:</label>
              {this.state.profile.localizedFirstName +
                " " +
                this.state.profile.localizedLastName}
            </div>
            <div className="profile-item profile-email">
              <label>Email:</label>
              {this.state.profile.email}
            </div>
            <div
              className="profile-item profile-logout button"
              onClick={() => this.IN.logout()}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default LnProfile;
