const express = require("express");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
// CORS configuration
const corsOptions = {
  origin: 'http://localhost:8080', // Allow only http://localhost:8080
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON

async function startServer() {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", () => {
    console.log(`Mongoose connected to ${mongoUri}`);
  });

  // Your application logic here

  // Optionally, you can stop the server when you're done:
  // await mongoServer.stop();a
}

startServer().catch((e) => {
  console.error(e);
  process.exit(1);
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("We're connected to the database!");
});

const cAuthLoginSchema = new mongoose.Schema({
  wallet: String,
  data: {
    username: String,
    policyId: String,
    metadata: {
      name: String,
      email: String,
      daysValid: String,
      validFrom: String,
      description: String,
      cAuthVersion: String,
    },
    authCode: String,
  },
  expires: {
    type: Date,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    index: { expires: "7d" }, // Expires in 7 days
  },
});

const cAuthLogin = mongoose.model("cAuthLogin", cAuthLoginSchema);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.post("/cauthlogins", async (req, res) => {
  const cauthLogin = new cAuthLogin(req.body);
  console.log('Received new authentication data',cAuthLogin)
  try {
    await cauthLogin.save();
    res.status(201).send(cauthLogin);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/cauthlogins/check", async (req, res) => {
  try {
    const { authCode } = req.query;
    console.log('Received authentication request');
    if (!authCode) {
      return res.status(400).send({ message: "AuthCode is required" });
    }

    const cauthLogin = await cAuthLogin.findOne({
      "data.authCode": authCode,
      expires: { $gte: new Date() },
    });

    if (cauthLogin) {
      console.log('Found authenticated data',cauthLogin);
      res.send({ valid: true, cauthLogin });
    } else {
      res
        .status(404)
        .send({ valid: false, message: "AuthCode not found or expired" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
