// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod music;
mod commands;
mod db;

fn main() {
    tauri::Builder::default().plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            commands::load_music_library
        ])
        .run(tauri::generate_context!())
        .unwrap();
}