const { Melli, Saman, Congress } = require('./index.js');
const { checkSliceEq } = require('./util/slice.js');

const test = async () => {
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
}

test();

//await TestName();

async function TestName(t) {
    const tests = [
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/636958",
            exp: "سمفونی مردگان"
        },
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/3399286",
            exp: "شغل مناسب شما: با توجه به ویژگی\u200cهای شخصیتی خود کارتان را انتخاب کنید..."
        },
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/5030326",
            exp: "مدیریت اجرایی (For Dummies (MBA"
        },
    ];
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        const book = await melli.NewBook(test.url);
        const err = null;
        if (err !== null) {
            console.error("Test %d: Error on creating book from %s: %s", i, test.url, err);
        }
        const name = book.Name();
        if (name !== test.exp) {
            console.log("\n%q\n%q", test.exp, name);
            console.error("Test %d: Expected book name '%s', but got '%s'", i, test.exp, name);
        }
        console.log(book.All());
    }
}

function TestPublisher(t) {
    const tests = [
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/636958",
            exp: "ققنوس"
        },
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/3399286",
            exp: "نقش و نگار"
        },
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/5030326",
            exp: "آوند دانش"
        },
    ];
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        const book = melli.NewBook(test.url);
        const err = null;
        if (err !== null) {
            console.error("Test %d: Error on creating book from %s: %s", i, test.url, err);
        }
        const name = book.Publisher();
        if (name !== test.exp) {
            console.log("\n%q\n%q", test.exp, name);
            console.error("Test %d: Expected publisher name '%s', but got '%s'", i, test.exp, name);
        }
    }
}

function TestAuthor(t) {
    const tests = [
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/5309538",
            faName: "گری نورثفیلد",
            enName: "Gary Northfield"
        },
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/4929459",
            faName: "ریک ریوردان",
            enName: "Rick Riordan"
        },
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/3649724",
            faName: "عفت\u200cالسادات مرقاتی خویی",
            enName: ""
        },
    ];
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        const book = melli.NewBook(test.url);
        const err = null;
        if (err !== null) {
            console.error("Test %d: Error on creating book from %s: %s", i, test.url, err);
        }
        const [faName, enName] = book.Author();
        if (faName !== test.faName) {
            console.log("\n%q\n%q", test.faName, faName);
            console.error("Test %d: Expected author faName '%s', but got '%s'", i, test.faName, faName);
        }
        if (enName !== test.enName) {
            console.log("\n%q\n%q", test.enName, enName);
            console.error("Test %d: Expected author enName '%s', but got '%s'", i, test.enName, enName);
        }
    }
}

function TestOriginalName(t) {
    const tests = [
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/5265395",
            exp: "The paradox of choice: why more is less"
        },
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/5363581",
            exp: "Lying"
        },
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/2072242",
            exp: "Diary of a wimpy kid: Greg Heffley’s journal"
        },
    ];
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        const book = melli.NewBook(test.url);
        const err = null;
        if (err !== null) {
            console.error("Test %d: Error on creating book from %s: %s", i, test.url, err);
        }
        const name = book.OriginalName();
        if (name !== test.exp) {
            console.log("\n%q\n%q", test.exp, name);
            console.error("Test %d: Expected original name '%s', but got '%s'", i, test.exp, name);
        }
    }
}

function TestTranslator(t) {
    const tests = [
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/5483716",
            exp: ["ارسلان فصیحی"]
        },
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/3125961",
            exp: ["محمدرضا طبیب\u200cزاده"]
        },
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/5174229",
            exp: []
        },
    ];
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        const book = melli.NewBook(test.url);
        const err = null;
        if (err !== null) {
            console.error("Test %d: Error on creating book from %s: %s", i, test.url, err);
        }
        const translators = book.Translators();
        if (!checkSliceEq(translators, test.exp)) {
            console.error("Test %d: Expected translators %q, but got %q", i, test.exp, translators);
        }
    }
}

function TestSerie(t) {
    const tests = [
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/5438339",
            exp: []
        },
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/4914535",
            exp: ["پرسی جکسون"]
        },
        {
            url: "http://opac.nlai.ir/opac-prod/bibliographic/4573407",
            exp: ["رمان نوجوان", "قهرمانان المپ"]
        },
    ];
    for (let i = 0; i < tests.length; i++) {
        const test = tests[i];
        const book = melli.NewBook(test.url);
        const err = null;
        if (err !== null) {
            console.error("Test %d: Error on creating book from %s: %s", i, test.url, err);
        }
        const series = book.Series();
        if (!checkSliceEq(series, test.exp)) {
            console.error("Test %d: Expected series %q, but got %q", i, test.exp, series);
        }
    }
}
