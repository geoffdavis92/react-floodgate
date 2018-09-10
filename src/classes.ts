import { ErrorBoundaryProps, ErrorBoundaryState } from "./types";
import * as React from "react";
import * as PropTypes from "prop-types";
import { ErrorMessage } from "functions";

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  // static props
  static defaultProps = {
    errorMessage: ErrorMessage
  };
  static propTypes = {
    children: PropTypes.any.isRequired,
    errorMessage: PropTypes.func,
    fallbackUI: PropTypes.func
  };

  // fields
  state = {
    treeHasError: false,
    treeError: { error: false, info: "" }
  };

  // methods
  componentDidCatch(error: Error, info: any) {
    this.setState(prevState => ({
      treeHasError: true,
      treeError: {
        error: error.toString(),
        info
      }
    }));
  }
  render() {
    const { children, fallbackUI } = this.props;
    const { treeHasError, treeError } = this.state;
    if (treeHasError) {
      return fallbackUI ? fallbackUI({ ...treeError }) : children;
    } else {
      return children;
    }
  }
}

export { ErrorBoundary };
