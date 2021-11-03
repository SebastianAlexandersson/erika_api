const express = require('express');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
 
app.get('/', (req, res) => {
  //Hämta ingridienser från databasen och skicka tillbaka.
  open({
    filename: 'databas',
    driver: sqlite3.Database
  }).then(async (db) => {
    // do your thing
    const data = await db.all('SELECT * FROM ingredients');
    res.send(JSON.stringify(data));
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

app.post('/', (req, res) => {
  //Spara ingridienser till databasen
  const { count, name } = req.body;
  open({
    filename: 'databas',
    driver: sqlite3.Database
  }).then(async (db) => {
    // do your thing
    const data = await db.run(`INSERT INTO ingredients (count, name) VALUES (?, ?)`, count, name);
    res.json({ message: 'ingredients saved to database!' });
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

app.put('/:id', (req, res) => {
  //Uppdatera ingridienser i databasen
  const { count } = req.body;
  const { id } = req.params;
  open({
    filename: 'databas',
    driver: sqlite3.Database
  }).then(async (db) => {
    // do your thing
    const data = await db.get('SELECT * FROM ingredients WHERE id = ?', id);
    console.log('data: ', data)

    if (!data) {
      res
        .status(400)
        .json({ error: 'ID doesn\'t exist'});
      return
    }

    await db.run(`UPDATE ingredients SET count = ? WHERE id = ?`, count, id);
    res.json({ message: `Ingredient with id: ${id} has been udated to: ${count}` });
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});

app.delete('/:id', (req, res) => {
  //Ta bort ingridienser från databasen
  const { id } = req.params;
  open({
    filename: 'databas',
    driver: sqlite3.Database
  }).then(async (db) => {
    // do your thing
    const data = await db.get('SELECT * FROM ingredients WHERE id = ?', id);
    console.log('data: ', data)

    if (!data) {
      res
        .status(400)
        .json({ error: 'ID doesn\'t exist'});
      return
    }

    await db.run(`DELETE FROM ingredients WHERE id = ?`, id);
    res.json({ message: `Ingredient with id: ${id} has been deleted` });
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  });
});
 
app.listen(5555, () => console.log('Server listening on port 5555'))
