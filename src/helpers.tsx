import * as React from "react";
import * as loremIpsum from "lorem-ipsum";

const loopSimulation = (amount: number, simulation: Function) => {
  for (let i = 0; i < amount; i++) {
    simulation();
  }
};

const generateFilledArray = (amount: number) => {
  const the_array: Array<number> = [];
  for (let i = 0; i < amount; i++) {
    the_array.push(i);
  }
  return the_array;
};

const generateLoremIpsum = (config: Object) => {
  return loremIpsum(
    Object.assign(
      {
        count: 16,
        format: "plain",
        units: "words"
      },
      config
    )
  );
};

const theOfficeData: Array<{
  name: string,
  username: string,
  email: string,
  status: boolean
}> = [
  {
    name: "Jim Halpert",
    username: "jhalpert",
    email: "jim@athleap.co",
    status: false
  },
  {
    name: "Pam Halpert",
    username: "phalpert",
    email: "phalpert79@gmail.com",
    status: false
  },
  {
    name: "Ed Truck",
    username: "ed",
    email: "etruck@dundermifflin.com",
    status: false
  },
  {
    name: "Michael Scott",
    username: "mscott",
    email: "admin@michaelscottfoundation.org",
    status: false
  },
  {
    name: "Dwight Schrute",
    username: "bearsbeats74",
    email: "dschrute@dundermifflin.com",
    status: true
  },
  {
    name: "Phyllis Vance",
    username: "pvance",
    email: "pvance@dundermifflin.com",
    status: true
  },
  {
    name: "Stanley Hudson",
    username: "shudson",
    email: "pretzelday@aol.com",
    status: false
  },
  {
    name: "Erin Hannon",
    username: "khannon",
    email: "khannon@dundermifflin.com",
    status: true
  },
  {
    name: "Andrew Bernard",
    username: "the_nard_dog",
    email: "nard.dog@cornell.edu",
    status: false
  },
  {
    name: "David Wallace",
    username: "dwallace",
    email: "dwallace@dundermifflin.com",
    status: true
  },
  {
    name: "Meredith Palmer",
    username: "mpalmer",
    email: "supplierrelations@dundermifflin.com",
    status: true
  },
  {
    name: "Angela Schrute",
    username: "aschrute",
    email: "aschrute@dundermifflin.com",
    status: true
  }
];

class StatefulToggle extends React.Component<
  {
    children: (args: {
      STState: object,
      toggle: Function,
      stashState: Function
    }) => JSX.Element,
    stateObj?: object
  },
  { toggleChildren?: boolean, savedFloodgateState?: object | boolean }
> {
  constructor(props) {
    super(props);
    this.state = {
      toggleChildren: true,
      savedFloodgateState: props.stateObj || false
    };
    this.stashState = this.stashState.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  stashState(stateKey: string, stateVal: object) {
    this.setState(prevState => ({
      ...prevState,
      [stateKey]: { ...prevState[stateKey], ...stateVal }
    }));
  }
  toggle() {
    return this.setState(prevState => ({
      toggleChildren: !prevState.toggleChildren
    }));
  }
  render() {
    const { state: STState, stashState, toggle } = this;
    return this.props.children({ STState, toggle, stashState });
  }
}

export {
  generateFilledArray,
  generateLoremIpsum,
  loopSimulation,
  theOfficeData,
  StatefulToggle
};
