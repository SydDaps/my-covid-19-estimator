const express = require('express');

const app = express();
const dotenv = require('dotenv');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const apiRoute = require('./src/routes/mainRoute');


// Configurations
dotenv.config({ path: './src/config.env' });


const accessLogStream = fs.createWriteStream('./src/access.log', { flags: 'a' });
app.use(logger(
  ':method\t:url\t:status\t:response-time', {
    stream: {
      write(string) {
        const finalIndex = string.length - 1;
        const lastTabIndex = string.lastIndexOf('\t');
        const str = string.substring(lastTabIndex + 1, finalIndex);
        let time = Math.ceil(parseFloat(str));
        if (time < 10) {
          time = `0${time.toString()}`;
        } else {
          time = time.toString();
        }
        const msg = `${string.substring(0, lastTabIndex + 1)}${time}ms\n`;
        accessLogStream.write(msg);
      }
    }
  }
));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Route handling middleware
app.use('/api/v1/on-covid-19', apiRoute);


app.all('*', (req, res, next) => {
  const err = new Error(`Can not find ${req.originalUrl} on this server!`);
  next(err);
});
app.use((err, req, res, next) => {
  res.status(400).json({
    status: 'failed',
    error: err.message
  });
  next();
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server started on port ${port}`);
  }
});
