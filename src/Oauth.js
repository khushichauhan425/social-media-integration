export class linkedInAuth extends EventTarget {
  client_id;
  redirect_uri;
  scopes;
  on;
  access_token;
  user;
  email;
  constructor({
    client_id,
    redirect_url = "https://localhost:3000/oauth_recieve.html",
    scopes = "r_liteprofile r_emailaddress",
  }) {
    super();
    this.client_id = client_id;
    this.redirect_uri = redirect_url;
    this.scopes = scopes instanceof Array ? scopes.join(" ") : scopes;
    this.access_token =
      "linkedin-accesstoken" in localStorage
        ? JSON.parse(localStorage.getItem("linkedin-accesstoken"))
        : undefined;
    this.on = this.addEventListener;
    this.on("logout", () =>
      this.dispatchEvent(new CustomEvent("loginChanged", { detail: false }))
    );
    this.on("login", () =>
      this.dispatchEvent(new CustomEvent("loginChanged", { detail: true }))
    );
  }
  islogin() {
    if ("linkedin-accesstoken" in localStorage) {
      if (this.access_token.valid_till < Date.now()) {
        return false;
      } else return true;
    } else return false;
  }
  logout() {
    localStorage.removeItem("linkedin-accesstoken");
    localStorage.removeItem("linkedin-granttoken");
    this.user = this.email = this.access_token = undefined;
    this.dispatchEvent(new CustomEvent("logout"));
  }
  getGrant() {
    if ("linkedin-granttoken" in localStorage)
      return JSON.parse(localStorage.getItem("linkedin-granttoken"));
    var childwindow = window.open(
      `https://www.linkedin.com/oauth/v2/authorization?client_id=${this.client_id}&&redirect_uri=${this.redirect_uri}&&response_type=code&&scope=${this.scopes}`,
      "",
      "width=500,height=500,left=400,top=100"
    );
    return new Promise(function (resolve) {
      async function handler(message) {
        if (message.source !== childwindow) return;
        window.removeEventListener("message", handler);
        childwindow.close();
        if ("error" in message.data) throw message.error;
        else if ("code" in message.data) {
          console.log("Grant token received: ", message.data);
          localStorage.setItem(
            "linkedin-granttoken",
            JSON.stringify(message.data.code)
          );
          resolve(message.data.code);
        } else console.log("~");
      }
      window.addEventListener("message", handler);
    });
  }

  async login() {
    if (this.islogin()) {
      var token = JSON.parse(localStorage.getItem("linkedin-accesstoken"));
      this.access_token = token;
      return true;
    } else {
      var gCode = await this.getGrant();
      var result = await fetch("/linkedin/get_access_token", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code: gCode,
          redirect_uri: this.redirect_uri,
        }),
      });
      var token = await result.json();
      console.log("Access token recieved: ", token);
      localStorage.setItem("linkedin-accesstoken", JSON.stringify(token));
      localStorage.removeItem("linkedin-granttoken");
      this.access_token = token;
      this.dispatchEvent(new CustomEvent("login"));
      return true;
    }
  }
  async api(path = "/me") {
    if (!this.islogin()) throw "Not loggen yet";
    else {
      var result = await fetch(
        "/linkedin/api?path=/v2" + encodeURIComponent(path),
        {
          headers: {
            authorization: "Bearer " + this.access_token.access_token,
          },
        }
      );
      return result.json();
    }
  }
  async currentUser() {
    if (this.user) return this.user;
    var profile = await this.api(
      "/me?projection=(*,profilePicture(displayImage~:playableStreams))"
    );
    profile.profilePicture = profile.profilePicture["displayImage~"].elements
      .map((el) => el.identifiers)
      .flat()
      .map((i) => i.identifier)
      .pop();
    return (this.user = profile);
  }
  async getEmail() {
    if (this.email) return this.email;
    var _email = await this.api(
      "/emailAddress?q=members&projection=(elements*(handle~))"
    );
    return (this.email = _email.elements[0]["handle~"].emailAddress);
  }
}
