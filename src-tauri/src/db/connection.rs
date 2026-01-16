use rusqlite::{ Connection, Result };
use std::fs;
use std::path::PathBuf;

pub fn open_db() -> Result<Connection>{
    let mut path = tauri::api::path::app_data_dir(&tauri::Config::defaut()).expected("app data dir");

    fs::create_dir_all(&path).ok();
    path.push("music.db");
    
    let conn = Connection::open(path)?;

    conn.execute_batch(include_str!("schema.sql"));

    Ok(conn);
}