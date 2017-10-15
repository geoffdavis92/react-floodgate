const generateFilledArray = amount => {
	const the_array = [];
	for (let i = 0; i < amount; i++) {
		the_array.push(i);
	}
	return the_array;
};

export { generateFilledArray };
