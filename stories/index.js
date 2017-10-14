import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';
import { ErrorMessage } from 'functions'

const PreProps = {
	style: {
		backgroundColor: '#eee',
		color: '#3a3a3a',
		display: 'inline-block',
		fontSize: '18px',
		padding: '.66em'
	}
}

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);

storiesOf('Floodgate', module)
	.add('Numbers up to 100', () => <p>Coming soon!</p>)

storiesOf('Utilities/functions/ErrorMessage', module)
	.add('Generic message', () => <ErrorMessage text="Uncaught SyntaxError: {the error message}" {...PreProps} />)
	.add('No `text` provided, with children', () => <ErrorMessage {...PreProps}>Uncaught SyntaxError: {'{the error message}'}</ErrorMessage>)
	.add('No `text` provided, no children', () => <ErrorMessage />)
