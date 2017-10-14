// @flow
// @flow-ignore
import type { ErrorBoundaryProps, ErrorBoundaryState } from "./types";
import React, { Component } from "react";
// @flow-ignore
import PropTypes from "prop-types";
import { ErrorMessage } from "./functions";

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
	componentDidCatch(error: string, info: string) {
		this.setState(prevState => ({
			treeHasError: true,
			treeError: {
				error,
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
