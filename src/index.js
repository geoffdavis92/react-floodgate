// @flow
import React, { Component } from "react";
// @flow-ignore
import PropTypes from "prop-types";

class Floodgate extends Component {
	state: Object;
	// @flow-ignore
	static propTypes = {
		children: PropTypes.func.isRequired,
		datasource: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
			.isRequired
	};
	// @flow-ignore
	static defaultProps = {
		errorDisplay: props => <p>{props.errorMessage}</p>
	};
	constructor(props: any) {
		super(props);
		this.state = {
			floodgateDidCatch: false,
			floodgateErrorMessage: "",
			isFetching: false,
			data: [],
			fetchDidCatch: false
		};
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
										data
									}));
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
						}));
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
	render(): ReactElement {
		if (!this.state.floodgateDidCatch) {
			return this.props.children(this.state);
		} else {
			return this.props.errorDisplay({
				errorMessage: this.state.floodgateErrorMessage
			});
		}
	}
}

export default Floodgate;
