const fs = require('fs');
const GoogleSpreadsheet = require('google-spreadsheet')
const { promisify } = require('util')

const credentials = require(`./service-account.json`)

const SHEETS = [
  { index: 0, name: 'questions', cols: ['title', 'text', 'graphics'] },
  { index: 1, name: 'data-vizes', cols: ['title', 'text', 'graphics'] },
];
const DATA_PATH = './data/data.json';

function writeJson(file, data) {
  console.log('writeJson', file);
  const jsonData = JSON.stringify(data);
  fs.writeFileSync(file, jsonData);
}

function getSheetData(sheet, columns) {
  return new Promise((resolve, reject) => {
    sheet.getRows({ offset: 1 }, function(err, rows) {
      if (err) {
        reject(err);
      }

      const data = rows.map((row) => {
        return columns.reduce((acc, col) => {
          acc[col] = row[col];
          return acc;
        }, {});
      });

      resolve(data);
    });
  });
}

const SPREADSHEET_ID = '1V-INXvFo918hYdcVTZGTVkLdo9QDCHsc3A9Gx8mgH00';
async function accessSpreadsheet() {
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
  await promisify(doc.useServiceAccountAuth)(credentials);

  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[0];

  //  create all promises to fetch data from all the sheets
  const promises = SHEETS.map((sheet) => {
    return getSheetData(info.worksheets[sheet.index], sheet.cols);
  });

  Promise.all(promises)
    .then((arr) => {
      console.log('arr', arr);
      writeJson(DATA_PATH, arr);
    });
}

accessSpreadsheet();
