"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var HomePage = (function () {
    function HomePage(navCtrl, lineService) {
        this.navCtrl = navCtrl;
        this.lineService = lineService;
    }
    HomePage.prototype.updateLineInfo = function () {
        var homeController = this;
        this.lineService.setServing();
        this.lineService.setLineSize();
        this.lineService.getLineName(function (name) {
            homeController.lineName = name.split('_').join(' ');
            console.log(homeController.lineName);
        });
    };
    HomePage.prototype.ngOnInit = function () {
        this.updateLineInfo();
        this.getLineSize();
        this.getServing();
    };
    HomePage.prototype.getLineSize = function () {
        var _this = this;
        this.lineService.lineSize.subscribe(function (size) { return _this.size = size; });
    };
    HomePage.prototype.getServing = function () {
        var _this = this;
        this.lineService.serving.subscribe(function (serving) { return _this.serving = serving; });
    };
    HomePage = __decorate([
        core_1.Component({
            selector: 'page-home',
            templateUrl: 'home.html'
        })
    ], HomePage);
    return HomePage;
}());
exports.HomePage = HomePage;
//# sourceMappingURL=home.js.map