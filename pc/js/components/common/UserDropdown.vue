<template>
  <div class="navbar-user" v-clickoutside="clickOutside">
    <div id="userDropdownBox" class="user" :class="{open: !isOutside}">
      <div @click="onAvatarClick">
        <a class="avatar" href="javascript:void(0);">
          <img :src="theAvatarURL" />
        </a>
      </div>
      <ul class="dropdown-menu" :style="menuStyle[menuAlign]">
        <li>
          <a href="/editor/drafts/new">
            <i class="fa fa-pencil"></i>
            <span>写文章</span>
          </a>
        </li>
        <li v-if="userID === 44">
          <a href="/handbooks/new">
            <i class="fa fa-book" aria-hidden="true"></i>
            <span>写小书</span>
          </a>
        </li>
        <li>
          <a href="/editor/drafts">
            <i class="fa fa-file-text" aria-hidden="true"></i>
            <span>草稿</span>
          </a>
        </li>
        <li class="dropdown-menu-sep"></li>
        <li>
          <a :href="`/uc/${userID}`">
            <i class="iconfont ic-navigation-profile"></i>
            <span>我的主页</span>
          </a>
        </li>
        <li>
          <a :href="`/uc/${userID}/like/articles`">
            <i class="fa fa-thumbs-up" aria-hidden="true"></i>
            <span>我赞过的</span>
          </a>
        </li>
        <li>
          <a :href="`/uc/${userID}/writehandbooks`">
            <i class="fa fa-sticky-note" aria-hidden="true"></i>
            <span>我的小书</span>
          </a>
        </li>
        <li>
          <a :href="`/uc/${userID}/collections`">
            <i class="fa fa-star" aria-hidden="true"></i>
            <span>我的收藏</span>
          </a>
        </li>
        <li>
          <a :href="`/uc/${userID}/buyhandbooks`">
            <i class="iconfont ic-paid"></i>
            <span>已购</span>
          </a>
        </li>
        <li class="dropdown-menu-sep"></li>
        <li>
          <a href="/tags">
            <i class="fa fa-tags" aria-hidden="true"></i>
            <span>标签管理</span>
          </a>
        </li>
        <li>
          <a href="/settings/profile">
            <i class="iconfont ic-navigation-settings"></i>
            <span>设置</span>
          </a>
        </li>
        <li class="dropdown-menu-sep"></li>
        <li>
          <a @click="onSignout">
            <i class="iconfont ic-navigation-signout"></i>
            <span>退出</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { addClass, removeClass, hasClass } from '~/js/utils/dom.js';
import { myHTTP } from '~/js/common/net.js';
import { ErrorCode } from '~/js/constants/error.js';
import { globalEventEmitter, EVENTS } from '~/js/utils/event.js';

export default {
  props: ['menuAlign', 'userID', 'avatarURL'],
  data() {
    return {
      theAvatarURL: this.avatarURL,
      menuStyle: {
        left: { left: 0 },
        right: { right: 0 },
      },
      isOutside: true,
    };
  },
  methods: {
    onSignout() {
      myHTTP.delete('/users/signout').then(res => {
        if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
          location.reload();
        }
      });
    },
    clickOutside() {
      this.isOutside = true;
    },
    onAvatarClick() {
      this.isOutside = !this.isOutside;
    },
    onAvatarChange(avatarURL) {
      this.theAvatarURL = avatarURL;
    },
  },
  mounted() {
    globalEventEmitter.on(EVENTS.USER_AVATAR_CHANGE, this.onAvatarChange, this);
  },
};
</script>

<style>
.navbar-user .avatar {
  width: 40px;
}
</style>
