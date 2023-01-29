var http = require('http');
var dt = require('./ogs_module');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write("The Nate and time are currently: " + dt.myDateTime());
  res.end();
}).listen(8080);





//https://github.com/jshemas/openGraphScraper


// Usage
// const ogs = require('open-graph-scraper');
// const options = { url: 'https://www.oprah.com/food/tuna-burgers-with-ginger-and-soy' };
// ogs(options)
//   .then((data) => {
//     const { error, result, response } = data;
//     console.log('error:', error);  // This returns true or false. True if there was an error. The error itself is inside the results object.
//     console.log('result:', result); // This contains all of the Open Graph results
//     console.log('response:', response); // This contains the HTML of page
//   })
//   

// const ogs = require('open-graph-scraper');
// const options = {
//   url: 'https://github.com/jshemas/openGraphScraper',
//   customMetaTags: [{
//     multiple: false, // is there more than one of these tags on a page (normally this is false)
//     property: 'hostname', // meta tag name/property attribute
//     fieldName: 'hostnameMetaTag', // name of the result variable
//   }],
// };
// ogs(options)
//   .then((data) => {
//     const { error, result, response } = data;
//     console.log('hostnameMetaTag:', result.hostnameMetaTag); // hostnameMetaTag: github.com
//   })
  
  
// User Agent Example
// const ogs = require("open-graph-scraper");
// const options = {
//   url: "https://www.wikipedia.org/",
//   headers: {
//     "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)",
//   },
// };
// ogs(options)
//   .then((data) => {
//     const { error, result, response } = data;
//     console.log("error:", error); // This returns true or false. True if there was an error. The error itself is inside the results object.
//     console.log("results:", results); // This contains all of the Open Graph results
//   })
//   

