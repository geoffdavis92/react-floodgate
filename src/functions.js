import React from "react";

const generator = function* generator(data, stepCount) {
	let currentIndex = 0;
	while (currentIndex <= data.length - 1) {
		yield [...data].splice(currentIndex, stepCount);
		currentIndex = currentIndex + stepCount;
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
