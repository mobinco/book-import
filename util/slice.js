function checkSliceEq(ss1, ss2) {
    if (ss1.length !== ss2.length) {
        return false;
    }
    for (let s1 of ss1) {
        let found = false;
        for (let s2 of ss2) {
            if (s1 === s2) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
    }
    return true;
}

function sliceContains(ss, s) {
    for (let s1 of ss) {
        if (s1 === s) {
            return true;
        }
    }
    return false;
}

function shuffle(ss) {
    for (let i = ss.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ss[i], ss[j]] = [ss[j], ss[i]];
    }
}

module.exports = { checkSliceEq, sliceContains, shuffle };