const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');

const hostname = 'https://www.businessfunding.help';

// Recursively walk through all directories to find HTML files
const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
};

// Get all HTML files relative to project root
const htmlFiles = walk('./')
  .filter(f => !f.includes('node_modules')) // ignore node_modules
  .map((filePath) => {
    const relative = path.relative('./', filePath).replace(/\\/g, '/');
    let url = '/' + relative.replace(/index\.html$/, '').replace(/\.html$/, '');
    if (url !== '/' && url.endsWith('/')) url = url.slice(0, -1); // remove trailing slash unless root
    return { url };
  });

const sitemap = new SitemapStream({ hostname });

// Write URLs to the sitemap stream
htmlFiles.forEach(page => sitemap.write(page));
sitemap.end();

streamToPromise(sitemap).then(sm => {
  fs.writeFileSync('./sitemap.xml', sm.toString());
  console.log('✅ sitemap.xml generated');
}).catch(err => {
  console.error('❌ Error generating sitemap:', err);
});
