angular.module('quo')

.controller('editorController', function($scope,$state,$ionicActionSheet, $cordovaDevice, $cordovaFile, $ionicPlatform, $cordovaEmailComposer, $ionicActionSheet, ImageService, FileService, $cordovaImagePicker) {

  $ionicPlatform.ready(function() {
    $scope.images = FileService.images();

  });

  $scope.fonts=["Merriweather", "Inconsolata", "Abel", "Quicksand", "Playfair Display", "Roboto Condensed"];
  $scope.colorsDefault=['black','white','#607d8b','#555555','#ffc93b'];
  $scope.colorsBgDefault=['#e74c3c','#e67e22','#f1c40f','#1abc9c','#34495e','#ecf0f1'];
  $scope.textParams   = {
    fontSelected: 'Merriweather',
    colorSelected: 'black',
    textContent:''
  };
  $scope.colorParams  = {bgColor: 'white', fillColor: 'white', borderColor:'white'};
  $scope.shapesParams = {};
  $scope.photoParams  = {};

  var windowHeight = $(document).height();
  var navbarHeight = $('.editor-navbar').height();
  $scope.canvasWidth  = screen.width - 2;
  $scope.canvasHeight = $scope.canvasWidth * 0.75;
  $scope.editorHeight = windowHeight - navbarHeight - $scope.canvasHeight;

  $('.dynamic-editor-height').css("height", $scope.editorHeight);
  $scope.initiateStage=function(){
    $scope.canvasStyle = {
      width: $scope.canvasWidth,
      height: $scope.canvasHeight
    }

    $scope.stage = new Konva.Stage({
      container: 'canvas',
      name: "canvas",
      width: $scope.canvasWidth,
      height: $scope.canvasHeight
    })


    $scope.layer = new Konva.Layer();

    var bg = new Konva.Rect({
      x: 0,
      y: 0,
      fill: '#F0F0F0',
      width: $scope.canvasWidth,
      height: $scope.canvasHeight,
      id:"bg"
    });

    $scope.layer.add(bg);
    $scope.stage.add($scope.layer);


  }
    $scope.initiateStage();

  $scope.resizeView=function(){
    angular.element(document).ready(function () {
    $('.dynamic-editor-height').css("height", $scope.editorHeight);
      });
    console.log( $scope.editorHeight);
  }

  $scope.saveImage = function(){
    var dataURL = $scope.stage.toDataURL();
     cordova.base64ToGallery(
        dataURL,

        {
            prefix: 'img_',
            mediaScanner: true
        },

        function(path) {
            console.log(path);
        },

        function(err) {
            console.error(err);
        }
    );
  }

/**
  *                *
  * TEXT GENERATOR *
  *                *
*/
  $scope.colorChosen= function(index){
    $('.normal').removeClass('').addClass('ion-record normal');
    $scope.textParams.colorSelected= $scope.colorsDefault[index];
    console.log($scope.textParams.colorSelected);
    $('.normal'+'#'+index).removeClass('ion-record').addClass('ion-checkmark-circled');
  }
  $scope.sendTexttoCanvas = function (){
     var layer=new Konva.Layer();
     var complexText = new Konva.Text({
      text: $scope.textParams.textContent,
      fontSize: 16,
      fontFamily: $scope.textParams.fontSelected,
      fill: $scope.textParams.colorSelected,
      width:300,
      padding: 10,
      lineHeight:1.2,
      align: 'left'
    });

    var textGroup=new Konva.Group({
      x:40,
      y:200,
      draggable:true
    });
    textGroup.add(complexText);
    layer.add(textGroup);
    $scope.addTextAnchor(textGroup, 0, 0, 'topLeft');
    $scope.addTextAnchor(textGroup, complexText.getWidth(), 0, 'topRight');
    $scope.addTextAnchor(textGroup, complexText.getWidth(), complexText.getHeight(), 'bottomRight');
    $scope.addTextAnchor(textGroup, 0, complexText.getHeight(), 'bottomLeft');
    textGroup.on('touchstart', function() {
      textGroup.find('.topLeft').show();
      textGroup.find('.topRight').show();
      textGroup.find('.bottomRight').show();
      textGroup.find('.bottomLeft').show();
      layer.draw();
    })
    textGroup.on('tap', function() {
      textGroup.find('.topLeft').hide();
      textGroup.find('.topRight').hide();
      textGroup.find('.bottomRight').hide();
      textGroup.find('.bottomLeft').hide();
      layer.draw();
    })

    textGroup.on('dbltap', function() {
      this.destroy();
      layer.draw();
    })

    textGroup.on('dragstart', function() {
      this.moveToTop();
      layer.draw();
    })
    $scope.stage.add(layer);
    $('textarea').val('');
   }

  $scope.updateTextSize=function(activeAnchor) {
    var group = activeAnchor.getParent();

    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var text = group.get('Text')[0];

    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();

    // update anchor positions
    switch (activeAnchor.getName()) {
      case 'topLeft':
          topRight.setY(anchorY);
          bottomLeft.setX(anchorX);
          break;
      case 'topRight':
          topLeft.setY(anchorY);
          bottomRight.setX(anchorX);
          break;
      case 'bottomRight':
          bottomLeft.setY(anchorY);
          topRight.setX(anchorX);
          break;
      case 'bottomLeft':
          bottomRight.setY(anchorY);
          topLeft.setX(anchorX);
          break;
    }

    text.position(topLeft.position());

    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();
    if(width && height) {
      text.fontSize((width/10));
      text.height(height);
      text.width(width);
    }
  }

  $scope.addTextAnchor=function(group,x,y,name){
    var stage = group.getStage();
    var layer = group.getLayer();
    var anchor = new Konva.Circle({
      x: x,
      y: y,
      stroke: '#666',
      fill: '#ddd',
      radius: 3,
      name: name,
      draggable: true,
      dragOnTop: false
    });
    anchor.on('dragmove', function() {
      $scope.updateTextSize(this);
      layer.draw();
    });
    anchor.on('mousedown touchstart', function() {
      group.setDraggable(false);
      this.moveToTop();
    });
    anchor.on('dragend', function() {
      group.setDraggable(true);
      layer.draw();
    });
    // add hover styling
    anchor.on('mouseover', function() {
      var layer = this.getLayer();
      document.body.style.cursor = 'pointer';
      this.setStrokeWidth(4);
      layer.draw();
    });
    anchor.on('mouseout', function() {
      var layer = this.getLayer();
      document.body.style.cursor = 'default';
      this.setStrokeWidth(2);
      layer.draw();
    });

    group.add(anchor);
  }
/**
  *                            *
  * BACKGROUND COLOR GENERATOR *
  *                            *
*/
  $scope.BgColorChosen= function(index){
    $('.normalbg').removeClass('').addClass('ion-record normal');
    $scope.colorParams.bgColor= $scope.colorsBgDefault[index];
    console.log($scope.colorParams.bgColor);
    $('#'+'color'+index).removeClass('ion-record').addClass('ion-checkmark-circled');
    var shape = $scope.stage.find('#bg')[0];
    shape.fill($scope.colorsBgDefault[index]);
    $scope.layer.draw();
  }

/**
  *                            *
  * SHAPE -CIRCLE GENERATOR *
  *                            *
*/

  $scope.fillColorChosen=function(index){
    $('.normalfill').removeClass('').addClass('ion-record normal');
    $scope.colorParams.fillColor= $scope.colorsBgDefault[index];
    console.log($scope.colorParams.fillColor);
    $('#'+'fillColor'+index).removeClass('ion-record').addClass('ion-checkmark-circled');

  }

  $scope.borderColorChosen=function(index){
    $('.normalborder').removeClass('').addClass('ion-record normal');
    $scope.colorParams.borderColor= $scope.colorsBgDefault[index];
    console.log($scope.colorParams.fillColor);
    $('#'+'borderColor'+index).removeClass('ion-record').addClass('ion-checkmark-circled');

  }

  $scope.generateCircle=function(){
    console.log('circle');
    var layer=new Konva.Layer();
    var circle = new Konva.Circle({
      radius: 100,
      fill: $scope.colorParams.fillColor,
      stroke: $scope.colorParams.borderColor,
      strokeWidth: 4
    });

    var circleGroup=new Konva.Group({
        x:10,
        y:200,
        draggable:true
    });
    $scope.stage.add(layer);
    layer.add(circleGroup);
    circleGroup.add(circle);
    $scope.addCircleAnchor(circleGroup, 0,0 , 'origin');
    $scope.addCircleAnchor(circleGroup, 0, 100, 'control');
    circleGroup.on('touchstart', function() {
      circleGroup.find('.origin').show();
      circleGroup.find('.control').show();
      layer.draw();
    })
    circleGroup.on('tap', function() {
      circleGroup.find('.origin').hide();
      circleGroup.find('.control').hide();
      layer.draw();
    })
    circleGroup.on('dbltap', function() {
      this.destroy();
      layer.draw();
    })
    circleGroup.on('dragstart', function() {
      this.moveToTop();
      layer.draw();
    })
    layer.draw();
  }

  $scope.addCircleAnchor=function(group, x, y, name){
    var stage = group.getStage();
    var layer = group.getLayer();

    var anchor = new Konva.Circle({
        x: x,
        y: y,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 2,
        radius: 8,
        name: name,
        draggable: true,
        dragOnTop: false
    });

    anchor.on('dragmove', function() {
        $scope.updateCircle(this);
        layer.draw();
    });
    anchor.on('mousedown touchstart', function() {
        group.setDraggable(false);
        this.moveToTop();
    });
    anchor.on('dragend', function() {
        group.setDraggable(true);
        layer.draw();
    });
    // add hover styling
    anchor.on('mouseover', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        this.setStrokeWidth(4);
        layer.draw();
    });
    anchor.on('mouseout', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.setStrokeWidth(2);
        layer.draw();
    });

    group.add(anchor);
    var origin = group.get('.origin')[0];
    origin.draggable(false);
  }

  $scope.updateCircle=function(activeAnchor){
    var group = activeAnchor.getParent();
    var control=group.get('.control')[0];
    var origin = group.get('.origin')[0];
    var circle = group.get('Circle')[0];
    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();
    // update anchor positions
    origin.setX(anchorX);
    circle.position(origin.position());
    var radius = Math.abs(origin.getY() - control.getY());
    circle.radius(radius);
  }

