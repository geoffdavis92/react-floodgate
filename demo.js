import React from "react";
import ReactDOM from "react-dom";
import Floodgate from "floodgate";

const errorNotification = ({ errorMessage }) => (
	<p
		style={{
			backgroundColor: "#ecc",
			color: "#e33",
			fontFamily: '"Roboto",sans-serif',
			lineHeight: 1,
			padding: "1em"
		}}
	>
		{errorMessage}
	</p>
);

ReactDOM.render(
	<Floodgate
		datasource={[{ title: "first" }, { title: "second" }]}
		errorDisplay={errorNotification}
	>
		{({ data, floodgateDidCatch }) =>
			data.map(({ title }) => <p key={`${title}-${Date.now()}`}>{title}</p>)}
	</Floodgate>,
	document.getElementById("root")
);
