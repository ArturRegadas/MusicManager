use serde::Serialize;

#[derive(Serialize)]
pub struct Track {
    pub id:i64,
    pub album_id: i64,
    pub number: u32,
    pub title: String,
    pub duration: Option<u32>,
    pub path: String,
}

#[derive(Serialize)]
pub struct Album {
    pub id:i64,
    pub artist_id: i64,
    pub title: String,
    pub year: Option<u32>,
    pub image: Option<String>,
}

#[derive(Serialize)]
pub struct Artist {
    pub id:i64,
    pub name: String,
    pub image: String,
}
