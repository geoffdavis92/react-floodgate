import "./__test_utils__";
import React from "react";
import jest from "jest";
import Enzyme, { render, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import toJSON from "enzyme-to-json";

import Floodgate from "../dist/floodgate.esm";
import { loopSimulation, theOfficeData } from "../src/helpers";
import toJson from "enzyme-to-json";

// configure Enzyme
Enzyme.configure({ adapter: new Adapter() });

// Wrapper instance
const WrappedFloodgateInstance = fgProps => <WrappedFloodgate {...fgProps} />;

class WrappedFloodgate extends React.Component {
  static defaultProps = {
    floodgateSaveStateOnUnmount: true
  };
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
    this.spliceRandomEntries = this.spliceRandomEntries.bind(this);
    this.toggleFloodgate = this.toggleFloodgate.bind(this);
    this.cacheFloodgateState = this.cacheFloodgateState.bind(this);
  }
  spliceRandomEntries() {
    const data = [...this.state.savedState.data];
    const randomNumToSplice = Math.ceil(Math.random() * data.length - 1);
    const randomIndexToSplice = () => Math.floor(Math.random() * data.length);
    for (let i = 0; i < randomNumToSplice; i++) {
      data.splice(randomIndexToSplice(), 1);
    }
    this.setState(prevState => ({
      ...prevState,
      savedState: {
        ...prevState.savedState,
        data
      }
    }));
    return data.length;
  }
  toggleFloodgate() {
    this.setState(prevState => ({
      ...prevState,
      showFloodgate: !prevState.showFloodgate
    }));
  }
  cacheFloodgateState({ currentIndex: initial }) {
    this.setState(prevState => ({
      ...prevState,
      savedState: {
        ...prevState.savedState,
        initial
      }
    }));
  }
  render() {
    return (
      <div>
        <button id="toggleFloodgate" onClick={this.toggleFloodgate}>
          Toggle Floodgate
        </button>
        {this.state.showFloodgate && (
          <Floodgate
            data={this.state.savedState.data}
            initial={this.state.savedState.initial}
            increment={this.state.savedState.increment}
            saveStateOnUnmount={this.props.floodgateSaveStateOnUnmount}
            exportState={this.cacheFloodgateState}
          >
            {({ items, loadNext, loadAll, reset, loadComplete }) => (
              <main>
                {items.map(({ name }) => (
                  <p key={name}>{name}</p>
                ))}
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
                    All items loaded.
                    <br />
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

function FCCTest(props) {
  return <p>{props.chidlren}</p>;
}

// Floodgate instance
const FloodgateInstance = ({ increment = 3, initial = 3 }) => (
  <Floodgate data={theOfficeData} {...{ initial, increment }}>
    {({ items, loadNext, loadAll, reset, loadComplete }) => (
      <main>
        {items.map(({ name }) => (
          <p key={name}>{name}</p>
        ))}
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
            All items loaded.
            <br />
            <button id="reset" onClick={reset}>
              Reset
            </button>
          </p>
        )}
      </main>
    )}
  </Floodgate>
);

describe("A. Floodgate", () => {
  // simple check to make sure Floodgate renders
  it("1. Should render the Floodgate component", () => {
    const fgi = render(<FloodgateInstance />);
    expect(toJSON(fgi)).toMatchSnapshot();
  });

  // test instance has correct children
  it("2. Should render 3 `p` children and 2 `button` child", () => {
    const fgi = mount(<FloodgateInstance />);
    expect(fgi.find("p").length).toBe(3);
    expect(fgi.find("button").length).toBe(3);
    expect(toJSON(fgi)).toMatchSnapshot();
  });

  // test instance's children's text values
  it("3. Should render `p` children that have text matching [Jim Halpert,Pam Halpert,Ed Truck]", () => {
    const testTextValues = ["Jim Halpert", "Pam Halpert", "Ed Truck"];
    const renderedParagraphTextValues = [];
    const fgi = mount(<FloodgateInstance />);
    fgi.find("p").forEach(p => {
      renderedParagraphTextValues.push(p.text());
    });
    expect(renderedParagraphTextValues).toMatchObject(testTextValues);
  });

  // test instance renders non-default lengths of initial
  it("4. Should render with 4 `p` children", () => {
    const fgi = mount(<FloodgateInstance initial={4} />);
    expect(fgi.find("p").length).toBe(4);
    expect(toJSON(fgi)).toMatchSnapshot();
  });

  // test instance loads new items
  it("5. Should render with 3 `p` children and load 3 `p` children `onClick()`", () => {
    const fgi = mount(<FloodgateInstance />);
    expect(fgi.find("p").length).toBe(3);
    expect(toJSON(fgi)).toMatchSnapshot();

    // simulate click
    fgi.find("button#load").simulate("click");
    expect(fgi.find("p").length).toBe(6);
    expect(toJSON(fgi)).toMatchSnapshot();
  });
  // test instance loads different lengths of increment
  it("6. Should render with 2 `p` children and load 1 `p` children `onClick()`", () => {
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
  it("7. Should render with 2 `p` children, load 1 `p` child, and reset state to original load", () => {
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

  it("8. Should render 1 `p` child, click to load all then reset", () => {
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
});

describe("B. Wrapped Floodgate for saveState testing", () => {
  it("1. Should render a wrapped Floodgate instance", () => {
    const wfgi = mount(<WrappedFloodgate floodgateSaveStateOnUnmount />);
    expect(toJSON(wfgi)).toMatchSnapshot();
  });
  it("2. Should load 3 items, and save the currentIndex to the WrappedFloodgate state on cWU", () => {
    const wfgi = mount(<WrappedFloodgate floodgateSaveStateOnUnmount />);
    const fgi = wfgi.find(Floodgate).instance();
    const loadBtn = wfgi.find("button#load");
    const toggleBtn = wfgi.find("button#toggleFloodgate");

    expect(fgi.state.currentIndex).toEqual(3);
    expect(wfgi.find("p")).toHaveLength(3);

    loadBtn.simulate("click");

    expect(wfgi.find("p")).toHaveLength(6);
    expect(fgi.state.currentIndex).toEqual(6);

    toggleBtn.simulate("click");
    expect(wfgi.find("p")).toHaveLength(0);
    expect(wfgi.state().showFloodgate).toBe(false);
    expect(wfgi.state("savedState")).toMatchObject({
      data: theOfficeData,
      initial: 6,
      increment: 3
    });
  });
  it("2. Should load 3 items, click to load 3 more items, toggle Floodgate, and persist Floodgate state through mounting/re-mounting", () => {
    const wfgi = mount(<WrappedFloodgate floodgateSaveStateOnUnmount />);
    const getFgi = () => wfgi.find(Floodgate).instance();
    const loadBtn = wfgi.find("button#load");
    const toggleBtn = wfgi.find("button#toggleFloodgate");

    expect(getFgi().state.currentIndex).toEqual(3);
    expect(wfgi.find("p")).toHaveLength(3);

    loadBtn.simulate("click");

    expect(wfgi.find("p")).toHaveLength(6);
    expect(getFgi().state.currentIndex).toEqual(6);

    toggleBtn.simulate("click");
    // wfgi.setState({ showFloodgate: false })

    expect(wfgi.find("p")).toHaveLength(0);
    expect(wfgi.state().showFloodgate).toBe(false);

    expect(wfgi.state("savedState")).toMatchObject({
      data: theOfficeData,
      initial: 6,
      increment: 3
    });

    toggleBtn.simulate("click");
    expect(wfgi.state().showFloodgate).toBe(true);
    expect(getFgi().state.currentIndex).toBe(6);
  });
  it("3. Should load 3 items, toggle Floodgate, randomly splice data entries, then persist Floodgate index state through mounting/re-mounting", () => {
    const wfgi = mount(<WrappedFloodgate floodgateSaveStateOnUnmount />);
    const getFgi = () => wfgi.find(Floodgate).instance();
    const toggleBtn = wfgi.find("button#toggleFloodgate");

    expect(getFgi().state.currentIndex).toEqual(3);
    expect(wfgi.find("p")).toHaveLength(3);

    toggleBtn.simulate("click");

    expect(wfgi.find("p")).toHaveLength(0);
    expect(wfgi.state().showFloodgate).toBe(false);
    expect(wfgi.state("savedState")).toMatchObject({
      data: theOfficeData,
      initial: 3,
      increment: 3
    });

    wfgi.instance().spliceRandomEntries();

    toggleBtn.simulate("click");
    expect(wfgi.state().showFloodgate).toBe(true);
    expect(getFgi().state.renderedItems).toMatchObject(
      wfgi.state().savedState.data.slice(0, 3)
    );
  });
});

describe("C. Context-Wrapped Floodgate", () => {
  it("1. Should provide FloodgateInternals via Context API", () => {
    const fgi = mount(
      <Floodgate data={theOfficeData}>
        {({
          items,
          loadComplete,
          loadAll,
          loadNext,
          reset,
          saveState,
          FloodgateContext
        }) => (
          <FloodgateContext.Consumer>
            {ctxProps => <FCCTest {...{ ctxProps }} />}
          </FloodgateContext.Consumer>
        )}
      </Floodgate>
    );
    expect(toJSON(fgi)).toMatchSnapshot();
    expect(fgi.find(FCCTest).props().ctxProps).toMatchObject({
      items: fgi.instance().state.renderedItems,
      loadComplete: fgi.instance().state.allItemsRendered,
      loadAll: fgi.instance().loadAll,
      loadNext: fgi.instance().loadNext,
      reset: fgi.instance().reset,
      saveState: fgi.instance().saveState
    });
  });
  it("2. Should display 5 items, load 3 more from Context controls", () => {
    const fgi = mount(
      <Floodgate data={theOfficeData} increment={3}>
        {({ items, FloodgateContext }) => (
          <div>
            <ul>
              {items.map(item => (
                <li key={item.username}>{item.name}</li>
              ))}
            </ul>
            <section id="controls">
              <FloodgateContext.Consumer>
                {({ loadNext, loadAll }) => (
                  <React.Fragment>
                    <button onClick={loadNext} id="load-next">
                      Load Next
                    </button>
                    <button onClick={loadAll} id="load-all">
                      Load All
                    </button>
                  </React.Fragment>
                )}
              </FloodgateContext.Consumer>
            </section>
          </div>
        )}
      </Floodgate>
    );
    expect(toJSON(fgi)).toMatchSnapshot();
    expect(fgi.find("li")).toHaveLength(5);

    fgi.find("#load-next").simulate("click");

    expect(fgi.find("li")).toHaveLength(8);

    fgi.find("#load-all").simulate("click");

    expect(fgi.find("li")).toHaveLength(theOfficeData.length);
  });
});
