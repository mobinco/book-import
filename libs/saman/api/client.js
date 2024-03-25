const axios = require('axios');
const https = require('https');

const baseUrl = 'https://samanpl.ir';

// fix ssl certificate error
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // not for production
});
axios.defaults.httpsAgent = httpsAgent;

async function searchBooks(text) {
  const searchURL = `${baseUrl}/LSearch/LSearch/SearchDT_new`;
  try {
    var formData = new URLSearchParams({
      QueryStatement: text,
      Field: 'b200_a',
      OrgType: 10000,
      OrgIdOstan: 10101010
    });
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    const res = await axios.post(searchURL, formData, options);
    const result = res.data;

    let arrRet = [];
    result?.data?.forEach((row) => {
      arrRet.push({
        id: row.RecordNumber,
        type: 'کتاب',
        image: `${baseUrl}/Content/materialIcons/1.png`,
        title: row.Titles?.trim(),
        link: `${baseUrl}/Search/FSearch/GetBookDetailsN/?recordNumber=${row.RecordNumber}`,
        author: row.Creators?.trim(),
        publisher: row.publishercname?.trim(),
        publicationDate: '',
        OriginalData: row
      });
    });

    return arrRet;

  } catch (err) {
    throw err;
  }
}

async function getBookById(id, ...args) {
  const searchURL = `${baseUrl}/Search/FSearch/GetBookDetailsN/?recordNumber=${id}`;
  try {
    const res = await axios.get(searchURL);
    const result = res.data;

    if (!(result instanceof Array) || result.length <= 0) {
      throw new Error(`can't find book id in search page book link ${searchURL}`);
    } else {
      const row = result[0];
      return {
        id: row.RecordNumber,
        name: row.Title,
        author: row.Creator,
        publisher: `${row.MahalNashr}: ${row.Nasher}, ${row.saleNashr}`,
        subject: row.mozoe,
        originalName: row.Title,
        appearance: `${row.TedadSafhe}, ${row.zaher}`,
        price: row.gheymat,
        isbn: row.shabak,
        notes: row.lstYaddashts,
        congress: null,
        dewey: `${row.RadeAsliD}, ${row.RadeFareiD}, ${row.ShomareKaterD}`,
        biblioId: null,
        biblioInfo: null,
        translators: [row.Translator],
        series: row.farvast,
        link: `${baseUrl}/Search/FSearch/GetBookDetailsN/?recordNumber=${row.RecordNumber}`,
        OriginalData: row
      };
    }
  } catch (err) {
    throw err;
  }
}

module.exports = { searchBooks, getBookById, baseUrl };
