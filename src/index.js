// @flow
import type { FloodgateProps, FloodgateState } from "./types";
import * as _Polyfill from "babel-polyfill";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { generator } from "functions";

class Floodgate extends Component<FloodgateProps, FloodgateState> {
	// flow types
	data: Array<any>;
	queue: Function;
	getNext: Function;
	loadNext: Function;
	resetQueue: Function;

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
		this.resetQueue = this.resetQueue.bind(this);
	}
	getNext(): Object {
		return this.queue.next();
	}
	componentDidMount(): void {
		this.loadNext();
	}
	resetQueue(/*{ callback }: { callback: Function }*/): void {
		this.queue = generator(this.data, this.props.increment, this.props.initial);
		this.setState(prevState => ({
			renderedItems: [],
			allItemsRendered: false
		}), this.loadNext)
	}
	loadNext(/*{ callback }: { callback: Function }*/): void {
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
			}/*, () => callback && callback()/*.bind(this)*\/ */);
	}
	render(): Function {
		const { loadNext, resetQueue } = this;
		const { renderedItems, allItemsRendered } = this.state;
		return this.props.children({
			items: renderedItems,
			loadComplete: allItemsRendered,
			loadNext,
			resetQueue
		});
	}
}

export default Floodgate;
