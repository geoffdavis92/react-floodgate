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

type FloodgateProps = {
  children: (args: {
    items: Array<any>,
    loadComplete: boolean,
    loadAll: Function,
    loadNext: Function,
    reset: Function
  }) => JSX.Element,
  data: Array<any>,
  increment: number,
  initial: number
};

type FloodgateState = {
  renderedItems: Array<any>,
  allItemsRendered: boolean
};

export {
  ErrorBoundaryProps,
  ErrorBoundaryState,
  FloodgateProps,
  FloodgateState
};
