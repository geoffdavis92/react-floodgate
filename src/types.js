type ErrorBoundaryProps = {
	errorMessage?: Function,
	fallbackUI?: Function
};
type ErrorBoundaryState = {
	treeHasError: boolean,
	treeError: {
		error: boolean | string,
		info: string
	}
};
type FloodgateProps = Object;
type FloodgateState = {
	renderedData: Array<any>,
	allDataRendered: boolean
};

export {
	ErrorBoundaryProps,
	ErrorBoundaryState,
	FloodgateProps,
	FloodgateState
};