/**
  *                            *
  * SHAPE -TRANGLE GENERATOR *
  *                            *
*/
  $scope.generateTriangle=function(){
    var tri = new Konva.RegularPolygon({
        sides: 3,
        radius: 70,
        fill: $scope.colorParams.fillColor,
        stroke: $scope.colorParams.borderColor,
        strokeWidth: 3
      });

      var triGroup=new Konva.Group({
          x:40,
          y:200,
          draggable:true
      });
      var layer = new Konva.Layer();
      $scope.stage.add(layer);
      layer.add(triGroup);
      triGroup.add(tri);
      $scope.addTriAnchor(triGroup, 0, 0, 'origin');
      $scope.addTriAnchor(triGroup, 0, 35, 'control');
      triGroup.on('touchstart', function() {
        triGroup.find('.origin').show();
        triGroup.find('.control').show();
        layer.draw();
      })
      triGroup.on('tap', function() {
        triGroup.find('.origin').hide();
        triGroup.find('.control').hide();
        layer.draw();
      })
      triGroup.on('dbltap', function() {
        this.destroy();
        layer.draw();
      })
      triGroup.on('dragstart', function() {
        this.moveToTop();
        layer.draw();
      })
    layer.draw();
  }

  $scope.addTriAnchor=function(group, x, y, name){
    var stage = group.getStage();
    var layer = group.getLayer();
    var anchor = new Konva.Circle({
        x: x,
        y: y,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 2,
        radius: 8,
        name: name,
        draggable: true,
        dragOnTop: false
    });

    anchor.on('dragmove', function() {
        $scope.updatetri(this);
        layer.draw();
    });
    anchor.on('mousedown touchstart', function() {
        group.setDraggable(false);
        this.moveToTop();
    });
    anchor.on('dragend', function() {
        group.setDraggable(true);
        layer.draw();
    });
    // add hover styling
    anchor.on('mouseover', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        this.setStrokeWidth(4);
        layer.draw();
    });
    anchor.on('mouseout', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.setStrokeWidth(2);
        layer.draw();
    });
    group.add(anchor);
    var origin = group.get('.origin')[0];
    origin.draggable(false);
  }

  $scope.updatetri=function(activeAnchor){
    var group = activeAnchor.getParent();
    var control=group.get('.control')[0];
    var origin = group.get('.origin')[0];
    var tri = group.get('RegularPolygon')[0];
    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();
    // update anchor positions
    origin.setX(anchorX);
    tri.position(origin.position());
    var radius = Math.abs(origin.getY() - control.getY());
    tri.radius(radius*2);
  }

