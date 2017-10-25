global.requestAnimationFrame = function(callback) {
	setTimeout(callback, 0);
};

export default global;
