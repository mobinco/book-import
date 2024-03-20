# book-import

Getting documents data from http://opac.nlai.ir & https://samanpl.ir

ورود اطلاعات اسناد از سایت کتابنشاسی ملی و نرم افزار سامان


# Install
<code> npm install github:mobinco/book-import --save </code>

# Using
Check <code> book_test.js </code>.

```
import { Book as Melli } from './libs/melli/index.js';
import { Book as Saman } from './libs/saman/index.js';

var melli = new Melli();
var resMelli = await melli.SearchBook('مبین');
console.log(resMelli);
if (resMelli.length > 0) {
    var m = await melli.NewBook(resMelli[0]?.link);
    console.log(m.All());
}

var saman = new Saman();
var resSaman = await saman.SearchBook('مبین');
console.log(resSaman);
if (resSaman.length > 0) {
    var s = await saman.GetBookById(resSaman[0]?.RecordNumber);
    console.log(s);
}
```
