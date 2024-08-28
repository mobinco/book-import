const axios = require('axios');
const https = require('https');

const baseUrl = 'https://www.loc.gov';

// fix ssl certificate error
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // not for production
});
axios.defaults.httpsAgent = httpsAgent;

async function searchBooks(text) {
  const searchURL = `${baseUrl}/books/?q=${text}&fo=json&at=results`;
  try {
    const res = await axios.get(searchURL);
    const result = res.data?.results;

    let arrRet = [];
    result?.forEach((row) => {
      arrRet.push({
        id: row.number_lccn[0] || null,
        type: row.original_format[0] || null,
        image: row.image_url ? row.image_url[0] : null,
        title: row.title,
        link: `https:${row.url}`,
        author: row.contributor ? row.contributor[0] : null,
        publisher: row.item?.created_published[0] || null,
        publicationDate: row.date,
        subject: row.subject?.join(', '),
        OriginalData: row
      });
    });

    return arrRet;

  } catch (err) {
    throw err;
  }
}

async function getBookById(id, ...args) {
  const searchURL = `${baseUrl}/item/${id}/?fo=json&at=item`;
  try {
    const res = await axios.get(searchURL);
    const row = res?.data?.item;

    if (!row) {
      throw new Error(`can't find book id in search page book link ${searchURL}`);
    } else {
      return {
        id: row.number_lccn[0] || null,
        name: row.title,
        names: row.other_title,
        language: row.languages,
        author: row.contributor_names ? row.contributor_names[0] : null,
        authors: row.contributor_names,
        publisher: getPublisher(row.created_published[0])[1] || null,
        publicationPlace: getPublisher(row.created_published[0])[0] || null,
        publicationDate: row.date,
        subject: row.subject ? row.subject[0] : null,
        subjects: row.subject,
        originalName: row.title,
        appearance: row.medium,
        price: null,
        isbn: null,
        notes: row.notes,
        congress: row.shelf_id,
        dewey: null,
        biblioId: null,
        biblioInfo: null,
        series: null,
        link: `https:${row.url}`,
        OriginalData: row
      };
    }
  } catch (err) {
    throw err;
  }
}

function getPublisher(strPublished) {
  let arrRet = [];
  let arrPub = strPublished?.split(': ');
  if (arrPub?.length > 1) {
    // if has ":"
    arrRet[0] = arrPub[0]?.trim();
    if (arrPub.length > 1) arrRet[1] = arrPub[1]?.split(',')[0]?.trim();
  } else {
    // if has ","
    arrPub = strPublished?.split(', ');
    if (arrPub?.length >= 3 && arrPub[2]?.replace(/\./g, '')?.trim() != parseInt(arrPub[2]?.trim())) {
      arrRet[0] = arrPub[0]?.trim() + ', ' + arrPub[1]?.trim();
      arrRet[1] = arrPub[2]?.split('[')[0]?.trim();
    } else if (arrPub?.length >= 2) {
      arrRet[0] = arrPub[0]?.trim();
      arrRet[1] = arrPub[1]?.trim();
    } else {
      arrRet[0] = arrPub[0]?.trim();
      arrRet[1] = '';
    }
  }

  return arrRet;
}

module.exports = { searchBooks, getBookById, baseUrl };
