import jest from "jest";
import { generateFilledArray, theOfficeData } from "helpers";

describe("generateFilledArray", () => {
	it("Should render an empty array", () => {
		expect(generateFilledArray()).toMatchObject([]);
	});

	it("Should render an array of 10 entries filled with that entry's index", () => {
		const arr = generateFilledArray(10);
		expect(arr.length).toBe(10);
		expect(arr[0]).toBe(0);
		expect(arr[arr.length - 1]).toBe(9);
	});
});

describe("theOfficeData", () => {
	it("Should have 7 entries", () => {
		expect(theOfficeData.length).toEqual(7);
	});

	it("Should start with Jim Halpert and end with Angela Schrute", () => {
		expect(theOfficeData[0].name).toMatch("Jim Halpert");
		expect(theOfficeData[theOfficeData.length - 1].name).toMatch(
			"Angela Schrute"
		);
	});

	it("Should have entries with keys that match this schema: {name,username,email,active}", () => {
		const schemaKeys = ["name", "username", "email", "active"];
		theOfficeData.forEach(entry =>
			expect(Object.keys(entry)).toMatchObject(schemaKeys)
		);
	});
});
