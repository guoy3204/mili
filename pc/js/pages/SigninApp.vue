<template>
  <div id="app" class="main">
    <transition
      name="custom-classes-transition"
      enter-active-class="animated shake"
      leave-active-class="animated fadeOutUp"
    >
      <div v-if="errorVisible" class="sign-error-msg">{{errorMsg}}</div>
    </transition>
    <h4 class="title">
      <div class="normal-title">
        <a class="active" href="/signin">登录</a>
        <b>·</b>
        <a id="js-sign-up-btn" href="/signup">注册</a>
      </div>
    </h4>
    <div class="js-sign-in-container">
      <form method="post">
        <div class="input-prepend restyle js-normal">
          <input v-model="login" placeholder="用户名或手机号" type="text" />
          <i class="iconfont ic-user"></i>
        </div>
        <div class="input-prepend">
          <input v-model="password" placeholder="密码" type="password" />
          <i class="iconfont ic-password"></i>
        </div>
        <div class="remember-btn">
          <input type="checkbox" value="true" checked="checked" />
          <span>记住我</span>
        </div>
        <div class="forget-btn">
          <a data-toggle="dropdown" href>登录遇到问题?</a>
          <ul class="dropdown-menu">
            <li>
              <a href>用手机号重置密码</a>
            </li>
            <li>
              <a href>用邮箱重置密码</a>
            </li>
            <li>
              <a target="_blank" href>无法用海外手机号登录</a>
            </li>
            <li>
              <a target="_blank" href>无法用 Google 帐号登录</a>
            </li>
          </ul>
        </div>
        <button @click="onSubmit" class="sign-in-button" type="button">
          <span id="sign-in-loading"></span>
          登录
        </button>
      </form>
      <div class="more-sign">
        <h6>社交帐号登录</h6>
        <ul>
          <li>
            <a class="weixin" target="_blank" href="/users/signin/oauth">
              <i class="iconfont ic-wechat"></i>
            </a>
          </li>
          <li class>
            <a class="weibo" target="_blank" href="/users/signin/weibo">
              <i class="iconfont ic-weibo"></i>
            </a>
          </li>
        </ul>
        <div class="weibo-geetest-captcha"></div>
      </div>
    </div>
  </div>
</template>

<script>
import validator from 'validator';
import { ErrorCode } from '~/js/constants/error.js';
import { myHTTP } from '~/js/common/net.js';

export default {
  data: function() {
    return {
      captchaDisabled: window.captchaDisabled,
      login: '',
      password: '',
      errorVisible: false,
      errorDisplayDur: 10000,
      geetestCaptcha: null,
    };
  },
  mounted: function() {
    // 如果禁用验证码的话，就不请求配置
    if (this.captchaDisabled) {
      return;
    }
    const self = this;
    const url = '/users/geetestconfig';
    myHTTP.get(url).then(result => {
      const data = result.data.data;
      initGeetest(
        {
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: true,
          product: 'bind',
        },
        function(captchaObj) {
          self.geetestCaptcha = captchaObj;
          self.geetestCaptcha.onSuccess(function() {
            self.submit();
          });
        },
      );
    });
  },
  methods: {
    verifyData: function() {
      let login = (this.login || '').replace(/^\s+|\s+$/, '');
      this.login = login;
      if (!login) {
        this.errorVisible = true;
        this.errorMsg = '用户名或手机号不能为空';
        setTimeout(() => {
          this.errorVisible = false;
        }, this.errorDisplayDur);
        return false;
      }
      if (!this.password) {
        this.errorVisible = true;
        this.errorMsg = '密码不能为空';
        setTimeout(() => {
          this.errorVisible = false;
        }, this.errorDisplayDur);
        return false;
      }
      return true;
    },
    onSubmit: function() {
      // 如果禁用验证码的话，直接提交
      if (this.captchaDisabled) {
        this.submit();
        return;
      }
      if (!this.verifyData()) {
        return;
      }
      if (this.geetestCaptcha) {
        this.geetestCaptcha.verify();
      }
    },
    submit: function() {
      if (!this.verifyData()) {
        return;
      }
      this.errorVisible = false;

      let captchaResult;
      if (!this.captchaDisabled) {
        captchaResult = this.geetestCaptcha.getValidate();
      }
      captchaResult = captchaResult || {
        geetest_challenge: '-',
        geetest_validate: '-',
        geetest_seccode: '-',
      };

      let reqData = {
        geetest_challenge: captchaResult.geetest_challenge,
        geetest_validate: captchaResult.geetest_validate,
        geetest_seccode: captchaResult.geetest_seccode,
        login: this.login,
        password: this.password,
      };
      if (validator.isMobilePhone(this.login, 'zh-CN')) {
        reqData.verifyType = 'phone';
      } else {
        reqData.verifyType = 'username';
      }

      const url = '/users/signin';
      myHTTP.post(url, reqData).then(res => {
        if (res.data.errorCode === ErrorCode.SUCCESS.CODE) {
          location.href = decodeURIComponent(window.loginReferer);
          return;
        }
        this.errorVisible = true;
        this.errorMsg = res.data.message;
        setTimeout(() => {
          this.errorVisible = false;
        }, this.errorDisplayDur);
      });
    },
  },
};
</script>
