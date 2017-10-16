import React from "react";

const generator = function* generator(data, yieldLength, initialYieldLength) {
	let currentIndex = 0;
	while (currentIndex <= data.length - 1) {
		let firstYield = currentIndex === 0;
		yield [...data].splice(
			currentIndex,
			firstYield && initialYieldLength >= 0 ? initialYieldLength : yieldLength
		);
		currentIndex = firstYield && initialYieldLength >= 0 ? (currentIndex + initialYieldLength) : (currentIndex + yieldLength);
	}
};

const ErrorMessage = (
	{ children, callerDisplayName, text, ...rest } = { text: false }
) => (
	<span
		className={`error_message${callerDisplayName
			? `--${callerDisplayName}`
			: ""}`}
		{...rest}
	>
		{text ? text : children}
	</span>
);

export { ErrorMessage, generator };
