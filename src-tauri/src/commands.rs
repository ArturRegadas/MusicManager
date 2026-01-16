use crate::music::scanner::scan_music_folder;
use crate::music::models::{Artist};

#[tauri::command]
pub async fn load_music_library(path: String) -> Result<Vec<Artist>, String> {
    let result = tauri::async_runtime::spawn_blocking(move || {
        scan_music_folder(path)
    })
    .await
    .map_err(|e| e.to_string())?;

    Ok(result)
}

