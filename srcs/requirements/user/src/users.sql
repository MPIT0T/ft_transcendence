CREATE TABLE[IF NOT EXISTS] users
(

    id              INT PRIMARY KEY NOT NULL AUTOINCREMENT,
    username        TEXT UNIQUE NOT NULL,
    password        TEXT NOT NULL,
    created_at      DATE DEFAULT CURRENT_DATE,
    elo             INT DEFAULT 0,
    avatar          TEXT DEFAULT 'alien.png',
)

CREATE TABLE[IF NOT EXISTS] games
(
    id              INT PRIMARY KEY NOT NULL,
    player_1        INT,
                        FOREIGN KEY (player_1)
                            REFERENCES users(id)
    player_2        INT,
                        FOREIGN KEY (player_2)
                            REFERENCES users(id)
    score           INT,
    winner          INT,
                        FOREIGN KEY (winner)
                            REFERENCES users(id)
    tournament      INT,
                        FOREIGN KEY (tournament)
                            REFERENCES tournaments(id)
    gamemode        INT,
    create_at       DATE DEFAULT CURRENT_DATE,
    ended_at        DATE
)

CREATE TABLE[IF NOT EXISTS] tournaments
(
    id              INT PRIMARY KEY NOT NULL,
    name            TEXT,
    winner          INT,
                        FOREIGN KEY (winner)
                            REFERENCES users(id)
    create_at       DATE DEFAULT CURRENT_DATE,
)

CREATE TABLE[IF NOT EXISTS] friendships
(
    user_id         INT,
                        FOREIGN KEY (user_id)
                            REFERENCES users(id)
    friend_id       INT,
                        FOREIGN KEY (friend_id)
                            REFERENCES users(id)
    status          INT,
    create_at       DATE DEFAULT CURRENT_DATE
)