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

### Controlled Floodgate

The following is a basic example of a controlled Floodgate implementation; this component has a location to save Floodgate state, and uses those values as Floodgate's props. In order to make sure this component does save Floodgate's state, the `exportState` prop will have to have a function passed to it that saves desired Floodgate state properties to the controlling component's state.

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
    );
  }
}

const ControlledFGInstance = <FloodgateController data={[4, 8, 15, 16, 23, 42]} />;
```

This strategy can also be employed to fetch data to pass into Floodgate's `data` prop, or alongside some settings dialogue to allow end-users control over how this feed behaves.

<!-- 
### Floodgate in TypeScript

When using TypeScript, Floodgate takes a type parameter that will be applied as the `data` prop's array type; the reasoning for this is so that every element in the `data` prop array is consistent and uniform. 

This helps prevent bugs from being introduced when accessing the `items` property inside the render prop function. 

For example, using the previous example in TypeScript, you would provide the parameter type as `number` (in these examples, the type parameter would be passed down to the `Floodgate` instance from `FloodgateController`):

```typescript
const ControlledFGInstance = <FloodgateController<number> data={[4, 8, 15, 16, 23, 42]} />;
```

This can take any type you provide, but TypeScript does expect *all* elements in the array to be constrained to that type:

```typescript
type AlphaNumeric = number | string;

const ControlledFGInstance = <FloodgateController<AlphaNumeric> data={[4, 'eight', 15, 'sixteen', 23, 'forty-two']} />;
```

Elements with mismatched types to the provided type parameter will throw an error:

```typescript
const ControlledFGInstance = <FloodgateController<{ first: string, last: string }> data={[{ first: 'Jane', last: 'Doe' }, { first: 'John' }]} />;
// [ts] Property 'last' is missing in type '{ first: string; }' but required in type '{ first: string; last: string; }'
```

If a component requires the need to accept any type to the `data` prop array, you can pass `any` as the type parameter:

```typescript
const ControlledFGInstance = <FloodgateController<any> data={[4, 'eight', 15, 'sixteen', 23, { number: 42 }]} />;
```

-->

## API

### `Floodgate` props

| name                 | type               | default                                                       | description                                                                               |
|----------------------|--------------------|---------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| `data`               | Array\<any>|`null` | The array of items to be processed by `Floodgate`             |                                                                                           |
| `initial`            | number |`5`        | How many items are initially available in the render function |                                                                                           |
| `increment`          | number |`5`        | How many items are added when calling `loadNext`              |                                                                                           |
| `saveStateOnUnmount` | boolean            | *(optional)*                                                  | Toggle if `exportState` will be called during `componentWillUnmount`                      |
| `exportState`        | Function           | *(optional)*                                                  | Function to pass up Floodgate's internal state when `componentWillUnmount` fires          |
| `onLoadNext`         | Function           | *(optional)*                                                  | Callback function to run after `loadNext`; runs after inline `callback` argument prop     |
| `onLoadComplete`     | Function           | *(optional)*                                                  | Callback function to run after `loadComplete`; runs after inline `callback` argument prop |
| `onReset`            | Function           | *(optional)*                                                  | Callback function to run after `reset`; runs after inline `callback` argument prop        |

#### `data`

*Type:* `Array<any> = null`

The array of items to be processed by the `Floodgate` internal queue. 

This array will accept any type of element, but it is recommended to either provide elements with a uniform type, or normalize elements before they get consumed by `Floodgate`. This best practice is to safeguard against the possibility of performing side effects on an element in Floodgate's `render` function that are incompatible with a given element's type; e.g. an element with a type of `{ name: 'Jane Doe', email: 'jane@doe.com' }`, but in the `render` function performing `exampleItem.toUpperCase()`.

<!-- mention TypeScript considerations here, link to #floodgate-in-typescript section -->

#### `initial`

*Type:* `number = 5`

The length of the first set of items that will be rendered from Floodgate. <!-- If `initial` is negative or zero, this will default to the default value of 5 -->

<!-- TODO: 
  • change >= to > on line 17 of functions.tsx to catch initial values of zero
  • update loadNext to allow initial values of zero, so allItemsRendered does not get set
    to true when calling the first zero-length set
-->

#### `increment`

*Type:* `number = 5`

The length of subsequent sets of items when calling `loadNext`. <!-- If `increment` is negative or zero, this will default to the default value of 5 -->

#### `saveStateOnUnmount`

*Type:* `boolean = false`

Flag to configure the calling of `props.exportState` when Floodgate triggers the `componentWillUnmount` component lifecycle event.

#### `exportState`       

*Arguments:* `{ currentIndex: number, renderedItems: any[], allItemsRendered: boolean }`

Prop callback function that executes when Floodgate triggers the `componentWillUnmount` component lifecycle event. It provides a single object argument that represents a set of internal state properties that can be exported to a different component; this is best used on instances that will be toggled (un)mounted, such as in tabs or a single page application.

`currentIndex` is a number representing the index of the last item passed through the queue to `state.renderedItems`.

`renderedItems` is an array of all items that have been passed through the queue from `props.data`.

`allItemsRendered` a boolean describing if all items have been processed by the queue.

#### `onLoadNext`        

*Arguments:* [`Floodgate.state`](https://github.com/geoffdavis92/react-floodgate/blob/8f9ffe83aaae987246d12533671a335032e9f6dd/src/types.d.ts#L33-L43)

Callback property that fires after the `loadNext` method is called. This is executed after `loadNext`'s `callback` method is executed.

#### `onLoadComplete`    

*Arguments:* [`Floodgate.state`](https://github.com/geoffdavis92/react-floodgate/blob/8f9ffe83aaae987246d12533671a335032e9f6dd/src/types.d.ts#L33-L43)

Callback property that fires after the `loadComplete` method is called. This is executed after `loadComplete`'s `callback` method is executed.

#### `onReset`           

*Arguments:* [`Floodgate.state`](https://github.com/geoffdavis92/react-floodgate/blob/8f9ffe83aaae987246d12533671a335032e9f6dd/src/types.d.ts#L33-L43)

Callback property that fires after the `reset` method is called. This is executed after `reset`'s `callback` method is executed.


### `render` function

**Note:** the `render` function uses a single object argument to expose the following values/functions. Use the ES2015 destructuring syntax to get the most of this pattern. (see the [Usage](#usage) and [Examples](#examples) sections on how to do this)

| name           | type               | default                                       | parameters                                                                                                                                                                          | description |
|----------------|--------------------|-----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| `items`        | Array\<any>|`null` | n/a                                           | State: the subset of items determined by the `intitial` and `increment` props                                                                                                       |             |
| `loadComplete` | boolean|`false`    | n/a                                           | State: describes if all items have been processed by the `Floodgate` instance                                                                                                       |             |
| `loadAll`      | Function           | n/a|`{callback?: Function}`                   | Action: loads all `items`; `callback` prop in argument fires immediately after invocation                                                                                           |             |
| `loadNext`     | Function           | n/a|`{silent?: boolean, callback?: Function}` | Action: loads the next set of items; `callback` prop in argument fires immediately after invocation, `silent` determinse if `onLoadNext` callback is fired after calling `loadNext` |             |
| `reset`        | Function           | n/a|`{callback?: Function}`                   | Action: resets the state of the `Floodgate` instance to the initial state; `callback` prop in argument fires immediately after invocation                                           |             |
| `saveState`    | Function           | n/a|`null`                                    | Action: calls the `exportState` prop callback                                                                                                                                       |             |
#### `items`

*Type:* `Array<any> = null`

Subset of all elements in the `props.data` array, based on the values of the `initial` and `increment` props.

Elements of `items` do not have to be rendered at all; for example, `props.data` could be comprised of string manipulation methods, and each member of `items` would then call the respective method on a static value.

#### `loadComplete`

*Type:* `boolean = false`

Describes if all elements of the `props.data` array have been processed by the internal queue and passed to `items`.

#### `loadAll`

*Arguments:* `{ suppressWarning?: boolean, callback?: Function } = { suppressWarning: false }`

Appends all elements currently in the `data` prop to the `items` array. When called, the `render` argument's `loadComplete` property will be set to `true`, and the `currentIndex` state property will be updated to the length of `Floodgate.props.data`.

The `supressWarning` argument property determines if a warning should be emitted when all items are rendered`.

