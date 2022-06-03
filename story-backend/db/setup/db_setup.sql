-- NOTE: likely not safe to store user generated html in db in serve that html to others. maybe markdown?
-- DROP TABLE stories;
-- DROP TABLE steps;

-- two connected tables:
--  "stories" contains metadata on all stored stories
--  "steps" contains the content of all story steps

CREATE TABLE IF NOT EXISTS stories (
  storyID integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
  name VARCHAR(30),
  category VARCHAR(120),
  story_json TEXT,
  PRIMARY KEY(storyID)
);


CREATE TABLE IF NOT EXISTS steps (
  stepID integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
  storyID INT,
  step_major INT,
  step_minor INT,
  html TEXT,
  image bytea,

  PRIMARY KEY(stepID),
  CONSTRAINT storyID
    FOREIGN KEY(storyID)
    REFERENCES stories(storyID)

);
