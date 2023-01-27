

const mql = require('@microlink/mql')

 
module.exports = async () => {
  const { status, data, response } = await mql(
    'https://github.com/microlinkhq/',
    {
      apiKey: '1E3D6sdCsSa7RHCCJlLPA17Yr9XyvU079oKZFmhG'
    }
  )
	console.log( 'hi')
  console.log(data)
}

const getHTML = require('html-get')

/**
 * `browserless` will be passed to `html-get`
 * as driver for getting the rendered HTML.
 */
const browserless = require('browserless')()
// 
// // const getContent = async url => {
// //   // create a browser context inside the main Chromium process
// //   const browserContext = browserless.createContext()
// //   const promise = getHTML(url, { getBrowserless: () => browserContext })
// //   // close browser resources before return the result
// //   promise.then(() => browserContext).then(browser => browser.destroyContext())
// //   return promise
// // }
// 
// /**
//  * `metascraper` is a collection of tiny packages,
//  * so you can just use what you actually need.
//  */
// const metascraper = require('metascraper')([
//   require('metascraper-author')(),
//   require('metascraper-date')(),
//   require('metascraper-description')(),
//   require('metascraper-image')(),
//   require('metascraper-logo')(),
//   require('metascraper-clearbit')(),
//   require('metascraper-publisher')(),
//   require('metascraper-title')(),
//   require('metascraper-url')()
// ])
// 
// // *
// //  * The main logic
// //  */
// // getContent('https://microlink.io')
// //   .then(metascraper)
// //   .then(metadata => console.log(metadata))
// //   .then(browserless.close)
// //   .then(process.exit)



// 
// -----------
// 
// const getMetaData = require('metadata-scraper')
// 
// async function run() {
// 	var url = 'https://github.com/BetaHuhn/metadata-scraper'
// 	url = 'http://www.oprah.com/recipe/food/recipessandwiches/food_20050509_tunaburger'
// 	url = 'https://www.oprah.com/food/tuna-burgers-with-ginger-and-soy'
// 	const data = await getMetaData(url)
// 	console.log(data)
// }
// 
// run()
