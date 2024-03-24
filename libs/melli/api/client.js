const axios = require('axios');
const { JSDOM } = require('jsdom');
//import stringSimilarity from 'string-similarity';
const { clean } = require('../../../util/string.js'); // Assuming util.js exists and has a clean function similar to the JavaScript version

const baseUrl = 'http://opac.nlai.ir';

async function searchBooks(text) {
  const searchURL = `${baseUrl}/opac-prod/search/bibliographicSimpleSearchProcess.do?simpleSearch.value=${text}&bibliographicLimitQueryBuilder.biblioDocType=${''}&simpleSearch.indexFieldId=&command=I&simpleSearch.tokenized=true&classType=0`;
  try {
    const res = await axios.get(searchURL);
    const dom = new JSDOM(res.data);
    const document = dom.window.document;
    const results = document.querySelectorAll("#table > tbody > tr");
    let arrRet = [];
    results?.forEach((row) => {
      const td = Array.from(row.querySelectorAll("td"));
      arrRet.push({
        type: td[1]?.querySelector("img")?.title,
        image: baseUrl + td[1]?.querySelector("img")?.src,
        title: td[2]?.querySelector("a")?.innerHTML?.replace(/\n/g, "").trim(),
        link: baseUrl + td[2]?.querySelector("a")?.href,
        publisher: td[4]?.textContent?.replace(/\n/g, "").trim(),
        publicationDate: td[6]?.textContent?.replace(/\n/g, "").trim()
      });
    });
    let exists = arrRet?.length > 0;

    if (!exists) {
      return "";
    }

    return arrRet;

  } catch (err) {
    throw err;
  }
}

async function getBookURLByISBN(isbn, ...args) {
  const searchURL = `${baseUrl}/opac-prod/search/bibliographicSimpleSearchProcess.do?simpleSearch.value=${isbn}&bibliographicLimitQueryBuilder.biblioDocType=BF&simpleSearch.indexFieldId=&command=I&simpleSearch.tokenized=true&classType=0`;
  try {
    const res = await axios.get(searchURL);
    const dom = new JSDOM(res.data);
    const document = dom.window.document;
    let link = document.querySelector("#td2 > a")?.href;
    let exists = link !== undefined;

    if (args.length > 0) {
      let score = 0.0;
      exists = false;
      const arg = clean(args[0]);
      const links = document.querySelectorAll("#td2 > a");
      links.forEach((sel) => {
        const title = clean(sel.textContent);
        //let tmp = stringSimilarity.compareTwoStrings(arg, title);
        //if (tmp > score && (tmp > 0.2 || arg.includes(title))) {
        if (arg.includes(title)) {
          link = sel.href;
          exists = true;
          //score = tmp;
        }
      });
    }

    if (!exists) {
      return "";
    }

    const u = new URL(link, baseUrl);
    const params = new URLSearchParams(u.search);
    if (!params.has("id")) {
      throw new Error(`can't find book id in search page book link ${link}`);
    } else {
      return `${baseUrl}/opac-prod/bibliographic/${params.get("id")}`;
    }
  } catch (err) {
    throw err;
  }
}

module.exports = { searchBooks, getBookURLByISBN, baseUrl };
