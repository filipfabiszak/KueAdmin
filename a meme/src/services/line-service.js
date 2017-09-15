"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var firebase_1 = require('firebase');
var Subject_1 = require('rxjs/Subject');
var LineService = (function () {
    function LineService() {
        this.lineSize = new Subject_1.Subject();
        this.serving = new Subject_1.Subject();
    }
    LineService.prototype.createLine = function (company, line) {
        company = company.split(' ').join('_');
        line = line.split(' ').join('_');
        var DBLineRef = 'lines/' + company + '/' + line;
        var uid = firebase_1["default"].auth().currentUser.uid;
        var updates = {};
        updates['users/' + uid + '/line'] = DBLineRef;
        updates['lines/' + company + '/' + line] = 1;
        firebase_1["default"].database().ref().update(updates);
    };
    LineService.prototype.setLineSize = function () {
        console.log('Querying for line size...');
        var service = this;
        var uid = firebase_1["default"].auth().currentUser.uid;
        firebase_1["default"].database().ref('users/' + uid).once('value').then(function (snapshot) {
            var DBLineRef = snapshot.val().line;
            firebase_1["default"].database().ref(DBLineRef).once('value').then(function (snapshot) {
                if (snapshot.val() == 1) {
                    console.log('Line size retrieved!');
                    service.lineSize.next(0);
                }
                else {
                    var realSize = snapshot.numChildren();
                    console.log('Line size retrieved!');
                    service.lineSize.next(realSize);
                }
            });
        });
    };
    LineService.prototype.getLineName = function (callback) {
        console.log('Querying for line name...');
        var uid = firebase_1["default"].auth().currentUser.uid;
        firebase_1["default"].database().ref('users/' + uid).once('value').then(function (snapshot) {
            var name = snapshot.val().line;
            name = name.split('/')[name.split('/').length - 1];
            callback(name);
        });
    };
    LineService.prototype.joinWithPhone = function (callback, name, number) {
        var uid = firebase_1["default"].auth().currentUser.uid;
        firebase_1["default"].database().ref('users/' + uid).once('value').then(function (snapshot) {
            var lineName = snapshot.val().line;
            var dataKey = firebase_1["default"].database().ref().child(lineName).push().key;
            var updates = {};
            updates[lineName + '/' + dataKey] = { phone: number, name: name };
            firebase_1["default"].database().ref().update(updates);
            callback();
        });
    };
    LineService.prototype.setServing = function () {
        setTimeout(function () {
            console.log('Querying for current customer...');
            var service = this;
            var uid = firebase_1["default"].auth().currentUser.uid;
            firebase_1["default"].database().ref('users/' + uid).once('value').then(function (snapshot) {
                var DBLineRef = snapshot.val().line;
                firebase_1["default"].database().ref(DBLineRef).once('value').then(function (snapshot) {
                    if (snapshot.val() == 1) {
                        console.log('No one in line');
                        service.serving.next("Line Empty");
                    }
                    else {
                        var realSize = snapshot.numChildren();
                        console.log('Line size retrieved!');
                        service.lineSize.next(realSize);
                    }
                });
            });
        }, 3000);
    };
    LineService = __decorate([
        core_1.Injectable()
    ], LineService);
    return LineService;
}());
exports.LineService = LineService;
//# sourceMappingURL=line-service.js.map