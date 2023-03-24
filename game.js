
  const config = {
      type: Phaser.AUTO,
      autoRound: true, // Round pixel values to the nearest integer to save resources
      antialias: false, // Disable antialiasing to save resources
      backgroundColor: '#000000', // Set a solid background color
      width: 800,
      height: 600,
      scene: {
          preload: preload,
          create: create,
          update: update
      },
      contextCreationParams: {
          powerPreference: 'low-power' // save resources
      },
      render: {
          batchSize: 4000 // Increase the batchSize
      }

  };

  function update() {
    if (pinchUpdate) {
        if (this.input.pointer1.isDown && this.input.pointer2.isDown) {
            if (!pinchActive) {
                pinchActive = true;
                initialPinchDistance = Phaser.Math.Distance.Between(
                    this.input.pointer1.x, this.input.pointer1.y,
                    this.input.pointer2.x, this.input.pointer2.y
                );
            } else {
                const pinchDistance = Phaser.Math.Distance.Between(
                    this.input.pointer1.x, this.input.pointer1.y,
                    this.input.pointer2.x, this.input.pointer2.y
                );

                const zoomAmount = (initialPinchDistance - pinchDistance) * 0.01;
                camera.zoom = Phaser.Math.Clamp(camera.zoom - zoomAmount, 0.1, 2);
                initialPinchDistance = pinchDistance;
            }
        } else {
            pinchActive = false;
            pinchUpdate = false;
        }
    }
}


  const game = new Phaser.Game(config);


  let layer;
  let camera;
  let tileWidth = 300;
  let tileHeight = 140;
  let offsetX = tileWidth / 2;
  let offsetY = tileHeight / 2;
  let dragging = false;
  let dragStart = new Phaser.Math.Vector2();
  let pinchActive = false;
  let pinchUpdate = false;
  let initialPinchDistance;

  function preload() {
      this.load.image('tile00', 'assets/tile00.png');
  }
  function create() {
      layer = this.add.layer(0, 0);
      camera = this.cameras.main;

      const mapWidth = 50;
      const mapHeight = 50;
      let tileCounter = 0;

      const hitArea = new Phaser.Geom.Polygon([
          0, tileHeight / 2,
          tileWidth / 2, 0,
          tileWidth, tileHeight / 2,
          tileWidth / 2, tileHeight
      ]);  // add hit area so that coordinates are correct regardless of tile overlap which is necessary because the buildings and other assets will overlap due to isometric view

      for (let y = 0; y < mapHeight; y++) {
          for (let x = 0; x < mapWidth; x++) {
              if (y % 2 === 0 && x % 2 === 0) {
                  const tile = this.add.image(x * tileWidth / 2, y * offsetY, 'tile00')
                      .setInteractive(hitArea, Phaser.Geom.Polygon.Contains)
                      .setData({ name: `mapTile${tileCounter}`, x, y });

                  tile.setTint( 0xffffff);
                  layer.add(tile);
                  tileCounter++;
              } else if (y % 2 === 1 && x % 2 === 1) {
                  const tile = this.add.image(x * tileWidth / 2, y * offsetY, 'tile00')
                      .setInteractive(hitArea, Phaser.Geom.Polygon.Contains)
                      .setData({ name: `mapTile${tileCounter}`, x, y });

                  tile.setTint(0xffffff);
                  layer.add(tile);
                  tileCounter++;
              }
          }
      }  // drawing the map and setting the hitzones to be interactive and display coordinates in the console upon clicking



      this.input.on('pointerdown', (pointer) => {
          if (this.input.pointer1.isDown && this.input.pointer2.isDown) {
                pinchUpdate = true;
          } else {
              dragging = true;
              dragStart.set(pointer.x, pointer.y);
          }

      });  // checking to see if user is pinching the map (mobile) or selecting the map to drag

      this.input.on('pointerup', (pointer) => {
          dragging = false;
          pinchActive = false;

      });  // making sure the dragging and pinch is stopped upon lifting fingers of the map or releasing the mouse button to stop dragging

      this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
          const zoomAmount = deltaY > 0 ? -0.1 : 0.1;
          camera.zoom = Phaser.Math.Clamp(camera.zoom + zoomAmount, 0.1, 2);

      }); // mouse zoom functionality and updating the map whenever this happens

      this.input.on('pointermove', _.throttle((pointer) => {
          if (dragging && !pinchActive) {
              const deltaX = pointer.x - dragStart.x;
              const deltaY = pointer.y - dragStart.y;

              camera.scrollX -= deltaX / camera.zoom;
              camera.scrollY -= deltaY / camera.zoom;

              dragStart.set(pointer.x, pointer.y);
          }

          if (this.input.pointer1.isDown && this.input.pointer2.isDown) {
              pinchUpdate = true;
            }


      }, 16)); // dragging / scrolling the map and updating the map upon the user event

      // Add the event listener for clicking on a tile
      this.input.on('gameobjectdown', (pointer, gameObject) => {
          console.log(`Tile clicked: ${gameObject.getData('name')}, Coordinates: {x: ${gameObject.getData('x')}, y: ${gameObject.getData('y')}}`);
      });
  }
