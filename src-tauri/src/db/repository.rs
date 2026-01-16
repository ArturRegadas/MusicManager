use rusqlite::{params, Connection};

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
) {
    conn.execute(
        "INSERT OR IGNORE INTO tracks (album_id, number, title, path)
         VALUES (?, ?, ?, ?)",
        params![album_id, number, title, path],
    ).ok();
}


