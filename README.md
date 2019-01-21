<h1 align="center">react-floodgate 🌊</h1>
<p align="center">Configurable and flexible "load more" component for React</p>

---

<p align="center">
  <a href="https://www.npmjs.com/package/react-floodgate"><img src="https://img.shields.io/npm/v/react-floodgate.svg?style=flat-square" alt="npm version"> </a>
  <a><img src="https://img.shields.io/github/release/geoffdavis92/react-floodgate.svg?style=flat-square" alt="GitHub release"></a>
  <a href="https://www.npmjs.com/package/react-floodgate"><img src="https://img.shields.io/npm/dt/react-floodgate.svg?style=flat-square" alt="npm downloads"> </a>
  <a href="https://github.com/geoffdavis92/react-floodgate/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/react-floodgate.svg?style=flat-square" alt="npm license"></a>
</p>

## The motivation

I have worked on a few client sites and side projects where serialized data is to be displayed concatenated to a given length, with the ability to load more entries after a respective user interaction. 

This can easily result in a complicated mixture of `Array.splice`-ing, potential data mutation, and overly complicated component methods.

Surely there can be a more elegant solution?

## This solution

Enter `react-floodgate`; like its namesake, this component allows for the precise and safe control of resources. Using an [ES2015 generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) as the control mechanism and the [function-as-child](http://mxstbr.blog/2017/02/react-children-deepdive/#function-as-a-child) pattern for flexible and developer-controlled rendering, one can load serialized data into `react-floodgate`, render their desired components, and safely and programmatically iterate through the data as needed.

## The inspiration

This project was inspired by [Kent Dodd's](https://twitter.com/kentcdodd) [Downshift](https://github.com/paypal/downshift), [this talk](https://www.youtube.com/watch?v=hEGg-3pIHlE) by [Ryan Florence](https://twitter.com/ryanflorence), and [this blog post](http://mxstbr.blog/2017/02/react-children-deepdive/#function-as-a-child) by [Max Stoiber](https://twitter.com/mxstbr).

This README file modeled after the [Downshift README](https://github.com/paypal/downshift/blob/master/README.md).

## Installation

You can install the package via [**`npm`**](https://npmjs.org/) or [**`yarn`**](https://yarnpkg.com/):

`$ yarn add react-floodgate`

or

`$ npm i --save react-floodgate`

## Usage

This is a basic example of Floodgate, showcasing an uncontrolled implementation:

```javascript
const BasicExample = props => (
  <Floodgate
    data={[4, 8, 15, 16, 23, 42]}
    initial={3}
    increment={1}
    saveStateOnUnMount={false}
    onLoadNext={(stateAtLoadNext) => console.log(stateAtLoadNext)}
    onLoadAll={(stateAtLoadAll) => console.log(stateAtLoadAll)}
    onReset={(stateAtReset) => console.log(stateAtReset)}>
    {({ items, loadNext, loadAll, reset, loadComplete }) => (
      <div>
        <ul>
          {items.map(number => <li key={number}>{number}</li>)}
        </ul>
        <button onClick={loadNext} disabled={loadComplete}>Load More</button>
        <button onClick={loadAll} disabled={loadComplete}>Load All</button>
        {loadComplete ? <button onClick={reset}>Reset</button> : null}
      </div>
    )}
  </Floodgate>
)
```

Uncontrolled Floodgate components are entirely static, and their state will be complete lost/reset when unmounting and re-mounting. In order to ensure internal state is saved during these scenarios, and in order to create dynamic Floodgate components, Floodgate has to be controlled.

#### Controlled Floodgate

The following is a basic example of a controlled Floodgate implementation; this component has a location to save Floodgate state, and uses those values as Floodgate's props. In order to make sure this 

```javascript
class FloodgateController extends React.Component {
  constructor(props) {
    super();
    this.state = {
      showFloodgate: true,
      FGState: {
        data: props.data,
        initial: 3,
        increment: 3
      }
    };
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState(prevState => ({
      showFloodgate: !prevState.showFloodgate
    }));
  }
  render() {
    return (
      <div>
        <button onClick={this.toggle}>Toggle Floodgate</button>
        {this.state.showFloodgate ? <Floodgate 
          data={this.state.FGState.data} 
          increment={this.state.FGState.increment} 
          initial={this.state.FGState.initial}
          saveStateOnUnmount={true}
          exportState={newFGState => this.setState(prevState => ({
            FGState: {
              ...prevState.FGState,
              ...newFGState,
              initial: newFGState.currentIndex
            }
          }))}>
          {({ items, loadNext, loadAll, reset, loadComplete }) => (
            <div>
              <ul>
                {items.map(number => <li key={number}>{number}</li>)}
              </ul>
              <button onClick={loadNext} disabled={loadComplete}>Load More</button>
              <button onClick={loadAll} disabled={loadComplete}>Load All</button>
              {loadComplete ? <button onClick={reset}>Reset</button> : null}
            </div>
          )}
        </Floodgate> : null }
      </div>
    )
  }
}

const ControlledFGInstance = <FloodgateController data={[4, 8, 15, 16, 23, 42]} />
```

This strategy can also be employed to fetch data to pass into Floodgate's `data` prop, or alongside some settings dialogue to allow end-users control over how this feed behaves.

### API

#### `Floodgate` props

| name                 | type               | default                                                       | description                                                                               |
|----------------------|--------------------|---------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| `data`               | Array\<any>|`null` | The array of items to be processed by `Floodgate`             |                                                                                           |
| `initial`            | Integer|`5`        | How many items are initially available in the render function |                                                                                           |
| `increment`          | Integer|`5`        | How many items are added when calling `loadNext`              |                                                                                           |
| `saveStateOnUnmount` | Boolean            | *(optional)*                                                  | Toggle if `exportState` will be called during `componentWillUnmount`                      |
| `exportState`        | Function           | *(optional)*                                                  | Function to pass up Floodgate's internal state when `componentWillUnmount` fires          |
| `onLoadNext`         | Function           | *(optional)*                                                  | Callback function to run after `loadNext`; runs after inline `callback` argument prop     |
| `onLoadComplete`     | Function           | *(optional)*                                                  | Callback function to run after `loadComplete`; runs after inline `callback` argument prop |
| `onReset`            | Function           | *(optional)*                                                  | Callback function to run after `reset`; runs after inline `callback` argument prop        |

#### `render` function

**Note:** the `render` function uses a single object argument to expose the following values/functions. Use the ES2015 destructuring syntax to get the most of this pattern. (see the [Usage](#usage) and [Examples](#examples) sections on how to do this)

| name           | type               | default                                       | parameters                                                                                                                                                                          | description |
|----------------|--------------------|-----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| `items`        | Array\<any>|`null` | n/a                                           | State: the subset of items determined by the `intitial` and `increment` props                                                                                                       |             |
| `loadComplete` | Boolean|`false`    | n/a                                           | State: describes if all items have been processed by the `Floodgate` instance                                                                                                       |             |
| `loadAll`      | Function           | n/a|`{callback?: Function}`                   | Action: loads all `items`; `callback` prop in argument fires immediately after invocation                                                                                           |             |
| `loadNext`     | Function           | n/a|`{silent?: boolean, callback?: Function}` | Action: loads the next set of items; `callback` prop in argument fires immediately after invocation, `silent` determinse if `onLoadNext` callback is fired after calling `loadNext` |             |
| `reset`        | Function           | n/a|`{callback?: Function}`                   | Action: resets the state of the `Floodgate` instance to the initial state; `callback` prop in argument fires immediately after invocation                                           |             |
| `saveState`    | Function           | n/a|`null`                                    | Action: calls the `exportState` prop callback                                                                                                                                       |             |

## Examples

- [Proof of Concept](https://codesandbox.io/embed/jlzxplj2z9)

## Contributors

**[Request a feature](https://github.com/geoffdavis92/react-floodgate/issues/new?template=feature-request.md&projects=geoffdavis92/react-floodgate/1&labels=feature)**

**[Request maintenance](https://github.com/geoffdavis92/react-floodgate/issues/new?template=maintenance.md&projects=geoffdavis92/react-floodgate/1&labels=dx)**

**[Request a documentation update](https://github.com/geoffdavis92/react-floodgate/issues/new?template=documentation.md&projects=geoffdavis92/react-floodgate/3&labels=github,dx)**

## LICENSE

[MIT](blob/master/.github/LICENSE)
