import { FloodgateProps, FloodgateState } from "./types";
import "regenerator-runtime/runtime";
import * as React from "react";
import * as PropTypes from "prop-types";
import { generator } from "./functions";

class Floodgate extends React.Component<FloodgateProps, FloodgateState> {
  // types
  data: Array<any>;
  queue: Generator;
  state: FloodgateState;

  // static props
  static propTypes = {
    children: PropTypes.func,
    data: PropTypes.array.isRequired,
    initial: PropTypes.number,
    increment: PropTypes.number,
    saveStateOnUnmount: PropTypes.bool,
    exportState: PropTypes.func
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
    this.queue = generator(data, increment, initial);
    this.data = data;
    this.state = {
      renderedItems: [],
      currentIndex: 0,
      allItemsRendered: false
    };
    this.loadAll = this.loadAll.bind(this);
    this.loadNext = this.loadNext.bind(this);
    this.reset = this.reset.bind(this);
    this.saveState = this.saveState.bind(this);
  }
  componentDidMount(): void {
    this.loadNext();
  }
  componentWillUnmount(): void {
    // Prevent unwanted cacheing by setting saveStateOnUnmount to false
    this.props.saveStateOnUnmount && this.saveState();
  }
  reset({ callback }: { callback?: Function } = {}): void {
    this.queue = generator(this.data, this.props.increment, this.props.initial);
    this.setState(
      prevState => ({
        renderedItems: [],
        allItemsRendered: false
      }),
      () => {
        this.loadNext({ callback });
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
  loadNext({ callback }: { callback?: Function } = {}): void {
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
            newRenderedData.length === this.data.length;
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
            this.props.onLoadNext && this.props.onLoadNext(this.state);
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
