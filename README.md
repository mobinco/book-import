# book-import

Getting documents data from http://opac.nlai.ir & https://samanpl.ir

ورود اطلاعات اسناد از سایت کتابشناسی ملی و نرم افزار سامان

برگرفته از https://github.com/ketabchi/melli


# Install
<code>npm install github:mobinco/book-import --save</code>

# Using
Check <code> book_test.js </code>

```js
import { Melli, Saman } from 'book_import';
// or // const { Melli, Saman } = require('book_import');

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
```
