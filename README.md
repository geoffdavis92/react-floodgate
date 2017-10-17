<h1 align="center">react-floodgate 🌊</h1>
<p align="center">Configurable and flexible React component for incrementally displaying data.</p>

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

## Usage

## Examples

- [Proof of Concept](https://codesandbox.io/embed/jlzxplj2z9)

## Contributors

## LICENSE

[MIT](blob/master/.github/LICENSE)