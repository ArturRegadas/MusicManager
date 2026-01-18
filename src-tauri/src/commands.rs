use crate::music::scanner::scan_music_folder;
use crate::music::models::Artist;
use crate::db::connection;
use crate::db::repository;

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