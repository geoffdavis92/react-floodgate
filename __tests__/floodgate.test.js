import rAFPolyfill from "./__test_utils__";
import React from "react";
import jest from "jest";
import Enzyme, { render, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import toJSON from "enzyme-to-json";

import Floodgate from "../dist/floodgate.esm";
import { loopSimulation, theOfficeData } from "../src/helpers";

// configure Enzyme
Enzyme.configure({ adapter: new Adapter() });

// Wrapper instance
class WrappedFloodgateInstance extends React.Component {
  constructor() {
    super();
    this.state = {
      showFloodgate: true,
      savedState: {
        data: theOfficeData,
        initial: 3,
        increment: 3
      }
    };
    this.cacheFloodgateState = this.cacheFloodgateState.bind(this);
  }
  cacheFloodgateState({ currentIndex: initial, ...restNewSavedState }) {
    this.setState(prevState => ({
      ...prevState,
      savedState: {
        ...prevState.savedState,
        ...restNewSavedState,
        initial
      }
    }));
  }
  render() {
    return (
      <div>
        <button id="toggleFloodgate">Toggle Floodgate</button>
        {this.state.showFloodgate && (
          <Floodgate
            data={this.state.savedState.data}
            initial={this.state.savedState.initial}
            increment={this.state.savedState.increment}
            exportState={this.cacheFloodgateState}
          >
            {({ items, loadNext, loadAll, reset, loadComplete }) => (
              <main>
                {items.map(({ name }) => <p key={name}>{name}</p>)}
                {(!loadComplete && (
                  <span>
                    <button id="load" onClick={loadNext}>
                      Load More
                    </button>
                    <button id="loadall" onClick={loadAll}>
                      Load All
                    </button>
                    <button id="reset" onClick={reset}>
                      Reset
                    </button>
                  </span>
                )) || (
                  <p>
                    All items loaded.<br />
                    <button id="reset" onClick={reset}>
                      Reset
                    </button>
                  </p>
                )}
              </main>
            )}
          </Floodgate>
        )}
      </div>
    );
  }
}

// Floodgate instance
const FloodgateInstance = ({ increment = 3, initial = 3 }) => (
  <Floodgate data={theOfficeData} {...{ initial, increment }}>
    {({ items, loadNext, loadAll, reset, loadComplete }) => (
      <main>
        {items.map(({ name }) => <p key={name}>{name}</p>)}
        {(!loadComplete && (
          <span>
            <button id="load" onClick={loadNext}>
              Load More
            </button>
            <button id="loadall" onClick={loadAll}>
              Load All
            </button>
            <button id="reset" onClick={reset}>
              Reset
            </button>
          </span>
        )) || (
          <p>
            All items loaded.<br />
            <button id="reset" onClick={reset}>
              Reset
            </button>
          </p>
        )}
      </main>
    )}
  </Floodgate>
);

describe("Floodgate", () => {
  // simple check to make sure Floodgate renders
  it("Should render the Floodgate component", () => {
    const fgi = render(<FloodgateInstance />);
    expect(toJSON(fgi)).toMatchSnapshot();
  });

  // test instance has correct children
  it("Should render 3 `p` children and 2 `button` child", () => {
    const fgi = mount(<FloodgateInstance />);
    expect(fgi.find("p").length).toBe(3);
    expect(fgi.find("button").length).toBe(3);
    expect(toJSON(fgi)).toMatchSnapshot();
  });

  // test instance's children's text values
  it("Should render `p` children that have text matching [Jim Halpert,Pam Halpert,Ed Truck]", () => {
    const testTextValues = ["Jim Halpert", "Pam Halpert", "Ed Truck"];
    const renderedParagraphTextValues = [];
    const fgi = mount(<FloodgateInstance />);
    fgi.find("p").forEach(p => {
      renderedParagraphTextValues.push(p.text());
    });
    expect(renderedParagraphTextValues).toMatchObject(testTextValues);
  });

  // test instance renders non-default lengths of initial
  it("Should render with 4 `p` children", () => {
    const fgi = mount(<FloodgateInstance initial={4} />);
    expect(fgi.find("p").length).toBe(4);
    expect(toJSON(fgi)).toMatchSnapshot();
  });

  // test instance loads new items
  it("Should render with 3 `p` children and load 3 `p` children `onClick()`", () => {
    const fgi = mount(<FloodgateInstance />);
    expect(fgi.find("p").length).toBe(3);
    expect(toJSON(fgi)).toMatchSnapshot();

    // simulate click
    fgi.find("button#load").simulate("click");
    expect(fgi.find("p").length).toBe(6);
    expect(toJSON(fgi)).toMatchSnapshot();
  });
  // test instance loads different lengths of increment
  it("Should render with 2 `p` children and load 1 `p` children `onClick()`", () => {
    const fgi = mount(<FloodgateInstance initial={2} increment={1} />);
    const loadButton = fgi.find("button#load");
    const p = (prop = false) => (prop ? fgi.find("p")[prop] : fgi.find("p"));
    expect(p("length")).toBe(2);
    expect(toJSON(fgi)).toMatchSnapshot();

    // simulate click
    loadButton.simulate("click");
    expect(p("length")).toBe(3);
    expect(toJSON(fgi)).toMatchSnapshot();

    loopSimulation(2, () => loadButton.simulate("click"));
    expect(p("length")).toBe(5);
    expect(fgi.find("button").length).toBe(3);
    expect(toJSON(fgi)).toMatchSnapshot();

    loopSimulation(3, () => loadButton.simulate("click"));
    expect(p("length")).toBe(8);
    expect(
      p()
        .last()
        .text()
    ).toMatch(theOfficeData[7].name);
    expect(fgi.find("button").length).toBe(3);
    expect(toJSON(fgi)).toMatchSnapshot();
  });
  it("Should render with 2 `p` children, load 1 `p` child, and reset state to original load", () => {
    const fgi = mount(<FloodgateInstance initial={2} increment={1} />);
    const loadButton = fgi.find("button#load");
    const resetButton = fgi.find("button#reset");
    const p = (prop = false) => (prop ? fgi.find("p")[prop] : fgi.find("p"));
    expect(p("length")).toBe(2);
    expect(
      p()
        .first()
        .text()
    ).toMatch("Jim Halpert");
    expect(
      p()
        .last()
        .text()
    ).toMatch("Pam Halpert");
    expect(toJSON(fgi)).toMatchSnapshot();

    loadButton.simulate("click");
    expect(p("length")).toBe(3);
    expect(toJSON(fgi)).toMatchSnapshot();

    resetButton.simulate("click");
    expect(p("length")).toBe(2);
    expect(
      p()
        .first()
        .text()
    ).toMatch("Jim Halpert");
    expect(
      p()
        .last()
        .text()
    ).toMatch("Pam Halpert");
    expect(fgi.find("button").length).toBe(3);
    expect(toJSON(fgi)).toMatchSnapshot();
  });

  it("Should render 1 `p` child, click to load all then reset", () => {
    const fgi = mount(<FloodgateInstance initial={1} increment={2} />);
    const loadButton = fgi.find("button#load");
    const loadAllButton = fgi.find("button#loadall");
    const resetButton = fgi.find("button#reset");
    const p = (prop = false) => (prop ? fgi.find("p")[prop] : fgi.find("p"));
    expect(p("length")).toBe(1);

    loadAllButton.simulate("click");
    expect(p("length")).toBe(theOfficeData.length + 1);
    expect(
      p()
        .first()
        .text()
    ).toMatch("Jim Halpert");
    expect(
      p()
        .at(theOfficeData.length - 1)
        .text()
    ).toMatch("Angela Schrute");
    expect(toJSON(fgi)).toMatchSnapshot();

    resetButton.simulate("click");
    expect(p("length")).toBe(1);
    expect(toJSON(fgi)).toMatchSnapshot();
  });

  it("Should render a wrapped Floodgate instance", () => {
    const wfgi = mount(<WrappedFloodgateInstance />);
    expect(toJSON(wfgi)).toMatchSnapshot();
  });
});
