/*
  ID of the google sheet with the stored data
 */
module.exports.SPREADSHEET_ID = '1V-INXvFo918hYdcVTZGTVkLdo9QDCHsc3A9Gx8mgH00';

/*
  Structure of the tabs of the google sheet
 */
module.exports.SHEETS = [
  { index: 0, type: 'object', name: 'quizz', cols: ['title'] },
  { index: 1, type: 'array', name: 'questions', cols: ['text', 'icon', 'color', 'type', 'placeholder'] },
  { index: 2, type: 'array', name: 'data-vizes', cols: ['title', 'text', 'image'] },
  { index: 3, type: 'object', name: 'about', cols: ['title', 'text', 'subtitle',  'CTA', 'image'] },
  { index: 4, type: 'array', name: 'form', cols: ['question', 'placeholder', 'type', 'isrequired', 'data'] },
];

/*
  Path to the output JSON
 */
module.exports.DATA_PATH = './data/data.json';
