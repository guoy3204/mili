import {
    Controller, Get, Param, Query, Res, Post, Body, UseGuards, Put, Delete,
} from '@nestjs/common';
import * as _ from 'lodash';
import * as bluebird from 'bluebird';
import { ArticleService } from './article.service';
import { UserService } from '../user/user.service';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { ConfigService } from '../config/config.service';
import { Article } from '../entity/article.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { OSSService } from '../common/oss.service';
import { CollectionService } from './collection.service';
import { Collection, ArticleCollectionStatus } from '../entity/collection.entity';
import { ErrorCode } from '../constants/error';
import { MyHttpException } from '../core/exception/my-http.exception';
import { CurUser } from '../core/decorators/user.decorator';
import { ActiveGuard } from '../core/guards/active.guard';
import { User, Follower } from '../entity/user.entity';
import { ParsePagePipe } from '../core/pipes/parse-page.pipe';

@Controller()
export class CollectionController {
    constructor(
        private readonly articleService: ArticleService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly ossService: OSSService,
        private readonly collectionService: CollectionService,
    ) { }

    @Get('/collections/:id.html')
    async detail(@Param('id', MustIntPipe) id: number, @CurUser() user, @Res() res) {
        const pageSize: number = 2;
        const [articles, collection, articleCount, isFollowed, followers] = await bluebird.all([
            this.articleService.collectionArticlesSortByCommentCount(id, 1, pageSize),
            this.collectionService.findById(id),
            this.collectionService.articleCount(id),
            user ? this.collectionService.isFollowed(user.id, id) : Promise.resolve(false),
            this.collectionService.getFollowers(id, 1),
        ]);
        if (!collection) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        let creatorIndex: number;
        let isCollectionAdmin: boolean = false;
        collection.admins.forEach((u: User, index: number) => {
            if (u.id === collection.creatorID) {
                creatorIndex = index;
            }
            if (u.id === user.id) {
                isCollectionAdmin = true;
            }
        });
        if (creatorIndex > 0) {
            [collection.admins[0], collection.admins[creatorIndex]] = [collection.admins[creatorIndex], collection.admins[0]];
        }

        res.render('pages/collection/collection', {
            isFollowed,
            isCreator: user && user.id === collection.creatorID,
            articles,
            articleCount: articleCount || 0,
            collection,
            isCollectionAdmin,
            followers,
        });
    }

    @Get('/collections/new')
    @UseGuards(ActiveGuard)
    async createView(@Res() res) {
        const uploadPolicy = await this.ossService.requestPolicy(res.locals.globalConfig.csrfToken);
        res.render('pages/collection/edit', {
            uploadPolicy,
            collection: {},
        });
    }

    @Get('/collections/:id/edit.html')
    @UseGuards(ActiveGuard)
    async editView(@CurUser() user, @Param('id', MustIntPipe) id: number, @Res() res) {
        const [collection, uploadPolicy] = await bluebird.all([
            this.collectionService.findById(id),
            this.ossService.requestPolicy(res.locals.globalConfig.csrfToken),
        ]);
        if (!collection) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (collection.creatorID !== user.id) {
            res.redirect(`/u/${user.id}.html`);
            return;
        }
        res.render('pages/collection/edit', {
            uploadPolicy,
            collection,
        });
    }

    @Get('/api/v1/collections/searchbypublish')
    @UseGuards(ActiveGuard)
    async searchByPublish(@CurUser() user, @Query('q') keyword: string) {
        // 排除掉自己创建或管理的专题
        const collections = await this.collectionService.searchByPublish(keyword, user.id);
        return collections;
    }

    @Post('/api/v1/collections')
    @UseGuards(ActiveGuard)
    async create(@CurUser() user, @Body() createCollectionDto: CreateCollectionDto) {
        const collection: Collection = await this.collectionService.create(createCollectionDto, user.id);
        return collection;
    }

    @Put('/api/v1/collections/:id')
    @UseGuards(ActiveGuard)
    async update(@CurUser() user, @Param('id', MustIntPipe) id: number,
        @Body() createCollectionDto: CreateCollectionDto) {
        return await this.collectionService.updateOne(createCollectionDto, id, user.id);
    }

