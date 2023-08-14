const { buildSchema } = require("graphql");
const schema = buildSchema(`
type Query {
    alerts: [Alert],
    setupalerts: String,
    alertsforregion(region: String): [Alert],
    alertsforsubregion(subregion: String): [Alert],
    regions: [String],
    subregions: [String],
    countries: [String],
    advisories: [Advisory]
}

type Alert {
    country: String
    name: String
    text: String
    date: String
    region: String
    subregion: String
},

type Advisory {
    name: String,
    text: String,
    date: String,
    traveller: String
}

type Mutation {
    addadvisory(name: String, text: String, date: String, traveller: String): Advisory
    }
`);

module.exports = { schema };