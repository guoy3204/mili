<template>
  <div class="post-list-box">
    <div class="sub-header">
      <div class="sub-header-title">赞</div>
      <div class="sub-type-box">
        <router-link :to="`/uc/${author.id}/like/articles`" class="sub-type active">文章</router-link>
        <router-link :to="`/uc/${author.id}/like/boilings`" class="sub-type">圈子</router-link>
      </div>
    </div>
    <Pinterest :url="`/articles/users/${author.id}/like`" @load="onLoad">
      <template v-slot:loading>
        <div style="padding: 20px; padding-top: 10px;">
          <ArticleLoading />
        </div>
      </template>
      <template v-slot:content>
        <div>
          <div class="article-list">
            <ArticleItem :key="article.id" v-for="article in articles" :article="article" />
          </div>
        </div>
      </template>
    </Pinterest>
    <div v-if="isEmpty" class="empty-box">
      <img src="../../../images/user/emptybox.svg" />
      <div class="empty-text">这里什么都没有</div>
    </div>
  </div>
</template>

<script>
import ArticleLoading from '~/js/components/article/ArticleLoading.vue';
import ArticleItem from '~/js/components/article/ArticleItem.vue';
import Pinterest from '~/js/components/common/Pinterest.vue';

export default {
  data() {
    return {
      author: window.author,
      articles: [],
      isEmpty: false,
    };
  },
  mounted() {
    this.$nextTick(() => {});
  },
  methods: {
    onLoad(result) {
      this.articles = this.articles.concat(result.data.data.list);
      if (!result.data.data.count) {
        this.isEmpty = true;
      }
    },
  },
  components: {
    ArticleLoading,
    ArticleItem,
    Pinterest,
  },
};
</script>

<style lang="scss" scoped>
.article-list {
  width: 100%;
}

.article-list-item {
  padding: 20px;
}
</style>
