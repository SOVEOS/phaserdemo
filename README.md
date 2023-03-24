# phaser3Demo
Demo of Phaser3 js engine with desired functionality for SOV INVADERS

currently is set to only update the game / map upon user interactions with the standard 'update' phaser function ommited and a custom function to gets triggered to update the game / map only upon user interactions.  

on mobile currently the pinch zoom does not work, but this version may fix that, i am literally adding it here exclusively to test on mobile.  

the map is built and the tile dimensions are set to interactive hitzones that provides coordinate upon user input.  it is done this way to ensure wrong coordinates are not given when clicking on a tile or asset that overlaps with another.  many of the games assets include units and buildings that will overlap the tiles for the isometric effect, and also even with the single tile asset like it is now, without the hitzones it can give some unexpected coordinates at times when clicking close to the edge of the tiles.  the hitzones fixes this though.  

the games map will be built from an array that will say which tiles to use, that is called from a smartcontract on EOS, though it is currently just set to a single tile with random color tints for the demo / testing.    
