const fs = require('fs');
const GoogleSpreadsheet = require('google-spreadsheet')
const { promisify } = require('util')

const credentials = require(`./service-account.json`)
const { SPREADSHEET_ID, SHEETS, DATA_PATH } = require('./config');

function writeJson(file, data) {
  const jsonData = JSON.stringify(data);
  fs.writeFileSync(file, jsonData);
}

function createRowObject(data, columns) {
  return columns.reduce((acc, col) => {
    acc[col] = data[col];
    return acc;
  }, {});
}

/*
  Fetch sheet data and format it
 */
function getSheetData(sheet, name, columns) {
  return new Promise((resolve, reject) => {
    sheet.getRows({ offset: 1 }, function(err, rows) {
      if (err) {
        reject(err);
      }

      const data = rows.reduce((acc, row) => {
        acc[name] = createRowObject(row, columns);
        return acc;
      }, {});
      resolve(data);
    });
  });
}

/*
  Connect to google sheets
 */
async function connectToGoogleSheets(googleSheetId) {
  const doc = new GoogleSpreadsheet(googleSheetId);
  await promisify(doc.useServiceAccountAuth)(credentials);

  const sheetData = await promisify(doc.getInfo)();
  return sheetData;
}

/*
  Main scripts which:

  1. Connects to google sheet
  2. Formats fetch data
  3. Outputs formatted data into a json file stored at 'data/data.json'
 */
async function updateData() {
  const sheetData = await connectToGoogleSheets(SPREADSHEET_ID);

  //  create all promises to fetch data from all the sheets
  const promises = SHEETS.map((SHEET) => {
    const { index, name, cols } = SHEET;
    return getSheetData(sheetData.worksheets[index], name, cols);
  });

  Promise.all(promises)
    .then((arr) => {
      writeJson(DATA_PATH, arr);
    });
}

updateData();
