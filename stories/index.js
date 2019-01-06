import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import { Button, Welcome } from "@storybook/react/demo";
import { LoadsArticles, LoadsCards } from "./demos";

import Floodgate from "floodgate";
import { ErrorMessage } from "../src/functions.tsx";
import { generateFilledArray, StatefulToggle } from "../src/helpers.tsx";

const PreProps = {
  style: {
    backgroundColor: "#eee",
    color: "#3a3a3a",
    display: "inline-block",
    fontSize: "18px",
    padding: ".66em"
  }
};

storiesOf("Welcome", module).add("to Storybook", () => (
  <Welcome showApp={linkTo("Button")} />
));

storiesOf("Floodgate/styled", module)
  .add("loads articles", LoadsArticles)
  .add("loads cards", LoadsCards);

storiesOf("Floodgate/simple", module)
  .add(
    "Displays numbers up to 9, loads every 2, with initial load of 2",
    () => (
      <Floodgate data={generateFilledArray(9)} initial={2} increment={2}>
        {({ items, loadNext, loadComplete }) => (
          <article>
            {items.map(n => <p key={n}>{n}</p>)}
            {(!loadComplete && (
              <p>
                <button onClick={loadNext}>Load More</button>
              </p>
            )) || <p>All loaded.</p>}
          </article>
        )}
      </Floodgate>
    )
  )
  .add(
    "Displays numbers up to 9, loads every 3, with initial load of 3",
    () => (
      <Floodgate data={generateFilledArray(9)} increment={3} initial={3}>
        {({ items, loadNext, loadComplete }) => (
          <article>
            {items.map(n => <p key={n}>{n}</p>)}
            {(!loadComplete && (
              <p>
                <button onClick={loadNext}>Load More</button>
              </p>
            )) || <p>All loaded.</p>}
          </article>
        )}
      </Floodgate>
    )
  )
  .add(
    "Displays numbers up to 9, loads every 3, with initial load of 4",
    () => (
      <Floodgate data={generateFilledArray(9)} increment={3} initial={4}>
        {({ items, loadNext, loadComplete }) => (
          <article>
            {items.map(n => <p key={n}>{n}</p>)}
            {(!loadComplete && (
              <p>
                <button onClick={loadNext}>Load More</button>
              </p>
            )) || <p>All loaded.</p>}
          </article>
        )}
      </Floodgate>
    )
  )
  .add("Displays numbers up to 9, loads every 9", () => (
    <Floodgate data={generateFilledArray(9)} initial={9}>
      {({ items, loadNext, loadComplete }) => (
        <article>
          {items.map(n => <p key={n}>{n}</p>)}
          {(!loadComplete && (
            <p>
              <button onClick={loadNext}>Load More</button>
            </p>
          )) || <p>All loaded.</p>}
        </article>
      )}
    </Floodgate>
  ))
  .add("Has reset button", () => (
    <Floodgate data={generateFilledArray(25)}>
      {({ items, loadNext, loadComplete, reset }) => (
        <article>
          {items.map(n => <p key={n}>{n}</p>)}
          {(!loadComplete && (
            <p>
              <button onClick={loadNext}>Load More</button>
              <button onClick={reset}>Reset</button>
            </p>
          )) || (
            <p>
              All loaded.
              <br />
              <button onClick={reset}>Reset</button>
            </p>
          )}
        </article>
      )}
    </Floodgate>
  ))
  .add("With render prop callback callbacks", () => (
    <Floodgate data={generateFilledArray(25)} initial={1} increment={3}>
      {({ items, loadNext, loadComplete, reset }) => (
        <article>
          {items.map((item, i, allItems) => (
            <p
              key={item}
              id={i !== 0 && i === allItems.length - 1 ? "last" : null}
            >
              {item}
            </p>
          ))}
          {(!loadComplete && (
            <p>
              <button
                onClick={e =>
                  loadNext({
                    callback: ({ renderedItems }) => {
                      console.log("LOAD MORE", {
                        currentIndex: renderedItems.length - 1
                      });
                      window.location = "#last";
                    }
                  })}
              >
                Load More
              </button>
              <button
                onClick={e =>
                  reset({ callback: state => console.log("RESET", { state }) })}
              >
                Reset
              </button>
            </p>
          )) || (
            <p>
              All loaded.
              <br />
              <button
                onClick={e =>
                  reset({
                    callback: state =>
                      console.log("RESET AFTER ALL LOADED", { state })
                  })}
              >
                Reset
              </button>
            </p>
          )}
        </article>
      )}
    </Floodgate>
  ))
  .add("With loadAll callback", () => (
    <Floodgate data={generateFilledArray(25)} initial={1} increment={3}>
      {({ items, loadAll, loadNext, loadComplete, reset }) => {
        console.log({ loadComplete });
        return (
          <article>
            {items.map((item, i, allItems) => (
              <p
                key={item}
                id={i !== 0 && i === allItems.length - 1 ? "last" : null}
              >
                {item}
              </p>
            ))}
            {(!loadComplete && (
              <p>
                <button
                  onClick={e =>
                    loadNext({
                      callback: ({ renderedItems }) => {
                        console.log("LOAD MORE", {
                          currentIndex: renderedItems.length - 1
                        });
                        window.location = "#last";
                      }
                    })}
                >
                  Load More
                </button>
                <button
                  onClick={e =>
                    loadAll({
                      callback: state => console.log("LOAD ALL", { state }),
                      suppressWarning: false
                    })}
                >
                  Load All
                </button>
                <button
                  onClick={e =>
                    reset({
                      callback: state => console.log("RESET", { state })
                    })}
                >
                  Reset
                </button>
              </p>
            )) || (
              <p>
                All loaded.
                <br />
                <button
                  onClick={e =>
                    reset({
                      callback: state =>
                        console.log("RESET AFTER ALL LOADED", { state })
                    })}
                >
                  Reset
                </button>
              </p>
            )}
          </article>
        );
      }}
    </Floodgate>
  ))
  .add("Parent-Controlled Floodgate", () => {
    class LoadMore extends React.Component {
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
        setTimeout(
          () =>
            this.setState(
              prevState => {
                return {
                  fetchActive: false,
                  fetchComplete: false,
                  data: [...prevState.data, prevState.data.length]
                };
              },
              () => {}
            ),
          500
        );
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
                  <ul>{items.map(n => <li>{n}</li>)}</ul>
                  <button onClick={loadNext} disabled={loadComplete}>
                    Load More
                  </button>
                  <button
                    onClick={this.handleClick}
                    disabled={this.state.fetchActive}
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
    return <LoadMore />;
  })
  .add("With saveLoadState", () => {
    return (
      <StatefulToggle
        stateObj={{ data: generateFilledArray(25), initial: 3, increment: 3 }}
      >
        {({ STState, toggle, stashState }) => (
          <div>
            <button onClick={toggle}>Toggle Children</button>
            <br />
            {STState.toggleChildren && (
              <Floodgate
                data={STState.savedFloodgateState.data}
                initial={STState.savedFloodgateState.initial}
                increment={STState.savedFloodgateState.increment}
                exportState={state =>
                  stashState("savedFloodgateState", {
                    ...state,
                    initial: state.currentIndex
                  })}
              >
                {({ items, loadNext, loadComplete, reset }) => (
                  <article>
                    {items.map(n => <p key={n.toString()}>{n}</p>)}
                    <br />
                    {!loadComplete ? (
                      <button onClick={loadNext}>load next</button>
                    ) : (
                      <button onClick={reset}>reset</button>
                    )}
                  </article>
                )}
              </Floodgate>
            )}
          </div>
        )}
      </StatefulToggle>
    );
  })
  .add("With event callbacks", () => {
    return (
      <StatefulToggle
        stateObj={{ data: generateFilledArray(25), initial: 3, increment: 3 }}
      >
        {({ STState, toggle, stashState }) => (
          <div>
            <button onClick={toggle}>Toggle Children</button>
            <br />
            {STState.toggleChildren && (
              <Floodgate
                data={STState.savedFloodgateState.data}
                initial={STState.savedFloodgateState.initial}
                increment={STState.savedFloodgateState.increment}
                onLoadNext={s => console.log({ stateOnLoadNext: s })}
                onLoadComplete={s => console.log({ stateOnLoadComplete: s })}
                onReset={s => console.log({ stateOnReset: s })}
                exportState={state =>
                  stashState("savedFloodgateState", {
                    ...state,
                    initial: state.currentIndex
                  })}
              >
                {({ items, loadNext, loadComplete, reset }) => (
                  <article>
                    {items.map(n => <p key={n.toString()}>{n}</p>)}
                    <br />
                    {!loadComplete ? (
                      <button onClick={loadNext}>load next</button>
                    ) : (
                      <button onClick={reset}>reset</button>
                    )}
                  </article>
                )}
              </Floodgate>
            )}
          </div>
        )}
      </StatefulToggle>
    );
  })
  .add("Floodgate children wrapped in Context.Provider", () => {
    const Display = props => (
      <ul>{props.items.map(n => <li key={n}>{n}</li>)}</ul>
    );
    const Controls = ({ ContextConsumer }) => (
      <React.Fragment>
        <ContextConsumer>
          {({ loadNext, loadAll, loadComplete, reset }) => (
            <React.Fragment>
              <button onClick={loadNext} disabled={loadComplete}>
                Load More
              </button>{" "}
              <button onClick={loadAll} disabled={loadComplete}>
                Load All
              </button>
              {loadComplete && (
                <React.Fragment>
                  <br />
                  <button onClick={reset}>Reset</button>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </ContextConsumer>
      </React.Fragment>
    );
    return (
      <main>
        <Floodgate data={generateFilledArray(10)} initial={1} increment={1}>
          {({ items, FloodgateContext }) => {
            return (
              <main>
                <Display items={items} />
                <footer>
                  <Controls ContextConsumer={FloodgateContext.Consumer} />
                </footer>
              </main>
            );
          }}
        </Floodgate>
      </main>
    );
  });
storiesOf("Utilities/functions/ErrorMessage", module)
  .add("Generic message", () => (
    <ErrorMessage
      text="Uncaught SyntaxError: {the error message}"
      {...PreProps}
    />
  ))
  .add("No `text` provided, with children", () => (
    <ErrorMessage {...PreProps}>
      Uncaught SyntaxError: {"{the error message}"}
    </ErrorMessage>
  ))
  .add("No `text` provided, no children", () => <ErrorMessage />);
