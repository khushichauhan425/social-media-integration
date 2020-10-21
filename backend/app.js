const express = require("express");
const axios = require("axios").default;
const url = require("url");
const app = express();
const CLIENT_SECRET = "nWTRVj9QQDj57m3J";
const CLIENT_ID = "78mv65deb478ft";
app.use(express.json({ extended: true }));
app.get("/linkedin/api", async (req, res) => {
  var path = req.query.path;
  var result = await axios.get("https://api.linkedin.com" + path, {
    headers: { authorization: req.headers.authorization },
  });
  res.json(result.data);
});

app.post("/linkedin/get_access_token", async (req, res, next) => {
  var { code, redirect_uri } = req.body;
  var params = new url.URLSearchParams({
    code,
    redirect_uri,
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });
  var response = await axios.post(
    "https://www.linkedin.com/oauth/v2/accessToken",
    params.toString()
  );
  var res_token = response.data;
  var token = {
    access_token: res_token.access_token,
    valid_till: Date.now() + res_token.expires_in * 1000,
  };
  res.json(token);
});
app.listen(8080, () => console.log("Started @ 8000"));
