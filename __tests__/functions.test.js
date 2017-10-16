import jest from "jest";
import { generator } from "functions";
import { generateFilledArray } from "helpers";

const mockData = generateFilledArray(10);

describe("generator", () => {
	it("Should return a generator object", () => {
		const gen = generator(mockData, 1, 1);
		expect(typeof gen).toBe("object");
		expect(Object.keys(gen)[0]).toBe("_invoke");
	});

	it("Should yield inital object that matches {value:[0],done:false}", () => {
		const gen = generator(mockData, 1, 1);
		expect(gen.next()).toMatchObject({ value: [0], done: false });
	});

	it("Should yield final object that matches {value:undefined,done:true}", () => {
		const gen = generator(mockData, 1, 1);
		for (let i = 0; i < mockData.length; i++) {
			gen.next();
		}
		expect(gen.next()).toMatchObject({ value: undefined, done: true });
	});
});
