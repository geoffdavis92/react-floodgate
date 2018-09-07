// @flow
import React from "react";
import { FloodgateProps } from "types";

const generator = function* generator(
	data: FloodgateProps['data'],
	yieldLength: FloodgateProps['increment'],
	initialYieldLength: FloodgateProps['initial']
): Generator {
	let currentIndex: number = 0;
	while (currentIndex <= data.length - 1) {
		let firstYield = currentIndex === 0;
		yield [...data].splice(
			currentIndex,
			firstYield && initialYieldLength >= 0 ? initialYieldLength : yieldLength
		);
		currentIndex =
			firstYield && initialYieldLength >= 0
				? currentIndex + initialYieldLength
				: currentIndex + yieldLength;
	}
};

const ErrorMessage = ({
	children,
	callerDisplayName,
	text,
	...rest
}: {
	children: ?Array<any>,
	callerDisplayName: ?string,
	text: string
}) => (
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
