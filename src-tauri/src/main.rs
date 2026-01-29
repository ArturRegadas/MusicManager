// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod music;
mod commands;
mod db;

fn main() {
    tauri::Builder::default()
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            commands::load_music_library,
            commands::add_play_history,
            commands::get_play_history,
            commands::clear_play_history
        ])
        .run(tauri::generate_context!())
        .unwrap();
}