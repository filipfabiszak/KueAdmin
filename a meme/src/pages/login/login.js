"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var email_1 = require('../../validators/email');
var tabs_1 = require('../tabs/tabs');
var reset_password_1 = require('../reset-password/reset-password');
var signup_1 = require('../signup/signup');
/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var Login = (function () {
    function Login(navCtrl, navParams, formBuilder, alertCtrl, loadingCtrl, authData, nav) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.authData = authData;
        this.nav = nav;
        this.loginForm = formBuilder.group({
            email: ['', forms_1.Validators.compose([forms_1.Validators.required, email_1.EmailValidator.isValid])],
            password: ['', forms_1.Validators.compose([forms_1.Validators.minLength(6), forms_1.Validators.required])]
        });
    }
    Login.prototype.loginUser = function () {
        var _this = this;
        if (!this.loginForm.valid) {
            console.log(this.loginForm.value);
        }
        else {
            this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password).then(function (authData) {
                _this.loading.dismiss().then(function () {
                    _this.nav.setRoot(tabs_1.TabsPage);
                });
            }, function (error) {
                _this.loading.dismiss().then(function () {
                    var alert = _this.alertCtrl.create({
                        message: error.message,
                        buttons: [
                            {
                                text: "Ok",
                                role: 'cancel'
                            }
                        ]
                    });
                    alert.present();
                });
            });
            this.loading = this.loadingCtrl.create();
            this.loading.present();
        }
    };
    Login.prototype.goToSignup = function () {
        this.nav.push(signup_1.Signup);
    };
    Login.prototype.goToResetPassword = function () {
        this.nav.push(reset_password_1.ResetPassword);
    };
    Login = __decorate([
        core_1.Component({
            selector: 'page-login',
            templateUrl: 'login.html'
        })
    ], Login);
    return Login;
}());
exports.Login = Login;
//# sourceMappingURL=login.js.map