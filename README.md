<h1 align="center">react-floodgate 🌊</h1>
<p align="center">Configurable and flexible React component for incrementally displaying data.</p>

## The motivation

I have worked on a few client sites and side projects where serialized data is to be displayed concatenated to a given length, with the ability to load more entries after a respective user interaction. 

This can easily result in a complicated mixture of `Array.splice`-ing, potential data mutation, and overly complicated component methods.

Surely there can be a more elegant solution?

## This solution

Enter `react-floodgate`; like its namesake, this component allows for the precise control of rendering serialized data.

## The inspiration

This project was inspired by [Kent Dodd's](https://twitter.com/kentcdodd) [Downshift](https://github.com/paypal/downshift), [this talk](https://www.youtube.com/watch?v=hEGg-3pIHlE) by [Ryan Florence](https://twitter.com/ryanflorence), and [this blog post](http://mxstbr.blog/2017/02/react-children-deepdive/#function-as-a-child) by [Max Stoiber](https://twitter.com/mxstbr).

This README file modeled after the [Downshift README](https://github.com/paypal/downshift/blob/master/README.md).

## LICENSE

[MIT](blob/master/LICENSE)