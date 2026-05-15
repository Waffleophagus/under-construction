#!/usr/bin/env node
// Downloads under-construction GIFs locally
// Run with: node scripts/download-gifs.mjs

import http from 'http';
import fs from 'fs';
import path from 'path';

const baseUrl = 'http://textfiles.com/underconstruction/';
const targetDir = './public/gifs';

const gifs = [
  'SunsetStripUnderground1358YellowandBlackconstructiontape.gif',
  'CaCapeCanaveral3537construct_line_2.gif',
  'HeHeartlandPrairie6170construct1.gif',
  'CaCapeCanaveralStation2739IconsConstruction-SpinSign.gif',
  'HeHeartlandLake9817Construct3AVI.gif',
  'HeHeartlandGarden5828constructionCaution4.gif',
  'Chamber9602construction2.gif',
  'CaCapeCanaveralStation2739IconsConstructionSign.gif',
  'HeHeartland5384construct_line_bird.gif',
  'HeHeartlandLane6362personalconstructionconst.gif',
  'AtAthensAcademy9957construction_line.gif',
  'HeHeartland3460buttonsConstructani.gif',
  'ArArea51Station9771rulersconstructionconstruction_2.gif',
  'totokyoisland4174underconstruction.gif',
  'SiSiliconValleyHaven8517Gif-Construction-Set.gif',
  'ReResearchTriangleThinktank5966graphicconstruct_line_1.gif',
  'MoMotorCityDowns6390construction.gif',
];

function downloadFile(filename) {
  return new Promise((resolve, reject) => {
    const url = baseUrl + filename;
    const dest = path.join(targetDir, filename);

    if (fs.existsSync(dest)) {
      console.log(`  already exists: ${filename}`);
      resolve(true);
      return;
    }

    const file = fs.createWriteStream(dest);
    http.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            console.log(`  downloaded: ${filename}`);
            resolve(true);
          });
        });
      } else {
        console.error(`  failed (${response.statusCode}): ${filename}`);
        fs.unlink(dest, () => {});
        resolve(false);
      }
    }).on('error', (err) => {
      console.error(`  error: ${filename} - ${err.message}`);
      fs.unlink(dest, () => {});
      resolve(false);
    });
  });
}

(async () => {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Downloading ${gifs.length} GIFs to ${targetDir}...\n`);
  const results = await Promise.all(gifs.map(downloadFile));
  const ok = results.filter(Boolean).length;
  console.log(`\nDone! ${ok}/${gifs.length} files ready.`);
})();
