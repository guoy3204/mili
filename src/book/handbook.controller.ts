import {
    Controller, Post, Body, UseGuards, Get, Param, Delete, Res, Put, Query,
} from '@nestjs/common';
import * as _ from 'lodash';
import { ErrorCode } from '../constants/error';
import { MyHttpException } from '../core/exception/my-http.exception';
import { CurUser } from '../core/decorators/user.decorator';
import { MustIntPipe } from '../core/pipes/must-int.pipe';
import { ConfigService } from '../config/config.service';
import { ActiveGuard } from '../core/guards/active.guard';
import { HandBookService } from './handbook.service';
import { OSSService } from '../common/oss.service';
import { APIPrefix } from '../constants/constants';
import {
    UpdateHandBookChapterContentDto,
    UpdateHandBookChapterTryReadDto,
    UpdateHandBookChapterDto,
} from './dto/update-handbook-chapter.dto';
import { UpdateHandBookIntroduceDto, UpdateHandBookDto } from './dto/update-handbook.dto';
import { RolesGuard } from '../core/guards/roles.guard';
import { Roles } from '../core/decorators/roles.decorator';
import { UserRole } from '../entity/user.entity';
import { CreateHandBookDto } from './dto/create-handbook.dto';
import { ParsePagePipe } from '../core/pipes/parse-page.pipe';

@Controller()
export class HandBookController {
    constructor(
        private readonly configService: ConfigService,
        private readonly handBookService: HandBookService,
        private readonly ossService: OSSService,
    ) { }

    @Get('/handbooks')
    async listView(@CurUser() user, @Res() res) {
        const data = {
            icp: this.configService.server.icp,
            categories: [
                {
                    name: '前端',
                },
                {
                    name: '通用',
                },
            ],
            handbooks: [
                {},
            ],
        };
        res.render('pages/handbook/handbooks.njk', data);
    }

    /**
     * 创建小册的页面
     */
    @Get('/handbooks/new')
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async createView(@Res() res) {
        const uploadPolicy = await this.ossService.requestPolicy(res.locals.globalConfig.csrfToken);
        res.render('pages/handbook/editHandbook', {
            siteName: this.configService.server.siteName,
            companyName: this.configService.server.companyName,
            uploadPolicy,
        });
    }

    @Get('/handbooks/:id')
    async detailView(@CurUser() user, @Res() res) {
        res.render('pages/handbook/handbookDetail.njk', {
            handbooks: [
                {},
            ],
        });
    }

    /**
     * 编辑小册章节的页面
     */
    @Get('/handbooks/:handbookID/chapters/:chapterID/edit')
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async editView(@Param('handbookID', MustIntPipe) handbookID: number, @Param('chapterID') chapterID: string, @Res() res) {
        const uploadPolicy = await this.ossService.requestPolicy(res.locals.globalConfig.csrfToken);
        res.render('pages/handbook/editHandbook', {
            siteName: this.configService.server.siteName,
            companyName: this.configService.server.companyName,
            uploadPolicy,
        });
    }

    /**
     * 小册详请
     */
    @Get(`${APIPrefix}/handbooks/:id`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async handBookDetail(@Param('id', MustIntPipe) id: number) {
        return await this.handBookService.detail(id);
    }

    /**
     * 章节详请
     */
    @Get(`${APIPrefix}/handbooks/chapters/:id`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async chapterDetail(@Param('id', MustIntPipe) id: number) {
        return await this.handBookService.getChapter(id);
    }

    @Get(`${APIPrefix}/handbooks/:id/chapters`)
    @UseGuards(ActiveGuard)
    async getChapters(@Param('id', MustIntPipe) id: number) {
        return await this.handBookService.getChapters(id);
    }

    /**
     * 用户已购买的小册
     */
    @Get(`${APIPrefix}/handbooks/users/:userID/buy`)
    async userBuyHandBooks(@CurUser() user) {
        return {
            list: [
                {},
                {},
                {},
                {},
            ],
            count: 4,
            page: 1,
            pageSize: 20,
        };
    }

    /**
     * 撰写的小册
     */
    @Get(`${APIPrefix}/handbooks/users/:id/my`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async myHandBooks(@Param('id', MustIntPipe) authorID: number, @Query('page', ParsePagePipe) page: number) {
        const pageSize = 20;
        return await this.handBookService.getMyHandBooks(authorID, page, pageSize);
    }

    /**
     * 创建小册
     */
    @Post(`${APIPrefix}/handbooks`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async create(@CurUser() user, @Body() dto: CreateHandBookDto) {
        const createResult = await this.handBookService.create(user.id, dto);
        return {
            id: createResult.id,
        };
    }

    /**
     * 创建小册的章节
     */
    @Post(`${APIPrefix}/handbooks/:id/chapters`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async createChapter(@CurUser() user, @Param('id', MustIntPipe) id: number, @Body() dto: UpdateHandBookChapterDto) {
        const isHandbookOwner = this.handBookService.isOwner(id, user.id);
        if (!isHandbookOwner) {
            throw new MyHttpException({
                errorCode: ErrorCode.Forbidden.CODE,
            });
        }
        const createResult = await this.handBookService.createChapter(id, dto.name, user.id);
        return {
            id: createResult.id,
            name: dto.name,
        };
    }

    /**
     * 更新小册的章节标题
     */
    @Put(`${APIPrefix}/handbooks/chapters/:id/title`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async updateChapterTitle(@CurUser() user, @Param('id', MustIntPipe) id: number, @Body() dto: UpdateHandBookChapterDto) {
        await this.handBookService.updateChapterTitle(id, dto.name, user.id);
        return {
            name: dto.name,
        };
    }

    /**
     * 更新小册介绍
     */
    @Put(`${APIPrefix}/handbooks/:id/introduce`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async updateHandBookIntroduce(@CurUser() user, @Param('id', MustIntPipe) id: number, @Body() dto: UpdateHandBookIntroduceDto) {
        await this.handBookService.updateIntroduce(id, dto.introduce, user.id);
        return {};
    }

    /**
     * 更新小册
     */
    @Put(`${APIPrefix}/handbooks/:id`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async updateHandbook(@CurUser() user, @Param('id', MustIntPipe) id: number, @Body() dto: UpdateHandBookDto) {
        if (!dto.isAgree) {
            throw new MyHttpException({
                message: '请先同意小册线上协议',
            });
        }
        await this.handBookService.updateHandBook(id, dto, user.id);
        return {};
    }

    /**
     * 更新章节内容
     */
    @Put(`${APIPrefix}/handbooks/chapters/:id/content`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async updateChapterContent(@CurUser() user, @Param('id', MustIntPipe) id: number, @Body() dto: UpdateHandBookChapterContentDto) {
        await this.handBookService.updateChapterContent(id, dto.content, user.id);
        return {
        };
    }

    /**
     * 章节试读
     */
    @Put(`${APIPrefix}/handbooks/chapters/:id/tryread`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async updateChapterTryRead(@CurUser() user, @Param('id', MustIntPipe) id: number, @Body() dto: UpdateHandBookChapterTryReadDto) {
        await this.handBookService.updateChapterTryRead(id, dto.tryRead, user.id);
        return {
            tryRead: dto.tryRead,
        };
    }

    /**
     * 删除章节
     */
    @Delete(`${APIPrefix}/handbooks/chapters/:id`)
    @UseGuards(ActiveGuard, RolesGuard)
    @Roles(UserRole.Admin)
    async deleteChapter(@CurUser() user, @Param('id', MustIntPipe) id: number) {
        await this.handBookService.deleteChapter(id, user.id);
        return {};
    }
}