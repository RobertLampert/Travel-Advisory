const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  isocountries: process.env.ISOCOUNTRIES,
  gocalerts: process.env.GOCALERTS,
  alertcollection: process.env.ALERTCOLLECTION,
  alerturl: process.env.ALERTURL,
  atlas: process.env.DBURL,
  appdb: process.env.DB,
  port: process.env.PORT,
  graphql: process.env.GRAPHQLURL,
  advisorycollection: process.env.ADVISORYCOLLECTION
};
