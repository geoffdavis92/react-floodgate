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

storiesOf("Bugfix: state-controlled-props", module).add("test", () => {
  class LoadMore extends React.Component {
    constructor() {
      super();
      this.state = {
        renderCount: 6,
        data: [
          {
            userId: 1,
            id: 1,
            title:
              "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
            body:
              "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
          },
          {
            userId: 1,
            id: 2,
            title: "qui est esse",
            body:
              "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
          },
          {
            userId: 1,
            id: 3,
            title:
              "ea molestias quasi exercitationem repellat qui ipsa sit aut",
            body:
              "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
          },
          {
            userId: 1,
            id: 4,
            title: "eum et est occaecati",
            body:
              "ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit"
          },
          {
            userId: 1,
            id: 5,
            title: "nesciunt quas odio",
            body:
              "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque"
          }
        ]
      };
      this.pushInterval = false;
      this.getData = this.getData.bind(this);
      this.saveState = this.saveState.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.addDataToState = this.addDataToState.bind(this);
    }
    componentDidMount() {
      // this.getData()
      //   .then(res => res.json())
      //   .then(this.addDataToState);
    }
    getData() {
      return fetch(
        `https://jsonplaceholder.typicode.com/posts/${this.state.renderCount}`
      );
    }
    saveState(FloodgateState) {
      this.setState(prevState => ({
        cachedFloodgateState: FloodgateState
      }));
    }
    addDataToState(data) {
      setTimeout(
        () =>
          this.setState(
            prevState => ({
              fetchActive: false,
              renderCount: prevState.renderCount + 1,
              data: [...prevState.data, data]
            }),
            () => {} //console.log(this.state)
          ),
        500
      );
    }
    handleClick() {
      this.setState(
        () => ({ fetchActive: true }),
        () => {
          this.getData()
            .then(res => res.json())
            .then(this.addDataToState);
        }
      );
    }
    render() {
      return (
        <div>
          <Floodgate data={this.state.data} initial={3} increment={1}>
            {({ items, loadNext, loadComplete }) => (
              <div>
                {items.map(item => <p>{item.title}</p>)}
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
});

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
              All loaded.<br />
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
              All loaded.<br />
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
                All loaded.<br />
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
