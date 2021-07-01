window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Activator: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "933feMFui9HDq5L8YQa4t9g", "Activator");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("../Game");
    var Utils_1 = require("../Global/Utils");
    var Pin_1 = require("../Level/Pin");
    var Obstacle_1 = require("./Obstacle");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Activator = function(_super) {
      __extends(Activator, _super);
      function Activator() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.button = null;
        _this.pressed = false;
        _this.colorIndex = 0;
        _this.prevButtonDistance = 0;
        return _this;
      }
      Activator_1 = Activator;
      Activator.prototype.onCreate = function(p1, p2) {
        this.point1 = p1;
        this.point2 = p2;
        var vector = p2.sub(p1);
        this.node.setPosition(p1);
        var rads = -vector.signAngle(cc.Vec2.RIGHT);
        this.node.angle = cc.misc.radiansToDegrees(rads);
        this.combine();
        Game_1.default.instance.levelEditor.editing && this.playRandomSound(this.dragSounds);
        this.unparentButton();
      };
      Activator.prototype.update = function() {
        var _a;
        var d = this.node.getPosition().sub(this.button.getPosition()).magSqr();
        if (this.pressed) d > 2e3 && (this.pressed = false); else if (this.prevButtonDistance != d) {
          if (d < 1e3 && this.prevButtonDistance > 1e3) {
            cc.audioEngine.playEffect(this.dropSounds[0], false);
            null === (_a = this.target) || void 0 === _a ? void 0 : _a.activate();
            this.pressed = true;
          }
          this.prevButtonDistance = d;
        }
      };
      Activator.prototype.bindTarget = function(target) {
        this.target = target;
        target.coloredNode.color = this.getColor(this.colorIndex);
        target.target = this;
      };
      Activator.prototype.unbindTarget = function() {
        this.target.coloredNode.color = this.target.defaultColor;
        this.target.target = null;
        this.target = null;
      };
      Activator.prototype.combine = function() {
        var obstacles = Game_1.default.instance.levelEditor.obstacles;
        var target;
        for (var i = 4; i < obstacles.length - 1; i++) {
          var o = obstacles[i];
          o.interactive && (o instanceof Activator_1 ? this.colorIndex = o.colorIndex + 1 : null == o.target && (target = o));
          Utils_1.default.minDistanceBetweenLineAndPoint(o.point1, o.point2, this.point1) < 16 && Pin_1.default.create(this, o, this.node.parent.convertToWorldSpaceAR(this.node.getPosition()), Pin_1.PinType.Weld);
        }
        null != target && this.bindTarget(target);
        this.coloredNode.color = this.getColor(this.colorIndex);
      };
      Activator.prototype.onTouchStart = function(touch) {
        _super.prototype.onTouchStart.call(this, touch);
        var p = this.button.parent.convertToWorldSpaceAR(this.button.getPosition());
        this.button.setParent(this.node);
        this.button.angle = 0;
        this.button.setSiblingIndex(0);
        this.button.setPosition(this.node.convertToNodeSpaceAR(p));
        if (null != this.target) {
          console.log(typeof this.target);
          this.unbindTarget();
        }
        var obstacles = Game_1.default.instance.levelEditor.obstacles;
        var index = 0;
        for (var i = 4; i < obstacles.length - 1; i++) {
          var o = obstacles[i];
          if (o instanceof Activator_1) {
            o.colorIndex = index;
            o.coloredNode.color = this.getColor(index);
            null != o.target && (o.target.coloredNode.color = o.coloredNode.color);
            index++;
          }
        }
        this.colorIndex = index;
        this.coloredNode.color = this.getColor(this.colorIndex);
      };
      Activator.prototype.onEndDrag = function(touch) {
        _super.prototype.onEndDrag.call(this, touch);
        this.unparentButton();
      };
      Activator.prototype.unparentButton = function() {
        var p = this.node.convertToWorldSpaceAR(this.button.getPosition());
        this.button.setParent(this.node.parent);
        this.button.angle = this.node.angle;
        this.button.setSiblingIndex(this.node.getSiblingIndex());
        this.button.setPosition(this.node.parent.convertToNodeSpaceAR(p));
      };
      Activator.prototype.onDestroy = function() {
        _super.prototype.onDestroy.call(this);
        this.button.destroy();
      };
      Activator.prototype.getColor = function(index) {
        var color = cc.Color.WHITE;
        switch (index) {
         default:
          return color;

         case 0:
          return cc.Color.fromHEX(color, "#DB3D3D");

         case 1:
          return cc.Color.fromHEX(color, "#3D69DB");

         case 2:
          return cc.Color.fromHEX(color, "#D3B100");

         case 3:
          return cc.Color.fromHEX(color, "#29B61D");

         case 4:
          return cc.Color.fromHEX(color, "#E96D1A");

         case 5:
          return cc.Color.fromHEX(color, "#5C149E");

         case 6:
          return cc.Color.fromHEX(color, "#191919");

         case 7:
          return cc.Color.fromHEX(color, "#47A9C2");
        }
      };
      var Activator_1;
      __decorate([ property(cc.Node) ], Activator.prototype, "button", void 0);
      Activator = Activator_1 = __decorate([ ccclass ], Activator);
      return Activator;
    }(Obstacle_1.default);
    exports.default = Activator;
    cc._RF.pop();
  }, {
    "../Game": "Game",
    "../Global/Utils": "Utils",
    "../Level/Pin": "Pin",
    "./Obstacle": "Obstacle"
  } ],
  Background: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "34e64TYTCJKX6Sje28l5XzL", "Background");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Background = function(_super) {
      __extends(Background, _super);
      function Background() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.camera = null;
        _this.followRatioX = .5;
        _this.followRatioY = .25;
        return _this;
      }
      Background.prototype.onLoad = function() {
        this.backgroundWidth = this.getComponent(cc.Sprite).spriteFrame.getTexture().width;
        0 == this.backgroundWidth && (this.backgroundWidth = 1500);
      };
      Background.prototype.start = function() {
        this.previousPosition = this.camera.getPosition();
      };
      Background.prototype.update = function() {
        var dP = this.previousPosition.sub(this.camera.getPosition());
        var follow = cc.v3(dP.x * this.followRatioX, dP.y * this.followRatioY, 0);
        this.node.setPosition(this.node.position.sub(follow));
        this.previousPosition = this.camera.getPosition();
        var delta = this.camera.position.x - this.node.position.x;
        if (delta > this.backgroundWidth) this.node.setPosition(this.node.position.add(cc.v3(this.backgroundWidth, 0, 0))); else if (delta < -this.backgroundWidth) {
          this.node.setPosition(this.node.position.sub(cc.v3(this.backgroundWidth, 0, 0)));
          delta = 0;
        }
      };
      __decorate([ property(cc.Node) ], Background.prototype, "camera", void 0);
      __decorate([ property() ], Background.prototype, "followRatioX", void 0);
      __decorate([ property() ], Background.prototype, "followRatioY", void 0);
      Background = __decorate([ ccclass ], Background);
      return Background;
    }(cc.Component);
    exports.default = Background;
    cc._RF.pop();
  }, {} ],
  CameraController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c8e94aN/SRDr4C2fEWnbbfx", "CameraController");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var CameraController = function(_super) {
      __extends(CameraController, _super);
      function CameraController() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.target = null;
        _this.camera = null;
        _this.anim = null;
        _this.jumpZoom = false;
        _this.centerAtStart = false;
        _this.smoothFollow = false;
        _this.followX = 0;
        _this.followY = 0;
        _this.minFollowDist = 0;
        _this.followRatio = 0;
        _this.overview = false;
        _this.overviewTargets = [];
        _this.overviewMargin = 0;
        _this.speedZoom = false;
        _this.zoomInSpeed = 0;
        _this.zoomOutSpeed = 0;
        _this.canShake = false;
        _this.shakeDuration = 0;
        _this.pointerPan = false;
        _this.pointerXMult = 0;
        _this.pointerYMult = 0;
        _this.useBoundaries = false;
        _this.topBound = 0;
        _this.bottomBound = 0;
        _this.leftBound = 0;
        _this.rightBound = 0;
        _this.startFollow = false;
        _this.visibleSize = cc.Size.ZERO;
        _this.initZoomRatio = 1;
        return _this;
      }
      CameraController.prototype.onLoad = function() {
        this.startFollow = false;
        var canvas = cc.find("Canvas").getComponent(cc.Canvas);
        this.visibleSize = cc.view.getVisibleSize();
        this.initZoomRatio = this.camera.zoomRatio;
        this.centerAtStart && (this.node.position = this.target.convertToWorldSpaceAR(cc.Vec3.ZERO));
        this.previousPos = this.node.position;
        if (this.pointerPan) {
          this.overview = false;
          this.speedZoom = false;
          canvas.node.on("mousemove", this.onMouseMove, this);
          canvas.node.on("touchmove", this.onTouchMove, this);
          this.pointerPos = null;
        }
        if (this.overview) {
          this.jumpZoom = false;
          this.speedZoom = false;
        }
        this.speedZoom && (this.jumpZoom = false);
      };
      CameraController.prototype.lateUpdate = function(dt) {
        var targetPos;
        targetPos = this.overview ? this.target.parent.convertToWorldSpaceAR(this.getOverviewTargetsMidpoint()) : this.target.parent.convertToWorldSpaceAR(this.target.position);
        if (this.pointerPan && this.pointerPos) {
          var xDelta = this.pointerPos.x / (this.visibleSize.width / 2) - 1;
          var yDelta = this.pointerPos.y / (this.visibleSize.height / 2) - 1;
          xDelta *= this.pointerXMult;
          yDelta *= this.pointerYMult;
          targetPos = targetPos.add(cc.v2(xDelta, yDelta));
        }
        if (this.smoothFollow) {
          (Math.abs(targetPos.x - this.node.x) >= this.followX || Math.abs(targetPos.y - this.node.y) >= this.followY) && (this.startFollow = true);
          if (this.startFollow) {
            this.node.position = this.node.position.lerp(targetPos, this.followRatio);
            cc.Vec3.distance(targetPos, this.node.position) <= this.minFollowDist && (this.startFollow = false);
          }
        } else this.node.position = this.node.parent.convertToNodeSpaceAR(targetPos);
        if (this.speedZoom) {
          var curSpeed = Math.abs(this.previousPos.x - targetPos.x) / dt;
          var ratio = 0;
          if (curSpeed > this.zoomOutSpeed) {
            var r = (curSpeed - this.zoomOutSpeed) / (this.zoomInSpeed - this.zoomOutSpeed);
            ratio = 1 - cc.misc.clampf(r, .4, 1);
            this.camera.zoomRatio = cc.misc.lerp(this.camera.zoomRatio, ratio, .02);
          } else this.camera.zoomRatio = cc.misc.lerp(this.camera.zoomRatio, this.initZoomRatio, .02);
        }
        this.previousPos = targetPos;
        if (this.jumpZoom) {
          var ratio = targetPos.y / cc.winSize.height;
          this.camera.zoomRatio = 1 + .35 * (.6 - ratio);
        }
        if (this.useBoundaries) {
          var width = this.visibleSize.width / 2 / this.camera.zoomRatio;
          var height = this.visibleSize.height / 2 / this.camera.zoomRatio;
          var minX = this.node.x - width;
          var maxX = this.node.x + width;
          var minY = this.node.y - height;
          var maxY = this.node.y + height;
          minX < this.leftBound && (this.node.x = this.leftBound + width);
          minY < this.bottomBound && (this.node.y = this.bottomBound + height);
          maxX > this.rightBound && (this.node.x = this.rightBound - width);
          maxY > this.topBound && (this.node.y = this.topBound - height);
        }
      };
      CameraController.prototype.getOverviewTargetsMidpoint = function() {
        var midPoint = cc.v2(0, 0);
        var minX = 99999, minY = 99999, maxX = -99999, maxY = -99999;
        for (var i = 0; i < this.overviewTargets.length; ++i) {
          var target = this.overviewTargets[i];
          var pos = target.parent.convertToWorldSpaceAR(target.position);
          maxX = pos.x > maxX ? pos.x : maxX;
          minX = pos.x < minX ? pos.x : minX;
          maxY = pos.y > maxY ? pos.y : maxY;
          minY = pos.y < minY ? pos.y : minY;
        }
        maxX += this.overviewMargin;
        minX -= this.overviewMargin;
        maxY += this.overviewMargin;
        minY -= this.overviewMargin;
        var distX = Math.abs(maxX - minX);
        var distY = Math.abs(maxY - minY);
        midPoint = cc.v2(minX + distX / 2, minY + distY / 2);
        var ratio = Math.max(distX / this.visibleSize.width, distY / this.visibleSize.height);
        this.camera.zoomRatio = cc.misc.clampf(1 / ratio, .3, 1);
        return midPoint;
      };
      CameraController.prototype.shakeCamera = function() {
        if (!this.canShake) return;
        this.anim.play("shake");
        this.scheduleOnce(this.stopShake.bind(this), this.shakeDuration);
      };
      CameraController.prototype.stopShake = function() {
        this.anim.stop();
        this.camera.node.position = cc.Vec3.ZERO;
      };
      CameraController.prototype.onMouseMove = function(event) {
        this.pointerPos = event.getLocation();
      };
      CameraController.prototype.onTouchMove = function(event) {
        this.pointerPos = event.getLocation();
      };
      __decorate([ property(cc.Node) ], CameraController.prototype, "target", void 0);
      __decorate([ property(cc.Camera) ], CameraController.prototype, "camera", void 0);
      __decorate([ property(cc.Animation) ], CameraController.prototype, "anim", void 0);
      __decorate([ property ], CameraController.prototype, "jumpZoom", void 0);
      __decorate([ property ], CameraController.prototype, "centerAtStart", void 0);
      __decorate([ property ], CameraController.prototype, "smoothFollow", void 0);
      __decorate([ property({
        visible: function() {
          return this.smoothFollow;
        }
      }) ], CameraController.prototype, "followX", void 0);
      __decorate([ property({
        visible: function() {
          return this.smoothFollow;
        }
      }) ], CameraController.prototype, "followY", void 0);
      __decorate([ property({
        visible: function() {
          return this.smoothFollow;
        }
      }) ], CameraController.prototype, "minFollowDist", void 0);
      __decorate([ property({
        visible: function() {
          return this.smoothFollow;
        }
      }) ], CameraController.prototype, "followRatio", void 0);
      __decorate([ property() ], CameraController.prototype, "overview", void 0);
      __decorate([ property([ cc.Node ]), property({
        visible: function() {
          return this.overview;
        }
      }) ], CameraController.prototype, "overviewTargets", void 0);
      __decorate([ property({
        visible: function() {
          return this.overview;
        }
      }) ], CameraController.prototype, "overviewMargin", void 0);
      __decorate([ property ], CameraController.prototype, "speedZoom", void 0);
      __decorate([ property({
        visible: function() {
          return this.speedZoom;
        }
      }) ], CameraController.prototype, "zoomInSpeed", void 0);
      __decorate([ property({
        visible: function() {
          return this.speedZoom;
        }
      }) ], CameraController.prototype, "zoomOutSpeed", void 0);
      __decorate([ property ], CameraController.prototype, "canShake", void 0);
      __decorate([ property({
        visible: function() {
          return this.canShake;
        }
      }) ], CameraController.prototype, "shakeDuration", void 0);
      __decorate([ property ], CameraController.prototype, "pointerPan", void 0);
      __decorate([ property({
        visible: function() {
          return this.pointerPan;
        }
      }) ], CameraController.prototype, "pointerXMult", void 0);
      __decorate([ property({
        visible: function() {
          return this.pointerPan;
        }
      }) ], CameraController.prototype, "pointerYMult", void 0);
      __decorate([ property ], CameraController.prototype, "useBoundaries", void 0);
      __decorate([ property({
        visible: function() {
          return this.useBoundaries;
        }
      }) ], CameraController.prototype, "topBound", void 0);
      __decorate([ property({
        visible: function() {
          return this.useBoundaries;
        }
      }) ], CameraController.prototype, "bottomBound", void 0);
      __decorate([ property({
        visible: function() {
          return this.useBoundaries;
        }
      }) ], CameraController.prototype, "leftBound", void 0);
      __decorate([ property({
        visible: function() {
          return this.useBoundaries;
        }
      }) ], CameraController.prototype, "rightBound", void 0);
      CameraController = __decorate([ ccclass ], CameraController);
      return CameraController;
    }(cc.Component);
    exports.default = CameraController;
    cc._RF.pop();
  }, {} ],
  Cannon: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8075f8VRfFCM6ahhNnrEGmW", "Cannon");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("../Game");
    var Obstacle_1 = require("./Obstacle");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Cannon = function(_super) {
      __extends(Cannon, _super);
      function Cannon() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.cannonBall = null;
        _this.shotEffect = null;
        _this.barrelEnd = null;
        _this.charged = true;
        return _this;
      }
      Cannon.prototype.start = function() {
        _super.prototype.start.call(this);
        this.charged = true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.shot, this);
      };
      Cannon.prototype.onCreate = function(p1, p2) {
        this.point1 = p1;
        this.point2 = p2;
        var vector = p2.sub(p1);
        this.node.setPosition(p1);
        var rads = -vector.signAngle(cc.Vec2.RIGHT);
        this.node.angle = cc.misc.radiansToDegrees(rads);
        this.combine();
        Game_1.default.instance.levelEditor.editing && this.playRandomSound(this.dragSounds);
      };
      Cannon.prototype.onExplosionDamage = function(pos) {
        this.scheduleOnce(this.shot, .01);
      };
      Cannon.prototype.activate = function() {
        this.shot();
      };
      Cannon.prototype.shot = function() {
        if (!this.charged) return;
        var force = cc.v2(this.node.right).mul(1e6);
        var shot = cc.instantiate(this.shotEffect);
        shot.setParent(this.node.parent);
        var end = this.node.convertToWorldSpaceAR(this.barrelEnd.getPosition());
        shot.setPosition(this.node.parent.convertToNodeSpaceAR(end));
        if (this.cannonBall.active) {
          this.cannonBall = cc.instantiate(this.cannonBall);
          this.cannonBall.setParent(this.node);
          this.cannonBall.setPosition(this.barrelEnd.getPosition());
        } else this.cannonBall.active = true;
        this.cannonBall.getComponent(cc.RigidBody).applyForceToCenter(force, true);
        this.getComponent(cc.RigidBody).applyForceToCenter(force.negate(), true);
        this.charged = false;
        Game_1.default.instance.camera.shakeCamera();
      };
      __decorate([ property(cc.Node) ], Cannon.prototype, "cannonBall", void 0);
      __decorate([ property(cc.Prefab) ], Cannon.prototype, "shotEffect", void 0);
      __decorate([ property(cc.Node) ], Cannon.prototype, "barrelEnd", void 0);
      Cannon = __decorate([ ccclass ], Cannon);
      return Cannon;
    }(Obstacle_1.default);
    exports.default = Cannon;
    cc._RF.pop();
  }, {
    "../Game": "Game",
    "./Obstacle": "Obstacle"
  } ],
  ChooseLevel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9f31a7u+ipL5o51u/T4r8EQ", "ChooseLevel");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var UserData_1 = require("../Global/UserData");
    var LevelEditor_1 = require("../Level/LevelEditor");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ChooseLevel = function(_super) {
      __extends(ChooseLevel, _super);
      function ChooseLevel() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.pages = [];
        _this.indicator = null;
        _this.menuTheme = null;
        _this.lock = null;
        return _this;
      }
      ChooseLevel.prototype.onLoad = function() {
        cc.audioEngine.isMusicPlaying() || cc.audioEngine.playMusic(this.menuTheme, true);
        cc.director.preloadScene("Level");
        LevelEditor_1.default.editMode;
      };
      ChooseLevel.prototype.openMenu = function() {
        cc.director.loadScene("Menu");
      };
      ChooseLevel.prototype.start = function() {
        var stars = UserData_1.default.loaded.stars;
      };
      ChooseLevel.prototype.loadLevel = function(event, customEventData) {
        var level = +customEventData;
        if (level > UserData_1.default.loaded.stars.length) {
          cc.audioEngine.playEffect(this.lock, false);
          return;
        }
        LevelEditor_1.default.activeLevel = +customEventData;
        cc.director.loadScene("Level");
        cc.audioEngine.stopMusic();
      };
      __decorate([ property([ cc.Node ]) ], ChooseLevel.prototype, "pages", void 0);
      __decorate([ property(cc.Node) ], ChooseLevel.prototype, "indicator", void 0);
      __decorate([ property(cc.AudioClip) ], ChooseLevel.prototype, "menuTheme", void 0);
      __decorate([ property(cc.AudioClip) ], ChooseLevel.prototype, "lock", void 0);
      ChooseLevel = __decorate([ ccclass ], ChooseLevel);
      return ChooseLevel;
    }(cc.Component);
    exports.default = ChooseLevel;
    cc._RF.pop();
  }, {
    "../Global/UserData": "UserData",
    "../Level/LevelEditor": "LevelEditor"
  } ],
  CodeMenu: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "48347WGBn1NV4JWWmnG86mG", "CodeMenu");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("../Game");
    var Level_1 = require("../Level/Level");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var CodeMenu = function(_super) {
      __extends(CodeMenu, _super);
      function CodeMenu() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.code = "";
        return _this;
      }
      CodeMenu.prototype.open = function() {
        this.unscheduleAllCallbacks();
        this.node.active = true;
        this.tween && this.tween.stop();
        this.tween = cc.tween(this.node).set({
          opacity: 0
        }).to(.2, {
          opacity: 160
        }).start();
      };
      CodeMenu.prototype.close = function() {
        var _this = this;
        this.tween && this.tween.stop();
        cc.tween(this.node).to(.2, {
          opacity: 0
        }).start();
        this.scheduleOnce(function() {
          _this.node.active = false;
        }, .2);
      };
      CodeMenu.prototype.beginEditing = function(editBox, customEventdata) {
        this.code = "";
        editBox.textLabel.string = "";
        console.log("Code begin editing");
      };
      CodeMenu.prototype.textChanged = function(text, editBox, customEventdata) {
        this.code = text;
      };
      CodeMenu.prototype.editingEnded = function(editBox, customEventdata) {
        if (Level_1.default.verifyCode(this.code)) {
          var editor = Game_1.default.instance.levelEditor;
          editor.closeEditing();
          editor.loadLevel(this.code);
          editBox.textLabel.string = "level loaded";
        } else {
          this.code = "";
          editBox.textLabel.string = "wrong code";
        }
      };
      CodeMenu.prototype.editingReturn = function(editBox, customEventdata) {
        console.log("code edit return");
      };
      CodeMenu = __decorate([ ccclass ], CodeMenu);
      return CodeMenu;
    }(cc.Component);
    exports.default = CodeMenu;
    cc._RF.pop();
  }, {
    "../Game": "Game",
    "../Level/Level": "Level"
  } ],
  CollisionContactListener: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8b83baB2/xByawpbBo6Qv2p", "CollisionContactListener");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var CollisionContactListener = function(_super) {
      __extends(CollisionContactListener, _super);
      function CollisionContactListener() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.collisionCallback = null;
        _this.relativeVelocity = 500;
        return _this;
      }
      CollisionContactListener.prototype.onBeginContact = function(contact, self, other) {
        if (!other.sensor) {
          var relativeVelocity = self.body.linearVelocity.sub(other.body.linearVelocity).mag();
          relativeVelocity > this.relativeVelocity && this.collisionCallback.emit([]);
        }
      };
      __decorate([ property(cc.Component.EventHandler) ], CollisionContactListener.prototype, "collisionCallback", void 0);
      __decorate([ property ], CollisionContactListener.prototype, "relativeVelocity", void 0);
      CollisionContactListener = __decorate([ ccclass ], CollisionContactListener);
      return CollisionContactListener;
    }(cc.Component);
    exports.default = CollisionContactListener;
    cc._RF.pop();
  }, {} ],
  EditorMenu: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d9064NAznxDuJqx2Ci10akP", "EditorMenu");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("../Game");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var EditorMenu = function(_super) {
      __extends(EditorMenu, _super);
      function EditorMenu() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.toolboxContent = null;
        _this.selected = null;
        _this.normal = null;
        _this.anim = null;
        _this.selectedIndex = 0;
        return _this;
      }
      EditorMenu.prototype.onLoad = function() {
        var _this = this;
        this.toolboxContent.children.forEach(function(selectable) {
          var clickEventHandler = new cc.Component.EventHandler();
          clickEventHandler.target = _this.node;
          clickEventHandler.component = "EditorMenu";
          clickEventHandler.handler = "select";
          clickEventHandler.customEventData = selectable.getSiblingIndex().toString();
          var button = selectable.addComponent(cc.Button);
          button.clickEvents.push(clickEventHandler);
          button.transition = cc.Button.Transition.SCALE;
          button.zoomScale = .9;
        });
      };
      EditorMenu.prototype.open = function() {
        Game_1.default.instance.gameMenu.close();
        this.node.active = true;
        var s = this.anim.playAdditive("openEditor");
        s.wrapMode = cc.WrapMode.Normal;
      };
      EditorMenu.prototype.close = function() {
        Game_1.default.instance.gameMenu.open();
        var s = this.anim.playAdditive("openEditor");
        s.wrapMode = cc.WrapMode.Reverse;
      };
      EditorMenu.prototype.select = function(event, eventData) {
        this.toolboxContent.children[this.selectedIndex].getComponent(cc.Sprite).spriteFrame = this.normal;
        this.toolboxContent.children[eventData].getComponent(cc.Sprite).spriteFrame = this.selected;
        this.selectedIndex = eventData;
        Game_1.default.instance.levelEditor.selectTool(eventData);
      };
      __decorate([ property(cc.Node) ], EditorMenu.prototype, "toolboxContent", void 0);
      __decorate([ property(cc.SpriteFrame) ], EditorMenu.prototype, "selected", void 0);
      __decorate([ property(cc.SpriteFrame) ], EditorMenu.prototype, "normal", void 0);
      __decorate([ property(cc.Animation) ], EditorMenu.prototype, "anim", void 0);
      EditorMenu = __decorate([ ccclass ], EditorMenu);
      return EditorMenu;
    }(cc.Component);
    exports.default = EditorMenu;
    cc._RF.pop();
  }, {
    "../Game": "Game"
  } ],
  Explosion: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ab50e2GyUhC1ICXrzQQA5z7", "Explosion");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("./Game");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Explosion = function(_super) {
      __extends(Explosion, _super);
      function Explosion() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.explosionSound = null;
        _this.applyForce = false;
        _this.interactObstacles = false;
        _this.maxForce = 25e4;
        _this.explosionMark = null;
        return _this;
      }
      Explosion.prototype.onEnable = function() {
        var _this = this;
        cc.audioEngine.playEffect(this.explosionSound, false);
        this.scheduleOnce(function() {
          return _this.getComponent(cc.Collider).enabled = false;
        }, .05);
        this.scheduleOnce(function() {
          return _this.node.destroy();
        }, 1);
      };
      Explosion.prototype.onBeginContact = function(contact, selfCollider, otherCollider) {
        this.enabled = false;
        selfCollider.enabled = false;
        var radius = this.getComponent(cc.PhysicsCircleCollider).radius;
        var other_pos = otherCollider.node.parent.convertToWorldSpaceAR(otherCollider.node.getPosition());
        var self_pos = selfCollider.node.parent.convertToWorldSpaceAR(selfCollider.node.getPosition());
        if (this.applyForce && otherCollider.body.type === cc.RigidBodyType.Dynamic) {
          var force_vector = other_pos.sub(self_pos);
          var d = force_vector.mag();
          var force = cc.misc.lerp(this.maxForce, this.maxForce / 4, d / radius);
          force_vector = force_vector.normalize().mul(force);
          otherCollider.body.applyForceToCenter(force_vector, true);
        }
        if (!otherCollider.sensor && otherCollider.node.group.includes("obstacles") && otherCollider instanceof cc.PhysicsBoxCollider) {
          var maskNode = otherCollider.node.getChildByName("explosionMask");
          if (null === maskNode) {
            maskNode = new cc.Node("explosionMask");
            maskNode.setParent(otherCollider.node);
            maskNode.setPosition(otherCollider.offset);
            maskNode.setContentSize(otherCollider.size);
            var mask = maskNode.addComponent(cc.Mask);
            mask.type = cc.Mask.Type.RECT;
          }
          var markNode = new cc.Node("explosionMark");
          markNode.setContentSize(cc.size(radius));
          markNode.setParent(maskNode);
          markNode.setPosition(maskNode.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(cc.Vec3.ZERO)));
          var mark = markNode.addComponent(cc.Sprite);
          mark.spriteFrame = this.explosionMark;
        }
      };
      Explosion.prototype.onDisable = function() {
        if (this.interactObstacles) {
          var self_pos = this.node.parent.convertToWorldSpaceAR(this.node.getPosition());
          var radius = this.getComponent(cc.PhysicsCircleCollider).radius;
          var obstacles = Game_1.default.instance.levelEditor.obstacles;
          for (var i = 4; i < obstacles.length; i++) {
            var o = obstacles[i];
            var pos = o.node.parent.convertToWorldSpaceAR(o.node.getPosition());
            cc.Vec2.distance(self_pos, pos) < radius && o.onExplosionDamage(self_pos, radius);
          }
        }
      };
      __decorate([ property(cc.AudioClip) ], Explosion.prototype, "explosionSound", void 0);
      __decorate([ property() ], Explosion.prototype, "applyForce", void 0);
      __decorate([ property() ], Explosion.prototype, "interactObstacles", void 0);
      __decorate([ property({
        visible: function() {
          return this.applyForce;
        }
      }) ], Explosion.prototype, "maxForce", void 0);
      __decorate([ property(cc.SpriteFrame) ], Explosion.prototype, "explosionMark", void 0);
      Explosion = __decorate([ ccclass ], Explosion);
      return Explosion;
    }(cc.Component);
    exports.default = Explosion;
    cc._RF.pop();
  }, {
    "./Game": "Game"
  } ],
  GameMenu: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2bb5cGD9whGVoXdKGpwgj3b", "GameMenu");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var LevelEditor_1 = require("../Level/LevelEditor");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var GameMenu = function(_super) {
      __extends(GameMenu, _super);
      function GameMenu() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.screen = null;
        _this.buttons = [];
        _this.closeLevel = null;
        return _this;
      }
      GameMenu.prototype.start = function() {
        LevelEditor_1.default.editMode || (this.buttons[2].node.active = false);
      };
      GameMenu.prototype.open = function() {
        this.screen.active = true;
        cc.tween(this.node).to(.1, {
          opacity: 255
        }).start();
        this.buttons.forEach(function(b) {
          b.interactable = true;
        });
      };
      GameMenu.prototype.close = function() {
        this.screen.active = false;
        this.buttons.forEach(function(b) {
          b.interactable = false;
        });
        cc.tween(this.node).to(.1, {
          opacity: 0
        }).start();
      };
      GameMenu.prototype.showCloseLevel = function(show) {
        void 0 === show && (show = true);
        this.closeLevel.active = !!show;
      };
      __decorate([ property(cc.Node) ], GameMenu.prototype, "screen", void 0);
      __decorate([ property([ cc.Button ]) ], GameMenu.prototype, "buttons", void 0);
      __decorate([ property(cc.Node) ], GameMenu.prototype, "closeLevel", void 0);
      GameMenu = __decorate([ ccclass ], GameMenu);
      return GameMenu;
    }(cc.Component);
    exports.default = GameMenu;
    cc._RF.pop();
  }, {
    "../Level/LevelEditor": "LevelEditor"
  } ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "64e96uqVJBKRJUx5Ip8lruu", "Game");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Grenade_1 = require("./Grenade");
    var CameraController_1 = require("./CameraController");
    var ThrowZone_1 = require("./ThrowZone");
    var LevelEditor_1 = require("./Level/LevelEditor");
    var Monster_1 = require("./Obstacles/Monster");
    var Ground_1 = require("./Ground");
    var Scoreboard_1 = require("./UI/Scoreboard");
    var UserData_1 = require("./Global/UserData");
    var GameMenu_1 = require("./UI/GameMenu");
    var OverviewTarget_1 = require("./OverviewTarget");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Game = function(_super) {
      __extends(Game, _super);
      function Game() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.overviewTargets = [];
        _this.gameMenu = null;
        _this.monsterCamera = null;
        _this.levelEditor = null;
        _this.ground = null;
        _this.canvas = null;
        _this.gameTheme = null;
        _this.grenade = null;
        _this.camera = null;
        _this.monster = null;
        _this.throwZone = null;
        _this.center = null;
        _this.scoreboard = null;
        _this.starsCollected = 0;
        _this.paused = false;
        _this.gameover = false;
        return _this;
      }
      Game_1 = Game;
      Game.prototype.onLoad = function() {
        cc.audioEngine.isMusicPlaying() || cc.audioEngine.playMusic(this.gameTheme, true);
        cc.director.getPhysicsManager().enabled = true;
        cc.debug.setDisplayStats(false);
        Game_1.instance = this;
      };
      Game.prototype.look = function() {
        this.camera.target = this.monster.node;
        this.camera.overview = false;
        Math.random() < .25 && this.monster.getComponent(Monster_1.default).playAnimation("Roar");
      };
      Game.prototype.cancelLook = function() {
        this.camera.target = this.center;
        this.camera.overview = true;
      };
      Game.prototype.chooseLevel = function() {
        cc.director.loadScene("ChooseLevel");
        cc.audioEngine.stopMusic();
        LevelEditor_1.default.editMode && UserData_1.default.loaded.saveUserLevel(LevelEditor_1.default.activeLevel, this.levelEditor.level.getCode());
      };
      Game.prototype.onThrow = function() {
        this.overviewTargets.forEach(function(t) {
          t.followTarget = true;
        });
      };
      Game.prototype.onBombExploded = function() {
        this.overviewTargets[1].target = this.monster.node;
      };
      Game.prototype.restart = function() {
        this.unscheduleAllCallbacks();
        this.levelEditor.reloadLevel();
        this.monsterCamera.node.active = false;
        this.scoreboard.close();
        this.grenade.reset();
        this.throwZone.node.active = true;
        this.starsCollected = 0;
        this.camera.overview = true;
        this.camera.target = Game_1.instance.center;
        this.overviewTargets.forEach(function(t) {
          t.followTarget = false;
        });
        this.overviewTargets[1].target = this.grenade.node;
        this.gameover = false;
        this.gameMenu.showCloseLevel(false);
      };
      Game.prototype.endGame = function() {
        if (this.gameover) return;
        this.gameover = true;
        this.monsterCamera.node.active = true;
        if (LevelEditor_1.default.editMode) {
          UserData_1.default.loaded.saveUserLevel(LevelEditor_1.default.activeLevel, this.levelEditor.level.getCode());
          UserData_1.default.loaded.setUserStars(LevelEditor_1.default.activeLevel, this.starsCollected);
        } else UserData_1.default.loaded.setStars(LevelEditor_1.default.activeLevel, this.starsCollected);
        this.scoreboard.open();
      };
      Game.prototype.pause = function() {
        cc.director.getPhysicsManager().enabled = false;
        this.paused = true;
      };
      Game.prototype.resume = function() {
        cc.director.getPhysicsManager().enabled = true;
        this.paused = false;
      };
      var Game_1;
      __decorate([ property([ OverviewTarget_1.default ]) ], Game.prototype, "overviewTargets", void 0);
      __decorate([ property(GameMenu_1.default) ], Game.prototype, "gameMenu", void 0);
      __decorate([ property(cc.Camera) ], Game.prototype, "monsterCamera", void 0);
      __decorate([ property(LevelEditor_1.default) ], Game.prototype, "levelEditor", void 0);
      __decorate([ property(Ground_1.default) ], Game.prototype, "ground", void 0);
      __decorate([ property(cc.Animation) ], Game.prototype, "canvas", void 0);
      __decorate([ property(cc.AudioClip) ], Game.prototype, "gameTheme", void 0);
      __decorate([ property(Grenade_1.default) ], Game.prototype, "grenade", void 0);
      __decorate([ property(CameraController_1.default) ], Game.prototype, "camera", void 0);
      __decorate([ property(Monster_1.default) ], Game.prototype, "monster", void 0);
      __decorate([ property(ThrowZone_1.default) ], Game.prototype, "throwZone", void 0);
      __decorate([ property(cc.Node) ], Game.prototype, "center", void 0);
      __decorate([ property(Scoreboard_1.default) ], Game.prototype, "scoreboard", void 0);
      Game = Game_1 = __decorate([ ccclass ], Game);
      return Game;
    }(cc.Component);
    exports.default = Game;
    cc._RF.pop();
  }, {
    "./CameraController": "CameraController",
    "./Global/UserData": "UserData",
    "./Grenade": "Grenade",
    "./Ground": "Ground",
    "./Level/LevelEditor": "LevelEditor",
    "./Obstacles/Monster": "Monster",
    "./OverviewTarget": "OverviewTarget",
    "./ThrowZone": "ThrowZone",
    "./UI/GameMenu": "GameMenu",
    "./UI/Scoreboard": "Scoreboard"
  } ],
  Grenade: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b6677kXOsxNAIymDJOJI4m4", "Grenade");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Game_1 = require("./Game");
    var Monster_1 = require("./Obstacles/Monster");
    var Grenade = function(_super) {
      __extends(Grenade, _super);
      function Grenade() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.igniteBurningSound = null;
        _this.extinguishSound = null;
        _this.throwSound = null;
        _this.timer = 3;
        _this.explosion = null;
        _this.spark = null;
        _this.wick = null;
        _this.controlPoint = null;
        _this.ignited = false;
        _this.igniteBurningSoundAudioId = 0;
        _this.preElapsedTime = 0;
        _this.elapsedTime = 0;
        return _this;
      }
      Grenade.prototype.start = function() {
        this.startPosition = this.node.getPosition();
      };
      Grenade.prototype.throw = function(direction) {
        var rigidBody = this.getComponent(cc.RigidBody);
        rigidBody.type = cc.RigidBodyType.Dynamic;
        rigidBody.applyForceToCenter(cc.v2(direction.x, direction.y), true);
        cc.audioEngine.playEffect(this.throwSound, false);
      };
      Grenade.prototype.update = function(dt) {
        if (this.ignited && !Game_1.default.instance.paused) {
          this.elapsedTime += dt;
          var v = cc.Vec3.ZERO;
          var v2 = cc.Vec3.ZERO;
          this.spark.position = cc.Vec3.lerp(v, cc.v3(20, 0, 0), cc.Vec3.ZERO, this.elapsedTime / this.timer);
          this.controlPoint.position = cc.Vec3.lerp(v2, cc.v3(10, 0, 0), cc.Vec3.ZERO, this.elapsedTime / this.timer);
          var t = this.timer - .7;
          this.elapsedTime > t && this.preElapsedTime < t && this.preExplode();
          t = this.timer;
          this.elapsedTime > t && this.preElapsedTime < t && this.explode();
          t = this.timer + 2;
          this.elapsedTime > t && t < this.timer && Game_1.default.instance.endGame();
        }
        this.preElapsedTime = this.elapsedTime;
        var g = this.wick;
        var spark = this.spark.position;
        g.clear();
        g.moveTo(0, 0);
        var c = this.controlPoint.position;
        c = this.wick.node.convertToNodeSpaceAR(this.controlPoint.convertToWorldSpaceAR(cc.Vec3.ZERO, c));
        g.quadraticCurveTo(c.x, c.y, spark.x, spark.y);
        g.stroke();
      };
      Grenade.prototype.preExplode = function() {
        var monster = Game_1.default.instance.monster.node;
        var mPos = monster.parent.convertToWorldSpaceAR(monster.getPosition());
        var d = this.node.getPosition().sub(mPos).mag();
        d < 200 && monster.getComponent(Monster_1.default).playAnimation("Scream");
      };
      Grenade.prototype.prepare = function() {
        this.node.children.forEach(function(element) {
          element.active = true;
        });
      };
      Grenade.prototype.ignite = function() {
        this.spark.active = true;
        this.ignited = true;
        this.igniteBurningSoundAudioId = cc.audioEngine.playEffect(this.igniteBurningSound, false);
      };
      Grenade.prototype.extinguish = function() {
        this.ignited && cc.audioEngine.playEffect(this.extinguishSound, false);
        this.ignited = false;
        this.elapsedTime = 0;
        this.spark.active = false;
        this.spark.setPosition(cc.v2(20, 0));
        this.controlPoint.setPosition(cc.v2(10, 0));
        this.node.children.forEach(function(element) {
          element.active = false;
        });
        var state = cc.audioEngine.getState(this.igniteBurningSoundAudioId);
        state == cc.audioEngine.AudioState.PLAYING && cc.audioEngine.stopEffect(this.igniteBurningSoundAudioId);
      };
      Grenade.prototype.reset = function() {
        this.extinguish();
        this.node.setPosition(this.startPosition);
        var rigidBody = this.getComponent(cc.RigidBody);
        rigidBody.type = cc.RigidBodyType.Static;
        rigidBody.linearVelocity = cc.Vec2.ZERO;
        this.node.active = true;
        this.node.angle = 0;
      };
      Grenade.prototype.explode = function() {
        this.node.active = false;
        var monster = Game_1.default.instance.monster;
        var selfPos = this.node.parent.convertToWorldSpaceAR(this.node.getPosition());
        monster.onBombExploded(selfPos);
        Game_1.default.instance.onBombExploded();
        Game_1.default.instance.camera.shakeCamera();
        var exp = cc.instantiate(this.explosion);
        exp.setParent(cc.director.getScene());
        exp.setPosition(this.node.getPosition());
      };
      __decorate([ property(cc.AudioClip) ], Grenade.prototype, "igniteBurningSound", void 0);
      __decorate([ property(cc.AudioClip) ], Grenade.prototype, "extinguishSound", void 0);
      __decorate([ property(cc.AudioClip) ], Grenade.prototype, "throwSound", void 0);
      __decorate([ property ], Grenade.prototype, "timer", void 0);
      __decorate([ property(cc.Prefab) ], Grenade.prototype, "explosion", void 0);
      __decorate([ property(cc.Node) ], Grenade.prototype, "spark", void 0);
      __decorate([ property(cc.Graphics) ], Grenade.prototype, "wick", void 0);
      __decorate([ property(cc.Node) ], Grenade.prototype, "controlPoint", void 0);
      Grenade = __decorate([ ccclass ], Grenade);
      return Grenade;
    }(cc.Component);
    exports.default = Grenade;
    cc._RF.pop();
  }, {
    "./Game": "Game",
    "./Obstacles/Monster": "Monster"
  } ],
  Ground: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "492b2qkq41CLZpQAGgwiIqQ", "Ground");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Ground = function(_super) {
      __extends(Ground, _super);
      function Ground() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.segments = [];
        _this.camera = null;
        _this.segmentLength = 1600;
        return _this;
      }
      Ground.prototype.update = function() {
        var s = this.segments;
        var camPos = this.camera.parent.convertToWorldSpaceAR(this.camera.position);
        var segmentPos = s[1].parent.convertToWorldSpaceAR(s[1].position);
        if (camPos.x > segmentPos.x + this.segmentLength) {
          s[0].position = s[2].position.add(cc.v3(this.segmentLength));
          s.push(s.shift());
        } else if (camPos.x < segmentPos.x) {
          s[2].position = s[0].position.sub(cc.v3(this.segmentLength));
          s.unshift(s.pop());
        }
      };
      Ground.prototype.intersectPoint = function(worldPoint) {
        var points = this.getComponent(cc.PolygonCollider).world.points;
        return !!cc.Intersection.pointInPolygon(worldPoint, points);
      };
      __decorate([ property([ cc.Node ]) ], Ground.prototype, "segments", void 0);
      __decorate([ property(cc.Node) ], Ground.prototype, "camera", void 0);
      __decorate([ property ], Ground.prototype, "segmentLength", void 0);
      Ground = __decorate([ ccclass ], Ground);
      return Ground;
    }(cc.Component);
    exports.default = Ground;
    cc._RF.pop();
  }, {} ],
  LevelEditor: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2f98aeHDfhJ8J9FlKPTWqoZ", "LevelEditor");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("../Game");
    var Obstacle_1 = require("../Obstacles/Obstacle");
    var TrashBin_1 = require("./TrashBin");
    var Level_1 = require("./Level");
    var EditorMenu_1 = require("../UI/EditorMenu");
    var UserData_1 = require("../Global/UserData");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LevelEditor = function(_super) {
      __extends(LevelEditor, _super);
      function LevelEditor() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.overviewTarget = null;
        _this.dragTreshold = 10;
        _this.editorMenu = null;
        _this.trashBin = null;
        _this.selector = null;
        _this.openSound = null;
        _this.pin = null;
        _this.closeSound = null;
        _this.cellSize = 32;
        _this.pointRadius = 5;
        _this.obstaclePrefabs = [];
        _this.editorPanel = null;
        _this.cameraTarget = null;
        _this.minMaxZoom = cc.v2(.4, 1.4);
        _this.level = Level_1.default.getLevel(0);
        _this.selectedObstacle = 0;
        _this.selectedPoints = [];
        _this.camera = null;
        _this.editing = false;
        _this.touchStart = cc.Vec2.ZERO;
        _this.drag = false;
        _this.distance = 0;
        _this.obstacles = new Array();
        return _this;
      }
      LevelEditor_1 = LevelEditor;
      LevelEditor.prototype.onLoad = function() {
        this.editorPanel.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.editorPanel.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.editorPanel.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.editorPanel.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.editorPanel.on(cc.Node.EventType.MOUSE_WHEEL, this.mouseWheel, this);
      };
      LevelEditor.prototype.start = function() {
        this.camera = cc.Camera.main;
        if (LevelEditor_1.editMode) {
          var userLevel = UserData_1.default.loaded.getUserLevel(LevelEditor_1.activeLevel);
          this.level = null != userLevel ? Level_1.default.fromCode(userLevel) : Level_1.default.getLevel(0);
          this.reloadLevel();
          this.openEditing();
        } else {
          this.level = Level_1.default.getLevel(LevelEditor_1.activeLevel);
          this.reloadLevel();
        }
      };
      LevelEditor.prototype.openEditing = function() {
        var bomb = Game_1.default.instance.grenade;
        bomb.ignited ? Game_1.default.instance.restart() : this.reloadLevel();
        cc.audioEngine.playEffect(this.openSound, false);
        this.editorMenu.open();
        this.editing = true;
        this.editorPanel.active = true;
        var cam = Game_1.default.instance.camera;
        var monsterPos = this.obstacles[0].node.getPosition();
        this.cameraTarget.setPosition(monsterPos);
        cam.target = this.cameraTarget;
        cam.overview = false;
        cc.director.getPhysicsManager().enabled = false;
      };
      LevelEditor.prototype.selectTool = function(tool) {
        this.selectedObstacle = +tool;
        tool < this.obstaclePrefabs.length && cc.audioEngine.playEffect(this.obstaclePrefabs[tool].data.getComponent(Obstacle_1.default).dragSounds[0], false);
      };
      LevelEditor.prototype.closeEditing = function() {
        this.editing = false;
        var cam = Game_1.default.instance.camera;
        cam.target = Game_1.default.instance.center;
        cam.overview = true;
        this.saveLevel();
        this.reloadLevel();
        cc.director.getPhysicsManager().enabled = true;
        cc.audioEngine.playEffect(this.closeSound, false);
        this.editorMenu.close();
        this.editorPanel.active = false;
      };
      LevelEditor.prototype.onTouchStart = function(event) {
        this.touchStart = event.touch.getLocation();
      };
      LevelEditor.prototype.onTouchCancel = function(event) {
        this.clearPoints();
      };
      LevelEditor.prototype.onTouchEnd = function(event) {
        if (!this.editing) return;
        if (this.drag) {
          this.drag = false;
          return;
        }
        this.selectPoint(event.touch.getLocation());
        var touchLoc = event.touch.getLocation();
        var local = this.convertToLocalPoint(touchLoc);
        var x = Math.round(local.x / this.cellSize);
        var y = Math.round(local.y / this.cellSize);
        this.selectedPoints.push(cc.v2(x, y));
        2 == this.selectedObstacle && this.selectedPoints.push(this.selectedPoints[0]);
        if (this.selectedPoints.length > 1) {
          if ((0 == this.selectedObstacle || 3 == this.selectedObstacle) && this.selectedPoints[0].equals(this.selectedPoints[1])) {
            this.clearPoints();
            return;
          }
          this.createObstacle();
        }
      };
      LevelEditor.prototype.selectPoint = function(position) {
        this.selector.setPosition(this.snapToGridInNodeSpace(position));
        this.selector.active = true;
      };
      LevelEditor.prototype.onTouchMove = function(event) {
        var touches = event.getTouches();
        if (touches.length > 1) {
          0 == this.distance && (this.distance = cc.Vec2.squaredDistance(touches[0].getLocation(), touches[1].getLocation()) / this.camera.zoomRatio);
          var zoom = cc.Vec2.squaredDistance(touches[0].getLocation(), touches[1].getLocation()) / this.distance;
          this.camera.zoomRatio = zoom;
          this.camera.zoomRatio = cc.misc.clampf(this.camera.zoomRatio, this.minMaxZoom.x, this.minMaxZoom.y);
        } else this.distance = 0;
        if (!this.drag) {
          var delta_1 = this.touchStart.sub(event.touch.getLocation()).mag();
          if (delta_1 > this.dragTreshold) {
            this.clearPoints();
            this.drag = true;
          }
        }
        var delta = event.touch.getDelta();
        this.moveCamera(delta);
      };
      LevelEditor.prototype.moveCamera = function(deltaPosition) {
        var pos = this.cameraTarget.getPosition();
        var zoom = this.camera.zoomRatio;
        pos = pos.sub(deltaPosition.mul(1.5 / zoom));
        pos.x = cc.misc.clampf(pos.x, 0, this.node.width);
        pos.y = cc.misc.clampf(pos.y, 0, this.node.height);
        this.cameraTarget.setPosition(pos);
      };
      LevelEditor.prototype.saveLevel = function() {
        var obs = new Array();
        this.obstacles.forEach(function(o) {
          obs.push(o.getInfo());
        });
        this.level = new Level_1.default(obs);
      };
      LevelEditor.prototype.clearPoints = function() {
        this.selectedPoints = [];
        this.selector.active = false;
      };
      LevelEditor.prototype.mouseWheel = function(event) {
        var scroll = event.getScrollY();
        this.camera.zoomRatio += .1 * scroll;
        this.camera.zoomRatio = cc.misc.clampf(this.camera.zoomRatio, this.minMaxZoom.x, this.minMaxZoom.y);
      };
      LevelEditor.prototype.loadLevel = function(code) {
        this.level = Level_1.default.fromCode(code);
        this.reloadLevel();
      };
      LevelEditor.prototype.reloadLevel = function() {
        this.clearPoints();
        this.clearLevel();
        var obstacleSelected = this.selectedObstacle;
        for (var i = 0; i < this.level.obstacles.length; i++) {
          var o = this.level.obstacles[i];
          if (i < 4) this.obstacles[i].setPosition(o.point1.mul(this.cellSize)); else {
            this.selectedObstacle = o.id - 2;
            this.selectedPoints.push(o.point1);
            this.selectedPoints.push(o.point2);
            this.selectedObstacle < this.obstaclePrefabs.length && this.createObstacle();
          }
        }
        var lx = 0, ly = 0;
        for (var i = 0; i < this.obstacles.length; i++) {
          var o = this.obstacles[i];
          o.reset();
          var rect = o.node.getBoundingBoxToWorld();
          var xMax = rect.xMax, yMax = rect.yMax;
          lx = xMax > lx ? xMax : lx;
          ly = yMax > ly ? yMax : ly;
        }
        var target = Game_1.default.instance.overviewTargets[0];
        target.followTarget || target.setPosition(cc.v2(lx - 150, ly - 150));
        this.selectedObstacle = obstacleSelected;
      };
      LevelEditor.prototype.clearLevel = function() {
        for (var i = 4; i < this.obstacles.length; i++) this.obstacles[i].destroy();
        this.obstacles.splice(4, this.obstacles.length);
        for (var i = 8; i < this.node.children.length; i++) this.node.children[i].destroy();
      };
      LevelEditor.prototype.createObstacle = function() {
        var points = this.selectedPoints;
        this.selectedObstacle < 2 && points.sort(function(a, b) {
          return Math.abs(a.x - b.x) > Math.abs(a.y - b.y) ? a.x - b.x : a.y - b.y;
        });
        var obstacle = cc.instantiate(this.obstaclePrefabs[this.selectedObstacle]);
        this.obstacles.push(obstacle.getComponent(Obstacle_1.default));
        var p1 = points[0].mul(this.cellSize);
        var p2 = points[1].mul(this.cellSize);
        obstacle.setParent(this.node);
        obstacle.getComponent(Obstacle_1.default).onCreate(p1, p2);
        this.clearPoints();
      };
      LevelEditor.prototype.snapToGrid = function(screenPoint) {
        return this.node.convertToWorldSpaceAR(this.snapToGridInNodeSpace(screenPoint));
      };
      LevelEditor.prototype.snapToGridInNodeSpace = function(screenPoint) {
        var local = this.convertToLocalPoint(screenPoint);
        var x = Math.round(local.x / this.cellSize) * this.cellSize;
        var y = Math.round(local.y / this.cellSize) * this.cellSize;
        return cc.v2(x, y);
      };
      LevelEditor.prototype.convertToLocalPoint = function(screenPoint) {
        this.camera.getScreenToWorldPoint(screenPoint, screenPoint);
        var local = this.node.convertToNodeSpaceAR(screenPoint);
        return local;
      };
      LevelEditor.prototype.shareLevel = function() {
        this.saveLevel();
        var code = this.level.getCode();
        console.log(code);
        cc.sys.os === cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showAlertDialog", "(Ljava/lang/String;Ljava/lang/String;)V", "Level Code", code) : cc.sys.os !== cc.sys.OS_IOS && cc.sys.os !== cc.sys.OS_OSX || jsb.reflection.callStaticMethod("AppController", "showAlertDialog:withMessage:", "Level Code", code);
      };
      var LevelEditor_1;
      LevelEditor.activeLevel = 0;
      LevelEditor.editMode = true;
      __decorate([ property(cc.Node) ], LevelEditor.prototype, "overviewTarget", void 0);
      __decorate([ property ], LevelEditor.prototype, "dragTreshold", void 0);
      __decorate([ property(EditorMenu_1.default) ], LevelEditor.prototype, "editorMenu", void 0);
      __decorate([ property(TrashBin_1.default) ], LevelEditor.prototype, "trashBin", void 0);
      __decorate([ property(cc.Node) ], LevelEditor.prototype, "selector", void 0);
      __decorate([ property(cc.AudioClip) ], LevelEditor.prototype, "openSound", void 0);
      __decorate([ property(cc.SpriteFrame) ], LevelEditor.prototype, "pin", void 0);
      __decorate([ property(cc.AudioClip) ], LevelEditor.prototype, "closeSound", void 0);
      __decorate([ property ], LevelEditor.prototype, "cellSize", void 0);
      __decorate([ property ], LevelEditor.prototype, "pointRadius", void 0);
      __decorate([ property([ cc.Prefab ]) ], LevelEditor.prototype, "obstaclePrefabs", void 0);
      __decorate([ property(cc.Node) ], LevelEditor.prototype, "editorPanel", void 0);
      __decorate([ property(cc.Node) ], LevelEditor.prototype, "cameraTarget", void 0);
      __decorate([ property(cc.Vec2) ], LevelEditor.prototype, "minMaxZoom", void 0);
      __decorate([ property([ Obstacle_1.default ]) ], LevelEditor.prototype, "obstacles", void 0);
      LevelEditor = LevelEditor_1 = __decorate([ ccclass ], LevelEditor);
      return LevelEditor;
    }(cc.Component);
    exports.default = LevelEditor;
    cc._RF.pop();
  }, {
    "../Game": "Game",
    "../Global/UserData": "UserData",
    "../Obstacles/Obstacle": "Obstacle",
    "../UI/EditorMenu": "EditorMenu",
    "./Level": "Level",
    "./TrashBin": "TrashBin"
  } ],
  LevelFrame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f2a93FPZhlIQYV6qg+9KdPm", "LevelFrame");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var UserData_1 = require("../Global/UserData");
    var LevelEditor_1 = require("../Level/LevelEditor");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LevelFrame = function(_super) {
      __extends(LevelFrame, _super);
      function LevelFrame() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.lockSound = null;
        _this.blueSkin = null;
        _this.label = null;
        _this.lock = null;
        _this.frame = null;
        _this.stars = null;
        _this.plus = null;
        _this.index = 0;
        _this.locked = true;
        _this.addLvel = false;
        return _this;
      }
      LevelFrame.prototype.start = function() {
        this.index = this.node.getSiblingIndex() + 15 * this.node.parent.getSiblingIndex();
        this.label.string = (this.index + 1).toString();
        var data = UserData_1.default.loaded;
        if (LevelEditor_1.default.editMode) {
          this.frame.spriteFrame = this.blueSkin;
          this.lock.active = false;
          var c = data.userLevels[this.index];
          if (null != c) {
            this.label.node.active = true;
            if (null == data.userStars) return;
            this.stars.active = true;
            for (var i = 0; i < 3; i++) {
              var star = this.stars.children[i];
              var s = data.userStars[this.index];
              star.active = null != s && i < s;
            }
          } else {
            this.plus.active = true;
            this.frame.enabled = false;
          }
        } else if (this.index <= data.stars.length) {
          this.lock.active = false;
          this.label.node.active = true;
          this.stars.active = true;
          for (var i = 0; i < 3; i++) {
            var star = this.stars.children[i];
            star.active = i < data.stars[this.index];
          }
        }
      };
      LevelFrame.prototype.press = function() {
        if (!LevelEditor_1.default.editMode && this.index > UserData_1.default.loaded.stars.length) {
          cc.audioEngine.playEffect(this.lockSound, false);
          return;
        }
        LevelEditor_1.default.activeLevel = this.index;
        cc.director.loadScene("Level");
        cc.audioEngine.stopMusic();
      };
      __decorate([ property(cc.AudioClip) ], LevelFrame.prototype, "lockSound", void 0);
      __decorate([ property(cc.SpriteFrame) ], LevelFrame.prototype, "blueSkin", void 0);
      __decorate([ property(cc.Label) ], LevelFrame.prototype, "label", void 0);
      __decorate([ property(cc.Node) ], LevelFrame.prototype, "lock", void 0);
      __decorate([ property(cc.Sprite) ], LevelFrame.prototype, "frame", void 0);
      __decorate([ property(cc.Node) ], LevelFrame.prototype, "stars", void 0);
      __decorate([ property(cc.Node) ], LevelFrame.prototype, "plus", void 0);
      LevelFrame = __decorate([ ccclass ], LevelFrame);
      return LevelFrame;
    }(cc.Component);
    exports.default = LevelFrame;
    cc._RF.pop();
  }, {
    "../Global/UserData": "UserData",
    "../Level/LevelEditor": "LevelEditor"
  } ],
  Level: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a1edduVqH9CqaqfK+pxurIm", "Level");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ObstacleInfo_1 = require("../Obstacles/ObstacleInfo");
    var chars = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", "-", "?", "=" ];
    var Level = function() {
      function Level(obstacles) {
        this.obstacles = [];
        this.obstacles = obstacles;
      }
      Level.prototype.addObstacle = function(obstacle) {
        this.obstacles.push(obstacle);
      };
      Level.prototype.getCode = function() {
        var code = "";
        var numbers = this.toArray();
        for (var i = 0; i < numbers.length; i++) {
          var char = chars[numbers[i]];
          code = code.concat(char);
        }
        return code;
      };
      Level.fromCode = function(code) {
        var numbers = new Array();
        for (var i = 0; i < code.length; i++) {
          var n = chars.indexOf(code[i]);
          numbers.push(n);
        }
        return this.fromArray(numbers);
      };
      Level.prototype.toArray = function() {
        var numbers = new Array();
        for (var i = 0; i < this.obstacles.length; i++) {
          var obs = this.obstacles[i];
          numbers = numbers.concat(obs.getNumbers());
        }
        return numbers;
      };
      Level.fromArray = function(numbers) {
        var obstacles = new Array();
        var monserPosition = cc.v2(numbers[0], numbers[1]);
        obstacles.push(new ObstacleInfo_1.default(0, monserPosition));
        for (var i_1 = 2; i_1 < 8; i_1 += 2) {
          var starPosition = cc.v2(numbers[i_1], numbers[i_1 + 1]);
          obstacles.push(new ObstacleInfo_1.default(1, starPosition));
        }
        var i = 8;
        while (i < numbers.length) {
          var id = numbers[i];
          var point1 = cc.v2(numbers[i + 1], numbers[i + 2]);
          var point2 = cc.v2(point1.x, point1.y);
          if (ObstacleInfo_1.default.hasControlpoint(id)) {
            point2 = cc.v2(numbers[i + 3], numbers[i + 4]);
            i += 5;
          } else i += 3;
          obstacles.push(new ObstacleInfo_1.default(id, point1, point2));
        }
        return new Level(obstacles);
      };
      Level.getLevel = function(index) {
        var code = "ijmnipenckckhdhhkh";
        index > 0 && cc.sys.localStorage.getItem("levelSeed");
        switch (index) {
         case 1:
          code = "jlpqiecrcmhshcfbfgclblgdfhlhdgjmjegiemicsbss";
          break;

         case 2:
          code = "tlxlqfpmcsbsjdsjvjdvjzgdzgzpdnpzpdnknpdjgnedneqicdbdgddgjg";
          break;

         case 3:
          code = "CmvgxopgcmamjcyayjdmkskdtkykcsbsjcsjtjcEaEkdBkEk";
          break;

         case 4:
          code = "xdHetkAscqbqgcqgvgcFbFgcJbJsdqhqmdpnrndqoqscvgvhcvhAh";
          break;

         case 5:
          code = "rlokkjgjdujvpcpsvpdnopscuaujdqjujdibijcmbmkdghjhcfaegdcfeg";
          break;

         case 6:
          code = "yfyoyzfrdCjCodBaCjdvjvodvoxscCoBqcwbvjdvdCd";
          break;

         case 7:
          code = "IeBnLjGocGcGldDmGldAjDmdAjxncGcLccLbLhcKhRh";
          break;

         case 8:
          code = "vnigwjpmdyayqdmnsqcsqyqdvlyldmgmqcmcybjnipidrdrgfmgrg";
          break;

         case 9:
          code = "nlumaoCccqkqoclklocloqocoaojdljqj";
          break;

         case 10:
          code = "yA8gUotGctbtxcDv-adqvDvdCwCzeCwdDAFAdDABDdvyFydFyFAdvDCDdvwvDevw";
          break;

         case 11:
          code = "GpvvHyStdMoMvdBwMwdMwHCdBwHCdBoBvdDyDBdDBFBeJpeEpeDpeKpeJqcNaNpcAaApcAnNndFAJAdFxFBeEqdJwJA";
          break;

         case 12:
          code = "vkqfrrgfdwawiewidpiDidBiBj";
          break;

         case 13:
          code = "tkxmudqmdpbpidzbzifpizi";
          break;

         case 14:
          code = "wnpnvzyrdCaCrdmkCldmkmpdsntrdqrtrdsjsndCrxAcrsrzfmppk";
          break;

         case 15:
          code = "yDlwgtrxcwBwGcwGBGdBDCDdZcZDdKD0DcBBBGdwBBBfCDKD";
          break;

         case 16:
          code = "BrysGsrsdJaIudguIudgogufgoIo";
          break;

         case 17:
          code = "uovjxf8ddtiwidwjwmcvdGadtitmcvdvi";
          break;

         case 18:
          code = "zjspxsApdqaqkdugqkdzgCgfugzgdrjujcukupcxnCndCdCsdCdIb";
          break;

         case 19:
          code = "qhqdmhrlckckhdghkhdhntnehnchihndtatndpftf";
          break;

         case 20:
          code = "udCnunyecsbsgdEaEqcsgAgdtqEqeAgdAgAn";
          break;

         case 21:
          code = "jkskwrgldyayidsiyicDaDfdAfDfduhupcfhuhcfnoncfcfncrnvncuquwdupwpdiimifkius";
          break;

         case 22:
          code = "irqojjcsckckhdhhkhdkgpgdmGtDdhhhpdgpjpcgpgucgukudtatDgnznvfnznGhngog";
          break;

         case 23:
          code = "CnJovuyodAAOAdAtAufAuAAdFlFpdvlvpfAtFpfvpAtdvlFldGcOcgIAIuhGcIccOaOA";
          break;

         case 24:
          code = "nhwcipekckckhdhhkhdkdpdiodqddhhlohjkkl";
          break;

         case 25:
          code = "niLF4q-dckckhdkdndindpchkhmi";
          break;

         case 26:
          code = "togelqngdohwhdleoedoerheledlelhilhnhcqmwmdjswsdwbwsdjmjs";
          break;

         case 27:
          code = "tjmmfqxmdzazrjwczccrarocrhuhdpoAo";
          break;

         case 28:
          code = "soqdmotjcvavvcpgpvdpvvvdsfvfjtgugdomrmclalidmcme";
          break;

         case 29:
          code = "AdoegqnjdqoAogsoskjrfrccAgFgcFaFgcAgAoiFdFfhAhAjcqbqoeqhcnhthhqkqn";
          break;

         case 30:
          code = "ogxsotvddqvAudkeneckckhdndrdcndnedAaAuguruofuquvhAdAfikgkfhrdtdckhsmdzpApjzkzp";
          break;

         case 31:
          code = "Peyrtncwd1b1vd1v1GdhG1GciaifdCv1vdBaBvgPvPshBrBudUbUgiUeUgdpaphdnhphhnhnldhihmfhGhl";
          break;

         case 32:
          code = "BdrkudmfckckhdkcocdugtndkntniuhukcugEgcEbEgdybEbjkikmhkkki";
          break;

         case 33:
          code = "vgwlxxstcyayueyujuuyucsasrfyesedsrur";
          break;

         case 34:
          code = "nhquwjikckckhdkdocdEaEuildobdocpeckhomcomumdypEphErEtgzpzm";
          break;

         case 35:
          code = "zdqqxomldkdwdirdtdcwawmdkdkhdDaDsdmnpsdpsDs";
          break;

         case 36:
          code = "kmhnliamdfifpdkknkdcdnddhehhjgihicnbnpcfpnp";
          break;

         case 37:
          code = "lscqhlmddddkdijdkdcoaovdfvovdatfvchshvihsesddadgdlqpqdlnlq";
          break;

         case 38:
          code = "sgskpudtcfafscqbpsepsgpsmpdpeuehfpft";
          break;

         case 39:
          code = "uorposiockckhdhhkhcxaxscrsxsehhcjmrsctmxmghhhn";
          break;

         case 40:
          code = "nfcjrpsgckckhdkdqddchkhdhihnjgoiockholdxaxr";
          break;

         case 41:
          code = "ljmnlqenciaindihnhcpbpscdspsdgnincgogrjhpho";
          break;

         case 42:
          code = "emmninpodsbsqdbqsqcbkbqcbkgkdfghgfgggk";
          break;

         case 43:
          code = "ydsdEijkcGaGrcDlGldCrGrcuaujcujBldrfufgCkCifCrCjhsfufiuduchGoGq";
          break;

         case 44:
          code = "peBnpofkckckhcftDpdhinidhiilcfhxheniehiikekbhkimicDaDp";
          break;

         case 45:
          code = "rqiupggecrcrodpouoermdvmxpdjmvmcpppxdxpvrdojon";
          break;

         case 46:
          code = "DdtojkzddGaGndxaxhdvnGndiinieiidhhxheniclilkexngxnxl";
          break;

         case 47:
          code = "vnwrBnEhcvavfdugukdxgxkcofGfdqjqvdqvCwdGfCwcslyl";
          break;

         case 48:
          code = "KhKdEihkczazfdhfzfdhfhiihhhfdkgoghmgngeogekgd6aXjdYe6edvkNkevkcvgvkdNaNkdJfNf";
          break;

         case 49:
          code = "EkFfuizqcHaHncAsHndDiHidvasgdsgxecxeCedBfBodAfAmdzfzkdyfyj";
        }
        return this.fromCode(code);
      };
      Level.verifyCode = function(code) {
        if (code.length < 8) return false;
        for (var i = 0; i < code.length; i++) {
          var n = chars.indexOf(code[i]);
          if (n < 0) return false;
        }
        return true;
      };
      return Level;
    }();
    exports.default = Level;
    cc._RF.pop();
  }, {
    "../Obstacles/ObstacleInfo": "ObstacleInfo"
  } ],
  Menu: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fdb9e3NZ8hKZoOo/nqLK1dU", "Menu");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LevelEditor_1 = require("./Level/LevelEditor");
    var Menu = function(_super) {
      __extends(Menu, _super);
      function Menu() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.menuTheme = null;
        return _this;
      }
      Menu.prototype.onLoad = function() {
        var effectsVolume = cc.sys.localStorage.getItem("soundVolume");
        var musicVolume = cc.sys.localStorage.getItem("musicVolume");
        cc.audioEngine.setEffectsVolume(null != effectsVolume ? effectsVolume : 1);
        cc.audioEngine.setMusicVolume(null != musicVolume ? musicVolume : 1);
        cc.audioEngine.isMusicPlaying() || cc.audioEngine.playMusic(this.menuTheme, true);
        cc.director.preloadScene("ChooseLevel");
      };
      Menu.prototype.chooseLevel = function() {
        LevelEditor_1.default.editMode = false;
        cc.director.loadScene("ChooseLevel");
      };
      Menu.prototype.editLevel = function() {
        LevelEditor_1.default.editMode = true;
        cc.director.loadScene("ChooseLevel");
      };
      Menu.prototype.openMenu = function() {
        cc.director.loadScene("Menu");
      };
      __decorate([ property(cc.AudioClip) ], Menu.prototype, "menuTheme", void 0);
      Menu = __decorate([ ccclass ], Menu);
      return Menu;
    }(cc.Component);
    exports.default = Menu;
    cc._RF.pop();
  }, {
    "./Level/LevelEditor": "LevelEditor"
  } ],
  Monster: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5a717pe3xpPjodhHYBat/A2", "Monster");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("../Game");
    var Obstacle_1 = require("./Obstacle");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Monster = function(_super) {
      __extends(Monster, _super);
      function Monster() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.dead = null;
        _this.hurtSounds = [];
        _this.roarSounds = [];
        _this.screamSounds = [];
        _this.laughs = [];
        _this.explosion = null;
        _this.animation = null;
        _this.bloodMask = null;
        _this.blood = null;
        _this.body = null;
        _this.guts = [];
        _this.isDead = false;
        _this.isFliying = false;
        _this.audio = null;
        _this.bombExploded = false;
        _this.endgameTimer = 0;
        return _this;
      }
      Monster.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        this.audio = this.getComponent(cc.AudioSource);
        this.audio.volume = cc.audioEngine.getEffectsVolume();
      };
      Monster.prototype.update = function(dt) {
        if (this.bombExploded && !Game_1.default.instance.paused) {
          this.endgameTimer += dt;
          if (this.endgameTimer > 1) {
            var r = this.getComponent(cc.RigidBody);
            r.linearVelocity.mag() < 1 && this.endgameTimer > 2 && Game_1.default.instance.endGame();
            this.endgameTimer > 5 && Game_1.default.instance.gameMenu.showCloseLevel();
          }
        }
      };
      Monster.prototype.reset = function() {
        _super.prototype.reset.call(this);
        this.animation.play();
        this.bloodMask.node.setContentSize(128, 128);
        this.guts.forEach(function(g) {
          g.active = false;
        });
        this.node.angle = 0;
        if (this.isDead) {
          this.isDead = false;
          this.bloodMask.enabled = false;
          this.blood.active = false;
        }
        var rigid = this.getComponent(cc.RigidBody);
        rigid.awake = true;
        rigid.linearVelocity = cc.Vec2.ZERO;
        rigid.angularVelocity = 0;
        this.bombExploded = false;
        this.endgameTimer = 0;
      };
      Monster.prototype.onBeginContact = function(contact, self, other) {
        if (other.sensor) return;
        var relativeVelocity = self.body.linearVelocity.sub(other.body.linearVelocity).mag();
        relativeVelocity > 500 && this.playAnimation("Hurt");
        "cannonBall" === other.node.name && relativeVelocity > 3e3 && this.onBombExploded(other.node.parent.convertToWorldSpaceAR(other.node.getPosition()));
        this.isFliying = false;
      };
      Monster.prototype.playAnimation = function(name) {
        if (this.isDead) return;
        var animation = this.animation;
        if ("Hurt" == name && this.audio.isPlaying) return;
        this.unscheduleAllCallbacks();
        animation.stop();
        var sounds = this.hurtSounds;
        switch (name) {
         case "Scream":
          sounds = this.screamSounds;
          break;

         case "Roar":
          sounds = this.roarSounds;
          break;

         case "Laugh":
          sounds = this.laughs;
        }
        var rnd = this.getRandomInt(0, sounds.length);
        var sound = sounds[rnd];
        var state = animation.play(name);
        this.audio.clip = sound;
        this.audio.play();
        this.scheduleOnce(function() {
          animation.play("Idle");
        }, state.duration);
      };
      Monster.prototype.explode = function(source) {
        var selfPos = this.node.convertToWorldSpaceAR(this.node.children[1].getPosition());
        var d = cc.Vec2.distance(selfPos, source);
        var i = d > 100 ? d - 100 : 20;
        source.subSelf(source.sub(selfPos).normalize().mul(i));
        this.isDead = true;
        this.animation.stop();
        this.unscheduleAllCallbacks();
        this.body.getComponent(cc.Sprite).spriteFrame = this.dead;
        this.bloodMask.node.setContentSize(200, 200);
        this.bloodMask.node.setPosition(this.node.convertToNodeSpaceAR(source));
        var pos = this.node.convertToWorldSpaceAR(cc.v2(16, 16));
        this.blood.setPosition(this.blood.parent.convertToNodeSpaceAR(pos));
        this.body.setPosition(this.body.parent.convertToNodeSpaceAR(pos));
        this.blood.children[0].setPosition(this.blood.convertToNodeSpaceAR(source));
        this.bloodMask.enabled = true;
        this.blood.active = true;
        var exp = cc.instantiate(this.explosion);
        exp.parent = cc.director.getScene();
        exp.position = cc.director.getScene().convertToNodeSpaceAR(this.node.parent.convertToWorldSpaceAR(this.node.position));
        this.guts[0].active = true;
        for (var i_1 = 1; i_1 < this.guts.length; i_1++) {
          var g = this.guts[i_1];
          var pos_1 = g.parent.convertToWorldSpaceAR(g.getPosition());
          var d_1 = cc.Vec2.squaredDistance(source, pos_1);
          d_1 < 6400 && (g.active = true);
        }
      };
      Monster.prototype.onBombExploded = function(position) {
        if (this.isDead) return;
        this.bombExploded = true;
        var selfPos = this.node.parent.convertToWorldSpaceAR(this.node.getPosition());
        var d = position.sub(selfPos).mag();
        var blockingObstacles = cc.director.getPhysicsManager().rayCast(position, selfPos, cc.RayCastType.AllClosest);
        var block = false;
        blockingObstacles.forEach(function(o) {
          block = block || "metal" == o.collider.node.name;
        });
        d < 200 && !block ? this.explode(position) : this.playAnimation("Laugh");
      };
      Monster.prototype.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      };
      __decorate([ property(cc.SpriteFrame) ], Monster.prototype, "dead", void 0);
      __decorate([ property([ cc.AudioClip ]) ], Monster.prototype, "hurtSounds", void 0);
      __decorate([ property([ cc.AudioClip ]) ], Monster.prototype, "roarSounds", void 0);
      __decorate([ property([ cc.AudioClip ]) ], Monster.prototype, "screamSounds", void 0);
      __decorate([ property([ cc.AudioClip ]) ], Monster.prototype, "laughs", void 0);
      __decorate([ property(cc.Prefab) ], Monster.prototype, "explosion", void 0);
      __decorate([ property(cc.Animation) ], Monster.prototype, "animation", void 0);
      __decorate([ property(cc.Mask) ], Monster.prototype, "bloodMask", void 0);
      __decorate([ property(cc.Node) ], Monster.prototype, "blood", void 0);
      __decorate([ property(cc.Node) ], Monster.prototype, "body", void 0);
      __decorate([ property([ cc.Node ]) ], Monster.prototype, "guts", void 0);
      Monster = __decorate([ ccclass ], Monster);
      return Monster;
    }(Obstacle_1.default);
    exports.default = Monster;
    cc._RF.pop();
  }, {
    "../Game": "Game",
    "./Obstacle": "Obstacle"
  } ],
  ObstacleInfo: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "247cdOcpTtOc6HnM0wJxUGn", "ObstacleInfo");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ObstacleInfo = function() {
      function ObstacleInfo(id, point1, point2) {
        this.id = id;
        this.point1 = point1;
        this.point2 = null != point2 ? point2 : cc.v2(point1.x, point1.y);
      }
      ObstacleInfo.prototype.getNumbers = function() {
        var numbers = new Array();
        this.id > 1 && numbers.push(this.id);
        numbers.push(this.point1.x);
        numbers.push(this.point1.y);
        if (ObstacleInfo.hasControlpoint(this.id)) {
          numbers.push(this.point2.x);
          numbers.push(this.point2.y);
        }
        return numbers;
      };
      ObstacleInfo.hasControlpoint = function(id) {
        switch (id) {
         case 0:
         case 1:
         case 4:
          return false;

         default:
          return true;
        }
      };
      return ObstacleInfo;
    }();
    exports.default = ObstacleInfo;
    cc._RF.pop();
  }, {} ],
  Obstacle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b6d69ZYqlFExa7BlVG/QNNi", "Obstacle");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("../Game");
    var Utils_1 = require("../Global/Utils");
    var Pin_1 = require("../Level/Pin");
    var ObstacleInfo_1 = require("../Obstacles/ObstacleInfo");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Obstacle = function(_super) {
      __extends(Obstacle, _super);
      function Obstacle() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.id = 0;
        _this.interactive = false;
        _this.coloredNode = null;
        _this.fixedLength = -1;
        _this.dragSounds = [];
        _this.dropSounds = [];
        _this.defaultColor = cc.Color.WHITE;
        _this.sortPoints = true;
        _this.point1 = cc.Vec2.ZERO;
        _this.point2 = cc.Vec2.ZERO;
        _this.dragOffset = cc.Vec2.ZERO;
        _this.camera = null;
        _this.pins = [];
        _this.target = null;
        _this.canCollide = true;
        return _this;
      }
      Obstacle.prototype.start = function() {
        this.camera = cc.Camera.main;
      };
      Obstacle.prototype.onLoad = function() {
        this.interactive && (this.defaultColor = this.coloredNode.color);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.move, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onEndDrag, this);
      };
      Obstacle.prototype.onTouchStart = function(touch) {
        this.interactive && (this.coloredNode.color = this.defaultColor);
        this.playRandomSound(this.dragSounds);
        this.removePins();
        var pos = touch.getLocation();
        this.camera.getScreenToWorldPoint(pos, pos);
        this.dragOffset = this.node.convertToNodeSpaceAR(pos).rotate(cc.misc.degreesToRadians(this.node.angle));
        if (this.id > 1) {
          this.node.setSiblingIndex(this.node.parent.childrenCount - 1);
          var obs = Game_1.default.instance.levelEditor.obstacles;
          obs.push(obs.splice(obs.indexOf(this), 1)[0]);
          var trash = Game_1.default.instance.levelEditor.trashBin;
          trash.show(this);
        }
        this.toLayer("obstacles");
      };
      Obstacle.prototype.activate = function() {};
      Obstacle.prototype.onPinRemoved = function() {
        0 == this.pins.length && this.toLayer("obstacles");
      };
      Obstacle.prototype.removePins = function() {
        if (null != this.pins) {
          var i = this.pins.length;
          while (i--) this.pins[i].remove();
        }
      };
      Obstacle.prototype.toLayer = function(layer) {
        this.node.group = layer;
        var collider = this.node.getComponent(cc.PhysicsCollider);
        null != collider && collider.apply();
      };
      Obstacle.prototype.setPosition = function(position) {
        this.point1 = position;
        this.point2 = position;
        this.node.setPosition(position);
      };
      Obstacle.prototype.remove = function() {
        var obs = Game_1.default.instance.levelEditor.obstacles;
        obs.splice(obs.indexOf(this), 1);
        this.node.destroy();
      };
      Obstacle.prototype.move = function(touch) {
        var pos = touch.getLocation();
        var zoom = this.camera.zoomRatio;
        pos = pos.sub(this.dragOffset.mul(zoom));
        this.camera.getScreenToWorldPoint(pos, pos);
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(pos));
        if (this.id > 1) {
          pos = touch.getLocation();
          this.camera.getScreenToWorldPoint(pos, pos);
        }
      };
      Obstacle.prototype.onEndDrag = function(touch) {
        var area = Game_1.default.instance.levelEditor.editorPanel.getBoundingBoxToWorld();
        var rect = this.node.getBoundingBoxToWorld();
        var wp = this.node.parent.convertToWorldSpaceAR(this.node.getPosition());
        if (!area.containsRect(rect)) {
          var o = Utils_1.default.fitRectInArea(area, rect);
          var offset = wp.sub(rect.origin);
          wp = o.add(offset);
        }
        var c = this.camera.getWorldToScreenPoint(wp);
        var pos = cc.v2(c.x, c.y);
        pos = Game_1.default.instance.levelEditor.snapToGrid(pos);
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(pos));
        pos = this.node.getPosition();
        var diff = pos.sub(this.point1);
        this.point1 = pos;
        this.point2 = this.point2.add(diff);
        if (this.id > 1) {
          var trash = Game_1.default.instance.levelEditor.trashBin;
          trash.hide();
          this.combine();
        }
        this.playRandomSound(this.dropSounds);
      };
      Obstacle.prototype.onCreate = function(p1, p2) {
        this.point1 = p1;
        this.point2 = p2;
        var vector = p2.sub(p1);
        this.node.width = vector.mag() + 32;
        this.node.anchorX = 16 / this.node.width;
        this.node.setPosition(p1);
        var rads = -vector.signAngle(cc.Vec2.RIGHT);
        this.node.angle = cc.misc.radiansToDegrees(rads);
        var box = this.node.getComponent(cc.PhysicsBoxCollider);
        if (box) {
          box.size = this.node.getContentSize();
          box.offset = cc.v2(this.node.width / 2 - 16, 0);
          box.apply();
        }
        Game_1.default.instance.levelEditor.editing && this.playRandomSound(this.dragSounds);
        this.combine();
      };
      Obstacle.prototype.combine = function() {
        var _this = this;
        var p = this.point1.y < this.point2.y ? this.point1 : this.point2;
        p = this.node.parent.convertToWorldSpaceAR(p);
        var ground = Game_1.default.instance.ground;
        ground.intersectPoint(p) && (this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Kinematic);
        var obstacles = Game_1.default.instance.levelEditor.obstacles;
        var _loop_1 = function(i) {
          var o = obstacles[i];
          var cross = cc.v2(0, 0);
          var p1 = this_1.point1;
          var p2 = this_1.fixedLength < 0 ? this_1.point2 : Utils_1.default.getFixedPointOnLine(this_1.fixedLength, this_1.point1, this_1.point2);
          var p3 = o.point1;
          var p4 = o.fixedLength < 0 ? o.point2 : Utils_1.default.getFixedPointOnLine(o.fixedLength, p3, o.point2);
          if (Utils_1.default.cross(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y, cross)) {
            var overlapsWheel_1 = false;
            null != o.pins && o.pins.forEach(function(p) {
              if (p.joint instanceof cc.WheelJoint) {
                var pinPosition = p.node.parent.convertToWorldSpaceAR(p.node.getPosition());
                if (pinPosition.equals(_this.node.parent.convertToWorldSpaceAR(cross))) {
                  _this.toLayer("obstaclesFront");
                  p.obstacles[0].toLayer("obstaclesBack");
                  p.obstacles[0].getComponent(cc.PhysicsCircleCollider).enabled = false;
                  o.toLayer("obstaclesBack");
                  overlapsWheel_1 = true;
                }
              }
            });
            overlapsWheel_1 ? Pin_1.default.create(this_1, o, this_1.node.parent.convertToWorldSpaceAR(cross), Pin_1.PinType.Revolute) : Pin_1.default.create(this_1, o, this_1.node.parent.convertToWorldSpaceAR(cross));
          }
        };
        var this_1 = this;
        for (var i = 4; i < obstacles.length - 1; i++) _loop_1(i);
      };
      Obstacle.prototype.onBeginContact = function(contact, self, other) {
        var _this = this;
        if (other.sensor) return;
        if (!this.canCollide) return;
        var relativeVelocity = self.body.linearVelocity.sub(other.body.linearVelocity).mag();
        if (relativeVelocity > 500) {
          this.playRandomSound(this.dropSounds, relativeVelocity / 2e3);
          this.canCollide = false;
          this.scheduleOnce(function() {
            _this.canCollide = true;
          }, .5);
        }
      };
      Obstacle.prototype.onExplosionDamage = function(explosionPosition, explosionRadius) {
        var selfPos = this.node.parent.convertToWorldSpaceAR(this.node.getPosition());
        var blockingObstacles = cc.director.getPhysicsManager().rayCast(explosionPosition, selfPos, cc.RayCastType.AllClosest);
        var block = false;
        blockingObstacles.forEach(function(o) {
          block = block || "metal" == o.collider.node.name;
        });
        block || this.pins.forEach(function(p) {
          var pos = p.node.parent.convertToWorldSpaceAR(p.node.getPosition());
          cc.Vec2.distance(pos, explosionPosition) < explosionRadius && p.remove();
        });
      };
      Obstacle.prototype.reset = function() {
        this.node.setPosition(this.point1);
      };
      Obstacle.prototype.playRandomSound = function(sounds, volume) {
        void 0 === volume && (volume = 1);
        if (sounds.length > 0) {
          var rnd = this.getRandomInt(0, sounds.length);
          var sound = sounds[rnd];
          var audioID = cc.audioEngine.playEffect(sound, false);
          volume < 1 && cc.audioEngine.setVolume(audioID, volume);
        }
      };
      Obstacle.prototype.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      };
      Obstacle.prototype.getInfo = function() {
        var editor = Game_1.default.instance.levelEditor;
        var cellSize = editor.cellSize;
        var p1 = this.point1.div(cellSize);
        var p2 = this.point2.div(cellSize);
        return new ObstacleInfo_1.default(this.id, p1, p2);
      };
      Obstacle.prototype.onDestroy = function() {
        this.interactive && null != this.target && (this.target.target = null);
      };
      __decorate([ property ], Obstacle.prototype, "id", void 0);
      __decorate([ property ], Obstacle.prototype, "interactive", void 0);
      __decorate([ property(cc.Node), property({
        visible: function() {
          return this.interactive;
        }
      }) ], Obstacle.prototype, "coloredNode", void 0);
      __decorate([ property ], Obstacle.prototype, "fixedLength", void 0);
      __decorate([ property(cc.AudioClip) ], Obstacle.prototype, "dragSounds", void 0);
      __decorate([ property(cc.AudioClip) ], Obstacle.prototype, "dropSounds", void 0);
      Obstacle = __decorate([ ccclass ], Obstacle);
      return Obstacle;
    }(cc.Component);
    exports.default = Obstacle;
    cc._RF.pop();
  }, {
    "../Game": "Game",
    "../Global/Utils": "Utils",
    "../Level/Pin": "Pin",
    "../Obstacles/ObstacleInfo": "ObstacleInfo"
  } ],
  OverviewTarget: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "46a18e9UzxGY7hDspDyOXal", "OverviewTarget");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var overviewTarget = function(_super) {
      __extends(overviewTarget, _super);
      function overviewTarget() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.target = null;
        _this.followSpeed = 1;
        _this.followTarget = false;
        _this.offset = cc.Vec2.ZERO;
        return _this;
      }
      overviewTarget.prototype.start = function() {
        this.setPosition(this.node.getPosition());
      };
      overviewTarget.prototype.reset = function() {
        this.followTarget = false;
      };
      overviewTarget.prototype.setPosition = function(position) {
        this.startPosition = position;
        this.node.setPosition(position);
      };
      overviewTarget.prototype.update = function(dt) {
        if (this.followTarget && null != this.target) {
          var p = this.node.getPosition();
          var t = this.target.parent.convertToWorldSpaceAR(this.target.getPosition());
          if (cc.Vec2.squaredDistance(p, t) > .01) {
            var np = p;
            this.node.setPosition(cc.Vec2.lerp(np, p, t, dt * this.followSpeed));
          }
        } else {
          var p = this.node.getPosition();
          var t = this.startPosition.add(this.offset);
          if (cc.Vec2.squaredDistance(p, t) > .01) {
            var np = p;
            this.node.setPosition(cc.Vec2.lerp(np, p, t, dt * this.followSpeed));
          }
        }
      };
      __decorate([ property(cc.Node) ], overviewTarget.prototype, "target", void 0);
      __decorate([ property ], overviewTarget.prototype, "followSpeed", void 0);
      overviewTarget = __decorate([ ccclass ], overviewTarget);
      return overviewTarget;
    }(cc.Component);
    exports.default = overviewTarget;
    cc._RF.pop();
  }, {} ],
  PauseMenu: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e84dcFnibBLLrzo1H0SlXHs", "PauseMenu");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("../Game");
    var LevelEditor_1 = require("../Level/LevelEditor");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var PauseMenu = function(_super) {
      __extends(PauseMenu, _super);
      function PauseMenu() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.level = null;
        return _this;
      }
      PauseMenu.prototype.open = function() {
        Game_1.default.instance.gameMenu.close();
        Game_1.default.instance.pause();
        this.unscheduleAllCallbacks();
        cc.Canvas.instance.fitHeight = false;
        cc.Canvas.instance.fitWidth = true;
        this.node.active = true;
        cc.Canvas.instance.getComponent(cc.Widget).updateAlignment();
        this.level.string = "Level " + (LevelEditor_1.default.activeLevel + 1).toString();
        cc.tween(this.node).set({
          opacity: 0
        }).to(.1, {
          opacity: 255
        }).start();
      };
      PauseMenu.prototype.close = function() {
        Game_1.default.instance.gameMenu.open();
        Game_1.default.instance.resume();
        cc.Canvas.instance.fitHeight = true;
        cc.Canvas.instance.fitWidth = false;
        this.node.active = false;
        cc.Canvas.instance.getComponent(cc.Widget).updateAlignment();
      };
      PauseMenu.prototype.promoURL = function(event, customEventData) {
        var n = +customEventData;
        switch (n) {
         default:
          cc.sys.openURL("https://play.google.com/store/apps/details?id=com.ankiv.knifethrow");
          break;

         case 1:
          cc.sys.openURL("https://play.google.com/store/apps/details?id=com.ankiv.redrun");
          break;

         case 2:
          cc.sys.openURL("https://play.google.com/store/apps/details?id=com.ankiv.cubie");
        }
      };
      __decorate([ property(cc.Label) ], PauseMenu.prototype, "level", void 0);
      PauseMenu = __decorate([ ccclass ], PauseMenu);
      return PauseMenu;
    }(cc.Component);
    exports.default = PauseMenu;
    cc._RF.pop();
  }, {
    "../Game": "Game",
    "../Level/LevelEditor": "LevelEditor"
  } ],
  Pin: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e802fCvKJxKypR3+uHAi7sH", "Pin");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.PinType = void 0;
    var PinType;
    (function(PinType) {
      PinType[PinType["Weld"] = 0] = "Weld";
      PinType[PinType["Revolute"] = 1] = "Revolute";
      PinType[PinType["Wheel"] = 2] = "Wheel";
      PinType[PinType["MotorWheel"] = 3] = "MotorWheel";
    })(PinType = exports.PinType || (exports.PinType = {}));
    var Game_1 = require("../Game");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Pin = function(_super) {
      __extends(Pin, _super);
      function Pin() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.obstacles = [];
        _this.joint = null;
        return _this;
      }
      Pin_1 = Pin;
      Pin.create = function(obstacle1, obstacle2, position, pinType, obstacle1Node) {
        void 0 === pinType && (pinType = PinType.Weld);
        void 0 === obstacle1Node && (obstacle1Node = obstacle1.node);
        var pinNode = new cc.Node("pin");
        var pin = pinNode.addComponent(Pin_1);
        pin.obstacles.push(obstacle1, obstacle2);
        obstacle1.pins.push(pin);
        obstacle2.pins.push(pin);
        pinNode.parent = obstacle1Node;
        pinNode.setPosition(obstacle1Node.convertToNodeSpaceAR(position));
        var pinSprite = Game_1.default.instance.levelEditor.pin;
        var sprite = pin.addComponent(cc.Sprite);
        sprite.spriteFrame = pinSprite;
        pinNode.setContentSize(cc.size(16, 16));
        switch (pinType) {
         default:
          pin.joint = obstacle1Node.addComponent(cc.WeldJoint);
          pin.joint.referenceAngle = obstacle1.node.angle - obstacle2.node.angle;
          break;

         case PinType.Revolute:
          pin.joint = obstacle1Node.addComponent(cc.RevoluteJoint);
          pin.joint.referenceAngle = obstacle1.node.angle - obstacle2.node.angle;
          break;

         case PinType.Wheel:
          pin.joint = obstacle1Node.addComponent(cc.WheelJoint);
          pin.joint.frequency = 20;
          pin.joint.dampingRatio = 1;
          break;

         case PinType.MotorWheel:
          pin.joint = obstacle1Node.addComponent(cc.WheelJoint);
          pin.joint.frequency = 20;
          pin.joint.dampingRatio = 1;
          pin.joint.enableMotor = true;
          pin.joint.motorSpeed = 500;
          pin.joint.maxMotorTorque = 1e3;
        }
        pin.joint.anchor = obstacle1Node.convertToNodeSpaceAR(position);
        pin.joint.connectedAnchor = obstacle2.node.convertToNodeSpaceAR(position);
        pin.joint.connectedBody = obstacle2.getComponent(cc.RigidBody);
      };
      Pin.prototype.remove = function() {
        var _this = this;
        this.obstacles.forEach(function(o) {
          o.pins.splice(o.pins.indexOf(_this), 1);
          o.onPinRemoved();
        });
        this.joint.destroy();
        this.node.destroy();
      };
      var Pin_1;
      Pin = Pin_1 = __decorate([ ccclass ], Pin);
      return Pin;
    }(cc.Component);
    exports.default = Pin;
    cc._RF.pop();
  }, {
    "../Game": "Game"
  } ],
  Rope: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d5255XgkwpCj4WPxefmpeTi", "Rope");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("../Game");
    var Utils_1 = require("../Global/Utils");
    var Pin_1 = require("../Level/Pin");
    var Obstacle_1 = require("./Obstacle");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Rope = function(_super) {
      __extends(Rope, _super);
      function Rope() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.minSegmentLength = 32;
        _this.graph = null;
        _this.segments = [];
        _this.ropeJoint = null;
        return _this;
      }
      Rope.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        this.graph = this.getComponent(cc.Graphics);
      };
      Rope.prototype.update = function(dt) {
        var segments = this.segments;
        if (0 == segments.length) return;
        var g = this.graph;
        g.clear();
        g.moveTo(segments[0].x, segments[0].y);
        var s = this.segments[this.segments.length - 1];
        var end = this.getEndPoint();
        for (var n = 0; n < segments.length; n++) {
          var currentIndex = segments[n];
          var nextIndex = n + 2 > segments.length ? end : segments[n + 1];
          var xc = currentIndex.x + .5 * (nextIndex.x - currentIndex.x);
          var yc = currentIndex.y + .5 * (nextIndex.y - currentIndex.y);
          g.quadraticCurveTo(currentIndex.x, currentIndex.y, xc, yc);
        }
        g.quadraticCurveTo(end.x, end.y, end.x, end.y);
        g.stroke();
      };
      Rope.prototype.combine = function() {
        var obstacles = Game_1.default.instance.levelEditor.obstacles;
        for (var i = 4; i < obstacles.length - 1; i++) {
          var o = obstacles[i];
          Utils_1.default.minDistanceBetweenLineAndPoint(o.point1, o.point2, this.point1) < 16 && Pin_1.default.create(this, o, this.node.parent.convertToWorldSpaceAR(this.point1), Pin_1.PinType.Revolute, this.segments[0]);
        }
        for (var i = 4; i < obstacles.length - 1; i++) {
          var o = obstacles[i];
          Utils_1.default.minDistanceBetweenLineAndPoint(o.point1, o.point2, this.point2) < 16 && Pin_1.default.create(this, o, this.node.parent.convertToWorldSpaceAR(this.point2), Pin_1.PinType.Revolute, this.segments[this.segments.length - 1]);
        }
        if (this.pins.length > 1) {
          var o1 = this.pins[0].obstacles[1];
          var o2 = this.pins[1].obstacles[1];
          this.ropeJoint = o1.addComponent(cc.RopeJoint);
          this.ropeJoint.connectedBody = o2.getComponent(cc.RigidBody);
          this.ropeJoint.anchor = o1.node.convertToNodeSpaceAR(this.node.parent.convertToWorldSpaceAR(this.point1));
          this.ropeJoint.connectedAnchor = o2.node.convertToNodeSpaceAR(this.node.parent.convertToWorldSpaceAR(this.point2));
          this.ropeJoint.collideConnected = true;
          this.ropeJoint.maxLength = 1.1 * this.node.width;
        }
      };
      Rope.prototype.getEndPoint = function() {
        var node = this.segments[this.segments.length - 1];
        var angle = cc.misc.degreesToRadians(node.angle);
        var x = node.x;
        var y = node.y;
        var length = node.width;
        return cc.v2(length * Math.cos(angle) + x, length * Math.sin(angle) + y);
      };
      Rope.prototype.onCreate = function(p1, p2) {
        this.point1 = p1;
        this.point2 = p2;
        var vector = p2.sub(p1);
        this.node.width = vector.mag();
        this.node.anchorX = 0;
        this.node.setPosition(p1);
        var rads = -cc.v2(vector).signAngle(cc.Vec2.RIGHT);
        this.node.angle = cc.misc.radiansToDegrees(rads);
        Game_1.default.instance.levelEditor.editing && this.playRandomSound(this.dragSounds);
        Game_1.default.instance.levelEditor.editing ? this.drawRope() : this.createRope();
        this.combine();
      };
      Rope.prototype.onPinRemoved = function() {
        _super.prototype.onPinRemoved.call(this);
        null != this.ropeJoint && this.ropeJoint.destroy();
      };
      Rope.prototype.createRope = function() {
        var length = this.node.width;
        var segmentCount = Math.floor(length / this.minSegmentLength);
        var segmentSize = cc.size(length / segmentCount, this.graph.lineWidth);
        for (var i = 0; i < segmentCount; i++) {
          var x = i * segmentSize.width;
          var segment = new cc.Node("ropeSegment-" + i.toString());
          this.segments.push(segment);
          segment.setContentSize(segmentSize);
          segment.setAnchorPoint(0, .5);
          segment.setParent(this.node);
          segment.setPosition(x, 0);
          segment.addComponent(cc.RigidBody).gravityScale = 3;
          var box = segment.addComponent(cc.PhysicsBoxCollider);
          box.size = segmentSize;
          box.offset = cc.v2(segmentSize.width / 2, 0);
          box.apply();
          if (i > 0) {
            var joint = segment.addComponent(cc.RevoluteJoint);
            joint.connectedBody = this.segments[i - 1].getComponent(cc.RigidBody);
            joint.connectedAnchor = cc.v2(segmentSize.width, 0);
          }
        }
      };
      Rope.prototype.drawRope = function() {
        var g = this.graph;
        g.clear();
        g.moveTo(0, 0);
        g.lineTo(this.node.width, 0);
        g.stroke();
      };
      __decorate([ property ], Rope.prototype, "minSegmentLength", void 0);
      __decorate([ property(cc.Graphics) ], Rope.prototype, "graph", void 0);
      __decorate([ property([ cc.Node ]) ], Rope.prototype, "segments", void 0);
      Rope = __decorate([ ccclass ], Rope);
      return Rope;
    }(Obstacle_1.default);
    exports.default = Rope;
    cc._RF.pop();
  }, {
    "../Game": "Game",
    "../Global/Utils": "Utils",
    "../Level/Pin": "Pin",
    "./Obstacle": "Obstacle"
  } ],
  Scoreboard: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "91f19sO3qVMjqE83FANeH43", "Scoreboard");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("../Game");
    var Level_1 = require("../Level/Level");
    var LevelEditor_1 = require("../Level/LevelEditor");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Scoreboard = function(_super) {
      __extends(Scoreboard, _super);
      function Scoreboard() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isOpen = false;
        _this.animation = null;
        _this.win = null;
        _this.loose = null;
        _this.stars = [];
        _this.nextButton = null;
        _this.editButton = null;
        _this.homeButton = null;
        return _this;
      }
      Scoreboard.prototype.nextLevel = function() {
        LevelEditor_1.default.activeLevel += 1;
        Game_1.default.instance.levelEditor.loadLevel(Level_1.default.getLevel(LevelEditor_1.default.activeLevel).getCode());
        Game_1.default.instance.restart();
        this.close();
      };
      Scoreboard.prototype.restart = function() {
        Game_1.default.instance.restart();
        this.close();
      };
      Scoreboard.prototype.home = function() {
        cc.director.loadScene("Menu");
      };
      Scoreboard.prototype.open = function() {
        var g = Game_1.default.instance;
        g.gameMenu.close();
        var win = g.monster.isDead;
        if (LevelEditor_1.default.editMode) {
          this.nextButton.active = false;
          this.homeButton.active = false;
          this.editButton.active = true;
        } else {
          Level_1.default.getLevel(LevelEditor_1.default.activeLevel + 1).getCode() == Level_1.default.getLevel(0).getCode() && (this.homeButton.active = true);
          this.nextButton.active = !this.homeButton.active;
          this.editButton.active = false;
        }
        if (!win) {
          g.restart();
          cc.audioEngine.playEffect(this.loose, false);
          return;
        }
        cc.audioEngine.playEffect(this.win, false);
        this.node.active = true;
        this.node.children[2].scale = 1;
        this.isOpen = true;
        this.animation.playAdditive("scoreboardOpen");
        var starsCollected = Game_1.default.instance.starsCollected;
        for (var i = 0; i < 3; i++) {
          var star = this.stars[i];
          star.active = i < starsCollected;
        }
      };
      Scoreboard.prototype.close = function() {
        Game_1.default.instance.gameMenu.open();
        if (this.isOpen) {
          this.animation.playAdditive("scoreboardClose");
          this.isOpen = false;
        }
      };
      __decorate([ property(cc.Animation) ], Scoreboard.prototype, "animation", void 0);
      __decorate([ property(cc.AudioClip) ], Scoreboard.prototype, "win", void 0);
      __decorate([ property(cc.AudioClip) ], Scoreboard.prototype, "loose", void 0);
      __decorate([ property([ cc.Node ]) ], Scoreboard.prototype, "stars", void 0);
      __decorate([ property(cc.Node) ], Scoreboard.prototype, "nextButton", void 0);
      __decorate([ property(cc.Node) ], Scoreboard.prototype, "editButton", void 0);
      __decorate([ property(cc.Node) ], Scoreboard.prototype, "homeButton", void 0);
      Scoreboard = __decorate([ ccclass ], Scoreboard);
      return Scoreboard;
    }(cc.Component);
    exports.default = Scoreboard;
    cc._RF.pop();
  }, {
    "../Game": "Game",
    "../Level/Level": "Level",
    "../Level/LevelEditor": "LevelEditor"
  } ],
  SettingsMenu: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8b59cprz1FEK66oJGozdZNE", "SettingsMenu");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var SettingsMenu = function(_super) {
      __extends(SettingsMenu, _super);
      function SettingsMenu() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.musicSwitch = null;
        _this.soundSwitch = null;
        _this.musicOnSprite = null;
        _this.musicOffSprite = null;
        _this.soundOnSprite = null;
        _this.soundOffSprite = null;
        _this.soundOff = false;
        _this.musicOff = false;
        return _this;
      }
      SettingsMenu.prototype.start = function() {
        this.soundOff = 0 == cc.sys.localStorage.getItem("soundVolume");
        this.musicOff = 0 == cc.sys.localStorage.getItem("musicVolume");
        this.soundSwitch.spriteFrame = this.soundOff ? this.soundOffSprite : this.soundOnSprite;
        this.musicSwitch.spriteFrame = this.musicOff ? this.musicOffSprite : this.musicOnSprite;
      };
      SettingsMenu.prototype.open = function() {
        this.node.active = true;
      };
      SettingsMenu.prototype.close = function() {
        this.node.active = false;
      };
      SettingsMenu.prototype.clearData = function() {
        cc.sys.localStorage.clear();
      };
      SettingsMenu.prototype.switchSound = function() {
        this.soundSwitch.spriteFrame = this.soundOff ? this.soundOnSprite : this.soundOffSprite;
        this.soundOff = !this.soundOff;
        cc.sys.localStorage.setItem("soundVolume", this.soundOff ? 0 : 1);
        cc.audioEngine.setEffectsVolume(this.soundOff ? 0 : 1);
      };
      SettingsMenu.prototype.switchMusic = function() {
        this.musicSwitch.spriteFrame = this.musicOff ? this.musicOnSprite : this.musicOffSprite;
        this.musicOff = !this.musicOff;
        cc.sys.localStorage.setItem("musicVolume", this.musicOff ? 0 : 1);
        cc.audioEngine.setMusicVolume(this.musicOff ? 0 : 1);
      };
      __decorate([ property(cc.Sprite) ], SettingsMenu.prototype, "musicSwitch", void 0);
      __decorate([ property(cc.Sprite) ], SettingsMenu.prototype, "soundSwitch", void 0);
      __decorate([ property(cc.SpriteFrame) ], SettingsMenu.prototype, "musicOnSprite", void 0);
      __decorate([ property(cc.SpriteFrame) ], SettingsMenu.prototype, "musicOffSprite", void 0);
      __decorate([ property(cc.SpriteFrame) ], SettingsMenu.prototype, "soundOnSprite", void 0);
      __decorate([ property(cc.SpriteFrame) ], SettingsMenu.prototype, "soundOffSprite", void 0);
      SettingsMenu = __decorate([ ccclass ], SettingsMenu);
      return SettingsMenu;
    }(cc.Component);
    exports.default = SettingsMenu;
    cc._RF.pop();
  }, {} ],
  Spikes: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "88b903MW51Cn7NaZJXOgbtb", "Spikes");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Monster_1 = require("./Monster");
    var Obstacle_1 = require("./Obstacle");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Spikes = function(_super) {
      __extends(Spikes, _super);
      function Spikes() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.spikes = null;
        return _this;
      }
      Spikes.prototype.onCreate = function(p1, p2) {
        _super.prototype.onCreate.call(this, p1, p2);
        var offset = this.node.width % 32;
        this.spikes.x = offset / 2;
        this.spikes.width = this.node.width - 32 - this.node.width % 32;
      };
      Spikes.prototype.onBeginContact = function(contact, self, other) {
        var _this = this;
        _super.prototype.onBeginContact.call(this, contact, self, other);
        if (other.sensor) return;
        var relativeVelocity = self.body.linearVelocity.sub(other.body.linearVelocity);
        var v = cc.v3(relativeVelocity);
        if (this.node.up.angle(v) > 1) return;
        if ("monster" === other.node.name && relativeVelocity.mag() > 200) {
          var points = contact.getWorldManifold().points;
          other.node.getComponent(Monster_1.default).onBombExploded(points[0]);
          points.forEach(function(point) {
            var joint = _this.node.addComponent(cc.DistanceJoint);
            joint.connectedBody = other.getComponent(cc.RigidBody);
            joint.distance = 5;
            joint.anchor = self.node.convertToNodeSpaceAR(point);
            joint.connectedAnchor = other.node.convertToNodeSpaceAR(point);
            joint.collideConnected = true;
          });
        }
      };
      __decorate([ property(cc.Node) ], Spikes.prototype, "spikes", void 0);
      Spikes = __decorate([ ccclass ], Spikes);
      return Spikes;
    }(Obstacle_1.default);
    exports.default = Spikes;
    cc._RF.pop();
  }, {
    "./Monster": "Monster",
    "./Obstacle": "Obstacle"
  } ],
  Spring: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "515ccLx8MxIUJ25sPkMC/n2", "Spring");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("../Game");
    var Utils_1 = require("../Global/Utils");
    var Pin_1 = require("../Level/Pin");
    var Obstacle_1 = require("./Obstacle");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Spring = function(_super) {
      __extends(Spring, _super);
      function Spring() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.cap = null;
        _this.spring = null;
        _this.target = null;
        _this.activated = false;
        return _this;
      }
      Spring.prototype.onCreate = function(p1, p2) {
        this.point1 = p1;
        this.point2 = p2;
        var vector = p2.sub(p1);
        this.node.setPosition(p1);
        var rads = -vector.signAngle(cc.Vec2.RIGHT);
        this.node.angle = cc.misc.radiansToDegrees(rads);
        this.combine();
        Game_1.default.instance.levelEditor.editing && this.playRandomSound(this.dragSounds);
        this.unparentCap();
      };
      Spring.prototype.onEndDrag = function(touch) {
        _super.prototype.onEndDrag.call(this, touch);
        this.unparentCap();
      };
      Spring.prototype.update = function(dt) {
        if (this.activated) {
          var cap_position = this.cap.parent.convertToWorldSpaceAR(this.cap.getPosition());
          var spring_position = this.spring.parent.convertToWorldSpaceAR(this.spring.getPosition());
          var distance = cc.Vec2.distance(cap_position, spring_position);
          this.spring.scaleY = distance / this.spring.height;
        }
      };
      Spring.prototype.onTouchStart = function(touch) {
        _super.prototype.onTouchStart.call(this, touch);
        var p = this.cap.parent.convertToWorldSpaceAR(this.cap.getPosition());
        this.cap.setParent(this.node);
        this.cap.angle = 0;
        this.cap.setPosition(this.node.convertToNodeSpaceAR(p));
      };
      Spring.prototype.activate = function() {
        if (this.activated) return;
        cc.audioEngine.playEffect(this.dropSounds[0], false);
        this.activated = true;
        this.cap.getComponent(cc.PrismaticJoint).enabled = true;
        this.cap.getComponent(cc.WeldJoint) && this.cap.getComponent(cc.WeldJoint).destroy();
      };
      Spring.prototype.unparentCap = function() {
        var p = this.node.convertToWorldSpaceAR(this.cap.getPosition());
        this.cap.setParent(this.node.parent);
        this.cap.angle = this.node.angle;
        this.cap.setPosition(this.node.parent.convertToNodeSpaceAR(p));
      };
      Spring.prototype.combine = function() {
        var obstacles = Game_1.default.instance.levelEditor.obstacles;
        for (var i = 4; i < obstacles.length - 1; i++) {
          var o = obstacles[i];
          Utils_1.default.minDistanceBetweenLineAndPoint(o.point1, o.point2, this.point1) < 16 && Pin_1.default.create(this, o, this.node.parent.convertToWorldSpaceAR(this.node.getPosition()), Pin_1.PinType.Weld);
        }
      };
      Spring.prototype.onDestroy = function() {
        _super.prototype.onDestroy.call(this);
        this.cap.destroy();
      };
      __decorate([ property(cc.Node) ], Spring.prototype, "cap", void 0);
      __decorate([ property(cc.Node) ], Spring.prototype, "spring", void 0);
      Spring = __decorate([ ccclass ], Spring);
      return Spring;
    }(Obstacle_1.default);
    exports.default = Spring;
    cc._RF.pop();
  }, {
    "../Game": "Game",
    "../Global/Utils": "Utils",
    "../Level/Pin": "Pin",
    "./Obstacle": "Obstacle"
  } ],
  Star: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "04134h/r4NLPqlSpXMCXPX+", "Star");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("../Game");
    var Obstacle_1 = require("./Obstacle");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var t = cc.tween;
    var Star = function(_super) {
      __extends(Star, _super);
      function Star() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.active = false;
        _this.tween = null;
        return _this;
      }
      Star.prototype.start = function() {
        _super.prototype.start.call(this);
        this.appear();
      };
      Star.prototype.appear = function() {
        var _this = this;
        this.tween = t(this.node).set({
          opacity: 0,
          scale: 2,
          angle: 0
        }).to(.25, {
          opacity: 255,
          scale: 1
        }).start();
        this.scheduleOnce(function() {
          _this.active = true;
        }, .25);
      };
      Star.prototype.reset = function() {
        var _a;
        this.unscheduleAllCallbacks();
        _super.prototype.reset.call(this);
        null === (_a = this.tween) || void 0 === _a ? void 0 : _a.stop();
        this.enabled = true;
        this.active = false;
        this.appear();
      };
      Star.prototype.onBeginContact = function() {
        if (this.active) {
          this.pickUp();
          this.active = false;
        }
      };
      Star.prototype.pickUp = function() {
        this.enabled = false;
        Game_1.default.instance.starsCollected++;
        this.getComponent(cc.AudioSource).play();
        this.tween = t(this.node).to(.5, {
          opacity: 0,
          scale: 2
        }).start();
      };
      Star = __decorate([ ccclass ], Star);
      return Star;
    }(Obstacle_1.default);
    exports.default = Star;
    cc._RF.pop();
  }, {
    "../Game": "Game",
    "./Obstacle": "Obstacle"
  } ],
  ThrowZone: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4b653tPzjZAmpYU2j4ca+8e", "ThrowZone");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Game_1 = require("./Game");
    var NewClass = function(_super) {
      __extends(NewClass, _super);
      function NewClass() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.arrow = null;
        _this.touchNode = null;
        _this.finger = null;
        _this.nodes = [];
        _this.nodeCount = 8;
        _this.bomb = null;
        return _this;
      }
      NewClass.prototype.start = function() {
        this.bomb = Game_1.default.instance.grenade;
        this.node.on(cc.Node.EventType.TOUCH_START, this.startThrow, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.throw, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.updateNodes, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.throw, this);
      };
      NewClass.prototype.startThrow = function(touch) {
        this.bomb.prepare();
        this.arrow.active = false;
        this.finger.active = true;
        this.touchNode.active = false;
        this.arrow.position = cc.v3(touch.getLocationX(), touch.getLocationY(), 0);
        this.finger.position = cc.v3(touch.getLocationX(), touch.getLocationY(), 0);
        if (this.nodes.length < this.nodeCount) {
          this.nodes = new Array(this.nodeCount);
          this.nodes[0] = this.touchNode;
          for (var i = 1; i < this.nodes.length; i++) {
            this.nodes[i] = cc.instantiate(this.touchNode);
            this.nodes[i].parent = this.node;
          }
        }
      };
      NewClass.prototype.updateNodes = function(touch) {
        this.finger.position = cc.v3(touch.getLocationX(), touch.getLocationY(), 0);
        var b = this.arrow.position.sub(this.finger.position);
        var d = b.mag();
        var draw = d > 40;
        draw && (this.bomb.ignited || this.bomb.ignite());
        this.arrow.active = draw;
        this.nodes.forEach(function(element) {
          element.active = draw;
        });
        var arrow = this.arrow.getChildByName("Arrow2");
        arrow.getComponent(cc.Sprite).fillRange = cc.misc.lerp(0, 1, d / 300);
        var rads = -cc.v2(b).signAngle(cc.v2(1, 0));
        this.arrow.angle = cc.misc.radiansToDegrees(rads);
        for (var i = 0; i < this.nodes.length; i++) {
          var v = this.finger.position.add(b.normalize().mul(d / this.nodeCount * i));
          this.nodes[i].position = v;
          this.nodes[i].scale = cc.misc.clamp01(d / 300);
        }
      };
      NewClass.prototype.throw = function() {
        var d = this.finger.position.sub(this.arrow.position).mag();
        if (d < 40) {
          this.cancelThrow();
          return;
        }
        var dir = cc.v3(this.arrow.position.sub(this.finger.position)).mul(1e3);
        this.node.active = false;
        this.bomb.throw(dir);
        this.arrow.active = false;
        this.finger.active = false;
        for (var i = 0; i < this.nodeCount; i++) this.nodes[i].active = false;
        Game_1.default.instance.onThrow();
      };
      NewClass.prototype.cancelThrow = function() {
        this.arrow.active = false;
        this.finger.active = false;
        for (var i = 0; i < this.nodes.length; i++) this.nodes[i].active = false;
        this.bomb.extinguish();
      };
      __decorate([ property(cc.Node) ], NewClass.prototype, "arrow", void 0);
      __decorate([ property(cc.Node) ], NewClass.prototype, "touchNode", void 0);
      __decorate([ property(cc.Node) ], NewClass.prototype, "finger", void 0);
      __decorate([ property ], NewClass.prototype, "nodeCount", void 0);
      NewClass = __decorate([ ccclass ], NewClass);
      return NewClass;
    }(cc.Component);
    exports.default = NewClass;
    cc._RF.pop();
  }, {
    "./Game": "Game"
  } ],
  TrashBin: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "34acbJBQplNup1QBc7NiAHq", "TrashBin");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TrashBin = function(_super) {
      __extends(TrashBin, _super);
      function TrashBin() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.anim = null;
        _this.opened = false;
        _this.selected = null;
        _this.camera = null;
        return _this;
      }
      TrashBin.prototype.onLoad = function() {
        this.camera = cc.Camera.main;
        this.anim = this.getComponent(cc.Animation);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      };
      TrashBin.prototype.onKeyDown = function(event) {
        event.keyCode == cc.macro.KEY.Delete && this.removeSelectedObstacle();
      };
      TrashBin.prototype.removeSelectedObstacle = function() {
        if (null != this.selected) {
          this.selected.remove();
          this.hide();
        }
      };
      TrashBin.prototype.open = function() {
        this.opened = true;
        var s = this.anim.play("open");
        s.wrapMode = cc.WrapMode.Normal;
      };
      TrashBin.prototype.close = function() {
        this.opened = false;
        var s = this.anim.play("open");
        s.wrapMode = cc.WrapMode.Reverse;
      };
      TrashBin.prototype.update = function() {
        if (null != this.selected) {
          var touchPosition = this.selected.node.getPosition().add(this.selected.dragOffset);
          var d = cc.Vec2.distance(this.node.getPosition(), touchPosition);
          d < 66 / this.camera.zoomRatio ? this.opened || this.open() : this.opened && this.close();
        }
      };
      TrashBin.prototype.show = function(activeObstacle) {
        this.selected = activeObstacle;
        this.node.active = true;
        var zoom = cc.Camera.main.zoomRatio;
        this.node.setScale(1 / zoom);
        var pos = cc.v2(75, cc.winSize.height - 75);
        cc.Camera.main.getScreenToWorldPoint(pos, pos);
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(pos));
        var s = this.anim.play("show");
        s.wrapMode = cc.WrapMode.Normal;
      };
      TrashBin.prototype.hide = function() {
        if (this.opened) {
          this.opened = false;
          this.anim.play("delete");
          this.selected.remove();
        } else {
          var s = this.anim.play("show");
          s.wrapMode = cc.WrapMode.Reverse;
        }
        this.selected = null;
      };
      TrashBin = __decorate([ ccclass ], TrashBin);
      return TrashBin;
    }(cc.Component);
    exports.default = TrashBin;
    cc._RF.pop();
  }, {} ],
  UserData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d42f3M9um5D2Y91fWWMmTV1", "UserData");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var UserData = function() {
      function UserData(jsonData) {
        this.stars = jsonData ? jsonData.stars : new Array();
        this.userStars = jsonData && jsonData.userStars ? jsonData.userStars : new Array();
        this.userLevels = jsonData ? jsonData.userLevels : new Array();
      }
      UserData.prototype.save = function() {
        cc.sys.localStorage.setItem("userData", JSON.stringify(this));
      };
      Object.defineProperty(UserData, "loaded", {
        get: function() {
          if (null == UserData._loaded) {
            UserData._loaded = new UserData(JSON.parse(cc.sys.localStorage.getItem("userData")));
            null == UserData._loaded && (UserData._loaded = new UserData());
          }
          return UserData._loaded;
        },
        enumerable: false,
        configurable: true
      });
      UserData.prototype.totalStars = function() {
        var count = 0;
        this.stars.forEach(function(s) {
          count += s;
        });
        return count;
      };
      UserData.prototype.setStars = function(level, stars) {
        var s = null != this.stars[level] ? this.stars[level] : 0;
        this.stars[level] = stars > s ? stars : s;
        this.save();
      };
      UserData.prototype.setUserStars = function(level, stars) {
        var s = null != this.userStars[level] ? this.userStars[level] : 0;
        this.userStars[level] = stars > s ? stars : s;
        this.save();
      };
      UserData.prototype.saveUserLevel = function(index, code) {
        var oldCode = this.userLevels[index];
        null != oldCode && oldCode !== code && (this.userStars[index] = 0);
        this.userLevels[index] = code;
        this.save();
      };
      UserData.prototype.getUserLevel = function(index) {
        return this.userLevels[index];
      };
      return UserData;
    }();
    exports.default = UserData;
    cc._RF.pop();
  }, {} ],
  Utils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ce162JsKfVLKo0iA1HIKb+5", "Utils");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Utils = function() {
      function Utils() {}
      Utils.minDistanceBetweenLineAndPoint = function(v, w, p) {
        var l2 = cc.Vec2.squaredDistance(v, w);
        if (0 == l2) return cc.Vec2.distance(p, v);
        var t = Math.max(0, Math.min(1, cc.Vec2.dot(p.sub(v), w.sub(v)) / l2));
        var projection = v.add(w.sub(v).mul(t));
        return cc.Vec2.distance(p, projection);
      };
      Utils.cross = function(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y, out) {
        var s1_x, s1_y, s2_x, s2_y;
        s1_x = p1_x - p0_x;
        s1_y = p1_y - p0_y;
        s2_x = p3_x - p2_x;
        s2_y = p3_y - p2_y;
        var s, t;
        s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
        t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
        if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
          if (out) {
            out.x = p0_x + t * s1_x;
            out.y = p0_y + t * s1_y;
          }
          return true;
        }
        return false;
      };
      Utils.fitRectInArea = function(allowedArea, rect) {
        var c = rect.origin;
        rect.xMin < allowedArea.xMin && (c = cc.v2(allowedArea.xMin, c.y));
        rect.xMax > allowedArea.xMax && (c = cc.v2(allowedArea.xMax - rect.width, c.y));
        rect.yMin < allowedArea.yMin && (c = cc.v2(c.x, allowedArea.yMin));
        rect.yMax > allowedArea.yMax && (c = cc.v2(c.x, allowedArea.yMax - rect.height));
        return c;
      };
      Utils.getFixedPointOnLine = function(fixedLength, startPoint, endPoint) {
        var vector = endPoint.sub(startPoint).normalizeSelf().mul(fixedLength);
        return startPoint.add(vector);
      };
      return Utils;
    }();
    exports.default = Utils;
    cc._RF.pop();
  }, {} ],
  Wheel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "29f45mJBLBMLrRqzjTfPmGi", "Wheel");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) Object.prototype.hasOwnProperty.call(b, p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var Game_1 = require("../Game");
    var Utils_1 = require("../Global/Utils");
    var Pin_1 = require("../Level/Pin");
    var Obstacle_1 = require("./Obstacle");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Wheel = function(_super) {
      __extends(Wheel, _super);
      function Wheel() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isHinge = false;
        return _this;
      }
      Wheel.prototype.onCreate = function(p1, p2) {
        this.point1 = p1;
        this.point2 = p1;
        this.node.setPosition(p1);
        Game_1.default.instance.levelEditor.editing && this.playRandomSound(this.dropSounds);
        this.combine();
      };
      Wheel.prototype.combine = function() {
        var obstacles = Game_1.default.instance.levelEditor.obstacles;
        for (var i = 4; i < obstacles.length - 1; i++) {
          var o = obstacles[i];
          Utils_1.default.minDistanceBetweenLineAndPoint(o.point1, o.point2, this.point1) < 16 && Pin_1.default.create(this, o, this.node.parent.convertToWorldSpaceAR(this.node.getPosition()), Pin_1.PinType.Wheel);
        }
      };
      Wheel = __decorate([ ccclass ], Wheel);
      return Wheel;
    }(Obstacle_1.default);
    exports.default = Wheel;
    cc._RF.pop();
  }, {
    "../Game": "Game",
    "../Global/Utils": "Utils",
    "../Level/Pin": "Pin",
    "./Obstacle": "Obstacle"
  } ]
}, {}, [ "Background", "CameraController", "CollisionContactListener", "Explosion", "Game", "UserData", "Utils", "Grenade", "Ground", "Level", "LevelEditor", "Pin", "TrashBin", "Menu", "Activator", "Cannon", "Monster", "Obstacle", "ObstacleInfo", "Rope", "Spikes", "Spring", "Star", "Wheel", "OverviewTarget", "ThrowZone", "ChooseLevel", "CodeMenu", "EditorMenu", "GameMenu", "LevelFrame", "PauseMenu", "Scoreboard", "SettingsMenu" ]);