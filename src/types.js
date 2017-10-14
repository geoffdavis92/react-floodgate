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
	floodgateDidCatch: boolean,
	floodgateErrorMessage: string,
	isFetching: boolean,
	data: Array<any>,
	fetchDidCatch: boolean
};

export {
	ErrorBoundaryProps,
	ErrorBoundaryState,
	FloodgateProps,
	FloodgateState
};
