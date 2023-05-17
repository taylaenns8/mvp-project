-- create tables in users database
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS portfolio_items;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL, 
    password TEXT NOT NULL
);
CREATE TABLE portfolio_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL
);
