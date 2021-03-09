var utilRequst = require('./src/lib/utilRequest.js')

let obj1 = null
utilRequst.urlGetJson('http://json-schema.org/draft-07/schema#', jsonResponse => {
  obj1 = jsonResponse
  console.log('Got response ' + JSON.stringify(obj1))
})

let obj2 = null
utilRequst.urlGetJson('https://openweathermap.org/data/2.5/onecall?lat=35.6895&lon=139.6917&units=metric&appid=439d4b804bc8187953eb36d2a8c26a02', jsonResponse => {
  obj2 = jsonResponse
  console.log('Got response ' + JSON.stringify(obj2))
})
