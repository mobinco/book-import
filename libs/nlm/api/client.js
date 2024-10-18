const axios = require('axios');
const https = require('https');

const baseUrl = 'https://catalog.nlm.nih.gov/primaws/rest/pub/pnxs';

// fix ssl certificate error
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // not for production
});
axios.defaults.httpsAgent = httpsAgent;

async function searchBooks(text) {
  const searchURL = `${baseUrl}?acTriggered=false&blendFacetsSeparately=false&citationTrailFilterByAvailability=true&disableCache=false&getMore=0&inst=01NLM_INST&isCDSearch=false&lang=en&limit=100&newspapersActive=false&newspapersSearch=false&offset=0&otbRanking=false&pcAvailability=true&q=any,contains,${text},AND;rtype,exact,books&qExclude=&qInclude=&rapido=false&refEntryActive=false&rtaLinks=true&scope=MyInstitution&searchInFulltextUserSelection=true&skipDelivery=Y&sort=rank&tab=LibraryCatalog&vid=01NLM_INST:01NLM_INST`;
  try {
    const res = await axios.get(searchURL);
    const result = res.data?.docs;

    let arrRet = [];
    result?.forEach((doc) => {
      const row = doc?.pnx?.display;
      const id = doc?.pnx?.control?.recordid[0];
      arrRet.push({
        id: id || null,
        type: row.type[0] || null,
        image: null,
        title: row.title[0],
        link: id,
        author: row.contributor ? row.contributor[0] : null,
        publisher: row.publisher[0] || null,
        publicationDate: row.creationdate[0],
        subject: '',
        OriginalData: row
      });
    });

    return arrRet;

  } catch (err) {
    throw err;
  }
}

async function getBookById(id, ...args) {
  const searchURL = `${baseUrl}/L/${id}?vid=01NLM_INST:01NLM_INST&lang=en&search_scope=MyInstitution&adaptor=Local%20Search%20Engine&lang=en`;
  try {
    const res = await axios.get(searchURL);
    const pnx = res?.data?.pnx;
    const row = pnx?.display;
    const addata = pnx?.addata;
    const id = pnx?.control?.recordid[0];

    if (!pnx) {
      throw new Error(`can't find book id in search page book link ${searchURL}`);
    } else {
      return {
        id: id || null,
        name: row.title[0],
        names: row.title?.slice(1),
        language: row.language[0],
        author: row.creator ? row.creator[0] : null,
        authors: row.creator?.slice(1) || [],
        publisher: addata?.pub[0] || null,
        publicationPlace: addata?.cop[0] || null,
        publicationDate: row.creationdate[0],
        subject: row.mesh ? row.mesh[0] : null,
        subjects: row.mesh?.slice(1),
        addTitle: row.addtitle[0],
        appearance: row.format[0],
        price: null,
        isbn: null,
        notes: addata?.notes,
        congress: addata.lccn[0],
        dewey: null,
        biblioId: null,
        biblioInfo: null,
        series: null,
        link: `https://catalog.nlm.nih.gov/permalink/01NLM_INST/1o1phhn/${id}`,
        OriginalData: pnx
      };
    }
  } catch (err) {
    throw err;
  }
}

module.exports = { searchBooks, getBookById, baseUrl };
