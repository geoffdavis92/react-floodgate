// @flow
// @flow-ignore
import type { FloodgateProps, FloodgateState } from "./types";
import React, { Component } from "react";
// @flow-ignore
import PropTypes from "prop-types";

class Floodgate extends Component<FloodgateProps, FloodgateState> {
	// static props
	static displayName = "Floodgate";
	static propTypes = {
		children: PropTypes.func.isRequired,
		datasource: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
			.isRequired,
		initialCount: PropTypes.number,
		step: PropTypes.number
	};
	static defaultProps = {
		errorDisplay: props => <p>{props.errorMessage}</p>,
		initialCount: 10,
		step: 10
	};

	// methods
	constructor(props: any) {
		super(props);
		this.state = {
			floodgateDidCatch: false,
			floodgateErrorMessage: "",
			isFetching: false,
			data: [],
			fetchDidCatch: false
		}
		this.dataGenerator = function* (data, iterationLength = 2, startIndex = 0) {
			let currentIndex = startIndex;
			yield [...data].splice(startIndex, iterationLength);
			while (currentIndex <= data.length - 1) {
				currentIndex = currentIndex + iterationLength;
				yield [...data].splice(currentIndex, iterationLength);
			}
		}
		this.dataQueue;
	}
	componentWillMount() {
		if (this.props.datasource) {
			this.setState(
				prevState => ({
					isFetching: true
				}),
				() => {
					if (typeof this.props.datasource === "string") {
						window
							.fetch(this.props.datasource, this.props.options)
							.then(res => {
								let message = "";
								switch (res.status) {
									case 200: {
										return res.json();
									}
									case 401: {
										message = `${res.status} ERROR: Not allowed`;
										break;
									}
									case 404: {
										message = `${res.status} ERROR: Not found`;
										break;
									}
									default: {
										message = `${res.status} ERROR: Bad request`;
										break;
									}
								}
								return {
									error: true,
									message
								};
							})
							.then(data => {
								if (data.error) {
									throw `FloodgateError: ${data.error}`;
								} else {
									this.setState(prevState => ({
										data,
										isFetching: false
									}), () => this.dataQueue = this.dataGenerator(data,this.props.initialCount));
								}
							})
							.catch(err => {
								this.setState(prevState => ({
									floodgateDidCatch: true,
									floodgateErrorMessage: `Floodgate Error: ${err}`
								}));
							});
					} else {
						this.setState(prevState => ({
							data: this.props.datasource
						}), () => this.dataQueue = this.dataGenerator(data,this.props.initialCount));
					}
				}
			);
		} else {
			this.setState(prevState => ({
				floodgateDidCatch: true,
				floodgateErrorMessage: "Floodgate Error: missing valid datasource prop"
			}));
		}
	}

	componentDidCatch(err: string, info: string) {
		this.setState(prevState => ({
			floodgateDidCatch: true,
			floodgateErrorMessage: info
		}));
	}

	next() {
		const { value, done } = this.dataQueue.next()
		return { value, done }
	}

	render() {
		if (!this.state.floodgateDidCatch) {
			return this.props.children({ loadNext: this.next, ...this.state});
		} else {
			return this.props.errorDisplay({
				errorMessage: this.state.floodgateErrorMessage
			});
		}
	}
}

export default Floodgate;