    // 投稿
    @Post('/api/v1/collections/:collectionID/articles/:articleID')
    @UseGuards(ActiveGuard)
    async addArticle(@CurUser() user, @Param('collectionID', MustIntPipe) collectionID: number,
        @Param('articleID', MustIntPipe) articleID: number) {
        const [collection, article] = await Promise.all([
            this.collectionService.findById(collectionID),
            this.articleService.detail(articleID),
        ]);
        if (!collection) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (!article) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (article.user.id !== user.id) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }
        const index: number = collection.admins.findIndex((admin: User) => {
            return admin.id === user.id;
        });

        let status: number = ArticleCollectionStatus.Auditing;
        if (index >= 0) {
            status = ArticleCollectionStatus.Collected;
        }
        await this.collectionService.addArticle(user.id, collection, articleID, status);
        return {
            status,
        };
    }

    @Delete('/api/v1/collections/:collectionID/articles/:articleID')
    @UseGuards(ActiveGuard)
    async removeArticle(@CurUser() user, @Param('collectionID', MustIntPipe) collectionID: number,
        @Param('articleID', MustIntPipe) articleID: number) {
        const [collection, article] = await Promise.all([
            this.collectionService.findById(collectionID),
            this.articleService.detail(articleID),
        ]);
        if (!collection) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (!article) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (article.user.id !== user.id) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }

        await this.collectionService.removeArticle(collectionID, articleID);
        return {};
    }

    @Put('/api/v1/collections/:collectionID/articles/:articleID/:messageID/:status')
    @UseGuards(ActiveGuard)
    async receiveArticle(@CurUser() user, @Param('collectionID', MustIntPipe) collectionID: number,
        @Param('articleID', MustIntPipe) articleID: number,
        @Param('messageID', MustIntPipe) messageID: number,
        @Param('status', MustIntPipe) status: number) {
        // todo: 是管理员才允许接受投稿
        await this.collectionService.receiveArticle(collectionID, articleID, messageID, status);
        return {
            status,
        };
    }

    @Get('/api/v1/collections/:id/myarticles')
    @UseGuards(ActiveGuard)
    async myArticles(@CurUser() user, @Param('id', MustIntPipe) id: number, @Query('page', ParsePagePipe) page: number,
        @Query('q') keyword: string) {
        const pageSize: number = 20;
        let articles: Article[];
        keyword = _.trim(keyword || '');
        keyword = decodeURIComponent(keyword);
        if (keyword) {
            articles = await this.articleService.userArticlesByLike(user.id, keyword, page, pageSize);
        } else {
            articles = await this.articleService.userArticlesSortByCreatedAt(user.id, page, pageSize);
        }
        const articleIDs: number[] = articles.map((article: Article) => article.id);
        const collectedArticleMap = {};
        if (articles.length) {
            const collectedArticles = await this.collectionService.articlesStatusInCollection(id, articleIDs);
            collectedArticles.forEach(colArticle => collectedArticleMap[colArticle.article_id] = colArticle);
        }
        const myArticles = [];
        articles.map(article => {
            const theArticle: any = _.pick(article, ['id', 'name']);
            if (collectedArticleMap[article.id]) {
                theArticle.collectionStatus = collectedArticleMap[article.id].status;
            } else {
                theArticle.collectionStatus = ArticleCollectionStatus.NotCollect;
            }
            myArticles.push(theArticle);
        });
        return myArticles;
    }

    @Delete('/api/v1/collections/:id')
    @UseGuards(ActiveGuard)
    async removeCollection(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        const collection: Collection = await this.collectionService.findById(id);
        if (!collection) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        if (collection.creatorID !== user.id) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }
        await this.collectionService.deleteCollection(collection.id);
        return {};
    }

    @Post('/api/v1/collections/:id/follow')
    @UseGuards(ActiveGuard)
    async follow(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        const collection: Collection = await this.collectionService.findById(id);
        if (!collection) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        await this.collectionService.addFollower(collection.id, user.id);
        return {};
    }

    @Delete('/api/v1/collections/:id/follow')
    @UseGuards(ActiveGuard)
    async cancelFollow(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        const collection: Collection = await this.collectionService.findById(id);
        if (!collection) {
            throw new MyHttpException({
                errorCode: ErrorCode.NotFound.CODE,
            });
        }
        await this.collectionService.removeFollower(collection.id, user.id);
        return {};
    }

    @Get('/api/v1/collections/:id/followers')
    @UseGuards(ActiveGuard)
    async followers(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        const followers: Follower[] = await this.collectionService.getFollowers(id, 1);
        return followers;
    }
}