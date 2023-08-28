const express = require('express');
const path = require('path');
const fs = require('fs')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    const json = fs.readFileSync(path.join(__dirname,'./db/db.json'))
    const data =JSON.parse(json)
    res.json(data)
});

app.post('/api/notes', (req, res) => {
    const json = fs.readFileSync(path.join(__dirname,'./db/db.json'))
    const data =JSON.parse(json)
    const {title, text} = req.body
    
    let newId;

    // if the array is empty
    if (data.length === 0) {
        // set newId to 1
        newId = 1;
    } else {
        // otherwise, set newId to the last ID + 1
        const last = data[data.length - 1];
        newId = last.id + 1;
    }
    const newNote = {title, text, id: newId};

    data.push(newNote)
    const jsonData = JSON.stringify(data)
    fs.writeFileSync(path.join(__dirname, './db/db.json'), jsonData)
    res.json(newNote)
});

app.delete('/api/notes/:id', (req, res) => {
    const json = fs.readFileSync(path.join(__dirname,'./db/db.json'))
    const data =JSON.parse(json)

    const filteredData = data.filter(note => {
        return note.id != req.params.id
    });

    const jsonData = JSON.stringify(filteredData)
    fs.writeFileSync(path.join(__dirname, './db/db.json'), jsonData)
    res.json("success")
});

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
