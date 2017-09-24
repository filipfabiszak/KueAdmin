import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,
    AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { HomePage } from '../home/home';
import { AuthData } from '../../services/auth-data';
import { LineService } from '../../services/line-service';

/**
 * Generated class for the Signup page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class Signup {

    public signupForm;
    loading: any;


    constructor(public nav: NavController,
      public authData: AuthData,
      public formBuilder: FormBuilder,
      public loadingCtrl: LoadingController,
      public alertCtrl: AlertController,
      public lineService: LineService) {

        this.signupForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
            line: ['', Validators.compose([Validators.required])],
            company: ['', Validators.compose([Validators.required])],
            name: ['', Validators.compose([Validators.required])]
        })
    }

    /**
     * If the form is valid it will call the AuthData service to sign the user up password displaying a loading
     *  component while the user waits.
     *
     * If the form is invalid it will just log the form value, feel free to handle that as you like.
     */
    signupUser() {
        let signupRef = this;
        if (!this.signupForm.valid) {
            console.log(this.signupForm.value);
        } else {
            this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.name)
                .then(() => {
                    this.lineService.createLine(this.signupForm.value.company,this.signupForm.value.line);
                    this.loading.dismiss().then(() => {
                        this.nav.setRoot(HomePage);
                    });
                }, (error) => {
                    this.loading.dismiss().then(() => {
                        if(error['code'] = "auth/email-already-in-use"){
                            this.authData.loginUser(this.signupForm.value.email, this.signupForm.value.password).then(authData => {
                                this.loading.dismiss().then(() => {
                                    this.lineService.createLine(this.signupForm.value.company,this.signupForm.value.line);
                                    // this.lineService.getLineRef(function(DBLineRef){
                                    //     this.lineService.startNotifications(DBLineRef);
                                    // });
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
                        }
                        else {
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
                        }
                    });
                });
            this.loading = this.loadingCtrl.create();
            this.loading.present();
        }
    }
}
