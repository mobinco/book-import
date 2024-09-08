const axios = require('axios');
const cheerio = require('cheerio');
const util = require('../../util/string.js');
const api = require('./api/client.js');

// variables
const reTranslators       = new RegExp('(?:(?:[\\[\\(])?(?:\\s)?(?:ترجمه(?:(?:\\x{200c})+ی)?|مترجم(?:ان|ین)?)(?: \\[?و (?:[\\[\\(])?(?:تنظیم|گردآوری|گردآورنده|سرپرستی|تدوین|تالیف|انطباق فرهنگی|ویرایش|بومی\\x{200c}سازی|ترانه\\x{200c}سرا|ترانه سرا|شعرهای|انتخاب|نگارش|ویراستار|بازآفرینی|بررسی|تحقیق|شرح)(?:[\\]\\)])?)?(?:\\s)?(?:[\\]\\)])?)(.+?)(?:؛|\\.|\\]|$)', '')
const reCleanPubDate      = new RegExp('(\\[.*\\]|[,.]\\s?c?\\[?\\d{4}\\]?.?$)', '');
const reCleanDoubleColon  = new RegExp(':[\\s\\x{200f}\\x{202b}]+:', '');
const reSerie             = new RegExp('[^\\.]+؛[۰-۹\\s]+', '');
const reNumber            = new RegExp('[0-9۰-۹]', '');
// errors
const ErrNoBook           = "no book found";

