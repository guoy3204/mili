<template>
  <div v-if="modalVisible" class="boiling-point-modal">
    <div @click="onClose" class="boiling-point-bg"></div>
    <div class="boiling-editor-box">
      <div class style="position: relative;">
        <div class="boiling-point-title">发圈子</div>
        <button @click="onClose" type="button" class="close">×</button>
      </div>
      <BoilingPointEditor @success="onSuccess" />
    </div>
  </div>
</template>

<script>
import BoilingPointEditor from '~/js/components/editor/BoilingPointEditor.vue';

export default {
  data() {
    return {
      modalVisible: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      // document.getElementById('boilingPointBtn').addEventListener('click', () => {
      //     this.modalVisible = true;
      // });
    });
  },
  methods: {
    onClose() {
      this.modalVisible = false;
    },
    onSuccess() {
      this.modalVisible = false;
    },
  },
  components: {
    BoilingPointEditor,
  },
};
</script>

<style lang="scss" scoped>
.boiling-point-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
  overflow-x: hidden;
  overflow-y: hidden;
}

.boiling-point-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);
}

.boiling-editor-box {
  width: 640px;
  padding: 20px;
  padding-top: 0;
  padding-bottom: 6px;
  margin: 0 auto;
  background: #fff;
  position: relative;
  margin-top: 60px;
  position: relative;
}

.boiling-point-title {
  font-size: 16px;
  color: #17181a;
  text-align: center;
  line-height: 38px;
  height: 38px;
  font-weight: 500;
}

.comment-editor-box {
  margin-top: 0;
}

.boiling-editor-box .close {
  font-family: -apple-system, SF UI Text, Arial, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, WenQuanYi Micro Hei, sans-serif;
  float: right;
  line-height: 1;
  color: #000;
  opacity: 0.2;
  filter: alpha(opacity=20);
  font-weight: 200;
  font-size: 26px;
  outline: none;
  text-shadow: none;
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  -webkit-appearance: none;
  position: absolute;
  top: 6px;
  right: 0;
}
</style>