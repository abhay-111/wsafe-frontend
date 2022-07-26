<template>
  <v-app>
    <v-main class="red accent-3">
      <v-container class="text-white fill-height">
        <v-dialog
          :hide-overlay="true"
          v-model="otpDialog"
          transition="dialog-bottom-transition"
          max-width="500"
          :persistent="true"
        >
          <v-card class="pa-5">
            <v-card-title>
              <h4>Enter your OTP</h4>
            </v-card-title>
            <v-card-text>
              <strong
                >Otp sent at
                {{
                  registerUser.email || loginUser.email || forgotEmail
                }}</strong
              >
              <div class="conatiner" style="max-width: 300px">
                <v-otp-input
                  v-model="otp"
                  length="6"
                  class="mt-3"
                ></v-otp-input>
                <p v-if="otpTimeout">
                  Otp not recieved ?
                  <span>
                    <v-btn x-small text @click="resendOtp" class="error"
                      >Resend OTP</v-btn
                    >
                  </span>
                </p>
                <p v-else>Otp valid for next {{ otpTimer }} sec.</p>
                <v-btn
                  class="error mt-3"
                  @click="verifyOtp()"
                  :disabled="!isActive"
                  >Verify OTP</v-btn
                >
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog
          :hide-overlay="true"
          v-model="forgotPasswordDialog"
          transition="dialog-bottom-transition"
          max-width="500"
          :persistent="false"
        >
          <v-card class="pa-5">
            <v-card-title>
              <h4>Enter your registered Email</h4>
            </v-card-title>
            <v-card-text>
              <div class="conatiner" style="max-width: 300px">
                <v-text-field
                  v-model="forgotEmail"
                  prepend-icon="mdi-email"
                  hint="Enter your email."
                  :rules="emailRules"
                  label="Email"
                ></v-text-field>
                <br />
                <v-btn small class="error mt-3" @click="sendForgotPasswordMail"
                  >Send Resest OTP</v-btn
                >
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog
          :hide-overlay="true"
          v-model="setNewPassword"
          transition="dialog-bottom-transition"
          max-width="500"
          :persistent="true"
        >
          <v-card class="pa-5">
            <v-card-title>
              <h4>Create New Password</h4>
            </v-card-title>
            <v-card-text>
              <div class="conatiner" style="max-width: 300px">
                <v-text-field
                  v-model="changePassword.password"
                  :rules="passwordRules"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="changePassword.confirmPassword"
                  :rules="passwordRules"
                  label="Confirm Password"
                  type="password"
                  required
                ></v-text-field>
                <br />
                <v-btn small class="error mt-3" @click="createNewPassword"
                  >Create New Password</v-btn
                >
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :timeout="timeout">
          {{ errorText }}

          <template v-slot:action="{ attrs }">
            <v-btn color="blue" v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
        <div class="d-flex flex-row gap-5" style="width: 100%">
          <!-- <div class="container">
           
            <h2>Check before you leave.</h2>
            <h2>Be safe.</h2>
            <h2>Help Others.</h2>
            <p class="mt-5">
              W-Safe provides a platform to checkout the locality you might be
              visiting in the near future and helps you make better decision
              based on others experiences.
            </p>
          </div> -->
          <div
            class="container d-flex gap-5 flex-column justify-center align-items-center"
            style="min-width: 19rem; max-width: 35rem"
          >
            <div class="d-flex justify-center align-items-center">
              <img src="../assets/W-safewhite.png" height="120px" alt="" />
            </div>
            <v-card class="pa-10">
              <v-form v-if="isLogin" ref="form">
                <v-text-field
                  v-model="loginUser.email"
                  label="E-mail"
                  :rules="emailRules"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="loginUser.password"
                  :rules="passwordRules"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>
                <div>
                  <p class="caption">
                    Forgot Password
                    <v-btn text x-small color="error" @click="forgotPassword"
                      >Forgot Password</v-btn
                    >
                  </p>
                  <p class="caption">
                    Dont have an account ?
                    <v-btn
                      color="error"
                      text
                      x-small
                      @click="isLogin = !isLogin"
                    >
                      Register</v-btn
                    >
                  </p>
                </div>
                <v-btn color="error" @click="login" class="mr-4 mt-2">
                  Login
                </v-btn>
              </v-form>
              <v-form v-else ref="form" lazy-validation>
                <v-text-field
                  v-model="registerUser.name"
                  :rules="nameRules"
                  label="Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="registerUser.email"
                  :rules="emailRules"
                  label="E-mail"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="registerUser.password"
                  :rules="passwordRules"
                  type="password"
                  label="Password"
                  required
                ></v-text-field>
                <p class="caption">
                  Already have an account ?
                  <v-btn color="error" text x-small @click="isLogin = !isLogin">
                    Login</v-btn
                  >
                </p>
                <v-btn color="error" class="mr-4 mt-2" @click="register">
                  Register
                </v-btn>
              </v-form>
            </v-card>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// import logo from "";
