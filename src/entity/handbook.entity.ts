import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { HandBookChapterComment } from './comment.entity';

@Entity({ name: 'handbooks' })
export class HandBook {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at' })
    createdAt: Date;

    @Column('datetime', { name: 'updated_at' })
    updatedAt: Date;

    @Column('varchar', { length: 200 })
    name: string;

    @Column('text', { nullable: true, default: null })
    introduce: string;

    @Column('varchar', { name: 'summary', length: 200 })
    summary: string; // 摘要

    @Column('varchar', { name: 'author_intro', length: 200 })
    authorIntro: string; // 作者简介

    @Column('int', { name: 'price' })
    price: number;

    @Column('datetime', { name: 'completion_at' })
    completionAt: Date; // 小书完成时间

    @Column('boolean', { name: 'is_all_done' })
    isAllDone: boolean; // 所有章节已完成

    @Column('boolean', { name: 'is_agree' })
    isAgree: boolean;

    @Column('varchar', { name: 'cover_url', length: 500 })
    coverURL: string; // 封面图片

    @Column('int', { name: 'word_count' })
    wordCount: number; // 小书一共写了多少字

    @Column('int', { name: 'sale_count' })
    saleCount: number;

    @Column('int', { name: 'comment_count' })
    commentCount: number;

    @Column('int', { name: 'user_id' })
    userID: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}

@Entity({ name: 'handbook_chapters' })
export class HandBookChapter {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'created_at' })
    createdAt: Date;

    @Column('datetime', { name: 'updated_at' })
    updatedAt: Date;

    @Column('varchar', { length: 200 })
    name: string;

    @Column('int', { name: 'browse_count' })
    browseCount: number;

    @Column('int', { name: 'comment_count' })
    commentCount: number;

    @Column('int', { name: 'root_comment_count' })
    rootCommentCount: number;

    @Column('tinyint', { name: 'try_read' })
    tryRead: boolean;

    @Column('text', { nullable: true, default: null })
    content: string;

    @Column('text', { name: 'html_content', nullable: true, default: null })
    htmlContent: string;

    @Column('int', { name: 'word_count' })
    wordCount: number;

    @Column('int', { name: 'user_id' })
    userID: number;

    @ManyToOne(type => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('int', { name: 'book_id' })
    bookID: number;

    @ManyToOne(type => HandBook)
    @JoinColumn({ name: 'book_id' })
    book: HandBook;

    @OneToMany(type => HandBookChapterComment, comment => comment.chapter)
    comments: HandBookChapterComment[];
}