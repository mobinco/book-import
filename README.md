# book-import

Getting documents data from http://opac.nlai.ir | https://samanpl.ir | https://www.loc.gov | https://nlm.nih.gov

ورود اطلاعات اسناد از سایت کتابشناسی ملی، سامانه‌ی کتابخانه‌های عمومی، کتابخانه‌ی کنگره و کتابخانه‌ی ملی پزشکی

طرح اولیه از https://github.com/ketabchi/melli


# Install
<code>npm install github:mobinco/book-import --save</code>

# Using
Check <code> book_test.js </code>

```js
import { Melli, Saman, Congress, Nlm } from 'book_import';
// or // const { Melli, Saman, Congress, Nlm } = require('book_import');

var melli = new Melli();
var resMelli = await melli.SearchBook('مبین');
console.log(resMelli);
if (resMelli.length > 0) {
    var m = await melli.GetBookById(resMelli[0]?.id);
    console.log(m);
}

var saman = new Saman();
var resSaman = await saman.SearchBook('مبین');
console.log(resSaman);
if (resSaman.length > 0) {
    var s = await saman.GetBookById(resSaman[0]?.id);
    console.log(s);
}

var congress = new Congress();
var resCongress = await congress.SearchBook('مبین');
console.log(resCongress);
if (resCongress.length > 0) {
    var s = await congress.GetBookById(resCongress[0]?.id);
    console.log(s);
}

var nlm = new Nlm();
var resNlm = await nlm.SearchBook('Child');
console.log(resNlm);
if (resNlm.length > 0) {
    var s = await nlm.GetBookById(resNlm[0]?.id);
    console.log(s);
}
```