export default {
  name: "Home",
  computed: {
    isActive() {
      return this.otp.length == 6;
    },
  },
  data() {
    return {
      isLogin: false,
      loginUser: {
        email: "",
        password: "",
      },
      registerUser: {
        name: "",
        email: "",
        password: "",
      },
      nameRules: [(v) => !!v || "Name is required"],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) =>
          (v && v.length >= 8) || "Password must be greater than 8 characters",
      ],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      snackbar: false,
      timeout: 2000,
      errorText: "",
      otpDialog: false,
      otp: "",
      otpTimer: 180,
      otpTimeout: false,
      forgotPasswordDialog: false,
      forgotEmail: "",
      setNewPassword: false,
      changePassword: {
        password: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    login() {
      if (this.loginUser.email == "" || this.loginUser.password == "") {
        this.errorText = "Please fill in the form";
        this.snackbar = true;

        return;
      }
      this.$store
        .dispatch("loginUser", this.loginUser)
        .then((res) => {
          this.errorText = res.data.message;
          this.snackbar = true;

          setTimeout(() => {
            this.$router.push("/dashboard");
          }, 500);
        })
        .catch((err) => {
          this.errorText = err.response.data.error.message;
          this.snackbar = true;
          if (err.response.status == 401) {
            this.sendOtp(this.loginUser);
          }
        });
    },
    register() {
      if (
        this.registerUser.email == "" ||
        this.registerUser.password == "" ||
        this.registerUser.name == ""
      ) {
        this.errorText = "Please fill in the form";
        this.snackbar = true;
        return;
      }
      this.$store
        .dispatch("registerUser", this.registerUser)
        .then((res) => {
          this.errorText = res.data.message;
          this.snackbar = true;
          this.sendOtp(this.registerUser);
        })
        .catch((err) => {
          console.log(err);
          this.errorText = err.response.data.error.message;
          this.snackbar = true;
        });
    },
    startTimer() {
      const timerInterval = setInterval(() => {
        if (this.otpTimer == 0) {
          clearInterval(timerInterval);
          this.otpTimeout = true;
          return;
        }
        this.otpTimer -= 1;
      }, 1000);
    },
    verifyOtp() {
      const data = {
        otp: this.otp,
        email:
          this.loginUser.email || this.registerUser.email || this.forgotEmail,
      };
      if (this.forgotEmail != "") {
        data.email = this.forgotEmail;
      }
      this.$store
        .dispatch("verifyOtp", data)
        .then(() => {
          if (data.email == this.forgotEmail) {
            this.setNewPassword = true;
            this.otpDialog = false;
          } else {
            this.$router.push("/dashboard");
          }
        })
        .catch((err) => {
          this.errorText = err.response.data.error.message;
          this.snackbar = true;
        });
    },
    sendOtp(userData) {
      this.$store
        .dispatch("sendOtp", userData)
        .then((res) => {
          console.log(res);
          this.otpDialog = true;
          this.startTimer();
        })
        .catch((err) => {
          this.errorText = err.response.data.error.message;
          this.snackbar = true;
          this.otpDialog = true;
          this.startTimer();
        });
    },
    forgotPassword() {
      this.forgotPasswordDialog = true;
    },
    sendForgotPasswordMail() {
      this.$store
        .dispatch("forgotPassword", this.forgotEmail)
        .then(() => {
          const data = {
            email: this.forgotEmail,
          };
          this.$store
            .dispatch("sendOtp", data)
            .then(() => {
              this.forgotPasswordDialog = false;
              this.startTimer();
              this.otpDialog = true;
            })
            .catch((err) => {
              this.errorText = err.response.data.error.message;
              this.snackbar = true;
            });
        })
        .catch((err) => {
          this.errorText = err.response.data.error.message;
          this.snackbar = true;
        });
    },
    resendOtp() {
      const user = this.loginUser || this.registerUser;
      this.sendOtp(user);
    },
    createNewPassword() {
      if (this.changePassword.password != this.changePassword.confirmPassword) {
        this.errorText = "Passwords do not match";
        this.snackbar = true;
        return;
      }
      const data = this.changePassword;
      data["email"] = this.forgotEmail;
      this.$store.dispatch("createNewPassword", data).then((res) => {
        this.setNewPassword = false;
        this.forgotEmail = "";
        this.changePassword.password = "";
        this.changePassword.confirmPassword = "";
        this.otp = "";
        this.errorText = res.data.message;
        this.snackbar = true;
      });
    },
  },
};
</script>
