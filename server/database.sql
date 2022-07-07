CREATE DATABASE friendsTracks;

CREATE TABLE friends(
    friendID SERIAL PRIMARY KEY,
    FullName VARCHAR(255),
    Email VARCHAR(255),
    Username VARCHAR(255),
    Password VARCHAR(255)
    
);

CREATE TABLE followers(
    friendID int,
    followerID int,
    CONSTRAINT fk_followers_friends FOREIGN KEY(friendID) REFERENCES friends(friendID),
    CONSTRAINT fk_tracks_friends FOREIGN KEY(followerID) REFERENCES friends(friendID)
);

CREATE TABLE tracks(
    trackID int PRIMARY KEY,
    TrackName VARCHAR(255),
    Artist VARCHAR(255),
    TrackSpotifyId VARCHAR(50),
    friendID int,
    CONSTRAINT fk_tracks_friends FOREIGN KEY(friendID) REFERENCES friends(friendID)
);