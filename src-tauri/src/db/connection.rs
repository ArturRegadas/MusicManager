use rusqlite::{ Connection, Result };
use std::fs;

/// Abre (ou cria) o arquivo music.db na pasta de dados do usuário.
/// Usa `dirs::data_dir()` para encontrar a pasta de dados padrão por plataforma.
pub fn open_db() -> Result<Connection> {
    // pega a pasta de dados do usuário; fallback para o diretório atual se não existir
    let mut path = dirs::data_dir().unwrap_or_else(|| std::env::current_dir().unwrap());
    // cria um subdiretório para nossa aplicação (opcional, troque o nome se quiser)
    path.push("MusicManager");

    // apenas para debug — remova se não quiser imprimir
    println!("Music DB folder: {:?}", path);

    // garante que a pasta exista (ignora erro de criação)
    fs::create_dir_all(&path).ok();

    // arquivo de banco
    path.push("music.db");
    println!("Music DB file: {:?}", path);

    // abre o DB e aplica o schema
    let conn = Connection::open(path)?;
    conn.execute_batch(include_str!("schema.sql"))?;

    Ok(conn)
}