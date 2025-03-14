<template>
  <div id="app" class="main">
    <ErrorTip ref="errorTip" />
    <h4 class="title">
      <div class="normal-title">
        <a class href="/signin">登录</a>
        <b>·</b>
        <a id="js-sign-up-btn" class="active" href="/signup">注册</a>
      </div>
    </h4>
    <div class="js-sign-up-container">
      <form action method="post">
        <div class="input-prepend restyle">
          <input v-model="login" placeholder="用户名" type="text" />
          <i class="iconfont ic-user"></i>
        </div>
        <div class="input-prepend restyle no-radius js-normal">
          <input v-model="phone" placeholder="手机号" type="tel" />
          <i class="iconfont ic-phonenumber"></i>
        </div>
        <div
          v-show="phoneInputed"
          class="input-prepend restyle no-radius security-up-code js-security-number"
        >
          <input v-model="code" type="text" name="sms_code" placeholder="手机验证码" />
          <i class="iconfont ic-verify"></i>
          <a
            @click="reqCaptchaBtnClick"
            :class="{'btn-in-resend': phoneValid && smsEnabled}"
            class="btn-up-resend js-send-code-button disable"
          >{{smsLabel}}</a>
        </div>
        <div class="input-prepend">
          <input v-model="pass" placeholder="设置密码" type="password" />
          <i class="iconfont ic-password"></i>
        </div>
        <input @click.prevent="onSubmit" type="submit" value="注册" class="sign-up-button" />
        <p class="sign-up-msg">
          点击 “注册” 即表示您同意并愿意遵守《{{siteName}}》平台
          <br />
          <a target="_blank" href>用户协议</a> 和
          <a target="_blank" href>隐私政策</a>
        </p>
      </form>
      <div class="more-sign">
        <h6>社交帐号直接注册</h6>
        <ul>
          <li>
            <a class="weixin" target="_blank" href="/users/signup/oauth">
              <i class="iconfont ic-wechat"></i>
            </a>
          </li>
          <li>
            <a class="weibo" target="_blank" href="/users/signup/weibo">
              <i class="iconfont ic-weibo"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div
      v-if="errorTipVisible"
      :style="{top: errorTipTop}"
      class="tooltip tooltip-error fade right in"
      role="tooltip"
    >
      <div class="tooltip-arrow tooltip-arrow-border" style="top: 50%;"></div>
      <div class="tooltip-arrow tooltip-arrow-bg" style="top: 50%;"></div>
      <div class="tooltip-inner">
        <i class="iconfont ic-error"></i>
        <span>{{errorTipLabel}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import validator from 'validator';
import { ErrorCode } from '~/js/constants/error.js';
import ErrorTip from '~/js/components/common/ErrorTip.vue';
import { myHTTP } from '~/js/common/net.js';

export default {
  name: 'App',
  data: function() {
    return {
      siteName: window.siteName,
      phoneInputed: false,
      phone: '',
      login: '',
      pass: '',
      phoneValid: false,
      code: '', // 手机验证码
      smsEnabled: true,
      smsLabel: '发送验证码',
      smsCountdown: 60, // 每60秒才能发一次手机验证码
      geetestCaptcha: null,
      errorTipLabel: '',
      errorTipTop: 0,
      errorTipVisible: false,
    };
  },
  mounted: function() {
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
            self.sendSMS();
          });
        },
      );
    });
  },
  methods: {
    onSubmit: function() {
      const self = this;
      let login = (this.login || '').replace(/^\s+|\s+$/g, '');
      if (!this.login) {
        this.$refs.errorTip.show('用户名不能为空');
        return;
      }
      if (!this.validatePhone(this.phone)) {
        this.$refs.errorTip.show('无效的手机号');
        return;
      }
      if (!this.code) {
        this.$refs.errorTip.show('验证码无效或已过期，请重新发送验证码');
        return;
      }
      if (!this.pass) {
        this.$refs.errorTip.show('密码不能为空');
        return;
      }
      let captchaResult = this.geetestCaptcha.getValidate();
      captchaResult = captchaResult || {};
      const url = '/users/signup';
      myHTTP
        .post(url, {
          geetest_challenge: captchaResult.geetest_challenge,
          geetest_validate: captchaResult.geetest_validate,
          geetest_seccode: captchaResult.geetest_seccode,
          username: login,
          phone: this.phone,
          code: this.code,
          pass: this.pass,
        })
        .then(res => {
          const result = res.data;
          if (result.errorCode) {
            this.$refs.errorTip.show(result.message);
            return;
          }
          location.href = '/';
        });
    },
    reqCaptchaBtnClick: function() {
      if (!this.validatePhone(this.phone)) {
        return;
      }
      if (this.geetestCaptcha) {
        this.geetestCaptcha.verify();
      }
    },
    sendSMS: function(ticket, randstr) {
      const self = this;
      let captchaResult = this.geetestCaptcha.getValidate();
      if (!captchaResult) {
        return;
      }
      let login = (this.login || '').replace(/^\s+|\s+$/g, '');
      const reqData = {
        geetest_challenge: captchaResult.geetest_challenge,
        geetest_validate: captchaResult.geetest_validate,
        geetest_seccode: captchaResult.geetest_seccode,
        username: login,
        phone: this.phone,
      };

      const url = '/users/smscode';
      myHTTP
        .post(url, reqData)
        .then(res => {
          if (res.data.errorCode !== ErrorCode.SUCCESS.CODE) {
            this.$refs.errorTip.show(res.data.message);
            return;
          }
          let time = self.smsCountdown;
          self.smsEnabled = false;
          self.smsLabel = `重新发送(${time}s)`;
          const intervalID = setInterval(function() {
            time--;
            self.smsLabel = `重新发送(${time}s)`;
            if (time < 0) {
              self.smsLabel = '重新发送';
              self.smsEnabled = true;
              clearInterval(intervalID);
            }
          }, 1000);
        })
        .catch(err => {
          console.log(err);
        });
    },
    validatePhone: function(phone) {
      if (validator.isMobilePhone(phone, 'zh-CN')) {
        this.phoneValid = true;
      } else {
        this.phoneValid = false;
      }
      return this.phoneValid;
    },
  },
  components: {
    ErrorTip,
  },
  watch: {
    phone: function(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (this.validatePhone(newValue)) {
          this.phoneInputed = true;
        }
      }
    },
  },
};
</script>
