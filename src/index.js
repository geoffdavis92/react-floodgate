// @flow
import type { FloodgateProps, FloodgateState } from "./types";
import * as _Polyfill from 'babel-polyfill'
import React, { Component } from "react";
import PropTypes from "prop-types";
import { generator } from "functions";

class Floodgate extends Component<FloodgateProps, FloodgateState> {
	// flow types
	data: Array<any>;
	queue: Function;
	getNext: Function;
	loadNext: Function;

	// static props
	static propTypes = {
		data: PropTypes.array.isRequired,
		initial: PropTypes.number,
		increment: PropTypes.number
	};
	static defaultProps = {
		initial: 5,
		increment: 5
	};

	// methods
	constructor(props: FloodgateProps) {
		super();
		this.queue = generator(props.data, props.increment, props.initial);
		this.data = props.data;
		this.state = {
			renderedItems: [],
			allItemsRendered: false
		};
		this.getNext = this.getNext.bind(this);
		this.loadNext = this.loadNext.bind(this);
	}
	getNext(): Object {
		return this.queue.next();
	}
	componentDidMount(): void {
		this.loadNext();
	}
	loadNext(): void {
		!this.state.allItemsRendered &&
			this.setState(prevState => {
				const { value, done } = this.getNext();
				const valueIsAvailable =
					value !== null && value !== undefined && value.length > 0;
				const newRenderedData = [
					...prevState.renderedItems,
					...(valueIsAvailable ? value : [])
				];
				const dataLengthMatches = newRenderedData.length === this.data.length;
				const nextYieldIsPartial = value && value.length < this.props.increment;

				return {
					renderedItems: newRenderedData,
					allItemsRendered:
						!valueIsAvailable ||
						(valueIsAvailable && (nextYieldIsPartial || dataLengthMatches))
							? true
							: false
				};
			});
	}
	render(): Function {
		return this.props.children({
			items: this.state.renderedItems,
			loadNext: this.loadNext,
			loadComplete: this.state.allItemsRendered
		});
	}
}

export default Floodgate;
