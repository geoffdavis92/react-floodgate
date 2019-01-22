import { FloodgateProps, FloodgateState } from "./types";
import "regenerator-runtime/runtime";
import * as React from "react";
import * as PropTypes from "prop-types";
import { generator } from "./functions";

const initGeneratorSymbol = Symbol.for("initGenerator");

class Floodgate extends React.Component<FloodgateProps, FloodgateState> {
  // types
  data: Array<any>;
  queue: Generator | null;
  state: FloodgateState;

  // static props
  static propTypes = {
    children: PropTypes.func,
    data: PropTypes.array.isRequired,
    initial: PropTypes.number,
    increment: PropTypes.number,
    saveStateOnUnmount: PropTypes.bool,
    exportState: PropTypes.func,
    onLoadNext: PropTypes.func,
    onLoadComplete: PropTypes.func,
    onReset: PropTypes.func
  };
  static defaultProps = {
    initial: 5,
    increment: 5,
    saveStateOnUnmount: true
  };

  // methods
  constructor(props: FloodgateProps) {
    super(props);
    const { data, increment, initial } = props;
    this.queue = null;
    this.data = data;
    this.state = {
      items: this.data,
      renderedItems: [],
      currentIndex: 0,
      allItemsRendered: false,
      prevProps: {
        data,
        increment,
        initial
      }
    };
    this[initGeneratorSymbol] = this[initGeneratorSymbol].bind(this);
    this.loadAll = this.loadAll.bind(this);
    this.loadNext = this.loadNext.bind(this);
    this.reset = this.reset.bind(this);
    this.saveState = this.saveState.bind(this);
    this[initGeneratorSymbol](
      this.props.data,
      this.props.increment,
      this.props.initial
    );
  }
  [initGeneratorSymbol](data, increment, initial) {
    this.queue = generator(data, increment, initial);
  }
  componentDidMount(): void {
    this.loadNext({ silent: true });
  }
  componentDidUpdate(prevProps, prevState): void {
    const { data, increment } = this.props;
    if (this.props !== prevProps) {
      this[initGeneratorSymbol](
        data.slice(prevState.currentIndex, data.length),
        increment,
        increment
      );
      const items = data;
      this.setState(() => ({
        items,
        allItemsRendered: items.length === prevState.renderedItems.length
      }));
    }
  }
  componentWillUnmount(): void {
    // Prevent unwanted cacheing by setting saveStateOnUnmount to false
    this.props.saveStateOnUnmount && this.saveState();
  }
  reset({
    initial,
    callback
  }: { initial?: number, callback?: Function } = {}): void {
    this[initGeneratorSymbol](
      this.data,
      this.props.increment,
      typeof initial !== "undefined" ? initial : this.props.initial
    );

    this.setState(
      prevState => ({
        renderedItems: [],
        allItemsRendered: false,
        prevProps: {
          ...prevState.prevProps,
          initial: typeof initial !== "undefined" ? initial : this.props.initial
        }
      }),
      () => {
        this.loadNext({ silent: true, callback });
        this.props.onReset && this.props.onReset(this.state);
      }
    );
  }
  loadAll(
    {
      callback,
      suppressWarning
    }: { callback?: Function, suppressWarning: boolean } = {
      suppressWarning: false
    }
  ): void {
    !this.state.allItemsRendered
      ? this.setState(
          prevState => {
            return {
              renderedItems: this.data,
              currentIndex: this.data.length,
              allItemsRendered: true
            };
          },
          () => {
            callback && callback(this.state);
            this.props.onLoadComplete && this.props.onLoadComplete(this.state);
          }
        )
      : this.state.allItemsRendered &&
        !suppressWarning &&
        console.warn("Floodgate: All items are rendered");
  }
  loadNext(
    { silent, callback }: { silent?: boolean, callback?: Function } = {
      silent: false
    }
  ): void {
    if (!this.state.allItemsRendered) {
      // Get next iteratable
      const { value } = this.queue.next();
      // Check if array value exists and has at least one element
      const valueIsAvailable: boolean = value && value.length;

      this.setState(
        prevState => {
          // Apply new data if available
          const newRenderedData = [
            ...prevState.renderedItems,
            ...(valueIsAvailable ? value : [])
          ];
          // Check if all data items have been rendered
          const dataLengthMatches: boolean =
            newRenderedData.length === prevState.items.length;

          return {
            renderedItems: newRenderedData,
            currentIndex: newRenderedData.length,
            allItemsRendered:
              !valueIsAvailable || (valueIsAvailable && dataLengthMatches)
                ? true
                : false
          };
        },
        () => {
          callback && callback(this.state);
          if (this.state.allItemsRendered) {
            this.props.onLoadComplete && this.props.onLoadComplete(this.state);
          } else {
            this.props.onLoadNext &&
              !silent &&
              this.props.onLoadNext(this.state);
          }
        }
      );
    }
  }
  saveState() {
    const { renderedItems, currentIndex, allItemsRendered } = this.state;
    this.props.exportState &&
      this.props.exportState({
        currentIndex,
        renderedItems,
        allItemsRendered
      });
  }
  render() {
    const { loadAll, loadNext, reset, saveState } = this;
    const { renderedItems, allItemsRendered } = this.state;
    return this.props.children({
      items: renderedItems,
      loadComplete: allItemsRendered,
      loadAll,
      loadNext,
      reset,
      saveState
    });
  }
}

export default Floodgate;
