import { createConnection } from 'typeorm';
import { ConfigService } from '../config/config.service';
import { MyLoggerService } from '../common/logger.service';
import { tablesRun } from './tables';
import { addColumn } from './addColumn';
import { commentRun } from './comment';
import { commentRoot } from './commentRoot';
import { mdToHTMLRun } from './mdToHTML';
import { queryRun } from './query';
import { renameTableRun } from './renameTable';
import { userRun } from './user';
import { chapterMDToHTMLRun } from './s_book_chapters';
import { updateRootCommentCountRun as updateRootCommentCountRun } from './updateRootCommentCount';
import { updateUserArticleCountRun } from './updateUserArticleCount';
import { updateUserArticleViewCountRun } from './updateUserArticleViewCount';
import { updateUserLikedCountRun } from './updateUserLikedCount';

const config = new ConfigService();
const logger = new MyLoggerService();

async function insertAdmin(connection) {
    const sql = `INSERT INTO users (id, created_at, updated_at, deleted_at, activated_at, username, email,
        phone, pass, article_count, collect_count, introduce, role, status, avatar_url, cover_url,
        comment_count, sex, location, word_count, value, article_view_count, follow_count, boilingpoint_count,
        follower_count, follow_tag_count, collection_count, liked_count, u_like_count, u_article_like_count,
        u_bp_like_count, job, company, personal_hp, oauth_id, oauth_avatar_url, oauth_login, oauth_name,
        weibo_id, weibo_avatar_large, weibo_screen_name, weibo_name)
        VALUES
            (44, '2017-08-20 16:01:08', '2019-09-04 00:11:40', NULL, '2017-08-20 16:01:08', 'shen100',
            'liushen_shen@163.com', '', '150321606850159a1dc80fffd0ee9b9674c721aa77', 61, 4,
            '', 3, 2, 'http://www.cms.com/images/test/admin.png',
            '', 89, 0, '', 0, 0, 58984, 2, 10, 1, 0, 0, 10, 0, 0, 0,
            '站长', '点点', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`;
    return await connection.manager.query(sql);
}

async function insertCrawler(connection) {
    const sql = `INSERT INTO users (id, created_at, updated_at, deleted_at, activated_at, username, email,
        phone, pass, article_count, collect_count, introduce, role, status, avatar_url, cover_url,
        comment_count, sex, location, word_count, value, article_view_count, follow_count,
        boilingpoint_count, follower_count, follow_tag_count, collection_count, liked_count, u_like_count,
        u_article_like_count, u_bp_like_count, job, company, personal_hp, oauth_id, oauth_avatar_url, oauth_login,
        oauth_name, weibo_id, weibo_avatar_large, weibo_screen_name, weibo_name)
        VALUES
            (84, '2017-11-06 23:20:00', '2019-07-06 17:23:56', NULL, '2017-11-06 23:20:00', '超级苦工',
            '', '', '150321606850159a1dc80fffd0ee9b9674c721aa77', 1771, 0, '请叫我超级苦工~', 5, 2,
            'http://dev.cms.com/images/test/crawler.png', NULL, 0, 0,
            NULL, 0, 0, 317486, 1, 0, 5, 0, 0, 6, 0, 0, 0, NULL, NULL, NULL, NULL, NULL,
            NULL, NULL, NULL, NULL, NULL, NULL)`;
    return await connection.manager.query(sql);
}

(async function run() {
    const connection = await createConnection(config.db);
    // await tablesRun(connection)
    // await insertAdmin(connection);
    // await insertCrawler(connection);
    // await addColumn(connection);
    // await commentRun(connection);
    // await commentRoot(connection);
    // await mdToHTMLRun(connection);

    await queryRun(connection);
    // await renameTableRun(connection);
    // await chapterMDToHTMLRun(connection);
    // await updateRootCommentCountRun(connection);
    // await updateUserArticleCountRun(connection);
    // await updateUserArticleViewCountRun(connection);
    // await updateUserLikedCountRun(connection);
    // await updateUserLikedCountRun(connection);
    // await userRun(connection, config);

    logger.info({ message: 'init db done' });

    process.exit(0);
}());