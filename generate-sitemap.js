const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');

const hostname = 'https://www.businessfunding.help';

const walk = function(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.html')) {
      results.push(file);
    }
  });
  return results;
};

const htmlFiles = walk('./').map(file => {
  const relativePath = file.replace(__dirname, '').replace(/\\/g, '/');
  let url = relativePath.replace('/index.html', '/').replace('.html', '');
  url = url.replace('./', '').startsWith('/') ? url : '/' + url;
  return { url };
});

const sitemap = new SitemapStream({ hostname });

htmlFiles.forEach(page => sitemap.write(page));
sitemap.end();

streamToPromise(sitemap).then(sm => {
  fs.writeFileSync('./sitemap.xml', sm.toString());
  console.log('✅ sitemap.xml generated');
});
