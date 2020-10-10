CREATE DATABASE diary;

/* This store user's data for auth */ 
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name varchar(100),
    email text UNIQUE NOT NULL,
    joined TIMESTAMP NOT NULL
);

/* This store user's hash password for auth */ 
CREATE TABLE login (
    id SERIAL PRIMARY KEY,
    hash varchar(100) NOT NULL,
    email text UNIQUE NOT NULL
);

/* This store all user's post infomation */ 
/* Email here should not be UNIQUE as users can post as many as he want */
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    email text NOT NULL,
    title varchar(100) NOT NULL,
    content varchar(2000) NOT NULL,
    posted TIMESTAMP NOT NULL
);

/* This store all user's profile infomation */ 
CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    email text UNIQUE NOT NULL,
    total_posts BIGINT DEFAULT 0,
    total_edits BIGINT DEFAULT 0,
    total_deletes BIGINT DEFAULT 0
);

/* This store all user's setting infomation */ 
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    email text UNIQUE NOT NULL,
    is_night_mode BOOLEAN DEFAULT false,
    auto_location BOOLEAN DEFAULT true,
    location_method BOOLEAN DEFAULT false,
    lat VARCHAR(20),
    lon VARCHAR(20),
    city varchar(30)
);