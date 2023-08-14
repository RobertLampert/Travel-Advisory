const request = require("request");
const fsp = require("fs").promises;

const getJSONFromWWWPromise = src_url => {
    return new Promise((resolve, reject) => {
      request(
        {
          url: src_url,
          json: true
        },
        (error, response, body) => {
          if (error) {
            reject("unable to connect to GitHub servers");
          } else if (response.statusCode === 200) {
            resolve(body);
          }
        }
      );
    });
};

module.exports = {
    getJSONFromWWWPromise
}