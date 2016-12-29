
var ajax = require("./ajax.js")
const nconf = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var options = {
   port: global.PORT
  // ,method: "GET"
  ,headers: {
     "X-Parse-Application-Id": nconf.get('APP_ID')
    ,"X-Parse-Master-Key": nconf.get('MASTER_KEY')
  }
};

var manageSchemas = {
  now: function(req, res) {
    var baseURL = "http://"+global.HOST+"/parse/schemas"
    var all = require(global.base_dir + "/schemas.json").schemas
    if (typeof all == "object") {
      all.forEach(function(schema) {
        var name = schema.className;
        options.method = "GET";
        ajax.get(baseURL+"/"+name, options, function(response) {
          if (typeof response == "string" && response.substr(0,1) == "{") {
            var schemaDB = JSON.parse(response);
            if (schemaDB.code == 103) { // do not exist
              options.method = "POST";
            } else { // update schema
              options.method = "PUT"
              for (var type in schemaDB) {
                if (!schema[type]) {
                  schema[type] = {"__op": "Delete"};
                } else {
                  for (var prop in schemaDB[type]) {
                    if (!schema[type][prop]) {
                      schema[type][prop] = {"__op": "Delete"};
                    }
                  }
                }
              }
            }
            console.log(schema)
            ajax.post(baseURL+"/"+name, schema, options, function(result) {
              console.log(":::::",JSON.parse(result))
            })
          }
        })
      })
    }
  }
};

module.exports = manageSchemas;