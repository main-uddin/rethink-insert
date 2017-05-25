const Express = require('express')
const r = require('rethinkdb')
const bodyparser = require('body-parser')
const app = new Express()
app.use(bodyparser.json())

r.connect({
  host: 'localhost',
  port: 28015
}).then((conn) => {
  r.conn = conn
})

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

app.post('/add', function (req, res) {
  r
    .db('students')
    .table('list')
    .insert(req.body)
    .run(r.conn)
    .then(response => {
      res.send(`inserted ${response.inserted}`)
    })
    .error(err => {
      res.json(err)
    })
})

app.get('/list', function (req, res) {
  r
    .db('students')
    .table('list')
    .run(r.conn)
    .then(cur => cur.toArray())
    .then(data => {
      res.json({data})
    })
})

app.listen(8000, function () {
  console.log('server is running.....')
})
