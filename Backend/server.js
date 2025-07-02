require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require('cookie-parser');

const verifyJWT = require('./middleware/verifyJWT');

const homeRouter = require("./routes/homeRouter"); 
const vitRouter = require('./routes/api/vitRouter');

const registerRouter = require('./routes/registerRouter');
const authRouter = require('./routes/authrouter');

const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errHandler");

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false })); 
app.use(express.json()); 
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/subdir", express.static(path.join(__dirname, "public")));

const cors = require("cors"); 
const corsOptions = require('./config/corsOptions');
app.use(cors(corsOptions));

app.use(logger);
app.use(require('./middleware/credentials'));

app.use("/", homeRouter);
app.use('/register', registerRouter);
app.use('/auth', authRouter);
app.use('/refresh', require('./routes/refreshRouter'));
app.use('/logout', require('./routes/logoutRouter'));

app.use('/api/vit', verifyJWT, vitRouter); 

app.all(/^\/.*/, (req, res) => {
  res.status(404);
  if (req.accepts("html"))
    res.sendFile(path.join(__dirname, "views", "404.html"));
  else if (req.accepts("json")) res.send({ error: "404 Not Found" });
  else res.type("txt"), send("404 Not Found");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log("server running");
});
