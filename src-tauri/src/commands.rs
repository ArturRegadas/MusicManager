use crate::music::scanner::scan_music_folder;
use crate::music::models::Artist;

#[tauri::command]
pub async fn load_music_library(path: String) -> Result<(), String> {
    let handle = std::thread::spawn(move || {
        scan_music_folder(path)
    });

    handle
        .join()
        .map_err(|_| "thread panic".to_string())?;

    Ok(())
}

