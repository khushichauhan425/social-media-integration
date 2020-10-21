import React, { Component } from "react";
import logo from "../resources/logo_small.png";
import FbProfile from "./fbprofile";
import Gprofile from "./gprofile";
import LnProfile from "./lnProfile";

export default class Front extends Component {
  static defaultTheme() {
    return {
      button: {
        background: "black",
        border: "solid 2px ",
      },
      page: {
        "--theme-foreground-primary-color": "white",
        "--theme-background-primary-color": "black",
      },
    };
  }
  constructor(props) {
    super(props);
    this.all = [FbProfile, LnProfile, Gprofile];
    this.state = {
      current: 0,
    };
  }
  gettheme(pos) {
    switch (pos) {
      case "main":
        return this.all[this.state.current].theme
          ? this.all[this.state.current].theme()
          : Front.defaultTheme();
      case "right":
        return (this.all[this.next()].theme
          ? this.all[this.next()].theme()
          : Front.defaultTheme()
        ).button;
      case "left":
        return (this.all[this.prev()].theme
          ? this.all[this.prev()].theme()
          : Front.defaultTheme()
        ).button;
    }
  }
  getCurrentComponent() {
    var Component = this.all[this.state.current];
    var theme = this.gettheme("main");
    for (let each in theme.page || []) {
      document.body.style.setProperty(each, theme.page[each]);
    }
    return <Component />;
  }
  prev() {
    return (this.state.current + this.all.length - 1) % this.all.length;
  }
  next() {
    return (this.state.current + 1) % this.all.length;
  }
  changeCurrent(dir) {
    if (dir == -1) {
      var next = this.prev();
      this.setState({ current: next });
    } else if (dir == 1) {
      var next = this.next();
      this.setState({ current: next });
    }
    document.body.style.setProperty("--theme-shadow-angle", next * 5 + "px");
    console.log("current changed to " + this.all[next]);
  }
  render() {
    return (
      <div className="front-root">
        <div id="bg-layer"></div>
        <div className="front-header">
          <div className="logo-box">
            <img src={logo} alt="logo" />
          </div>
        </div>
        <div className="front-body">
          <div className="front-body-title">Social Media Integration</div>
          <div
            className="left-button  button"
            onClick={() => this.changeCurrent(-1)}
            style={this.gettheme("left")}
          >
            ←
          </div>
          <div className="main">
            {/* <div onClick={()=>console.log("div clicked")}>Lets get Started</div> */}
            {/*<FbProfile />*/}
            {/* <GProfile /> */}
            {this.getCurrentComponent()}
          </div>
          <div
            className="right-button  button"
            onClick={() => this.changeCurrent(1)}
            style={this.gettheme("right")}
          >
            →
          </div>
        </div>
        <div className="front-footer">
          <span>Made with ❤ in India</span>
        </div>
      </div>
    );
  }
}
