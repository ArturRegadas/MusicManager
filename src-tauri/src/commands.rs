use crate::music::scanner::scan_music_folder;
use crate::music::models::Artist;
use crate::db::connection; 

#[tauri::command]
pub async fn load_music_library(path: String) -> Result<Vec<Artist>, String> {
    let result = tauri::async_runtime::spawn_blocking(move || {
        // Abre/garante que o DB exista aqui (na mesma thread de bloqueio)
        if let Err(e) = connection::open_db() {
            // opcional: log para debug
            println!("Erro abrindo DB: {}", e);
            // podemos continuar mesmo assim, se quiser apenas retornar a varredura
        }

        // Agora varre a pasta
        scan_music_folder(path)
    })
    .await
    .map_err(|e| e.to_string())?;

    Ok(result)
}