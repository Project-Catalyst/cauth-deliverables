//require for express and middlewares
const bodyParser = require("body-parser");
const express = require("express");
const port = 3000;
const app = express();
const util = require("util");
const cors = require("cors");
//require for oauth2-server
const OAuth2Server = require("oauth2-server");
const model = require("./src/model");
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

//require for Cardano related libraries
const BlockfrostProvider = require("@meshsdk/core").BlockfrostProvider;
const checkSignature = require("@meshsdk/core").checkSignature;

//creating a Blockfrost provider
const blockfrostProvider = new BlockfrostProvider(
  "preprodogagfluB6ehST1uFm3zk0fB6BAhZaQL9"
);

//--configuring oauth2-server
app.oauth = new OAuth2Server({
  debug: true,
  model: model,
  grants: ["authorization_code"],
  accessTokenLifetime: 60 * 60 * 1, // 1 hour, or 1/24th of day
});
//--configuring express

//Not using CORS config, or rather using a least restrictive config
app.use(cors({
  origin: ['https://login.cauth.org','https://wiki.cauth.org'],
  allowedHeaders: 'Content-Type, Authorization',
  optionsSuccessStatus: 204
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * configuring endpoint
 */

app.get("/api", function (req, res) {
  res.send({ status: "ok", message: "Welcome to CAuth API" });
});

app.get("/api/authorize", async function (request, response) {
  console.log("GET /api/authorize");
  let req = new Request(request);
  let res = new Response(response);

  app.oauth
    .authenticate(req, res)
    .then((token) => {
      //Authentication successful
      //Q: Shouldn't I redirect back to the redirect_uri?
      response.status(200).json({ message: "Authenticated", token: token });
    })
    .catch((err) => {
      //No joy on authentication. We are hitting the web to do the CAuth login
      console.log(err);
      return response.redirect(
        util.format(
          "/?redirect=%s&response_type=%s&client_id=%s&redirect_uri=%s&scope%s&state=%s",
          req.route.path,
          req.query.response_type,
          req.query.client_id,
          encodeURIComponent(req.query.redirect_uri),
          req.query.scope,
          req.query.state
        )
      );
    });
});

//--START OF CAUTH INTEGRATION

app.post("/api/authorize", async (request, response) => {
  console.log("POST /api/authorize");
  console.log("Received new authentication data");
  let req = new Request(request);
  let res = new Response(response);
  let options = {
    authenticateHandler: {
      handle: function (request, response) {
        console.log("authenticateHandler active");
        return authenticateViaNFT(request);
      },
    },
  };
  app.oauth
    .authorize(req, res, options)
    .then(function (code) {
      console.log("Handle successful authentication", code);
      response.status(200).json({redirect:util.format(`${code.redirectUri}?code=%s&state=%s`,
      code.authorizationCode,
      request.body.state
    )})

    })
    .catch(function (err) {
      console.log(err);
    });

  async function authenticateViaNFT(req) {
    const nft = req.body.nft;
    const authCode = req.body.authCode;
    const signature = req.body.signature;
    const rewardAddress = req.body.rewardAddress;
    const walletAddresses = JSON.parse(req.body.walletAddresses);

    const dataToSign = {
      username: nft.asset.assetName,
      policyId: nft.asset.policyId,
      metadata: nft.metadata,
      authCode: authCode,
    };

    const signatureVerified = checkSignature(
      JSON.stringify(dataToSign),
      rewardAddress,
      signature
    );
    //NFT ownership verification
    const assetAddress = await blockfrostProvider.fetchAssetAddresses(
      nft.asset.unit
    );
    const nftValid = walletAddresses.indexOf(assetAddress[0].address) > -1;
    const verificationResult = signatureVerified && nftValid;
    return verificationResult;
  }
});

app.get("/api/clientName", async (request, response) => {
  response.status(200).json({ clientName: "Wiki.js" });
});

//--END OF CAUTH INTEGRATION

/**
 *  Token endpoint. Should be used the client to obtain token(s) (i.e. when refresh tokens are allowed)
 */

app.post("/api/token", async function (request, response) {
  console.log("POST /api/token");

  let req = new Request(request);
  let res = new Response(response);
  return app.oauth.token(req, res)
  .then(function(code) {
    response.status(200).json({
      access_token: code.accessToken,
      refresh_token: code.refreshToken,
      expires_in: 3600,
      token_type: "Bearer"
    })
  })
  .catch(function(err) {
    // handle error condition
    console.log(err)
  });
});
app.get("/api/info", async function (request, response) {
  let req = new Request(request);
  let res = new Response(response);
  console.log("GET /api/info");
  // console.log(req);
  app.oauth
  .authenticate(req, res)
  .then((token) => {
    response.status(200).json({
      id:"asset1c7djzs76nny9zlv4ct0zte3w29vcxwyjwhzhm8",
      displayName:"McLovin",
      email:"b8a3610269b7b5416cdda37058be9814a5c4a0400c2e8d5940e3b92c8bf19f66@cauth.org"
    })
  })
  .catch((err) => {
    //No joy on authentication. We are hitting the web to do the CAuth login
    console.log(err);
    return response.redirect(
      util.format(
        "/?redirect=%s&response_type=%s&client_id=%s&redirect_uri=%s&scope%s&state=%s",
        req.route.path,
        req.query.response_type,
        req.query.client_id,
        encodeURIComponent(req.query.redirect_uri),
        req.query.scope,
        req.query.state
      )
    );
  });
});

app.listen(port, () => {
  console.log(`cauth-bridge backend listening on port ${port}`);
});
