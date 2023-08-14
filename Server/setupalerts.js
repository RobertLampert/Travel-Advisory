const utils = require("./utilities");
const {isocountries,gocalerts, alertcollection, alerturl} = require("./config.js");
const rtnDB = require("./dbroutines");

let dataArr = [];
let results; 

const loadCountries = async () => {
    const loadData = await utils.getJSONFromWWWPromise(isocountries); 
    dataArr = loadData;
    results+= `Retrieved Country JSON from the remote web site. `;
};

const alerts = async () => {
    try{
        results='';
        let db = await rtnDB.loadDB();
        let dbWipe = await rtnDB.deleteAll(db,alertcollection);
        results += `deleted ${dbWipe.deletedCount} from the ${alertcollection} collection. `;

        let alertArray = await rtnDB.getJSONFromWWWPromise(alerturl);
        results+= `Retrieved Alert JSON from the remote web site. `;

        await Promise.allSettled(
            dataArr.map(async country => {
                let result;
                if(alertArray.data[country["alpha-2"]]===undefined){
                    result = {
                        country: country["alpha-2"],
                        name: country.name,
                        text: "No travel alerts",
                        date: "",
                        region: country.region,
                        subregion: country["sub-region"]
                    };
                }else{
                    result = {
                        country: country["alpha-2"],
                        name: country.name,
                        text: alertArray.data[[country["alpha-2"]]].eng["advisory-text"],
                        date: alertArray.data[[country["alpha-2"]]]["date-published"].date,
                        region: country.region,
                        subregion: country["sub-region"]
                    };
                };
                await rtnDB.addOne(db,alertcollection,result);
            })
        );
        let allDocuments = await rtnDB.findAll(db, alertcollection, {}, {});
        results+= `Added approx. ${allDocuments.length} new documents to the ${alertcollection} collection.`;
    } catch(err) {
        console.log(err);
    }
};

const run = async () => {
    try{
        await loadCountries();
        await alerts();
    }catch (err){
        console.log(err);
    }finally{
        return { results: results }
    }
};

module.exports = {
    run
}
