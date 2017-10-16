import React from "react";
import jest from "jest";
import renderer from "react-test-renderer";
import Enzyme, { render, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import Floodgate from "../src/";
import { theOfficeData } from "../src/helpers";

// configure Enzyme
Enzyme.configure({ adapter: new Adapter() });

// Floodgate isntance
const FloodgateInstance = () => (
	<Floodgate data={theOfficeData} loadCount={3}>
		{({ data, loadNext, allLoaded }) => (
			<main>
				{data.map(({ name }) => <p key={name}>{name}</p>)}
				{(!allLoaded && <button onClick={loadNext}>Load More</button>) || (
					<p>All items loaded.</p>
				)}
			</main>
		)}
	</Floodgate>
);

// render Floodgate instances
const snapshotInstance = renderer.create(<FloodgateInstance />);
const enzymeStaticInstance = render(<FloodgateInstance />);
const enzymeShallowInstance = shallow(
	<Floodgate data={theOfficeData} loadCount={3}>
		{({ data, loadNext, allLoaded }) => (
			<main>
				{data.map(({ name }) => <p key={name}>{name}</p>)}
				{(!allLoaded && <button onClick={loadNext}>Load More</button>) || (
					<p>All items loaded.</p>
				)}
			</main>
		)}
	</Floodgate>
);

it("Should render the Floodgate component", () => {
	// set instance to JSON
	let tree = snapshotInstance.toJSON();

	// expect the JSON to match the snapshot output
	expect(tree).toMatchSnapshot();
});

it("Should render the Floodgate component with Enzyme", () => {
	expect(enzymeStaticInstance).not.toBe(null);
});

it("Should render 3 `p` children and one `button` child", () => {
	expect(enzymeShallowInstance.find("p").length).toBe(3);
	expect(enzymeShallowInstance.find("button").length).toBe(1);
});

it("Should render `p` children that have text matching [Jim Halpert,Pam Halpert,Ed Truck]", () => {
	const testTextValues = ["Jim Halpert", "Pam Halpert", "Ed Truck"];
	const renderedParagraphTextValues = [];
	enzymeShallowInstance.find("p").forEach(p => {
		renderedParagraphTextValues.push(p.text());
	});
	expect(renderedParagraphTextValues).toMatchObject(testTextValues);
});
