CREATE TABLE profiles
(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    session_id VARCHAR NOT NULL,
    display_name VARCHAR,
    birthday DATE,
    gender VARCHAR,
    location VARCHAR,
    description TEXT,
    height INTEGER NOT NULL,
    weight INTEGER NOT NULL,
    is_deleted BOOL NOT NULL,
    is_blocked BOOL NOT NULL,
    is_premium BOOL NOT NULL,
    is_show_distance BOOL NOT NULL,
    is_invisible BOOL NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    last_online TIMESTAMP NOT NULL
);

CREATE TABLE profile_complaints (
                                    id BIGSERIAL NOT NULL PRIMARY KEY,
                                    profile_id BIGINT NOT NULL,
                                    complaint_user_id BIGINT NOT NULL,
                                    reason VARCHAR,
                                    created_at TIMESTAMP NOT NULL,
                                    updated_at TIMESTAMP NOT NULL,
                                    CONSTRAINT fk_profile_id FOREIGN KEY (profile_id) REFERENCES profiles (id)
);

CREATE TABLE profile_telegram (
                                  id BIGSERIAL NOT NULL PRIMARY KEY,
                                  profile_id BIGINT,
                                  telegram_id BIGINT,
                                  username VARCHAR,
                                  first_name VARCHAR,
                                  last_name VARCHAR,
                                  language_code VARCHAR,
                                  allows_write_to_pm BOOL,
                                  query_id VARCHAR,
                                  chat_id BIGINT,
                                  CONSTRAINT fk_profile_id FOREIGN KEY (profile_id) REFERENCES profiles (id)
);

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE profile_navigators (
                                    id BIGSERIAL NOT NULL PRIMARY KEY,
                                    profile_id BIGINT NOT NULL,
                                    location geometry(Point,  4326),
                                    CONSTRAINT fk_profile_id FOREIGN KEY (profile_id) REFERENCES profiles (id)
);

CREATE TABLE profile_images (
                                id BIGSERIAL NOT NULL PRIMARY KEY,
                                profile_id BIGINT NOT NULL,
                                name VARCHAR,
                                url VARCHAR,
                                size INTEGER,
                                created_at TIMESTAMP NOT NULL,
                                updated_at TIMESTAMP NOT NULL,
                                is_deleted bool NOT NULL,
                                is_blocked bool NOT NULL,
                                is_primary bool NOT NULL,
                                is_private bool NOT NULL,
                                CONSTRAINT fk_profile_id FOREIGN KEY (profile_id) REFERENCES profiles (id)
);

CREATE TABLE profile_filters (
                                 id BIGSERIAL NOT NULL PRIMARY KEY,
                                 profile_id BIGINT NOT NULL,
                                 search_gender VARCHAR,
                                 looking_for VARCHAR,
                                 age_from INTEGER,
                                 age_to INTEGER,
                                 distance INTEGER,
                                 page INTEGER,
                                 size INTEGER,
                                 CONSTRAINT fk_profile_id FOREIGN KEY (profile_id) REFERENCES profiles (id)
);

CREATE TABLE profile_reviews (
                                 id BIGSERIAL NOT NULL PRIMARY KEY,
                                 profile_id BIGINT NOT NULL,
                                 message TEXT,
                                 rating DECIMAL(3,  1),
                                 has_deleted BOOL NOT NULL,
                                 has_edited BOOL NOT NULL,
                                 created_at TIMESTAMP NOT NULL,
                                 updated_at TIMESTAMP NOT NULL,
                                 CONSTRAINT fk_profile_id FOREIGN KEY (profile_id) REFERENCES profiles (id)
);

CREATE TABLE profile_likes (
                               id BIGSERIAL NOT NULL PRIMARY KEY,
                               profile_id BIGINT NOT NULL,
                               likedUser_id BIGINT NOT NULL,
                               is_liked BOOL NOT NULL,
                               created_at TIMESTAMP NOT NULL,
                               updated_at TIMESTAMP NOT NULL,
                               CONSTRAINT fk_profile_id FOREIGN KEY (profile_id) REFERENCES profiles (id)
);

CREATE TABLE profile_blocks(
                               id BIGSERIAL NOT NULL PRIMARY KEY,
                               profile_id BIGINT NOT NULL,
                               blocked_user_id BIGINT NOT NULL,
                               is_blocked BOOL NOT NULL,
                               created_at TIMESTAMP NOT NULL,
                               updated_at TIMESTAMP NOT NULL,
                               CONSTRAINT fk_profile_id FOREIGN KEY (profile_id) REFERENCES profiles (id)
);