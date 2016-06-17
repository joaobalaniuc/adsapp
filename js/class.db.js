//........................
// SQL FUNX
//........................

//============================
// CONECTAR AO BANCO DE DADOS
//============================
function dbOpen() {
    var shortName = localStorage.dbShort;
    var version = localStorage.dbVersion;
    var displayName = localStorage.dbName;
    var maxSize = localStorage.dbMaxSize;
    //
    db = openDatabase(shortName, version, displayName, maxSize);

    //=============================
    // SET "LAST_CHAT_ID"
    //=============================
    dbx('SELECT id FROM chat ORDER BY id DESC LIMIT 1', function (transaction, result) {
        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            localStorage.LAST_CHAT_ID = row['id'];
            console.log(localStorage);
        }
    });

}
//========================
// CRIAR BANCO DE DADOS
//========================
function dbCreate() {

    dbOpen();
    //dbQuery("DROP TABLE chat");
    //dbQuery("DROP TABLE contact");

    //''''''''''''''''''''''''
    // CONTACT
    //''''''''''''''''''''''''
    db.transaction(
            function (transaction) {
                transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS contact ' +
                        ' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
                        ' id_server INTEGER, ' +
                        ' num TEXT NOT NULL UNIQUE, ' +
                        ' num_local TEXT NOT NULL, ' +
                        ' name TEXT, ' +
                        ' nick TEXT, ' +
                        ' id_fb TEXT, ' +
                        ' id_in TEXT, ' +
                        ' fav INTEGER);' // favorito
                        );
            }
    );
    //''''''''''''''''''''''''
    // CHAT
    //''''''''''''''''''''''''
    db.transaction(
            function (transaction) {
                transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS chat ' +
                        ' (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
                        ' chat_id INTEGER, ' + // CHAT ID FROM SERVER
                        ' chat_from INTEGER NOT NULL, ' + // SRC ID FROM SERVER
                        ' chat_to INTEGER NOT NULL, ' + // DST ID FROM SERVER
                        ' chat_msg TEXT, ' +
                        ' chat_read INTEGER, ' +
                        ' chat_post INTEGER, ' + // POST ID FROM SERVER (SE NOT NULL, NÃO É MENSAGEM, É POST)
                        ' chat_date TEXT);'
                        );
            }
    );

}
//========================
// EXECUTAR QUERY
//========================
function dbQuery(query, callback) {
    console.log("dbQuery: " + query);
    db.transaction(
            function (transaction) {
                transaction.executeSql(
                        query,
                        null,
                        function (transaction, result) {
                            callback;
                        },
                        errorHandler
                        );
            }
    );
}
//========================
// EXECUTAR QUERY COM
// CALL BACK INLINE
//========================
function dbx(query, callback) {
    db.transaction(
            function (transaction) {
                transaction.executeSql(
                        query, null,
                        callback,
                        errorHandler
                        );
            }
    );
}
//========================
// RETORNAR ERRO
//========================
function errorHandler(transaction, error) {
    console.log('Oops. Error was ' + error.message + ' (Code ' + error.code + ')');
    //popup("SQL Error: " + error.message + " (Code: " + error.code + ")", "red");
    return true;
}
//========================
// POPULAR DADOS ESTÁTICOS
//========================
function genreInsert() {

    var genreList = ['Blues ', 'Classic Rock ', 'Country ', 'Dance ', 'Disco ', 'Funk ', 'Grunge ', 'Hip-Hop ', 'Jazz ', 'Metal ', 'New Age ', 'Oldies ', 'Other ', 'Pop ', 'R&B ', 'Rap ', 'Reggae ', 'Rock ', 'Techno ', 'Industrial ', 'Alternative ', 'Ska ', 'Death Metal ', 'Pranks ', 'Soundtrack ', 'Euro-Techno ', 'Ambient ', 'Trip-Hop ', 'Vocal ', 'Jazz+Funk ', 'Fusion ', 'Trance ', 'Classical ', 'Instrumental ', 'Acid ', 'House ', 'Game ', 'Sound Clip ', 'Gospel ', 'Noise ', 'Alternative Rock ', 'Bass ', 'Soul ', 'Punk ', 'Space ', 'Meditative ', 'Instrumental Pop ', 'Instrumental Rock ', 'Ethnic ', 'Gothic ', 'Darkwave ', 'Techno-Industrial ', 'Electronic ', 'Pop-Folk ', 'Eurodance ', 'Dream ', 'Southern Rock ', 'Comedy ', 'Cult ', 'Gangsta ', 'Top 40 ', 'Christian Rap ', 'Pop/Funk ', 'Jungle ', 'Native US ', 'Cabaret ', 'New Wave ', 'Psychadelic ', 'Rave ', 'Showtunes ', 'Trailer ', 'Lo-Fi ', 'Tribal ', 'Acid Punk ', 'Acid Jazz ', 'Polka ', 'Retro ', 'Musical ', 'Rock & Roll ', 'Hard Rock ', 'Folk ', 'Folk-Rock ', 'National Folk ', 'Swing ', 'Fast Fusion ', 'Bebob ', 'Latin ', 'Revival ', 'Celtic ', 'Bluegrass ', 'Avantgarde ', 'Gothic Rock ', 'Progressive Rock ', 'Psychedelic Rock ', 'Symphonic Rock ', 'Slow Rock ', 'Big Band ', 'Chorus ', 'Easy Listening ', 'Acoustic ', 'Humour ', 'Speech ', 'Chanson ', 'Opera ', 'Chamber Music ', 'Sonata ', 'Symphony ', 'Booty Bass ', 'Primus ', 'Porn Groove ', 'Satire ', 'Slow Jam ', 'Club ', 'Tango ', 'Samba ', 'Folklore ', 'Ballad ', 'Power Ballad ', 'Rhytmic Soul ', 'Freestyle ', 'Duet ', 'Punk Rock ', 'Drum Solo ', 'Acapella ', 'Euro-House ', 'Dance Hall ', 'Goa ', 'Drum & Bass ', 'Club-House ', 'Hardcore ', 'Terror ', 'Indie ', 'BritPop ', 'Negerpunk ', 'Polsk Punk ', 'Beat ', 'Christian Gangsta ', 'Heavy Metal ', 'Black Metal ', 'Crossover ', 'Contemporary C ', 'Christian Rock ', 'Merengue ', 'Salsa ', 'Thrash Metal ', 'Anime ', 'JPop ', 'Synt'];
    dbx('SELECT DISTINCT * FROM genre', function (transaction, result) {
        // nenhum genero
        if (result.rows.length === 0) {
            // loop generos
            $.each(genreList, function (key, val) {
                // insert genero
                dbQuery('INSERT INTO genre (name) VALUES ("' + val + '")');
            });
        }
    });
}