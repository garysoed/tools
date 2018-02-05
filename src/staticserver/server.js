const chalk = require('chalk');
const express = require('express');
const fs = require('fs');
const path = require('path');
const process = require('process');

const configFilePath = process.argv.slice(2)[0];

const PORT = 8800;

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, {encoding: 'utf8'}, (error, data) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(data);
    });
  });
}

if (!configFilePath) {
  throw new Error('Config file is required');
}

const configFileDir = path.dirname(configFilePath);

readFile(configFilePath)
    .then((configFileContent) => {
      const app = express();
      const config = JSON.parse(configFileContent);
      for (const key of Object.getOwnPropertyNames(config)) {
        const filePath = config[key];
        console.log(`${chalk.cyan('CONFIG')} [${key}] -> [${filePath}]`);
        app.get(key, (req, resp) => {
          const normalizedPath = `${filePath}`.replace(
              /\$([a-zA-Z0-9_-]+)/g,
              (match, submatch) => {
                const param = req.params[submatch];
                return param ? param : match;
              });

          console.log(`${chalk.green(req.method)} [${req.originalUrl}] -> [${normalizedPath}]`);
          readFile(path.resolve(configFileDir, normalizedPath))
              .then((content) => {
                resp.send(content);
              },
              (error) => {
                console.error(`${chalk.red('ERROR')} ${error.message}`);
                console.error(error.stack);
              });
        });
      }

      app.listen(PORT, () => console.log(`\n\nGS Simple Static Server ready at port [${PORT}]`));
    })
    .catch((error) => {
      console.error(`Error reading ${configFilePath}:`, error);
    });
