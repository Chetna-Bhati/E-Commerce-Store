/**
 * Threadline - Real Fashion Photo Downloader
 * Downloads actual fashion photos from Unsplash (free, no API key needed)
 * and saves them as .webp files for each product.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', '..', 'client', 'public', 'images', 'products');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Real Unsplash photo IDs mapped to each product slug
// Format: [slug]: [photoId1, photoId2, photoId3, ...]
const productPhotos = {
  // T-shirts
  'heavyweight-boxy-tee':        ['1521572163474-6864f9cf17ab','1503341455253-b2e723bb3dbb','1583743814966-8936f5b7be1a'],
  'relaxed-pocket-tee':          ['1578681994506-b8e463d1c93d','1562157873-818bc0726f68','1571455786073-20d34aef41c5'],
  'minimal-graphic-tee':         ['1576566588028-4147f3842f27','1503342217-c0f0c5b53e0f','1561044599-cc2e1e9e7cb5'],
  'breton-striped-tee':          ['1529374255404-311a2a4f1fd9','1558618666-fcd25c85cd64','1591369822096-ffc4b89c432a'],
  'classic-pique-polo':          ['1581791538595-8a317ac13bbb','1591076822399-8c2c0b2c0f2b','1598300042247-d088f8ab3a91'],
  'raw-hem-oversized-tee':       ['1604644401890-0596b7e2e6e0','1554568218-96de8d7de3e8','1551028719-00167b16eac5'],

  // Shirts
  'french-linen-blend-shirt':    ['1607345366928-199ea26cfe3e','1598300042247-d088f8ab3a91','1617127365659-c47fa9d70f9f','1602810318383-e386cc2a3ccf'],
  'classic-oxford-button-down':  ['1598300042247-d088f8ab3a91','1607345366928-199ea26cfe3e','1617127365659-c47fa9d70f9f','1602810318383-e386cc2a3ccf'],
  'heavy-flannel-check-shirt':   ['1551232864-3f6cf49f25d0','1568910748155-01ca3b610f4b','1588099768523-f4e6a2a74b77'],
  'overdyed-denim-shirt':        ['1542272604-787c3835535d','1604644401890-0596b7e2e6e0','1604025702664-ed7cfc7abfd8'],
  'camp-collar-resort-shirt':    ['1602810318383-e386cc2a3ccf','1607345366928-199ea26cfe3e','1617127365659-c47fa9d70f9f'],

  // Jeans
  'slim-fit-raw-indigo-jeans':   ['1542272604-787c3835535d','1541099649105-f69ad21f3246','1604025702664-ed7cfc7abfd8','1555689502-c4b22b898ab8'],
  'straight-fit-classic-blue':   ['1541099649105-f69ad21f3246','1542272604-787c3835535d','1604025702664-ed7cfc7abfd8'],
  'relaxed-fit-carpenter-jeans': ['1604025702664-ed7cfc7abfd8','1555689502-c4b22b898ab8','1542272604-787c3835535d'],
  'tapered-fit-jet-black-jeans': ['1555689502-c4b22b898ab8','1541099649105-f69ad21f3246','1604025702664-ed7cfc7abfd8'],
  'light-wash-90s-baggy-jeans':  ['1604025702664-ed7cfc7abfd8','1542272604-787c3835535d','1555689502-c4b22b898ab8'],

  // Trousers
  'tailored-stretch-chinos':     ['1594938298603-e0e1c8a5e8e8','1603217192634-88821af56ab4','1551232864-3f6cf49f25d0','1568910748155-01ca3b610f4b'],
  'multi-pocket-cargo-pants':    ['1609602613889-d80c3b55ec9c','1594938298603-e0e1c8a5e8e8','1603217192634-88821af56ab4'],
  'pleated-formal-trousers':     ['1603217192634-88821af56ab4','1594938298603-e0e1c8a5e8e8','1551232864-3f6cf49f25d0'],
  'french-terry-everyday-joggers':['1618453292459-37e0a5a9e4cc','1609602613889-d80c3b55ec9c','1594938298603-e0e1c8a5e8e8'],
  'lightweight-linen-easy-pants': ['1551232864-3f6cf49f25d0','1568910748155-01ca3b610f4b','1594938298603-e0e1c8a5e8e8'],

  // Jackets and hoodies
  'trucker-denim-jacket':        ['1611312449408-fcedd27de839','1544022613-e87e68e6c5b7','1591047139829-d91aecb6caea','1520975916090-8f74af5b434a'],
  'ma-1-flight-bomber-jacket':   ['1544022613-e87e68e6c5b7','1611312449408-fcedd27de839','1591047139829-d91aecb6caea'],
  'heavyweight-pullover-hoodie': ['1556821840-b9b4bc4f3bfa','1618453292459-37e0a5a9e4cc','1609602613889-d80c3b55ec9c'],
  'full-zip-track-windcheater':  ['1518611012118-696072aa579a','1556821840-b9b4bc4f3bfa','1618453292459-37e0a5a9e4cc'],
  'minimalist-zip-up-hoodie':    ['1618453292459-37e0a5a9e4cc','1556821840-b9b4bc4f3bfa','1609602613889-d80c3b55ec9c'],

  // Dresses and kurtas
  'tiered-cotton-midi-dress':    ['1572804013309-59a88b7e92f1','1585487000160-6a26a25e2c79','1515886657613-9f3515b0c78f'],
  'belted-utility-shirt-dress':  ['1585487000160-6a26a25e2c79','1572804013309-59a88b7e92f1','1515886657613-9f3515b0c78f'],
  'handblock-print-cotton-kurta':['1583391099995-9bca5cee7ff7','1610030469983-98e550d6193c','1609102934170-0b40e4c79d73','1583391099995-9bca5cee7ff7'],
  'short-mandarin-collar-kurta': ['1610030469983-98e550d6193c','1609102934170-0b40e4c79d73','1583391099995-9bca5cee7ff7'],
  'a-line-button-front-dress':   ['1515886657613-9f3515b0c78f','1572804013309-59a88b7e92f1','1585487000160-6a26a25e2c79'],

  // Shoes
  'low-top-canvas-sneakers':     ['1542291026-7eec264c27ff','1605348532760-6753d2c43329','1600269452121-4f2416e55c28'],
  'everyday-knit-running-shoes': ['1538805060514-3f67e388a7e7','1542291026-7eec264c27ff','1605348532760-6753d2c43329'],
  'suede-penny-loafers':         ['1543163521-1bf539c55dd2','1542291026-7eec264c27ff','1605348532760-6753d2c43329'],
  'moulded-comfort-slides':      ['1603487742131-4160ec999306','1543163521-1bf539c55dd2','1542291026-7eec264c27ff'],

  // Accessories
  '6-panel-twill-baseball-cap':  ['1588850561407-ed78c73e770f','1521369909449-4e5825f5dc10','1534215754734-18e55d13e346'],
  'minimalist-canvas-backpack':  ['1553062407-98eeb64c6a62','1491553895911-0055eca6402d','1547949003-9792a18a2841'],
  'minimal-bauhaus-analog-watch':['1523275335684-37898b6baf30','1548169874-53a1de804d49','1547996160-2a5ed99abb3e'],
  'full-grain-leather-belt':     ['1553062407-98eeb64c6a62','1588850561407-ed78c73e770f','1521369909449-4e5825f5dc10'],
  'polarized-acetate-sunglasses':['1473496169904-ecb96f571563','1511499767772-6d369cc0b2d5','1528995604071-c3de1a1f5a75'],
};

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        file.close();
        downloadImage(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(destPath, () => {});
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadAll() {
  let done = 0;
  let failed = 0;
  const total = Object.values(productPhotos).reduce((sum, arr) => sum + arr.length, 0);

  console.log(`Downloading ${total} real fashion photos from Unsplash...`);
  console.log('This may take 1-2 minutes depending on your internet speed.\n');

  for (const [slug, photoIds] of Object.entries(productPhotos)) {
    for (let i = 0; i < photoIds.length; i++) {
      const photoId = photoIds[i];
      const filename = `${slug}-${i + 1}.webp`;
      const destPath = path.join(targetDir, filename);
      // Also write for .svg path (keep SVG as fallback)
      const svgPath = path.join(targetDir, `${slug}-${i + 1}.svg`);

      const url = `https://images.unsplash.com/photo-${photoId}?w=800&h=1000&fit=crop&crop=center&auto=format&q=80&fm=jpg`;

      try {
        process.stdout.write(`  [${done + 1}/${total}] ${filename}...`);
        await downloadImage(url, destPath);
        // Remove old SVG placeholder (keep as copy of real image)
        fs.copyFileSync(destPath, svgPath);
        console.log(' ✓');
        done++;
      } catch (err) {
        console.log(` ✗ (${err.message})`);
        failed++;
      }

      // Small delay to be polite to Unsplash CDN
      await sleep(100);
    }
  }

  console.log(`\nCompleted! ${done} images downloaded, ${failed} failed.`);
  console.log(`Images saved to: ${targetDir}`);
  if (failed > 0) {
    console.log('Failed images will still show the SVG placeholders as fallback.');
  }
}

downloadAll();
