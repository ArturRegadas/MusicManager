use crate::db::repository::*;
use crate::db::connection::open_db;

use std::fs;
use walkdir::WalkDir;
use lofty::{Probe, TaggedFileExt, Accessor};

const AUDIO_EXTENSIONS: [&str; 5] = ["mp3", "flac", "ogg", "m4a", "wav"];

pub fn scan_music_folder(root: String) {
    println!("ROOT: {}", root);

    let conn = open_db().expect("failed to open database");

    let Ok(artist_dirs) = fs::read_dir(&root) else {
        println!("ERROR: cannot read root directory");
        return;
    };

    for artist_dir in artist_dirs.flatten() {
        let artist_path = artist_dir.path();
        if !artist_path.is_dir() {
            continue;
        }

        let artist_name = artist_dir.file_name().to_string_lossy().to_string();
        let artist_id = insert_artist(&conn, &artist_name);

        let Ok(album_dirs) = fs::read_dir(&artist_path) else {
            continue;
        };

        for album_dir in album_dirs.flatten() {
            let album_path = album_dir.path();
            if !album_path.is_dir() {
                continue;
            }

            let album_title = album_dir.file_name().to_string_lossy().to_string();

            let mut album_year: Option<u32> = None;
            let mut tracks: Vec<(u32, String, String)> = Vec::new();

            for entry in WalkDir::new(&album_path)
                .max_depth(1)
                .into_iter()
                .filter_map(|e| e.ok())
            {
                if !entry.file_type().is_file() {
                    continue;
                }

                let path = entry.path();

                let ext = match path.extension().and_then(|e| e.to_str()) {
                    Some(e) => e.to_lowercase(),
                    None => continue,
                };

                if !AUDIO_EXTENSIONS.contains(&ext.as_str()) {
                    continue;
                }

                let Ok(tagged) = Probe::open(path).and_then(|p| p.read()) else {
                    continue;
                };

                let Some(tag) = tagged.primary_tag() else {
                    continue;
                };

                let title = tag
                    .title()
                    .map(|t| t.to_string())
                    .unwrap_or_else(|| {
                        path.file_stem()
                            .and_then(|s| s.to_str())
                            .and_then(|s| s.splitn(2, '-').nth(1))
                            .unwrap_or("Unknown")
                            .to_string()
                    });

                let number = tag.track().unwrap_or(0);

                if album_year.is_none() {
                    album_year = tag.year();
                }

                tracks.push((
                    number,
                    title,
                    path.to_string_lossy().to_string(),
                ));
            }

            if tracks.is_empty() {
                continue;
            }

            let album_id = insert_album(
                &conn,
                artist_id,
                &album_title,
                album_year,
                None,
            );

            for (number, title, path) in tracks {
                insert_track(&conn, album_id, number, &title, &path);
            }
        }
    }
}
