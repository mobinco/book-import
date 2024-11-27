function filter(char) {
  const code = char.charCodeAt(0);
  switch (code) {
    case 8205:
    case 8207:
    case 8235:
    case 8236:
    case 8238:
      return '';
    default:
      return char;
  }
}

function clean(s) {
  s = s?.split('')?.map(filter)?.join('');
  s = s?.replace(/\u200C /g, " ");
  s = s?.replace(/ : /g, ": ");
  s = s?.replace(/ \.\.\./g, "...");
  
  s = s?.replace(/  /g, " ");
  
  s = s?.replace(/\u200c\u200c/g, "\u200c");

  s = s?.replace(/\u200E|\u202C/g, "");

  if (s?.endsWith('\u200C')) {
    s = s?.substring(0, s.length - 1);
  }
  if (s?.endsWith('\u202D')) {
    s = s?.substring(0, s.length - 1);
  }
  return s?.trim();
}

function isNumber(n) {
  return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
}

module.exports = { filter, clean, isNumber };