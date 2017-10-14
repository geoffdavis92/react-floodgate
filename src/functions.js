import React from "react";

// const displayIf = (itemToCheck, replaceHolder = "<=itemToCheck=>") => {
// 	//itemToCheck ? replaceHolder.replace(/\<\=\s*[a-zA-Z0-9\-\_]+\s*\=\>/g, itemToCheck) : "";
// 	switch (typeof replaceHolder) {
// 		case 'function': {
// 			return itemToCheck && replaceHolder({ replaceVal }) || null
// 			break;
// 		}
// 		case 'string': {
// 			return itemToCheck && replaceHolder.replace(/\<\=\s*[a-zA-Z0-9\-\_]+\s*\=\>/g, replaceVal) || "";
// 		}
// 	}
// };

const ErrorMessage = ({ children, callerDisplayName, text, ...rest } = { text: false }) => (
	<span
		className={`error_message${callerDisplayName ? `--${callerDisplayName}` : ''}`}
		{...rest}
	>
		{text ? text : children}
	</span>
);

export { ErrorMessage };
