# Contributing to react-floodgate

## Setup

1. Fork and clone the repo
2. Run `yarn` to install dependencies
3. Create a branch for your PR

### Creating a branch

When creating a branch, please adhere to the following branch name specification:

`{username}/{classification}/{issue}/{short_description}`

Where:

- `{username}`: your Github username
- `{classification}`: One of the following:
	- `bug`: fixing a bug
	- `feature`: adding a new feature
	- `meta`: adding/updating any files pertaining to Github, the package.json, or the README
- `{issue}` (optional): if applicable, the related issue # that this PR solves 
- `{short_description}`: camelCase descriptive PR title; e.g. a PR that fixes a typo in the README may have a description like `fixReadmeTypo`


### Yarn scripts

Any `yarn`/`npm` scripts run locally-installed CLI binaries, so there is no worry about making sure your global binaries of the tools used are up to date. Note, this project primarily uses `yarn`, which is recommended, so ensuring Yarn is properly installed and up-to-date is important in the development process.


Note: this file is based off of the [Downshift CONTRIBUTING file](https://github.com/paypal/downshift/blob/master/CONTRIBUTING.md).