module.exports = class Melli {
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

  async NewBook(url) {
    const res = await axios.get(url);
    const doc = cheerio.load(await res.data);
    return new Melli(url, doc);
  }

  async NewBookByISBN(isbn, ...args) {
    const url = await api.getBookURLByISBN(isbn, ...args);
    if (!url) {
      //throw new Error(ErrNoBook);
      return console.error(ErrNoBook);
    }
    const res = await axios.get(url);
    const doc = cheerio.load(await res.data);
    return new Melli(url, doc);
  }

  async GetBookById(id) {
    const res = await api.getBookById(id);
    const doc = cheerio.load(await res.data);
    const melli = new Melli('', doc);
    return melli.All();
  }

  All = () => {
    return {
      name: this.Name(),
      author: this.Author(),
      publisher: this.Publisher(),
      publicationPlace: this.PublicationPlace(),
      publicationDate: this.PublicationDate(),
      subject: this.Subject(),
      originalName: this.OriginalName(),
      appearance: this.Appearance(),
      price: this.Price(),
      isbn: this.ISBN(),
      notes: this.Notes(),
      congress: this.Congress(),
      dewey: this.Dewey(),
      biblioId: this.BiblioId(),
      biblioInfo: this.BiblioInfo(),
      translators: this.Translators(),
      series: this.Series(),
      link: this.Link()
    };
  }

  Name = () => {
    const text = this.getField("\u200fعنوان و نام پديدآور");
    if (text) {
      return this.nameFromField(text);
    }
    return "";
  }

  nameFromField(text) {
    const splitted = text.split("/");
    let name = splitted[0].replace("[کتاب]", "").trim();
    name = util.clean(name);
    return name;
  }

  Publisher() {
    const text = this.getField("\u200fمشخصات نشر");
    if (text) {
      const pub = this.publisherFromField(text);
      return pub[0];
    }
    return "";
  }

  PublicationPlace() {
    const text = this.getField("\u200fمشخصات نشر");
    if (text) {
      const pub = this.publisherFromField(text);
      return pub[1];
    }
    return "";
  }

  PublicationDate() {
    const text = this.getField("\u200fمشخصات نشر");
    if (text) {
      const pub = this.publisherFromField(text);
      return pub[2]?.trim()?.replace(/\.|‬/g, '');
    }
    return "";
  }

  publisherFromField(text) {
    text = text.replace(/٬/g, "،");
    text = text.replace(/؛/g, "،");
    text = text.replace(/:[\s\x{200f}\x{202b}]+:/g, ":");
    let splitted1 = text.split(":");
    if (splitted1.length < 2) {
      return [splitted1[0], '', ''];
    }
    let splitted2 = splitted1[1].split("،");
    const spl2len = splitted2.length;
    if (spl2len === 1) {
      return [splitted2[0], splitted1[0], ''];
    }
    let name = util.clean(splitted2[spl2len <= 2 ? 0 : 1]);
    name = name.replace(/^نشر /, "");
    name = name.replace(/^انتشارات /, "");
    return [name, splitted1[0] + (spl2len > 2 ? ':' + splitted2[0] : ''), splitted2[spl2len - 1]];
  }

  Author() {
    let text = this.getField("\u200fسرشناسه");
    if (text) {
      const splitted = text.split("\n");
      const faName = this.authorFromField(splitted[0]);
      let enName = "";
      if (splitted.length > 1) {
        enName = this.authorEnFromField(splitted[1]);
      }
      if (faName || enName) return [faName, enName];
    }
    text = this.getField("\u200fعنوان و نام پديدآور");
    if (text) {
      const splitted = text.split("/");
      let author = util.clean(splitted[1]?.trim());
      return [author, ""];
    }
    return ["", ""];
  }

  authorFromField(text) {
    text = text.replace(/٬/g, "،");
    text = text.replace(/؛/g, "،");
    const splitted = text.split("،");
    return this.authorFullName(splitted);
  }

  authorEnFromField(text) {
    const splitted = text.split(",");
    return this.authorFullName(splitted);
  }

  authorFullName(splitted) {
    if (splitted.length < 2) {
      return "";
    }
    let fn = util.clean(splitted[1]);
    if (reNumber.test(fn)) {
      fn = "";
    }
    let ln = util.clean(splitted[0]);
    if (reNumber.test(ln)) {
      ln = "";
    }
    let name = `${fn} ${ln}`;
    name = name.trim();
    return name;
  }

  Subject() {
    let text = this.getField("\u200fموضوع");
    if (text) {
      text = text.trim().split("\n");
      return text;
    }
    return "";
  }

  OriginalName() {
    let text = this.getField("\u200fيادداشت");
    if (text) {
      if (!text.includes("عنوان اصلی:")) {
        return "";
      }
      text = text.replace("عنوان اصلی:", "");
      text = util.clean(text);
      text = text.replace(/\u202d/g, "");
      text = text.replace(/\u200e/g, "");
      text = text.replace(reCleanPubDate, "");
      text = text.replace(/,/g, "");
      const name = text.trim(".[] ");
      return name;
    }
    return "";
  }

  Appearance() {
    let text = this.getField("\u200fمشخصات ظاهری");
    if (text) {
      text = util.clean(text);
      return text;
    }
    return "";
  }

  Price() {
    let text = this.getField("\u200fشابک");
    if (text) {
      const splitted = text.split(":");
      text = util.clean(splitted[0]);
      return text;
    }
    return "";
  }

  Notes() {
    let arrTexts = this.getFields("\u200fيادداشت");
    let arrNotes = [];
    arrTexts.forEach((text) => {
      if (text) {
        text = text.replace("\u200fيادداشت", "");
        text = util.clean(text);
        arrNotes.push(text);
      }
    });
    
    return arrNotes;
  }

  Congress() {
    let text = this.getField("\u200fرده بندی کنگره");
    if (text) {
      text = util.clean(text);
      return text;
    }
    return "";
  }

  Dewey() {
    let text = this.getField("\u200fرده بندی دیویی");
    if (text) {
      text = util.clean(text);
      return text;
    }
    return "";
  }

  BiblioId() {
    let text = this.getField("\u200fشماره کتابشناسی ملی");
    if (text) {
      text = util.clean(text);
      return text;
    }
    return "";
  }

  BiblioInfo() {
    let text = this.getField("\u200fاطلاعات رکورد کتابشناسی");
    if (text) {
      text = util.clean(text);
      return text;
    }
    return "";
  }

  Translators() {
    const text = this.getField("\u200fعنوان و نام پديدآور");
    if (text) {
      return this.translatorsFromField(text);
    }
    return [];
  }

  translatorsFromField(text) {
    let ss = text.split("/");
    text = ss[ss.length - 1];
    text = util.clean(text);
    const translators = [];
    ss = reTranslators.exec(text);
    if (ss?.length < 2) {
      return translators;
    }
    text = text.replace(/ و /g, "،");
    text = text.replace(/٬/g, "،");
    text = text.replace(/؛/g, "،");
    ss = text.split("،");
    for (const s of ss) {
      const cleaned = util.clean(s);
      if (cleaned.length !== 0 && !cleaned.includes("[") && !cleaned.includes("]")) {
        translators.push(cleaned);
      }
    }
    return translators;
  }

  ISBN() {
    const text = this.getField("\u200fشابک");
    if (text) {
      let ret = "";
      const splitted = text.split("؛");
      splitted.forEach((s) => {
        const ss = s.split(":");
        if (ss.length > 1) ret += ss[1].trim() + ",";
      });
      return ret.replace(/,$/,"");
    }
    return "";
  }

  isbnFromField(text) {
    return text.replace(/-/g, "");
  }

  Link() {
    /*
    // first method by biblioId
    const biblioId = this.BiblioId()?.replace(/([۰-۹])/g, token => String.fromCharCode(token.charCodeAt(0) - 1728));
    if (biblioId) return `${api.baseUrl}/opac-prod/bibliographic/${biblioId}`;
    */
    let ret = "";
    const $ = cheerio.load('<html>');
    this.doc("td").each((i, sel) => {
      if ($(sel).text().indexOf("آدرس ثابت") >= 0 && $(sel).text().length < 100) {
        ret = $(sel).next()?.find('a')?.first()?.attr('href');
        return false;
      }
      return true;
    });
    return ret || this.url;
  }

  Series() {
    const text = this.getField("\u200fفروست");
    if (text) {
      return this.seriesFromField(text);
    }
    return [];
  }

  seriesFromField(text) {
    const series = [];
    const ss = text.match(reSerie);
    if (ss?.length === 0) {
      ss.push(text);
    }
    ss?.forEach((ss1) => {
      const ss2 = ss1.split("؛");
      let s = ss2[0];
      s = s.trim();
      s = s.replace(/\n/g, " ");
      s = util.clean(s);
      series.push(s.trim("."));
    });
    return series;
  }

  getField(key) {
    let ret = "";
    const $ = cheerio.load('<html>');
    this.doc("td").each((i, sel) => {
      if ($(sel).text()?.replace(/\s\s+/g, ' ') === key) {
        ret = $(sel)?.next()?.next()?.text();
        return false;
      }
      return true;
    });
    return ret;
  }
  
  getFields(key) {
    let arrRet = [];
    const $ = cheerio.load('<html>');
    this.doc("td").each((i, sel) => {
      if ($(sel).text()?.replace(/\s\s+/g, ' ') === key) {
        arrRet.push($(sel)?.next()?.next()?.text());
      }
    });
    return arrRet;
  }
}


