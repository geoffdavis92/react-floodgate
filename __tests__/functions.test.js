import jest from "jest";
import { generator } from "functions";
import { generateFilledArray } from "helpers";

const mockData = generateFilledArray(10);

describe("generator", () => {
  it("Should return a generator object", () => {
    const gen = generator(mockData, 1, 1);
    expect(typeof gen).toBe("object");
    //babel-polyfill expect(Object.keys(gen)[0]).toBe("_invoke");
  });

  it("Should yield inital object that matches {value:[0],done:false}", () => {
    const gen = generator(mockData, 1, 1);
    expect(gen.next()).toMatchObject({ value: [0], done: false });
  });

  it("Should yield an object with a value of [0,1,2] after 3 next() calls", () => {
    const gen = generator(mockData, 1, 1);
    const sum = [];
    sum.push(gen.next().value[0]);
    expect(sum).toMatchObject([0]);
    sum.push(gen.next().value[0]);
    expect(sum).toMatchObject([0, 1]);
    sum.push(gen.next().value[0]);
    expect(sum).toMatchObject([0, 1, 2]);
  });

  it("Should yield 3 items per next() calls, starting with 1", () => {
    const gen = generator(mockData, 3, 1);
    const sum = [];

    const { value: it1Value } = gen.next();
    sum.push(...it1Value);
    expect(it1Value.length).toBe(1);
    expect(sum).toMatchObject([0]);

    const { value: it2Value } = gen.next();
    sum.push(...it2Value);
    expect(it2Value.length).toBe(3);
    expect(sum).toMatchObject([0, 1, 2, 3]);
  });

  it("Should yield 2 items per next() calls, starting with 2", () => {
    const gen = generator(mockData, 2, 2);
    const sum = [];
    let { value: it1Value } = gen.next();

    sum.push(...it1Value);
    expect(it1Value.length).toEqual(2);
    expect(sum).toMatchObject([0, 1]);

    let { value: it2Value } = gen.next();

    sum.push(...it2Value);
    expect(it2Value.length).toEqual(2);
    expect(sum).toMatchObject([0, 1, 2, 3]);
  });

  it("Should yield final object that matches {value:undefined,done:true}", () => {
    const gen = generator(mockData, 1, 1);
    for (let i = 0; i < mockData.length; i++) {
      gen.next();
    }
    expect(gen.next()).toMatchObject({ value: undefined, done: true });
  });
});
