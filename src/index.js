// @flow
// @flow-ignore
import type { FloodgateProps, FloodgateState } from "./types";
import React, { Component } from "react";
// @flow-ignore
import PropTypes from "prop-types";
// @flow-ignore
import { generator } from "functions";

class Floodgate extends Component<FloodgateProps, FloodgateState> {
	// flow types
	data: Array<any>;
	queue: Function;
	loadNext: Function;

	// static props
	static defaultProps = {
		data: []
	};

	// methods
	constructor(props: FloodgateProps) {
		super();
		this.queue = generator(props.data, 3);
		this.data = props.data;
		this.state = {
			renderedData: [],
			allDataRendered: false
		};
		// this.initQueue();
		this.loadNext = this.loadNext.bind(this);
	}
	// initQueue(data = this.data) {
	// return (this.queue = generator(data, 3));
	// }
	getNext(): Object {
		return this.queue.next();
	}
	componentDidMount(): void {
		this.loadNext();
	}
	loadNext(): void {
		!this.state.allDataRendered &&
			this.setState(prevState => {
				const { value, done } = this.getNext();
				const valueIsAvailable =
					value !== null && value !== undefined && value.length > 0;
				const newRenderedData = [
					...prevState.renderedData,
					...(valueIsAvailable ? value : [])
				];
				return {
					renderedData: newRenderedData,
					allDataRendered: !valueIsAvailable && done ? true : false
				};
			});
	}
	render(): Function {
		return this.props.children({
			data: this.state.renderedData,
			loadNext: this.loadNext,
			allLoaded: this.state.allDataRendered
		});
	}
}

export default Floodgate;
