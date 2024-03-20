import axios from 'axios';
import https from 'https';

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

    return result;

  } catch (err) {
    throw err;
  }
}

async function getBookById(id, ...args) {
  const searchURL = `${baseUrl}/Search/FSearch/GetBookDetailsN/?recordNumber=${id}`;
  try {
    const res = await axios.get(searchURL);
    const result = res.data;

    if (result.length <= 0) {
      throw new Error(`can't find book id in search page book link ${link}`);
    } else {
      return result;
    }
  } catch (err) {
    throw err;
  }
}

export default { searchBooks, getBookById, baseUrl };
