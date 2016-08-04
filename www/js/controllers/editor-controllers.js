angular.module('quo')

.controller('editorController', function($scope,$state,$ionicActionSheet) {

  console.log($scope)
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

  $scope.initiateStage=function(){
    var windowHeight = $(document).height();
    var navbarHeight = $('.editor-navbar').outerHeight();
    var canvasWidth  = screen.width - 2;
    var canvasHeight = canvasWidth * 0.75;

    $scope.tabStyle = {
      height: windowHeight - navbarHeight - canvasHeight
    }

    console.log($scope.tabStyle)
    $scope.canvasStyle = {
      width: canvasWidth,
      height: canvasHeight
    }

    $scope.stage = new Konva.Stage({
      container: 'canvas',
      name: "canvas",
      width: canvasWidth,
      height: canvasHeight
    })

    $scope.layer = new Konva.Layer();

    var bg = new Konva.Rect({
      x: 0,
      y: 0,
      fill: '#F0F0F0',
      width: canvasWidth,
      height: canvasHeight,
      id:"bg"
    });

    $scope.layer.add(bg);
    $scope.stage.add($scope.layer);
  }
  $scope.initiateStage();

  $scope.saveImage = function(){
    var dataURL = $scope.stage.toDataURL();
    window.open(dataURL);
  }

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
    $scope.addAnchor(textGroup, 0, 0, 'topLeft');
    $scope.addAnchor(textGroup, complexText.getWidth(), 0, 'topRight');
    $scope.addAnchor(textGroup, complexText.getWidth(), complexText.getHeight(), 'bottomRight');
    $scope.addAnchor(textGroup, 0, complexText.getHeight(), 'bottomLeft');
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

  $scope.addAnchor=function(group,x,y,name){
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

  $scope.BgColorChosen= function(index){
    $('.normalbg').removeClass('').addClass('ion-record normal');
    $scope.colorParams.bgColor= $scope.colorsBgDefault[index];
    console.log($scope.colorParams.bgColor);
    $('#'+'color'+index).removeClass('ion-record').addClass('ion-checkmark-circled');
    var shape = $scope.stage.find('#bg')[0];
    shape.fill($scope.colorsBgDefault[index]);
    $scope.layer.draw();
  }

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
})

