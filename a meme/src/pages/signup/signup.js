"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var forms_1 = require('@angular/forms');
var email_1 = require('../../validators/email');
var tabs_1 = require('../tabs/tabs');
/**
 * Generated class for the Signup page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var Signup = (function () {
    function Signup(nav, authData, formBuilder, loadingCtrl, alertCtrl, lineService) {
        this.nav = nav;
        this.authData = authData;
        this.formBuilder = formBuilder;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.lineService = lineService;
        this.signupForm = formBuilder.group({
            email: ['', forms_1.Validators.compose([forms_1.Validators.required, email_1.EmailValidator.isValid])],
            password: ['', forms_1.Validators.compose([forms_1.Validators.minLength(6), forms_1.Validators.required])],
            line: ['', forms_1.Validators.compose([forms_1.Validators.required])],
            company: ['', forms_1.Validators.compose([forms_1.Validators.required])],
            name: ['', forms_1.Validators.compose([forms_1.Validators.required])]
        });
    }
    /**
     * If the form is valid it will call the AuthData service to sign the user up password displaying a loading
     *  component while the user waits.
     *
     * If the form is invalid it will just log the form value, feel free to handle that as you like.
     */
    Signup.prototype.signupUser = function () {
        var _this = this;
        if (!this.signupForm.valid) {
            console.log(this.signupForm.value);
        }
        else {
            this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.name)
                .then(function () {
                _this.lineService.createLine(_this.signupForm.value.company, _this.signupForm.value.line);
                _this.loading.dismiss().then(function () {
                    _this.nav.setRoot(tabs_1.TabsPage);
                });
            }, function (error) {
                _this.loading.dismiss().then(function () {
                    if (error['code'] = "auth/email-already-in-use") {
                        _this.authData.loginUser(_this.signupForm.value.email, _this.signupForm.value.password).then(function (authData) {
                            _this.loading.dismiss().then(function () {
                                _this.lineService.createLine(_this.signupForm.value.company, _this.signupForm.value.line);
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
                    }
                    else {
                        var alert_1 = _this.alertCtrl.create({
                            message: error.message,
                            buttons: [
                                {
                                    text: "Ok",
                                    role: 'cancel'
                                }
                            ]
                        });
                        alert_1.present();
                    }
                });
            });
            this.loading = this.loadingCtrl.create();
            this.loading.present();
        }
    };
    Signup = __decorate([
        ionic_angular_1.IonicPage(),
        core_1.Component({
            selector: 'page-signup',
            templateUrl: 'signup.html'
        })
    ], Signup);
    return Signup;
}());
exports.Signup = Signup;
//# sourceMappingURL=signup.js.map