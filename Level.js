Level = function(width, height) {
	this.LEVEL_WIDTH = width;
	this.LEVEL_HEIGHT = height;
};

Level.prototype = {
	characterStartX: 60,
	characterStartY: 150,
	platforms: null,
	counter: 0,
	counterText: null,

	preload: function() {
		this.loadAssets();

		this.bobby = new Character(this);
		this.bobby.preload();

	},

	create: function() {
		counter = 0;

		this.physics.startSystem(Phaser.Physics.Arcade);
		this.add.tileSprite(0, 0, this.LEVEL_WIDTH, this.LEVEL_HEIGHT, 'background');
		this.world.setBounds(0, 0, this.LEVEL_WIDTH, this.LEVEL_HEIGHT);
		this.platforms = this.add.group();
		this.platforms.enableBody = true;

		this.loadLevelObjects();

		this.bobby.create(this.characterStartX, this.characterStartY);

		// Register hooks for the number keys to switch between levels.
		keynames = [ "", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX",
								 "SEVEN", "EIGHT", "NINE", "TEN", "ZERO" ];
		for ( var n = 1; n <= 10; n++){
			// The extra anonymous function here exists because of:
			// http://www.mennovanslooten.nl/blog/post/62
			switchLevel = ( function(n) { return function () { game.state.start(n); } } )(n);
			// Equivelant of this.input.keyboard.addKey(49,50, .. ,58)
			this.input.keyboard.addKey(Phaser.Keyboard[keynames[n]]).onDown.add(switchLevel);
		}

		// Adds a text in the top right corner showing the time.
		counterText = this.add.text(0, 0, 'Time: 0', {font: "30px Arial", fill: "#000000", align: "left"});
		// The texts position is relative to the cameras.
		counterText.fixedToCamera = true;
		counterText.cameraOffset.setTo(game.width - 140, game.height - 570);


		this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
	},

	update: function() {
		this.bobby.update();

	},

	render: function() {
		this.bobby.render();
	},

	loadAssets: function() {
		this.load.image('background', 'assets/background.png');
		this.load.image('platform', 'assets/platform.png');
	},

	/**
	 * Adds a platform to the level.
	 * Arguments, all in pixels:
	 * x: The horizontal coordinate from the left edge.
	 * y: The vertical coordinate from the top edge.
	 * width: The horizontal width of the platform.
	 * height: The vertical height of the platform.
	 */
	addPlatform: function(x, y, width, height) {
		var platform = this.platforms.create(x, y, 'platform');
		platform.scale.setTo(width/400, height/32);
		platform.body.immovable = true;
	},

	updateCounter: function() {
		counter++;

		counterText.setText('Time: ' + counter);
	}
};
