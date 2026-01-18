use rusqlite::{params, Connection};

use crate::music::models::{Artist as ModelArtist, Album as ModelAlbum, Track as ModelTrack};

pub fn insert_artist(conn: &Connection, name: &str) -> i64 {
    conn.execute(
        "INSERT OR IGNORE INTO artists (name) VALUES (?)",
        [name],
    ).unwrap();

    conn.query_row(
        "SELECT id FROM artists WHERE name = ?",
        [name],
        |row| row.get(0),
    ).unwrap()
}

pub fn insert_album(
    conn: &Connection,
    artist_id: i64,
    title: &str,
    year: Option<u32>,
    image: Option<&str>,
) -> i64 {
    conn.execute(
        "INSERT OR IGNORE INTO albums (artist_id, title, year, image)
         VALUES (?, ?, ?, ?)",
        params![artist_id, title, year, image],
    ).unwrap();

    conn.query_row(
        "SELECT id FROM albums WHERE artist_id = ? AND title = ?",
        params![artist_id, title],
        |row| row.get(0),
    ).unwrap()
}


pub fn insert_track(
    conn: &Connection,
    album_id: i64,
    number: u32,
    title: &str,
    path: &str,
    duration: u32,
) {
    conn.execute(
        "INSERT OR IGNORE INTO tracks (album_id, number, title, path, duration)
         VALUES (?, ?, ?, ?, ?)",
        params![album_id, number, title, path, duration],
    ).ok();
}

pub fn get_library(conn: &Connection) -> Vec<ModelArtist> {
    let mut artists: Vec<ModelArtist> = Vec::new();


    let mut stmt = match conn.prepare("SELECT id, name, image FROM artists order by name") {
        Ok(s) => s,
        Err(e) => {
            println!("Error artists query: {}", e);
            return artists;
        }
    };

    let artist_rows = match stmt.query_map([], |row| {
        Ok((
            row.get::<_, i64>(0)?,
            row.get::<_, String>(1)?,
            row.get::<_, Option<String>>(2)?,
        ))
    }) {
        Ok(iter) => iter,
        Err(e) => {
            println!("Error run query: {}", e);
            return artists;
        }
    };

    for artist_res in artist_rows {
        if let Ok((artist_id, artist_name, artist_image)) = artist_res {

            let mut albums: Vec<ModelAlbum> = Vec::new();

            let mut stmt_albums = match conn.prepare(
                "SELECT id, title, year, image FROM albums WHERE artist_id = ?1",
            ) {
                Ok(s) => s,
                Err(e) => {
                    println!("Error albums query: {}", e);
                    continue;
                }
            };

            let album_rows = match stmt_albums.query_map(params![artist_id], |row| {
                Ok((
                    row.get::<_, i64>(0)?,
                    row.get::<_, String>(1)?,
                    row.get::<_, Option<u32>>(2)?,
                    row.get::<_, Option<String>>(3)?,
                ))
            }) {
                Ok(iter) => iter,
                Err(e) => {
                    println!("Error run query: {}", e);
                    continue;
                }
            };

            for album_res in album_rows {
                if let Ok((album_id, album_title, album_year, album_image)) = album_res {

                    let mut tracks: Vec<ModelTrack> = Vec::new();

                    let mut stmt_tracks = match conn.prepare(
                        "SELECT id, album_id, number, title, duration, path FROM tracks WHERE album_id = ?1 ORDER BY number",
                    ) {
                        Ok(s) => s,
                        Err(e) => {
                            println!("Error run query: {}", e);
                            continue;
                        }
                    };

                    let track_rows = match stmt_tracks.query_map(params![album_id], |row| {
                        Ok((
                            row.get::<_, i64>(0)?,
                            row.get::<_, i64>(1)?,
                            row.get::<_, u32>(2)?,
                            row.get::<_, String>(3)?,
                            row.get::<_, Option<u32>>(4)?,
                            row.get::<_, String>(5)?,
                        ))
                    }) {
                        Ok(iter) => iter,
                        Err(e) => {
                            println!("Error run query: {}", e);
                            continue;
                        }
                    };

                    for track_res in track_rows {
                        if let Ok((track_id, album_id_row, number, title, duration, path)) = track_res
                        {
                            tracks.push(ModelTrack {
                                id: track_id,
                                album_id: album_id_row,
                                number,
                                title,
                                duration,
                                path,
                            });
                        }
                    }

                    albums.push(ModelAlbum {
                        id: album_id,
                        artist_id,
                        title: album_title,
                        year: album_year,
                        image: album_image,
                        tracks,
                    });
                }
            }

            artists.push(ModelArtist {
                id: artist_id,
                name: artist_name,
                image: artist_image,
                albums,
            });
        }
    }

    artists
}