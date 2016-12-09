window.addEventListener('load', function() {
  var fadein_appear = false;

  window.awe.init({
    device_type: awe.AUTO_DETECT_DEVICE_TYPE,
    settings: {
      container_id: 'container',
      fps: 30,
      default_camera_position: { x:0, y:0, z:0 },
      default_lights: [{
        id: 'point_light',
        type: 'point',
        color: 0xFFFFFF
      }]
    },
    ready: function() {
      awe.util.require([
        {
          capabilities: ['gum','webgl'],
          files: [ 
            ['lib/awe-standard-dependencies.js', 'lib/awe-standard.js'],
            'lib/awe-standard-window_resized.js',
            'lib/awe-standard-object_clicked.js',
            'lib/awe-jsartoolkit-dependencies.js',
            'lib/OBJLoader.js',
            'lib/awe.marker_ar.js'
          ],
          success: function() { //start displaying element
            window.awe.setup_scene();

            // Points of Interest
            awe.pois.add({id: 'marker', position: {x: 0, y: 0, z: 10000}, visible: false});

            // Projections
            awe.projections.add({ 
              id: 'menu_items',
              geometry: {shape: 'plane', height: 240, width: 240},
              position: {x: 0, y: 0, z: 0},
              rotation: {x: 90, z: 45},
              texture: {path: 'assets/maus.png'},
              material: {
                type: 'lambert',
                color: 0x9999FF
              }
            }, {poi_id: 'marker'});

            awe.projections.add({
              id: 'ar_button_one',                   
              geometry: {shape: 'cube', x: 60, y: 30, z: 5},
              rotation: {y: 15},
              texture: {path: 'assets/tour.png'},
              position: {x: -5, y: -31, z: -5},
              material: {
                type: 'phong',
                color: 0xFF6600
              }
            }, {poi_id: 'marker'});

            awe.projections.add({
              id: 'ar_button_two',
              geometry: {shape: 'cube', x: 60, y: 30, z: 5},
              rotation: {y: 15},
              texture: {path: 'assets/trap.png'},
              position: {x: -5, y: -31, z: -5},
              material: {
                type: 'phong',
                color: 0xFF6600
              }
            }, {poi_id: 'marker'});

            awe.projections.add({
              id: 'ar_button_three',
              geometry: {shape: 'cube', x: 150, y: 80, z: 80},
              rotation: {x: 60, y: 0},
              texture: {path: 'assets/mau5v.webm'},
              position: {x: -5, y: -60, z: -5},
              material: {
                type: 'phong',
                color: 0xFF6600
              }
            }, {poi_id: 'marker'});

            
            awe.events.add([{
              id: 'ar_tracking_marker',
              device_types: {
                pc: 1,
                android: 1
              },
              register: function(handler) {
                window.addEventListener('ar_tracking_marker', handler, false);
              },
              unregister: function(handler) {
                window.removeEventListener('ar_tracking_marker', handler, false);
              },
              handler: function(event) {
                if (event.detail) {
                  if (event.detail['64']) {
                    awe.pois.update({
                      data: {
                        visible: true,
                        position: {x: 0, y: 0, z: 0},
                        matrix: event.detail['64'].transform
                      },
                      where: {
                        id: 'marker'
                      }
                    });
                    awe.projections.update({
                      data: {
                        visible: true
                      },
                      where: {
                        id: 'menu_items'
                      }
                    });
                  } else if (fadein_appear) {
                    awe.projections.update({
                      data: {
                        visible: false
                      },
                      where: {
                        id: 'menu_items'
                      }
                    });
                  }
                  else {
                    awe.pois.update({
                      data: {
                        visible: false
                      },
                      where: {
                        id: 'marker'
                      }
                    });
                  }
                  awe.scene_needs_rendering = 1; //update scene
                }
              }
            }]);

            window.addEventListener('object_clicked', function(e) {
              switch (e.detail.projection_id) {
                case 'menu_items':
                  if (!fadein_appear) {
                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {x: -60, y: 35}
                      },
                      where: {id: 'ar_button_one'}
                    });
                        awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {x: -60, y: 70},
                      },
                      where: {id: 'ar_button_two'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {x: 80, y:60},
                        rotation: {x: -25, y:-200}
                      },
                      where: {id: 'ar_button_three'}
                    });
                  } else {
                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_one'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_two'}
                    });

                    awe.projections.update({
                      data: {
                        animation: {
                          duration: 1
                        },
                        position: {y: -31}
                      },
                      where: {id: 'ar_button_three'}
                    });
                
                  }

                  menu_open = !menu_open;
                break;
                case 'ar_button_one':
                case 'ar_button_two':
                case 'ar_button_three':

                window.addEventListener('object_clicked', function(e) {
                  window.open(url,'_blank');
                });

                  // var request = new XMLHttpRequest();
                  // request.open('GET', 'http://live.deadmau5.com/', true);

                  // // request.onload = function() {
                  // //   if (request.status >= 200 && request.status < 400) {
                  // //     var data = JSON.parse(request.responseText);
                  // //     console.log(data);
                  // //   }
                  // // };

                  // request.send();
                break;
              }
            }, false);
          } // success()
        },
        {
          capabilities: [],
          success: function() { 
            document.body.innerHTML = '<p>I tried =(</p>';
          }
        }
      ]); // awe.util.require()
    } // ready()
  }); // window.awe.init()
}); // load