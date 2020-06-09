<template>
  <div class="main">
    <div class="login">
      <p style="text-align: center;color: #fff;font-size: 24px;margin-top: 170px;">管理后台</p>
      <a-form :form="form" class="user-layout-login" ref="formLogin" id="formLogin">
        <a-form-item class="item">
          <span class="key">账号</span>
          <a-input size="large" class="input" v-decorator="['username', validatorRules.username, { validator: this.handleUsernameOrEmail }]" type="text" placeholder="请输入用户名">
            <!-- <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" /> -->
          </a-input>
        </a-form-item>
        
        <a-form-item class="item">
          <span class="key">密码</span>
          <a-input class="input" v-decorator="['password', validatorRules.password]" size="large" type="password" autocomplete="false" placeholder="请输入密码" >
            <!-- <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" /> -->
          </a-input>
        </a-form-item>
        <a-form-item style="margin-top:24px;text-align: center;">
          <a-button size="large" type="primary" htmlType="submit" class="login-buttons" :loading="loginBtn" @click.stop.prevent="handleSubmit" :disabled="loginBtn">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import areas from '@/assets/js/json-data';
//import md5 from "md5"
import api from '@/api';
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha';
import { mapActions } from 'vuex';
import { timeFix } from '@/utils/util';
import Vue from 'vue';
import { ACCESS_TOKEN, ENCRYPTED_STRING } from '@/store/mutation-types';
import JGraphicCode from '@/components/jeecg/JGraphicCode';
import { putAction } from '@/api/manage';
import { postAction } from '@/api/manage';
import { encryption, getEncryptedString } from '@/utils/encryption/aesEncrypt';
import store from '@/store/';
import { USER_INFO } from '@/store/mutation-types';

