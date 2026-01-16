use rusqlite::{ Connection, Result };
use std::fs;


pub fn open_db() -> Result<Connection> {
    let mut path = dirs::data_dir().unwrap_or_else(|| std::env::current_dir().unwrap());
    path.push("MusicManager");

    println!("Music DB folder: {:?}", path);

    fs::create_dir_all(&path).ok();


    path.push("music.db");
    println!("Music DB file: {:?}", path);


    let conn = Connection::open(path)?;
    conn.execute_batch(include_str!("schema.sql"))?;

    Ok(conn)
}