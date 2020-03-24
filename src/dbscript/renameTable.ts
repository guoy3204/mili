export const renameTableRun = async (connection) => {
    await connection.manager.query('rename table user_like_articles to like_articles');
};