use std::fs;
use walkdir::WalkDir;
use lofty::{Probe, TaggedFileExt, Accessor};

use super::models::{Artist, Album, Track};

const AUDIO_EXTENSIONS: [&str; 5] = ["mp3", "flac", "ogg", "m4a", "wav"];

pub fn scan_music_folder(root: String) -> Vec<Artist> {
    println!("ROOT: {}", root);

    let mut artists = Vec::new();

    let Ok(artist_dirs) = fs::read_dir(&root) else {
        println!("ERROR: cannot read root directory");
        return artists;
    };

    for artist_dir in artist_dirs.flatten() {
        let artist_path = artist_dir.path();

        if !artist_path.is_dir() {
            continue;
        }

        let artist_name = artist_dir.file_name().to_string_lossy().to_string();
        println!("ARTIST: {}", artist_name);

        let mut albums = Vec::new();

        let Ok(album_dirs) = fs::read_dir(&artist_path) else {
            continue;
        };

        for album_dir in album_dirs.flatten() {
            let album_path = album_dir.path();

            if !album_path.is_dir() {
                continue;
            }

            let album_title = album_dir.file_name().to_string_lossy().to_string();
            println!("  ALBUM: {}", album_title);

            let mut tracks = Vec::new();
            let mut album_year: Option<u32> = None;

            for entry in WalkDir::new(&album_path).into_iter().filter_map(Result::ok) {
                if !entry.file_type().is_file() {
                    continue;
                }

                let path = entry.path();

                let ext = path
                    .extension()
                    .and_then(|e| e.to_str())
                    .map(|e| e.to_lowercase())
                    .unwrap_or_default();

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

                // Preencher todos os campos exigidos pela struct Track
                tracks.push(Track {
                    id: 0, // sem id até inserir no DB
                    album_id: 0, // será preenchido ao inserir o álbum no DB
                    number,
                    title,
                    duration: None,
                    path: path.to_string_lossy().to_string(),
                });
            }

            if tracks.is_empty() {
                println!("    (album ignorado, sem músicas)");
                continue;
            }

            tracks.sort_by_key(|t| t.number);

            // Preencher todos os campos exigidos pela struct Album
            albums.push(Album {
                id: 0, // sem id até inserir no DB
                artist_id: 0, // será preenchido ao inserir o artista no DB
                title: album_title,
                year: album_year,
                image: None,
                tracks,
            });
        }

        if albums.is_empty() {
            continue;
        }

        // Preencher todos os campos exigidos pela struct Artist
        artists.push(Artist {
            id: 0, // sem id até inserir no DB
            name: artist_name,
            image: None,
            albums,
        });
    }

    artists
}