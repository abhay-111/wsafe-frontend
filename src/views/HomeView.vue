<template>
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
          <strong>Otp sent at {{ registerUser.email }}</strong>
          <div class="conatiner" style="max-width: 300px">
            <v-otp-input v-model="otp" length="6" class="mt-3"></v-otp-input>
            <p v-if="otpTimeout">
              Otp not recieved ?
              <span>
                <v-btn x-small text @click="resendOtp" class="error"
                  >Resend OTP</v-btn
                >
              </span>
            </p>
            <p v-else>Otp valid for next {{ otpTimer }} sec.</p>
            <v-btn class="error mt-3" @click="verifyOtp" :disabled="!isActive"
              >Verify OTP</v-btn
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
    <v-row class="py-5 px-15">
      <v-col cols="12">
        <div class="d-flex justify-center align-items-center">
          <img src="../assets/W-safewhite.png" height="150px" alt="" />
        </div>
      </v-col>
      <v-col cols="6">
        <div class="">
          <h1>Check before you leave.</h1>
          <h1>Be safe.</h1>
          <h1>Help Others.</h1>
          <p class="mt-5">
            W-Safe provides a platform to checkout the locality you might be
            visiting in the near future and helps you make better decision based
            on the locality and others experiences.
          </p>
        </div>
      </v-col>
      <v-col cols="6">
        <div class="pa-5">
          <v-card class="pa-10" max-width="30rem" max-height="25rem">
            <v-form v-if="isLogin" ref="form" v-model="valid" lazy-validation>
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
                  Dont have an account ?
                  <v-btn color="error" text x-small @click="isLogin = !isLogin">
                    Register</v-btn
                  >
                </p>
              </div>
              <v-btn color="error" @click="login" class="mr-4 mt-2">
                Login
              </v-btn>
            </v-form>
            <v-form v-else ref="form" v-model="valid" lazy-validation>
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
      </v-col>
      <v-col cols="6"> </v-col>
    </v-row>
  </v-container>
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
        email: this.loginUser.email || this.registerUser.email,
      };
      this.$store
        .dispatch("verifyOtp", data)
        .then((res) => {
          console.log(res);
          setTimeout(() => {
            this.$router.push("/dashboard");
          }, 500);
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
    resendOtp() {
      const user = this.loginUser || this.registerUser;
      this.sendOtp(user);
    },
  },
};
</script>
