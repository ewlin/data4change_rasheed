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
function getSheetData(sheet, type, columns) {
  return new Promise((resolve, reject) => {
    sheet.getRows({ offset: 1 }, function(err, rows) {
      if (err) {
        reject(err);
      }

      let data = {};
      if (type === 'array') {
        data = rows.map((row) => {
          return createRowObject(row, columns);
        });
      } else if (type === 'object') {
        if (rows.length) {
          data = createRowObject(rows[0], columns);
        }
      }

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
    const { index, type, cols } = SHEET;
    return getSheetData(sheetData.worksheets[index], type, cols);
  });

  Promise.all(promises)
    .then((data) => {
      //  map data to final format
      console.log('reduce');
      const formattedData = SHEETS.reduce((acc, SHEET, i) => {
        acc[SHEET.name] = data[i];
        return acc;
      }, {});

      console.log('formattedData');
      console.log(formattedData);

      return Promise.resolve(formattedData);
    })
    .then((arr) => {
      writeJson(DATA_PATH, arr);
    });
}

updateData().catch(console.log);
