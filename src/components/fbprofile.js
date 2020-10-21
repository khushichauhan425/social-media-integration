import React, { Component } from "react";
var FB;
class FbProfile extends Component {
  static theme() {
    return {
      button: {
        background: "#3c5a9a",
        border: "solid 2px white",
      },
      page: {
        "--theme-foreground-primary-color": "white",
        "--theme-background-primary-color": "#0126b7",
        "--theme-page-background":
          "url(https://images.unsplash.com/photo-1491951931722-5a446214b4e2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2006&q=80)",
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
    FB = await new Promise((res) =>
      window.FB
        ? res(window.FB)
        : (window.FacebookApiloaded = () => res(window.FB))
    );
    FB.Event.subscribe("auth.statusChange", (status) =>
      this.loginChanged(status.status == "connected")
    );
    FB.getLoginStatus((status) =>
      this.loginChanged(status.status == "connected")
    );
  }
  loginChanged(state) {
    if (state == true) {
      window.FB.api(
        "/me",
        { fields: "email,first_name,last_name,picture" },
        (data) => {
          this.setState({
            profile: data,
            isLogged: true,
          });
        }
      );
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
              onClick={() => window.FB.login(() => {}, { scope: "email" })}
            >
              Login with Facebook
            </div>
          </div>
        )}

        {this.state.isLogged && (
          <div className="profile">
            <div className="profile-item profile-pic">
              <img src={this.state.profile.picture.data.url} alt="profile" />
            </div>
            <div className="profile-item profile-name">
              <label>Name:</label>
              {this.state.profile.first_name +
                " " +
                this.state.profile.last_name}
            </div>
            <div className="profile-item profile-email">
              <label>Email:</label>
              {this.state.profile.email}
            </div>
            <div
              className="profile-item profile-logout button"
              onClick={() => window.FB.logout()}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default FbProfile;
