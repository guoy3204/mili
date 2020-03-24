import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Collection } from './collection.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';

class UserScoreDef {
    readonly CreateArticle: number = 5;
}

export const UserScore = new UserScoreDef();

export enum UserRole {
    Normal = 1, // 普通用户
    Editor = 2, // 网站编辑
    Admin = 3, // 管理员
    SuperAdmin = 4, // 超级管理员
}

export enum UserStatus {
    InActive = 1, // 未激活
    Actived = 2, // 已激活
    Frozen = 3, // 已冻结
}

export enum UserSex {
    Male = 0, // 男
    Female = 1, // 女
    Unknown = 2, // 未知
}

export class Follower {
    constructor(
        public readonly id: number,
        public readonly username: string,
        public readonly avatarURL: string,
        public readonly date: Date,
    ) { }
}

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at' })
    createdAt: Date;

    @Column('datetime', { name: 'updated_at' })
    updatedAt: Date;

    @Column('datetime', { name: 'deleted_at', nullable: true, default: null })
    deletedAt: Date;

    @Column('datetime', { name: 'activated_at', nullable: true, default: null })
    activatedAt: Date; // 账号激活时间

    @Column('varchar', { length: 100 })
    username: string;

    @Column('varchar', { length: 50 })
    email: string;

    @Column('varchar', { length: 50, nullable: true, default: null })
    phone: string;

    @Exclude()
    @Column('varchar', { length: 100 })
    pass: string;

    @Column('int', { name: 'value', default: 0 })
    value: number; // 阅读值

    @Column('int', { name: 'article_count', default: 0 })
    articleCount: number;

    @Column('int', { name: 'article_view_count', default: 0 })
    articleViewCount: number; // 文章被阅读的次数

    @Column('int', { name: 'comment_count', default: 0 })
    commentCount: number;

    @Column('int', { name: 'word_count', default: 0 })
    wordCount: number; // 写了多少字

    @Column('int', { name: 'boilingpoint_count', default: 0 })
    boilingPointCount: number; // 圈子数量

    @Column('int', { name: 'follow_count', default: 0 })
    followCount: number; // 关注了多少人

    @Column('int', { name: 'follower_count', default: 0 })
    followerCount: number; // 被多少人关注

    @Column('int', { name: 'follow_tag_count', default: 0 })
    followTagCount: number; // 关注了多少个标签

    @Column('int', { name: 'liked_count', default: 0 })
    likedCount: number; // 获得多少个赞

    @Column('int', { name: 'u_like_count', default: 0 })
    uLikeCount: number; // 用户一共点了多少个赞

    @Column('int', { name: 'u_article_like_count', default: 0 })
    uArticleLikeCount: number; // 用户对文章点了多少个赞

    @Column('int', { name: 'u_bp_like_count', default: 0 })
    uBoilingPointLikeCount: number; // 用户对圈子点了多少个赞

    @Column('int', { name: 'collection_count', default: 0 })
    collectionCount: number; // 收藏的个数

    @Column('int')
    role: UserRole; // 角色

    @Column('int')
    status: UserStatus; // 用户状态

    @Column('varchar', { name: 'avatar_url', length: 500 })
    avatarURL: string; // 头像

    @Column('tinyint')
    sex: UserSex;

    @Column('varchar', { name: 'job', length: 100 })
    job: string;

    @Column('varchar', { name: 'company', length: 100 })
    company: string;

    @Column('varchar', { length: 200 })
    introduce: string; // 个人介绍

    @Column('varchar', { name: 'personal_hp', length: 100 })
    personalHomePage: string; // 个人主页

    @Column('int', { name: 'oauth_id', nullable: true, default: null })
    oauthID: number;

    @Column('varchar', { name: 'oauth_avatar_url', length: 500, nullable: true, default: null })
    oauthAvatarURL: string;

    @Column('varchar', { name: 'oauth_login', length: 100, nullable: true, default: null })
    oauthLogin: string;

    @Column('varchar', { name: 'oauth_name', length: 100, nullable: true, default: null })
    oauthName: string;

    @Column('int', { name: 'weibo_id', nullable: true, default: null })
    weiboID: number;

    @Column('varchar', { name: 'weibo_screen_name', length: 100, nullable: true, default: null })
    weiboScreenName: string;

    @Column('varchar', { name: 'weibo_name', length: 100, nullable: true, default: null })
    weiboName: string;

    @Column('varchar', { name: 'weibo_avatar_large', length: 500, nullable: true, default: null })
    weiboAvatarLarge: string;

    @Column('varchar', { length: 200, nullable: true, default: null })
    location: string;

    @ManyToMany(type => Category, category => category.followers)
    @JoinTable({
        name: 'follower_category',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'category_id',
            referencedColumnName: 'id',
        },
    })
    followedCategories: Category[]; // 关注的分类

    @ManyToMany(type => Tag, tag => tag.followers)
    @JoinTable({
        name: 'user_subscribed_tag',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'tag_id',
            referencedColumnName: 'id',
        },
    })
    followedTags: Tag[]; // 关注的标签

    @ManyToMany(type => Collection, collection => collection.admins)
    @JoinTable({
        name: 'user_collection',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'collection_id',
            referencedColumnName: 'id',
        },
    })
    collections: Collection[]; // 创建的专题

    @ManyToMany(type => Collection, collection => collection.followers)
    @JoinTable({
        name: 'follower_collection',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'collection_id',
            referencedColumnName: 'id',
        },
    })
    followedCollections: Collection[]; // 关注的专题

    @ManyToMany(type => Collection, collection => collection.contributors)
    @JoinTable({
        name: 'contributor_collection',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'collection_id',
            referencedColumnName: 'id',
        },
    })
    contributeCollections: Collection[]; // 投稿的专题
}