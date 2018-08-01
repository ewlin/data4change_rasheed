/*
  ID of the google sheet with the stored data
 */
module.exports.SPREADSHEET_ID = '1V-INXvFo918hYdcVTZGTVkLdo9QDCHsc3A9Gx8mgH00';

/*
  Structure of the tabs of the google sheet
 */
module.exports.SHEETS = [
  { index: 0, name: 'questions', cols: ['title', 'text', 'graphics'] },
  { index: 1, name: 'data-vizes', cols: ['title', 'text', 'graphics'] },
];

/*
  Path to the output JSON
 */
module.exports.DATA_PATH = './data/data.json';
