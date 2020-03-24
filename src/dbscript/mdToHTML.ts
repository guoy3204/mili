import { Article } from '../entity/article.entity';
import * as marked from 'marked';
import * as striptags from 'striptags';
import { MarkedConstants } from '../constants/article';

marked.setOptions(MarkedConstants.options);

let errCount = 0;

const summaryLenth = 500;
const summaryStripLenth = 100;

export const mdToHTMLRun = async function (connection) {
    const articleRepository = connection.getRepository(Article);

    try {
        await connection.manager.query(`alter table articles add column summary varchar(${summaryLenth})`);
        await connection.manager.query(`alter table articles add column root_comment_count int(11) NOT NULL DEFAULT '0'`);
        await connection.manager.query(`alter table articles add column liked_count int default 0`);
        await connection.manager.query(`alter table articles add column word_count int default 0`);
        await connection.manager.query(`alter table articles add column hot int default 0`);
        await connection.manager.query(`alter table articles add column cover_url varchar(500) DEFAULT NULL`);
        await connection.manager.query(`ALTER TABLE articles ADD INDEX (user_id, created_at)`);

        const articles = await articleRepository.find({
            select: {
                id: true,
                content: true,
                htmlContent: true,
                contentType: true,
            },
        });

        articles.forEach(async (article) => {
            let html;
            const updateData: any = {};
            if (article.contentType === 1) {
                html = marked(article.content);
                updateData.htmlContent = html;
            } else {
                html = article.htmlContent;
            }
            let summary = striptags(html);
            summary = summary.replace(/^\s+|\s+$/g, '');
            summary = summary.replace(/\s+|\n$/g, ' ');
            updateData.wordCount = summary.length;
            summary = summary.substr(0, summaryStripLenth);
            updateData.summary = summary;

            await articleRepository.update({
                id: article.id,
            }, updateData);
        });

        // tslint:disable-next-line:no-console
        console.log('articles.length:', articles.length);
        // tslint:disable-next-line:no-console
        console.log('errCount', errCount);
        // tslint:disable-next-line:no-console
        console.log('mdToHTML done');
    } catch (error) {
        errCount++;
        // tslint:disable-next-line:no-console
        console.log('Error: ', error);
        // tslint:disable-next-line:no-console
        console.log('errCount: ', errCount);
        process.exit(-1);
    }
};