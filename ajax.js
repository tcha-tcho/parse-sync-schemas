/**
 * Lib responsável por fazer requisições
 * http's via get, post entre outros que
 * estão relacionados mas ainda não implementados
 * 
 * @namespace Lib_Http
 */

  
/**
 * Proxy method that receive "bootstrap thisObj"
 *
 * @param  (Bootstrap)boot
 * @method Proxy
 */
var pubs = {}

// get loaded modules in memory 
var http       = require('http')
  , querystring = require('querystring')
  , url  = require('url');

/**
 * Método http utilizado 
 * para enviar dados via POST
 */
pubs.post = function(urlstr, data, useroptions, callback) {
  if (typeof useroptions == "function") {
    callback = useroptions;
    useroptions = {};
  }
  if (!useroptions) useroptions = {}; 
  // data parsed
  // var parsed_data = querystring.stringify(data);
  var parsed_data = JSON.stringify(data);
  console.log(parsed_data)
  var parsed_url = url.parse(urlstr);

  // http options
  var options = {
    host: parsed_url.host
   ,path: parsed_url.pathname
   ,method: 'POST'
   ,headers: {
      'Content-Type': 'application/json'
     ,'charset': 'UTF-8'
     ,'Content-Length': parsed_data?Buffer.byteLength(parsed_data):0
    }    
  };
  options.rejectUnauthorized = false;
  options.agent = new http.Agent( options );
  Object.assign(options, useroptions);

  // envia request
  pubs.request(parsed_data, options, callback);
};

/**
 * método para fazer request usando
 * http GET
 */
pubs.get = function(urlstr, useroptions, callback) {
  if (typeof useroptions == "function") {
    callback = useroptions;
    useroptions = {};
  }
  if (!useroptions) useroptions = {}; 

  var parsed_url = url.parse(urlstr);
  var options = {
    host: parsed_url.host
   ,path: parsed_url.pathname
   ,method: 'GET'
  };
  Object.assign(options, useroptions);
  this.request(null, options, callback);
};


pubs.request = function(data, opts, callback) {
  var res_ready = "";
  var req = http.request(opts, function(res) {
    // ready
    res.on('data', function(d) {
      res_ready += d.toString('utf8');;
    });
    // done
    res.on('end', function(){
      callback(res_ready);
    });
  }).on('error', function(e) {
    console.log("erro ajax.js",e);
  });
  // only POST
  var method = opts.method.toUpperCase();
  if ( method =='POST' || method == "PUT" ) req.write(data);
  req.end();
};



module.exports = pubs;