export default {
  components: {
    TwoStepCaptcha,
    JGraphicCode
  },
  data() {
    return {
      options: areas,
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      form2: this.$form.createForm(this),
      reModel: false,
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      encryptedString: {
        key: '',
        iv: ''
      },
      state: {
        time: 60,
        smsSendBtn: false
      },
      formLogin: {
        username: '',
        password: '',
        captcha: '',
        mobile: '',
        rememberMe: true
      },
      validatorRules: {
        username: { rules: [{ required: true, message: '请输入用户名!', validator: 'click' }] },
        password: { rules: [{ required: true, message: '请输入密码!', validator: 'click' }] },
      },
      verifiedCode: '',
      inputCodeContent: '',
      inputCodeNull: true,

      departList: [],
      departVisible: false,
      departSelected: '',
      currentUsername: '',
      validate_status: ''
    };
  },
  created() {
    Vue.ls.remove(ACCESS_TOKEN);
    this.getRouterData();
    // update-begin- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题
    //this.getEncrypte();
    // update-end- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题
  },
  methods: {
    ...mapActions(['Login', 'Logout', 'PhoneLogin']),
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      if (regex.test(value)) {
        this.loginType = 0;
      } else {
        this.loginType = 1;
      }
      callback();
    },
    // 注册相关方法
    registe() {
      this.reModel = true;
    },
    diquChange() {},
    selectEnt() {},
    handleOk() {
      this.form2.validateFields((err, values) => {
        console.log(err);
        if (!err) {
          console.log('Received values of form: ', values);
          this.reModel = false;
        } else {
          setTimeout(() => {
            this.resetFields();
          }, 1000);
        }
      });
    },
    // 注册 end
    handleTabClick(key) {
      this.customActiveKey = key;
      // this.form.resetFields()
    },
    handleSubmit() {
      let that = this;
      let loginParams = {
        remember_me: that.formLogin.rememberMe
      };
      that.loginBtn = true;
      // 使用账户密码登陆
      if (that.customActiveKey === 'tab1') {
        that.form.validateFields(['username', 'password', 'inputCode'], { force: true }, (err, values) => {
          if (!err) {
            loginParams.username = values.username;
            // update-begin- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题
            //loginParams.password = md5(values.password)
            //loginParams.password = encryption(values.password,that.encryptedString.key,that.encryptedString.iv)
            loginParams.password = values.password;
            // update-begin- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题

            that
              .Login(loginParams)
              .then(res => {
                this.departConfirm(res);
              })
              .catch(err => {
                that.requestFailed(err);
              });
          } else {
            that.loginBtn = false;
          }
        });
        // 使用手机号登陆
      } else {
        that.form.validateFields(['mobile', 'captcha'], { force: true }, (err, values) => {
          if (!err) {
            loginParams.mobile = values.mobile;
            loginParams.captcha = values.captcha;
            that
              .PhoneLogin(loginParams)
              .then(res => {
                console.log(res.result);
                this.departConfirm(res);
              })
              .catch(err => {
                that.requestFailed(err);
              });
          }
        });
      }
    },
    getCaptcha(e) {
      e.preventDefault();
      let that = this;
      this.form.validateFields(['mobile'], { force: true }, (err, values) => {
        if (!values.mobile) {
          that.cmsFailed('请输入手机号');
        } else if (!err) {
          this.state.smsSendBtn = true;
          let interval = window.setInterval(() => {
            if (that.state.time-- <= 0) {
              that.state.time = 60;
              that.state.smsSendBtn = false;
              window.clearInterval(interval);
            }
          }, 1000);

          const hide = this.$message.loading('验证码发送中..', 0);
          let smsParams = {};
          smsParams.mobile = values.mobile;
          smsParams.smsmode = '0';
          postAction('/sys/sms', smsParams)
            .then(res => {
              if (!res.success) {
                setTimeout(hide, 0);
                this.cmsFailed(res.message);
              }
              console.log(res);
              setTimeout(hide, 500);
            })
            .catch(err => {
              setTimeout(hide, 1);
              clearInterval(interval);
              that.state.time = 60;
              that.state.smsSendBtn = false;
              this.requestFailed(err);
            });
        }
      });
    },
    stepCaptchaSuccess() {
      this.loginSuccess();
    },
    stepCaptchaCancel() {
      this.Logout().then(() => {
        this.loginBtn = false;
        this.stepCaptchaVisible = false;
      });
    },
    loginSuccess() {
      // update-begin- author:sunjianlei --- date:20190812 --- for: 登录成功后不解除禁用按钮，防止多次点击
      // this.loginBtn = false
      // update-end- author:sunjianlei --- date:20190812 --- for: 登录成功后不解除禁用按钮，防止多次点击
      this.$router.push({ name: 'dashboard' });
      this.$notification.success({
        message: '欢迎',
        description: `${timeFix()}，欢迎回来`
      });
    },
    cmsFailed(err) {
      this.$notification['error']({
        message: '登录失败',
        description: err,
        duration: 4
      });
    },
    requestFailed(err) {
      this.$notification['error']({
        message: '登录失败',
        description: ((err.response || {}).data || {}).message || err.message || '请求出现错误，请稍后再试',
        duration: 4
      });
      this.loginBtn = false;
    },
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback();
      } else {
        callback('您的手机号码格式不正确!');
      }
    },
    validateInputCode(rule, value, callback) {
      if (!value || this.verifiedCode == this.inputCodeContent) {
        callback();
      } else {
        callback('您输入的验证码不正确!');
      }
    },
    generateCode(value) {
      this.verifiedCode = value.toLowerCase();
    },
    inputCodeChange(e) {
      this.inputCodeContent = e.target.value;
      if (!e.target.value || 0 == e.target.value) {
        this.inputCodeNull = true;
      } else {
        this.inputCodeContent = this.inputCodeContent.toLowerCase();
        this.inputCodeNull = false;
      }
    },
    departConfirm(res) {
      if (res.success) {
        let multi_depart = res.result.multi_depart;
        //0:无部门 1:一个部门 2:多个部门
        if (multi_depart == 0) {
          this.loginSuccess();
          this.$notification.warn({
            message: '提示',
            description: `您尚未归属部门,请确认账号信息`,
            duration: 3
          });
        } else if (multi_depart == 2) {
          this.departVisible = true;
          this.currentUsername = this.form.getFieldValue('username');
          this.departList = res.result.departs;
        } else {
          this.loginSuccess();
        }
      } else {
        this.requestFailed(res);
        this.Logout();
      }
    },
    departOk() {
      if (!this.departSelected) {
        this.validate_status = 'error';
        return false;
      }
      let obj = {
        orgCode: this.departSelected,
        username: this.form.getFieldValue('username')
      };
      putAction('/sys/selectDepart', obj).then(res => {
        if (res.success) {
          const userInfo = res.result.userInfo;
          Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000);
          store.commit('SET_INFO', userInfo);
          //console.log("---切换组织机构---userInfo-------",store.getters.userInfo.orgCode);
          this.departClear();
          this.loginSuccess();
        } else {
          this.requestFailed(res);
          this.Logout().then(() => {
            this.departClear();
          });
        }
      });
    },
    departClear() {
      this.departList = [];
      this.departSelected = '';
      this.currentUsername = '';
      this.departVisible = false;
      this.validate_status = '';
    },
    departChange(value) {
      this.validate_status = 'success';
      this.departSelected = value;
    },
    getRouterData() {
      this.$nextTick(() => {
        this.form.setFieldsValue({
          username: this.$route.params.username
        });
      });
    },
    //获取密码加密规则
    getEncrypte() {
      var encryptedString = Vue.ls.get(ENCRYPTED_STRING);
      if (encryptedString == null) {
        getEncryptedString().then(data => {
          this.encryptedString = data;
        });
      } else {
        this.encryptedString = encryptedString;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  width: 1100px;
  height: 620px;
  background: url(../../assets/homeMid.png) no-repeat;
  background-size:100% ;
  position: absolute;
  left: calc(50% - 550px);
  top: calc(50% - 310px);
  .login{
    width: 550px;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: absolute;
    right: 0;
    top: 0;
    .user-layout-login{
      width: 60%;
      margin: auto;
      .item{
        border-bottom: 1px solid #FFFFFF;
        padding: 5px 0;
        box-sizing: border-box;
        .key{
          display: inline-block;
          width:25%;
          height: 40px;
          line-height: 40px;
          color:#fff;
          border-right: 1px solid #fff;
          text-align:center;
          box-sizing: border-box;
        }
        .input{
          width:75% ;
          border: none;
          color: #FFFFFF;
          background: transparent !important;
          &:focus{
            border: none;
            box-shadow: none;
          }
        }
      }
    }
    .login-buttons{
      width: 100%;
      height: 40px;
      margin-top: 50px;
      background: #0076a9;
      border: 1px solid #0076a9;
      border-radius: 5px;
      color: #FFFFFF;
    }
  }
}

</style>
<style>
.valid-error .ant-select-selection__placeholder {
  color: #f5222d;
}
</style>
