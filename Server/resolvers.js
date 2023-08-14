const dbRtns = require("./dbroutines");
const { alertcollection, advisorycollection } = require("./config");
const setupRtns = require("./setupalerts");
const resolvers = {
    alerts: async () => {
        let db = await dbRtns.loadDB();
        return await dbRtns.findAll(db, alertcollection, {}, {});
    },
    alertsforregion: async args => {
        let db = await dbRtns.loadDB();
        return await dbRtns.findAll(db, alertcollection, {region: args.region});
    },
    alertsforsubregion: async args => {
        let db = await dbRtns.loadDB();
        return await dbRtns.findAll(db, alertcollection, { subregion: args.subregion});
    },
    regions: async () => {
        let db = await dbRtns.loadDB();
        let result = await dbRtns.findAll(db, alertcollection, {}, {});
        return [...new Set(result.map(x=>x.region))];
    },
    subregions: async () => {
        let db = await dbRtns.loadDB();
        let result = await dbRtns.findAll(db, alertcollection, {}, {});
        return [...new Set(result.map(x=>x.subregion))];
    },
    setupalerts: async () => {
        let db = await dbRtns.loadDB();
        let results = await setupRtns.run();
        console.log(`results: ${JSON.stringify(results)}`);
        return results.results;
    },
    countries: async () => {
        let db = await dbRtns.loadDB();
        let result = await dbRtns.findAll(db,alertcollection, {}, {});
        return new Set(result.map(x=>x.name));
    },
    addadvisory: async args => {
        let db = await dbRtns.loadDB();
        let advisory = {
            name: args.name,
            text: args.text,
            date: args.date,
            traveller: args.traveller
        };
        let results = await dbRtns.addOne(db, advisorycollection, advisory);
        return results.insertedCount === 1 ? advisory: null;
    },
    advisories: async () => {
        let db = await dbRtns.loadDB();
        let result = await dbRtns.findAll(db,advisorycollection, {}, {});
        return result;
    }
};

module.exports = { resolvers };