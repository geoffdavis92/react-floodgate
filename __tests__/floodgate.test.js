import "./__test_utils__";
import React from "react";
import jest from "jest";
import jest_mock from "jest-mock";
import Enzyme, { render, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import toJSON from "enzyme-to-json";

import Floodgate, { FloodgateContext } from "../dist/floodgate.esm";
import { loopSimulation, theOfficeData } from "../src/helpers";

// configure Enzyme
Enzyme.configure({ adapter: new Adapter() });

// Wrapped instance for unMount
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
    this.setState(prevState => {
      return {
        ...prevState,
        savedState: {
          ...prevState.savedState,
          initial
        }
      };
    });
  }
  render() {
    const ResetButton = ({ reset }) => (
      <button id="reset" onClick={() => reset({ initial: 3 })}>
        Reset
      </button>
    );
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
                    <ResetButton reset={reset} />
                  </span>
                )) || (
                  <div>
                    All items loaded.
                    <br />
                    <ResetButton reset={reset} />
                  </div>
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

// Wrapped instance for prop updates
class ControlledFloodgate extends React.Component {
  constructor() {
    super();
    this.state = {
      fetchComplete: false,
      fetchActive: false,
      data: [0, 1, 2]
    };
    this.saveState = this.saveState.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.addDataToState = this.addDataToState.bind(this);
  }
  saveState(FloodgateState) {
    this.setState(prevState => ({
      cachedFloodgateState: FloodgateState
    }));
  }
  addDataToState() {
    this.setState(prevState => {
      return {
        fetchActive: false,
        fetchComplete: false,
        data: [...prevState.data, prevState.data.length]
      };
    });
  }
  handleClick() {
    this.setState(
      () => ({ fetchActive: true }),
      () => {
        this.addDataToState();
      }
    );
  }
  render() {
    return (
      <div>
        <Floodgate data={this.state.data} initial={3} increment={1}>
          {({ items, loadNext, loadComplete }) => (
            <div>
              <ul>
                {items.map(n => (
                  <li key={n.toString()}>{n}</li>
                ))}
              </ul>
              <button id="loadNext" onClick={loadNext} disabled={loadComplete}>
                Load More
              </button>
              <button
                id="fetch"
                onClick={this.handleClick}
                disabled={this.state.fetchActive || this.state.fetchComplete}
              >
                fetch more
              </button>
            </div>
          )}
        </Floodgate>
      </div>
    );
  }
}

// Floodgate instance
const FloodgateInstance = ({
  increment = 3,
  initial = 3,
  silentLoadNext = false,
  ...restProps
}) => (
  <Floodgate data={theOfficeData} {...{ initial, increment }} {...restProps}>
    {({ items, loadNext, loadAll, reset, loadComplete }) => (
      <main>
        {items.map(({ name }) => (
          <p key={name} className="officeMember">
            {name}
          </p>
        ))}
        {(!loadComplete && (
          <span>
            <button
              id="load"
              onClick={() => loadNext({ silent: silentLoadNext })}
            >
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
  it("2. Should render 3 `p` children and 3 `button` child", () => {
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
    const loadButton = () => fgi.find("button#load");
    const loadAllButton = () => fgi.find("button#loadall");
    const resetButton = () => fgi.find("button#reset");
    const p = (prop = false) => (prop ? fgi.find("p")[prop] : fgi.find("p"));
    expect(p("length")).toBe(1);

    loadAllButton().simulate("click");
    expect(p("length")).toBe(theOfficeData.length + 1);
    expect(
      p()
        .first()
        .text()
    ).toMatch("Jim Halpert");
    expect(
      p()
        .at(fgi.find(Floodgate).instance().props.data.length - 1)
        .text()
    ).toMatch("Angela Schrute");
    expect(toJSON(fgi)).toMatchSnapshot();
    expect(loadButton()).toHaveLength(0);
    expect(loadAllButton()).toHaveLength(0);
    expect(resetButton()).toHaveLength(1);
    expect(fgi.find(Floodgate).instance().state.allItemsRendered).toBe(true);
    expect(fgi.find(Floodgate).instance().state.currentIndex).toBe(
      fgi.find(Floodgate).instance().props.data.length
    );

    expect(toJSON(fgi)).toMatchSnapshot();

    resetButton().simulate("click");
    expect(p("length")).toBe(1);
    expect(toJSON(fgi)).toMatchSnapshot();
  });

  it("9. Should fire props.onLoadNext during loadNext", () => {
    const mockedLoadNextCallback = jest_mock.fn(state => {
      expect(state).toMatchObject(fgi.find(Floodgate).instance().state);
    });
    const fgi = mount(
      <FloodgateInstance
        initial={1}
        increment={2}
        onLoadNext={mockedLoadNextCallback}
      />
    );
    const loadButton = () => fgi.find("button#load");

    loadButton().simulate("click");
    expect(mockedLoadNextCallback.mock.calls.length).toEqual(1);
  });
  it("10. Should fire props.onLoadComplete during loadAll", () => {
    const mockedLoadCompleteCallback = jest_mock.fn(state => {
      expect(state).toMatchObject(fgi.find(Floodgate).instance().state);
    });
    const fgi = mount(
      <FloodgateInstance
        initial={3}
        increment={3}
        onLoadComplete={mockedLoadCompleteCallback}
      />
    );
    const loadAllButton = () => fgi.find("button#loadall");

    loadAllButton().simulate("click");
    expect(fgi.find("p.officeMember").length).toEqual(theOfficeData.length);
    expect(mockedLoadCompleteCallback.mock.calls.length).toEqual(1);
  });

  it("11. Should fire only props.onLoadComplete after loadNext to completion", () => {
    const mockedLoadNextCallback = jest_mock.fn(state => {
      expect(state).toMatchObject(fgi.find(Floodgate).instance().state);
    });
    const mockedLoadCompleteCallback = jest_mock.fn(state => {
      expect(state).toMatchObject(fgi.find(Floodgate).instance().state);
    });
    const fgi = mount(
      <FloodgateInstance
        initial={theOfficeData.length - 4}
        increment={3}
        onLoadNext={mockedLoadNextCallback}
        onLoadComplete={mockedLoadCompleteCallback}
      />
    );
    const loadButton = () => fgi.find("button#load");

    loadButton().simulate("click");
    expect(mockedLoadNextCallback.mock.calls.length).toEqual(1);
    loadButton().simulate("click");
    expect(mockedLoadNextCallback.mock.calls.length).toEqual(1);
    expect(mockedLoadCompleteCallback.mock.calls.length).toEqual(1);
  });

  it("12. Should fire props.onReset after reset", () => {
    const mockedLoadNextCallback = jest_mock.fn(state => {
      expect(state).toMatchObject(fgi.find(Floodgate).instance().state);
    });
    const mockedResetCallback = jest_mock.fn(state => {
      expect(state).toMatchObject(fgi.find(Floodgate).instance().state);
    });
    const fgi = mount(
      <FloodgateInstance
        initial={1}
        increment={3}
        onLoadNext={mockedLoadNextCallback}
        onReset={mockedResetCallback}
      />
    );
    const loadButton = () => fgi.find("button#load");
    const resetButton = () => fgi.find("button#reset");

    loadButton().simulate("click");
    expect(fgi.find("p.officeMember").length).toEqual(4);
    expect(mockedLoadNextCallback.mock.calls.length).toEqual(1);
    resetButton().simulate("click");
    expect(fgi.find("p.officeMember").length).toEqual(1);
    expect(mockedResetCallback.mock.calls.length).toEqual(1);
  });
  it("13. Should fire loadNext in silent mode", () => {
    const mockedLoadNextCallback = jest_mock.fn(state => {
      expect(state).toMatchObject(fgi.find(Floodgate).instance().state);
    });
    const fgi = mount(
      <FloodgateInstance
        initial={1}
        increment={3}
        silentLoadNext={true}
        onLoadNext={mockedLoadNextCallback}
      />
    );
    const loadButton = () => fgi.find("button#load");

    loadButton().simulate("click");
    expect(mockedLoadNextCallback.mock.calls.length).toEqual(0);
  });
  // it("14. Should give propType error when non-function value passed to event callback props", () => {
  //   const fgi = mount(
  //     <FloodgateInstance
  //       onLoadNext={{ shouldError: true }}
  //       onLoadComplete={{ shouldError: true }}
  //       onReset={{ shouldError: true }}
  //     />
  //   );
  //   const loadButton = fgi.find("button#load");
  //   const loadAllButton = () => fgi.find("button#loadall");
  //   const resetButton = () => fgi.find("button#reset");

  //   expect(() => loadButton.simulate("click")).toThrowError();
  //   expect(() => loadAllButton.simulate("click")).toThrowError();
  //   expect(() => resetButton.simulate("click")).toThrowError();
  // });
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
  it("4. Should load 3 items, click to load all items, toggle Floodgate, reset should update state based on newInitial argument prop", () => {
    const wfgi = mount(<WrappedFloodgate floodgateSaveStateOnUnmount />);
    const getFgi = () => wfgi.find(Floodgate).instance();
    const getResetBtn = () => wfgi.find("button#reset");
    const loadAllBtn = wfgi.find("button#loadall");
    const toggleBtn = wfgi.find("button#toggleFloodgate");

    expect(getFgi().state.currentIndex).toEqual(3);
    expect(wfgi.find("p")).toHaveLength(3);

    loadAllBtn.simulate("click");

    expect(wfgi.find("p")).toHaveLength(getFgi().props.data.length);
    expect(getFgi().state.allItemsRendered).toBe(true);

    toggleBtn.simulate("click");
    wfgi.setState({ showFloodgate: false });

    expect(wfgi.find("p")).toHaveLength(0);
    expect(wfgi.state().showFloodgate).toBe(false);
    expect(wfgi.state("savedState")).toMatchObject({
      data: theOfficeData,
      initial: theOfficeData.length,
      increment: 3
    });

    toggleBtn.simulate("click");
    expect(wfgi.state().showFloodgate).toBe(true);

    getResetBtn().simulate("click");
    expect(getFgi().state.currentIndex).toBe(3);
    expect(wfgi.find("p")).toHaveLength(3);
  });
});

describe("C. Controlled Floodgate for parent state-controlled testing", () => {
  it("1. Should render 3 items", () => {
    const controlledFGI = mount(<ControlledFloodgate />);
    const getFG = () => controlledFGI.find(Floodgate);
    const getLI = () => controlledFGI.find("li");

    expect(getLI()).toHaveLength(3);
  });

  it("2. Should fetch 1 items, then render on LoadNext", () => {
    const controlledFGI = mount(<ControlledFloodgate />);
    const getFG = () => controlledFGI.find(Floodgate);
    const getLI = () => controlledFGI.find("li");
    const getFGInstance = () => getFG().instance();

    const getFetchButton = () => controlledFGI.find("button#fetch");
    const getLoadButton = () => controlledFGI.find("button#loadNext");

    expect(getLI()).toHaveLength(3);
    expect(getFGInstance().state.allItemsRendered).toEqual(true);

    // Fetch one number
    getFetchButton().simulate("click");

    expect(getFGInstance().state.renderedItems).toHaveLength(
      getFGInstance().state.items.length - 1
    );
    expect(getFGInstance().state.items).toHaveLength(
      getFGInstance().props.data.length
    );

    // Load new item
    getLoadButton().simulate("click");

    expect(getLI()).toHaveLength(getFGInstance().state.items.length);

    const fgState = getFGInstance().state;
    expect(fgState.items).toHaveLength(4);
    expect(fgState.renderedItems).toMatchObject(fgState.items);
    expect(fgState.currentIndex).toEqual(fgState.items.length);
    expect(fgState.allItemsRendered).toEqual(true);
  });

  it("3. Should fetch 2 items, render 1 new item on LoadNext", () => {
    const controlledFGI = mount(<ControlledFloodgate />);
    const getFG = () => controlledFGI.find(Floodgate);
    const getLI = () => controlledFGI.find("li");
    const getFGInstance = () => getFG().instance();

    const getFetchButton = () => controlledFGI.find("button#fetch");
    const getLoadButton = () => controlledFGI.find("button#loadNext");

    expect(getLI()).toHaveLength(3);
    expect(getFGInstance().state.allItemsRendered).toEqual(true);

    // Fetch two numbers
    getFetchButton().simulate("click");
    getFetchButton().simulate("click");

    expect(getFGInstance().state.renderedItems).toHaveLength(
      getFGInstance().state.items.length - 2
    );
    expect(getFGInstance().state.items).toHaveLength(
      getFGInstance().props.data.length
    );

    // Load new item
    expect(getFGInstance().props.data).toMatchObject(
      getFGInstance().state.items
    );

    getLoadButton().simulate("click");
    getFGInstance().loadNext();
    expect(getLI()).toHaveLength(getFGInstance().state.items.length - 1);

    getLoadButton().simulate("click");
    expect(getLI()).toHaveLength(getFGInstance().state.items.length);

    const fgState = getFGInstance().state;
    expect(fgState.items).toHaveLength(5);
    expect(fgState.renderedItems).toMatchObject(fgState.items);
    expect(fgState.currentIndex).toEqual(fgState.items.length);
    expect(fgState.allItemsRendered).toEqual(true);
  });
});

describe("D. Context-Wrapped Floodgate", () => {
  it("1. Should provide FloodgateInternals via Context API", () => {
    const fgi = mount(
      <Floodgate data={theOfficeData}>
        {() => (
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
        {({ items }) => (
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

  it("3. Updates Async Data from Props", () => {
    function* stringGen() {
      while (true) {
        yield Math.floor(Math.random() * 1000).toString();
      }
    }

    const StringGeneratorContext = React.createContext([]);
    class StringGenerator extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          strings: []
        };
        this.generator = stringGen();
        this.iterate = this.iterate.bind(this);
      }
      componentDidMount() {
        this.iterate();
      }
      iterate() {
        if (this.state.strings.length < this.props.count) {
          return this.setState(prevState => ({
            strings: [...prevState.strings, this.generator.next().value]
          }));
        }
      }
      render() {
        return (
          <StringGeneratorContext.Provider value={this.state.strings}>
            {this.props.children}
          </StringGeneratorContext.Provider>
        );
      }
    }
    const fgi = mount(
      <StringGenerator count={10}>
        <StringGeneratorContext.Consumer>
          {strings => (
            <React.Fragment>
              {strings.length ? (
                <Floodgate data={strings} initial={3} increment={1}>
                  {({ items, loadNext, loadAll, reset, loadComplete }) => (
                    <React.Fragment>
                      <ul id="string-list">
                        {items.map(s => (
                          <li
                            key={
                              s.replace(/\s/g, "_") +
                              Math.floor(Math.random() * 1000)
                            }
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                      <button id="next" onClick={loadNext}>
                        Next
                      </button>
                      <button id="all" onClick={loadAll}>
                        All
                      </button>
                      <button id="reset" onClick={reset}>
                        Reset
                      </button>
                    </React.Fragment>
                  )}
                </Floodgate>
              ) : null}
            </React.Fragment>
          )}
        </StringGeneratorContext.Consumer>
      </StringGenerator>
    );
    const getFG = () => fgi.find(Floodgate).instance();
    const getStringGen = () => fgi.find(StringGenerator).instance();
    const getNextButton = () => fgi.find("#next");
    const getAllButton = () => fgi.find("#all");
    const getResetButton = () => fgi.find("#reset");
    const getStringList = () => fgi.find("#string-list");

    getStringGen().iterate();
    getStringGen().iterate();
    expect(getFG().props.data).toHaveLength(
      getStringGen().state.strings.length
    );
    expect(getStringList().children.length).toBe(1);

    getNextButton().simulate("click");

    expect(getStringList().children().length).toBe(2);
    getStringGen().iterate();
    getStringGen().iterate();
    getStringGen().iterate();

    expect(getFG().props.data).toHaveLength(
      getStringGen().state.strings.length
    );

    getAllButton().simulate("click");
    expect(getFG().data).toMatchObject(getFG().props.data);
    expect(getStringList().children().length).toBe(getFG().props.data.length);
  });
});
