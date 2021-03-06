function trim(str) {
  if (!str || !str.length)
      return '';
  var start, end, i;
  for (i = str.length - 1; i >= 0; i--) {
      if (str[i] !== ' ')
          break;
  };
  //all of chars is empty such as ' '
  if (i === -1)
      return '';

  end = i + 1;

  for (i = 0; i < str.length; i++) {
      if (str[i] !== ' ')
          break;
  };
  start = i;
  return str.substring(start, end);
}

function minify(contents) {
  let htmlBuilder = [];
  let inner = false,
      intag = false, //<div> or </div>
      intagin = false, //<% expr %> ... <% for(var a=1; a "<" 5
      inscript = false,
      incss = false;

  let innerTextBuilder = [];
  for (let i = 0; i < contents.length; i++) {
    let charstr = contents[i];
      if (charstr === '<') {

          //maybe [<]div> or [<]/div> or a [<] 5
          if (contents[i + 1] !== '%') {
              //case a <= 5
              if (!intagin) {
                  intag = true;
              }
              inner = true;
          } else {
              //> ... [<]% ...
              if (!inner) {
                  intag = false;
                  inner = true;
                  intagin = true;
              }
          }

          if (inner && innerTextBuilder.length) {
              //debugger;
              let innerTextStr = innerTextBuilder.join('');
              htmlBuilder.push(trim(innerTextStr))
              innerTextBuilder = [];
          }
      }

      if (inner) {
          htmlBuilder.push(charstr);
      } else {
          if (charstr === '\r' || charstr === '\n' || charstr === '\t')
              continue;
          innerTextBuilder.push(charstr);
      }
      //maybe <...div[>] or </div[>] or <% a [>] 5 %> or <div ...  <% a [>] 5 %>[>]
      if (charstr === '>') {
          if (contents[i - 1] !== '%') {
              intag = false;
              inner = false;
          } else {
              if (!intag) {
                  inner = false;
                  intagin = false;
              }
          }
      }
  }
  return htmlBuilder.join('');
}

function unescapeHTML(a) {
  a = '' + a;
  return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

module.exports = {
    escapeEjs: (content) => {
        return content.replace(/<%/g, '<%%').replace(/%>/g, '%%>')
    },
    minify, 
    format: (content, isMinify = true) => {
        if (isMinify) {
            return minify(unescapeHTML(content));
        } else {
            content = content.trim();
        }
        return content;
    }
};