/**
  *                            *
  * SHAPE -RECTANGLE GENERATOR *
  *                            *
*/
  $scope.generateSquare=function(){
    var layer = new Konva.Layer();
    var rect = new Konva.Rect({
      width: 100,
      height: 100,
      fill: $scope.colorParams.fillColor,
      stroke: $scope.colorParams.borderColor,
      strokeWidth: 4
    });

    var rectGroup=new Konva.Group({
        x:40,
        y:200,
        draggable:true
    });

    $scope.stage.add(layer);
    layer.add(rectGroup);
    rectGroup.add(rect);
    $scope.addSquareAnchor(rectGroup, 0, 0, 'topLeft');
    $scope.addSquareAnchor(rectGroup, 100, 0, 'topRight');
    $scope.addSquareAnchor(rectGroup, 100, 100, 'bottomRight');
    $scope.addSquareAnchor(rectGroup, 0, 100, 'bottomLeft');

    rectGroup.on('touchstart', function() {
      rectGroup.find('.topLeft').show();
      rectGroup.find('.topRight').show();
      rectGroup.find('.bottomRight').show();
      rectGroup.find('.bottomLeft').show();
      layer.draw();
    })
    rectGroup.on('tap', function() {
      rectGroup.find('.topLeft').hide();
      rectGroup.find('.topRight').hide();
      rectGroup.find('.bottomRight').hide();
      rectGroup.find('.bottomLeft').hide();
      layer.draw();
    })

    rectGroup.on('dbltap', function() {
      this.destroy();
      layer.draw();
    })
    rectGroup.on('dragstart', function() {
      this.moveToTop();
      layer.draw();
    })
    layer.draw();
  }

  $scope.addSquareAnchor=function(group, x, y, name){
    var stage = group.getStage();
    var layer = group.getLayer();
    var anchor = new Konva.Circle({
      x: x,
      y: y,
      stroke: '#666',
      fill: '#ddd',
      strokeWidth: 2,
      radius: 8,
      name: name,
      draggable: true,
      dragOnTop: false
    });

    anchor.on('dragmove', function() {
        $scope.updateSquare(this);
        layer.draw();
    });
    anchor.on('mousedown touchstart', function() {
        group.setDraggable(false);
        this.moveToTop();
    });
    anchor.on('dragend', function() {
        group.setDraggable(true);
        layer.draw();
    });
    // add hover styling
    anchor.on('mouseover', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        this.setStrokeWidth(4);
        layer.draw();
    });
    anchor.on('mouseout', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.setStrokeWidth(2);
        layer.draw();
    });
    group.add(anchor);
  }

  $scope.updateSquare=function(activeAnchor){
    var group = activeAnchor.getParent();

    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var rect = group.get('Rect')[0];

    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();

    // update anchor positions
    switch (activeAnchor.getName()) {
        case 'topLeft':
            topRight.setY(anchorY);
            bottomLeft.setX(anchorX);
            break;
        case 'topRight':
            topLeft.setY(anchorY);
            bottomRight.setX(anchorX);
            break;
        case 'bottomRight':
            bottomLeft.setY(anchorY);
            topRight.setX(anchorX);
            break;
        case 'bottomLeft':
            bottomRight.setY(anchorY);
            topLeft.setX(anchorX);
            break;
    }

    rect.position(topLeft.position());
    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();
    if(width && height) {
        rect.width(width);
        rect.height(height);
    }
  }




  $scope.addMedia = function() {
    $scope.hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Take photo' },
        { text: 'Photo from library' }
      ],
      titleText: 'Add images',
      cancelText: 'Cancel',
      buttonClicked: function(index) {
        $scope.addImage(index);
      }
    });
  }

  $scope.addImage = function(type) {
    $scope.hideSheet();
    ImageService.handleMediaDialog(type).then(function() {
      $scope.$apply();
    });
  }

 $scope.addimageusingpicker =function(){
  var options = {
   maximumImagesCount: 1,
   width: 800,
   height: 800,
   quality: 80
  };

  $cordovaImagePicker.getPictures(options)
    .then(function (results) {
      for (var i = 0; i < results.length; i++) {
      console.log('Image URI: ' + results[i]);
      var layer = new Konva.Layer();
      var imageObj = new Image();
      imageObj.onload = function() {
        var image = new Konva.Image({
          image: imageObj,
          width: $scope.canvasWidth,
          height: $scope.canvasHeight
        });
        // add the shape to the layer
        layer.add(image);
        // add the layer to the stage
        $scope.stage.add(layer);
      };
        imageObj.src = results[i];
      }
    }, function(error) {
      // error getting photos
    });
  }

})

