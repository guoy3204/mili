import { createConnection, In } from 'typeorm';

export const tablesRun = async function (connection) {
  try {
    // await connection.manager.query(`alter table images add column size int(11)`);
    // await connection.manager.query(`alter table images add column format varchar(50)`);

    // await connection.manager.query(`alter table book_categories add column pathname varchar(50)`);

    // await connection.manager.query(`alter table categories add column follower_count int default 0`);
    // await connection.manager.query(`alter table categories add column article_count int default 0`);
    // await connection.manager.query(`alter table categories add column pathname varchar(50)`); 

    await connection.manager.query(`CREATE TABLE book_user_study (
          user_id int(11) unsigned NOT NULL,
          book_id int(11) unsigned NOT NULL,
          created_at datetime,
          updated_at datetime,
          PRIMARY KEY (user_id, book_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    let sql = `CREATE TABLE boilingpoint_comments (
          id int(11) unsigned NOT NULL AUTO_INCREMENT,
          html_content text,
          parent_id int(11) NOT NULL DEFAULT '0',
          root_id int(11) NOT NULL DEFAULT '0',
          status int(11) NOT NULL,
          source_id int(11) DEFAULT NULL,
          user_id int(11) unsigned NOT NULL,
          created_at datetime NOT NULL,
          updated_at datetime NOT NULL,
          deleted_at datetime DEFAULT NULL,
          liked_count int(11) NOT NULL DEFAULT '0',
          comment_count int(11) NOT NULL DEFAULT '0',
          latest varchar(100),
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

    await connection.manager.query(sql);

    sql = `
        CREATE TABLE users (
          id int(11) NOT NULL,
          created_at date NOT NULL,
          updated_at date NOT NULL,
          deleted_at date DEFAULT NULL,
          activated_at date NOT NULL,
          username varchar(64) NOT NULL,
          email varchar(128) NOT NULL,
          phone varchar(128) NOT NULL,
          pass varchar(128) NOT NULL,
          article_count int(11) NOT NULL,
          collect_count int(11) NOT NULL,
          introduce varchar(128) NOT NULL,
          role int(11) NOT NULL,
          status int(11) NOT NULL,
          avatar_url varchar(256) NOT NULL,
          cover_url varchar(256) DEFAULT NULL,
          comment_count int(11) NOT NULL,
          sex int(11) NOT NULL,
          location varchar(256) DEFAULT NULL,
          word_count int(11) NOT NULL,
          value int(11) NOT NULL,
          article_view_count int(11) NOT NULL,
          follow_count int(11) NOT NULL,
          boilingpoint_count int(11) NOT NULL,
          follower_count int(11) NOT NULL,
          follow_tag_count int(11) NOT NULL,
          collection_count int(11) NOT NULL,
          liked_count int(11) NOT NULL,
          u_like_count int(11) NOT NULL,
          u_article_like_count int(11) NOT NULL,
          u_bp_like_count int(11) NOT NULL,
          job varchar(128) DEFAULT NULL,
          company varchar(128) DEFAULT NULL,
          personal_hp varchar(128) DEFAULT NULL,
          github_id varchar(128) DEFAULT NULL,
          github_avatar_url varchar(128) DEFAULT NULL,
          github_login varchar(128) DEFAULT NULL,
          github_name varchar(128) DEFAULT NULL,
          weibo_id varchar(128) DEFAULT NULL,
          weibo_avatar_large varchar(128) DEFAULT NULL,
          weibo_screen_name varchar(128) DEFAULT NULL,
          weibo_name varchar(128) DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

    await connection.manager.query(sql);

    sql = `CREATE TABLE like_boiling_comments (
          comment_id int(11) unsigned NOT NULL,
          user_id int(11) unsigned NOT NULL,
          created_at datetime NOT NULL,
          PRIMARY KEY (comment_id, user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

    await connection.manager.query(sql);

    sql = `CREATE TABLE handbooks (
            id int(11) unsigned NOT NULL AUTO_INCREMENT,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            name varchar(200) NOT NULL,
            introduce text,
            summary varchar(200) NOT NULL,
            author_intro varchar(200) NOT NULL,
            price int(11) unsigned NOT NULL DEFAULT '0',
            completion_at datetime,
            is_all_done tinyint(1) unsigned NOT NULL DEFAULT '0',
            is_agree tinyint(1) unsigned NOT NULL DEFAULT '0',
            word_count int(11) unsigned NOT NULL DEFAULT '0',
            sale_count int(11) unsigned NOT NULL DEFAULT '0',
            comment_count int(11) unsigned NOT NULL DEFAULT '0',
            cover_url varchar(500) NOT NULL,
            user_id int(11) unsigned NOT NULL,
            PRIMARY KEY (id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    // await connection.manager.query('drop table book_chapter_comments');

    sql = `CREATE TABLE book_chapter_comments (
            id int(11) unsigned NOT NULL AUTO_INCREMENT,
            html_content text,
            parent_id int(11) NOT NULL DEFAULT '0',
            root_id int(11) NOT NULL DEFAULT '0',
            status int(11) NOT NULL,
            source_id int(11) DEFAULT NULL,
            collection_id int(11) NOT NULL,
            user_id int(11) unsigned NOT NULL,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            deleted_at datetime DEFAULT NULL,
            liked_count int(11) NOT NULL DEFAULT '0',
            comment_count int(11) NOT NULL DEFAULT '0',
            latest varchar(100),
            PRIMARY KEY (id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

    await connection.manager.query(sql);


    sql = `CREATE TABLE handbook_chapter_comments (
          id int(11) unsigned NOT NULL AUTO_INCREMENT,
          html_content text,
          parent_id int(11) NOT NULL DEFAULT '0',
          root_id int(11) NOT NULL DEFAULT '0',
          status int(11) NOT NULL,
          source_id int(11) DEFAULT NULL,
          collection_id int(11) NOT NULL,
          user_id int(11) unsigned NOT NULL,
          created_at datetime NOT NULL,
          updated_at datetime NOT NULL,
          deleted_at datetime DEFAULT NULL,
          liked_count int(11) NOT NULL DEFAULT '0',
          comment_count int(11) NOT NULL DEFAULT '0',
          latest varchar(100),
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

    await connection.manager.query(sql);

    sql = `CREATE TABLE handbook_chapters (
          id int(11) unsigned NOT NULL AUTO_INCREMENT,
          created_at datetime NOT NULL,
          updated_at datetime NOT NULL,
          name varchar(200) NOT NULL DEFAULT '',
          browse_count int(11) unsigned NOT NULL,
          comment_count int(11) unsigned NOT NULL,
          root_comment_count int(11) unsigned NOT NULL,
          html_content text,
          word_count int(11) DEFAULT '0',
          try_read tinyint(1) DEFAULT '0',
          user_id int(11) unsigned NOT NULL,
          book_id int(11) unsigned NOT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE book_stars (
          id int(11) unsigned NOT NULL AUTO_INCREMENT,
          created_at datetime NOT NULL,
          star int(11),
          html_content varchar(200) NOT NULL DEFAULT '',
          status int(11) NOT NULL ,
          user_id int(11) unsigned NOT NULL,
          book_id int(11) unsigned NOT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE tags (
          id int(11) unsigned NOT NULL AUTO_INCREMENT,
          created_at datetime NOT NULL,
          updated_at datetime NOT NULL,
          name varchar(200) NOT NULL DEFAULT '',
          follower_count int(11) unsigned NOT NULL,
          article_count int(11) unsigned NOT NULL,
          icon_url varchar(500) DEFAULT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE tag_category (
          tag_id int(11) unsigned NOT NULL,
          category_id int(11) unsigned NOT NULL,
          PRIMARY KEY (tag_id, category_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE user_subscribed_tag (
          user_id int(11) unsigned NOT NULL,
          tag_id int(11) unsigned NOT NULL,
          created_at datetime NOT NULL,
          PRIMARY KEY (user_id, tag_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE draft_tag (
          draft_id int(11) unsigned NOT NULL,
          tag_id int(11) unsigned NOT NULL,
          PRIMARY KEY (draft_id, tag_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE article_tag (
          article_id int(11) unsigned NOT NULL,
          tag_id int(11) unsigned NOT NULL,
          PRIMARY KEY (article_id, tag_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE like_bookchapter_comments (
          comment_id int(11) unsigned NOT NULL,
          user_id int(11) unsigned NOT NULL,
          created_at datetime NOT NULL,
          PRIMARY KEY (comment_id, user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;
    await connection.manager.query(sql);

    await connection.manager.query(`CREATE TABLE like_articles (
            user_id int(11) unsigned NOT NULL,
            article_id int(11) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (user_id, article_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    await connection.manager.query(`CREATE TABLE user_follower (
            user_id int(11) unsigned NOT NULL,
            follower_id int(11) unsigned NOT NULL,
            created_at datetime NOT NULL,
            PRIMARY KEY (user_id, follower_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    sql = `CREATE TABLE settings (
            id int(11) unsigned NOT NULL AUTO_INCREMENT,
            editor_type int(11) NOT NULL,
            user_id int(11) unsigned NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY user_id (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE drafts (
            id int(11) unsigned NOT NULL AUTO_INCREMENT,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            deleted_at datetime DEFAULT NULL,
            name varchar(200) NOT NULL,
            cover_url varchar(500) DEFAULT NULL,
            word_count int(11) unsigned NOT NULL DEFAULT '0',
            content text,
            html_content text,
            content_type int(11) NOT NULL,
            user_id int(11) unsigned NOT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE draft_category (
            draft_id int(11) unsigned NOT NULL,
            category_id int(11) unsigned NOT NULL,
            PRIMARY KEY (draft_id, category_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE collections (
            id int(11) unsigned NOT NULL AUTO_INCREMENT,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL,
            deleted_at datetime DEFAULT NULL,
            name varchar(200) NOT NULL,
            article_count int(11) unsigned NOT NULL DEFAULT '0',
            follower_count int(11) unsigned NOT NULL DEFAULT '0',
            announcement varchar(500) DEFAULT '',
            allow_post tinyint(1) unsigned NOT NULL DEFAULT '0',
            post_must_audit tinyint(1) unsigned NOT NULL DEFAULT '0',
            cover_url varchar(500) NOT NULL,
            creator_id int(11) unsigned NOT NULL,
            PRIMARY KEY (id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE article_collection (
            article_id int(11) unsigned NOT NULL,
            collection_id int(11) unsigned NOT NULL,
            status int(11) unsigned NOT NULL,
            PRIMARY KEY (article_id, collection_id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE user_collection (
            user_id int(11) unsigned NOT NULL,
            collection_id int(11) unsigned NOT NULL,
            PRIMARY KEY (user_id, collection_id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE follower_collection (
            user_id int(11) unsigned NOT NULL,
            collection_id int(11) unsigned NOT NULL,
            date datetime,
            PRIMARY KEY (user_id, collection_id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE contributor_collection (
            user_id int(11) unsigned NOT NULL,
            collection_id int(11) unsigned NOT NULL,
            PRIMARY KEY (user_id, collection_id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE post_message (
            id int(11) unsigned NOT NULL AUTO_INCREMENT,
            created_at datetime NOT NULL,
            author_id int(11) unsigned NOT NULL,
            user_id int(11) unsigned NOT NULL,
            article_id int(11) unsigned NOT NULL,
            collection_id int(11) unsigned NOT NULL,
            status int(11) unsigned NOT NULL,
            PRIMARY KEY (id)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE boilingpoint_topics (
          id int(11) unsigned NOT NULL AUTO_INCREMENT,
          created_at datetime NOT NULL,
          updated_at datetime NOT NULL,
          sequence int(11) unsigned NOT NULL,
          name varchar(200) NOT NULL,
          icon varchar(500) NOT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    sql = `CREATE TABLE boilingpoints (
          id int(11) unsigned NOT NULL AUTO_INCREMENT,
          created_at datetime NOT NULL,
          html_content varchar(2000) NOT NULL,
          summary varchar(100) NOT NULL,
          imgs varchar(2000),
          user_id int(11) unsigned NOT NULL,
          topic_id int(11) unsigned,
          browse_count int(11) unsigned NOT NULL DEFAULT 0,
          comment_count int(11) unsigned NOT NULL DEFAULT 0,
          root_comment_count int(11) NOT NULL DEFAULT 0,
          liked_count int(11) unsigned NOT NULL DEFAULT 0,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
    await connection.manager.query(sql);

    await connection.manager.query(`CREATE TABLE like_boilingpoints (
          user_id int(11) unsigned NOT NULL,
          boilingpoint_id int(11) unsigned NOT NULL,
          created_at datetime NOT NULL,
          PRIMARY KEY (user_id, boilingpoint_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    await connection.manager.query(`CREATE TABLE boilingpoint_reports (
          id int(11) unsigned NOT NULL AUTO_INCREMENT,
          boilingpoint_id int(11) unsigned NOT NULL,
          reason tinyint NOT NULL,
          created_at datetime NOT NULL,
          reporter int(11) unsigned NOT NULL,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    // tslint:disable-next-line:no-console
    console.log('tables done');
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log('Error: ', error);
    process.exit(-1);
  }
};