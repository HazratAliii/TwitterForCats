const express = require('express');
const morgan = require('morgan');
const monk = require('monk');
const { disabled } = require('express/lib/application');

const app = express();

app.use(morgan('combined'));
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))

//DB
const db = monk('localhost/Meower');
const meows = db.get('meows')

app.get("/", (req, res) => {
    res.render("index", {})
});

app.post('/', (req, res) => {
    const name = req.body.name;
    const meow = {
        name: name,
        date: new Date()
    }
    meows.insert(meow)
    .then((docs) => {
        res.render('/', {docs})
    }).catch((err) => {
        console.log(err);
    }).then(() =>  db.close())
});

app.listen(5000, (req, res) => {
    console.log("Running on port 5000");
})