The `callback` argument method will be called after `loadAll` has set the component's state; it will have access to this updated Floodgate `state`.

#### `loadNext`

*Arguments:* `{ silent?: boolean, callback?: Function } = { silent: false }`

Appends the next elements in the `data` prop to the `items` array, length equal to the `increment` prop. When called, will update the `currentIndex` state property; if this increment is equal to or exceeds the length of `data`, the `render` argument's `loadComplete` property will be set to `true`.

The `silent` argument property determines if this call triggers the `onLoadNext` prop callback.

The `callback` argument method will be called after `loadNext` has set the component's state; it will have access to this updated Floodgate `state`.

#### `reset`

*Arguments:* `{ initial?: number, callback?: Function } = {}`

The `initial` argument property provides the ability to pass in a custom `initial` value to the next rendering after `reset` is called; this is most useful when writing a [controlled Floodgate component](#controlled-floodgate) and the `exportState` prop is used. For more information on why this is needed, see [pull request #42](https://github.com/geoffdavis92/react-floodgate/pull/42).

The `callback` argument method will be called after `reset` has set the component's state; it will have access to this updated Floodgate `state`.

#### `saveState`

*Arguments:* `n/a`

Calls the `exportState` prop callback. Any logic to manipulate and/or save Floodgate's state to a parent component should happen in that prop; since the `exportState` arguments are not configurable, there are no arguments for `saveState`.

## Examples

- [Proof of Concept](https://codesandbox.io/embed/jlzxplj2z9)

## Contributors

**[Request a feature](https://github.com/geoffdavis92/react-floodgate/issues/new?template=feature-request.md&projects=geoffdavis92/react-floodgate/1&labels=feature)**

**[Request maintenance](https://github.com/geoffdavis92/react-floodgate/issues/new?template=maintenance.md&projects=geoffdavis92/react-floodgate/1&labels=dx)**

**[Request a documentation update](https://github.com/geoffdavis92/react-floodgate/issues/new?template=documentation.md&projects=geoffdavis92/react-floodgate/3&labels=github,dx)**

## LICENSE

[MIT](blob/master/.github/LICENSE)
