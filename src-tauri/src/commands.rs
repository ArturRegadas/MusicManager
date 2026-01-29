use crate::music::scanner::scan_music_folder;
use crate::music::models::Artist;
use crate::db::connection;
use crate::db::repository;
use serde::Serialize;
use rusqlite::params;
use chrono::Utc;

#[tauri::command]
pub async fn load_music_library(path: String) -> Result<Vec<Artist>, String> {
    let result = tauri::async_runtime::spawn_blocking(move || {
        if let Ok(conn) = connection::open_db() {
            let library = repository::get_library(&conn);
            if !library.is_empty() {
                return library;
            }
        } else {
            println!("Error to open DB: (ignore) - ");
        }

        scan_music_folder(path);

        if let Ok(conn_after) = connection::open_db() {
            let library_after = repository::get_library(&conn_after);
            return library_after;
        }

        Vec::new()
    })
    .await
    .map_err(|e| e.to_string())?;

    Ok(result)
}

#[derive(Serialize)]
pub struct PlayEntry {
    pub id: i64,
    pub title: String,
    pub artist: String,
    pub album: Option<String>,
    pub cover: Option<String>,
    pub path: String,
    pub played_at: String,
}

#[tauri::command]
pub async fn add_play_history(title: String, artist: String, album: Option<String>, cover: Option<String>, path: String) -> Result<(), String> {
    let _ = tauri::async_runtime::spawn_blocking(move || {
        if let Ok(conn) = connection::open_db() {
            let tx = conn;
            let _ = tx.execute(
                "INSERT INTO play_history (title, artist, album, cover, path) VALUES (?1, ?2, ?3, ?4, ?5)",
                params![title, artist, album, cover, path],
            );
        }
    }).await.map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn get_play_history() -> Result<Vec<PlayEntry>, String> {
    let result = tauri::async_runtime::spawn_blocking(move || {
        let mut vec: Vec<PlayEntry> = Vec::new();
        if let Ok(conn) = connection::open_db() {
            let mut stmt = match conn.prepare("SELECT id, title, artist, album, cover, path, played_at FROM play_history ORDER BY played_at DESC LIMIT 200") {
                Ok(s) => s,
                Err(e) => {
                    println!("Error preparing history query: {}", e);
                    return vec;
                }
            };

            let rows = match stmt.query_map([], |row| {
                Ok(PlayEntry {
                    id: row.get::<_, i64>(0)?,
                    title: row.get::<_, String>(1)?,
                    artist: row.get::<_, String>(2)?,
                    album: row.get::<_, Option<String>>(3)?,
                    cover: row.get::<_, Option<String>>(4)?,
                    path: row.get::<_, String>(5)?,
                    played_at: row.get::<_, String>(6)?,
                })
            }) {
                Ok(iter) => iter,
                Err(e) => {
                    println!("Error running history query: {}", e);
                    return vec;
                }
            };

            for r in rows {
                if let Ok(entry) = r {
                    vec.push(entry);
                }
            }
        }
        vec
    })
    .await
    .map_err(|e| e.to_string())?;

    Ok(result)
}