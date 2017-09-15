import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,
    AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { EmailValidator } from '../../validators/email';
import { HomePage }from'../home/home';
import { AuthData } from '../services/auth-data';
import { LineService } from '../services/line-service';

import { ResetPassword } from '../reset-password/reset-password';
import { Signup } from '../signup/signup';

/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class Login {
    public loginForm;
    loading: any;

    constructor(public navCtrl: NavController, public navParams: NavParams,
                public formBuilder: FormBuilder, public lineService: LineService,
                public alertCtrl: AlertController, public loadingCtrl: LoadingController,
                public authData: AuthData, public nav: NavController) {

        this.loginForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        });

    }

    loginUser(): void {
        let loginRef = this;
        if (!this.loginForm.valid) {
            console.log(this.loginForm.value);
        } else {
            this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password).then(authData => {
                this.loading.dismiss().then(() => {
                    this.lineService.getLineRef(function(DBLineRef){
                        loginRef.lineService.startNotifications(DBLineRef);
                    });
                    this.nav.setRoot(HomePage);
                });
            }, error => {
                this.loading.dismiss().then(() => {
                    let alert = this.alertCtrl.create({
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
    }

    goToSignup(): void {
        this.nav.push(Signup);
    }

    goToResetPassword(): void {
        this.nav.push(ResetPassword);
    }
}
