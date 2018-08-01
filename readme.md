# Rasheed Quizz


## Requirements

- `node` v8.x or above

- `npm` v3 or above


## Updating data

The data is stored in google sheet (https://docs.google.com/spreadsheets/d/1V-INXvFo918hYdcVTZGTVkLdo9QDCHsc3A9Gx8mgH00/edit#gid=0). You'll need google credentials stored in 'scripts/service-account.json'. Credentials are gitignored
so ask Zdenek (zdenek.hynek@gmail.com) if you need them.


Install dependencies by:

```
cd scripts/
npm install
```

To generate the JSON file with the latest data, run from terminal:

```
node ./scripts/update_data.js
```

which will generate a JSON file in at 'data/data.json'

