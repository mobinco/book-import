const api = require('./api/client.js');

// errors
const ErrNoBook           = "no book found";

module.exports = class Congress {
  constructor(url, doc) {
    this.url = url;
    this.doc = doc;
  }

  async SearchBook(text) {
    const result = await api.searchBooks(text);
    if (!result) {
      //throw new Error(ErrNoBook);
      return console.error(ErrNoBook);
    }
    
    return result;
  }

  async GetBookById(id, ...args) {
    const res = await api.getBookById(id, ...args);
    if (!res) {
      //throw new Error(ErrNoBook);
      return console.error(ErrNoBook);
    }
    
    return res;
  }
}
