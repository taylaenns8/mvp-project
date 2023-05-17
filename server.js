import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 3000

const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    // connectionString: "postgres://postgres:postgres@localhost/users"
});

app.use(express.static('public'));
app.use(express.json());



app.get("/api/login", (_, res) => {
    db.query('SELECT * FROM users').then((data) => {
     res.json(data.rows);
    });
   });



app.get("/api/portfolio", (_, res) => {
    db.query('SELECT * FROM portfolio_items').then((data) => {
     res.json(data.rows);
    });
   });
  
   app.post('/api/signup', async (req, res) => {
    const { name, email, password, title, description } = req.body;
  
    console.log('Received signup request:', name, email, password, title, description);

    try {
      //Create a new user
      const userResult = await db.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
        [name, email, password]
      );
      const userId = userResult.rows[0].id;

      console.log('User created with ID:', userId);
  
      //Create a new portfolio item for the user
      await db.query(
        'INSERT INTO portfolio_items (user_id, title, description) VALUES ($1, $2, $3)',
        [userId, title, description]
      );

      console.log('Portfolio item created for user with ID:', userId);
  
      res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Unable to register user' });
    }
  });

  app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
  
    //Query the database to see if the email and password match
    db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password])
      .then(result => {
        if (result.rows.length > 0) {
          console.log('User exists');
          res.send({ success: true });
          // res.send(`{"message": "User exists"}`);
        } else {
          console.log('User does not exist');
          res.send({ success: false });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error querying database');
      });
  });
  
  app.get("/api/login/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM users WHERE id = $1", [id])
      .then((result) => {
        res.json(result.rows[0]);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error querying database");
      });
  });

  app.get('/api/portfolio', (req, res) => {
    const userId = req.user.id; 
    const query = `SELECT * FROM portfolio_items WHERE user_id = $1`;
    const values = [userId];
  
    pool.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
  
      return res.json(result.rows);
    });
  });

  app.get("/api/portfolio/:id", (req, res) => {
    const id = req.params.id;
    db.query("SELECT * FROM portfolio_items WHERE id = $1", [id])
      .then((result) => {
        res.json(result.rows[0]);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error querying database");
      });
  });

  app.put("/api/portfolio/:id", async (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body;
  
    console.log(`Updating portfolio with id ${id}. New title: ${title}, new description: ${description}.`);
  
    db.query(`UPDATE portfolio_items SET title = '${title}', description = '${description}' WHERE id = ${id}`)
      .then(result => {
        console.log('Portfolio item updated successfully');
        res.json({ success: true, message: 'Portfolio item updated successfully' });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ success: false, message: 'Unable to update portfolio item' });
      });
  
    });


   app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

});
