import rAFPolyfill from './__test_utils__'
import React from 'react'
import jest from 'jest'
import Enzyme, { render, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import toJSON from 'enzyme-to-json'

import Floodgate from '../dist/floodgate.esm'
import { loopSimulation, theOfficeData } from '../src/helpers'
import toJson from 'enzyme-to-json'

// configure Enzyme
Enzyme.configure({ adapter: new Adapter() })

// Wrapper instance
const WrappedFloodgateInstance = fgProps => <WrappedFloodgate {...fgProps} />

class WrappedFloodgate extends React.Component {
  static defaultProps = {
    floodgateSaveStateOnUnmount: true
  }
  constructor () {
    super()
    this.state = {
      showFloodgate: true,
      savedState: {
        data: theOfficeData,
        initial: 3,
        increment: 3
      }
    }
    this.toggleFloodgate = this.toggleFloodgate.bind(this)
    this.cacheFloodgateState = this.cacheFloodgateState.bind(this)
  }
  toggleFloodgate () {
    this.setState(prevState => ({
      ...prevState,
      showFloodgate: !prevState.showFloodgate
    }))
  }
  cacheFloodgateState ({ currentIndex: initial }) {
    this.setState(prevState => ({
      ...prevState,
      savedState: {
        ...prevState.savedState,
        initial
      }
    }))
  }
  render () {
    return (
      <div>
        <button id='toggleFloodgate' onClick={this.toggleFloodgate}>
          Toggle Floodgate
        </button>
        {this.state.showFloodgate &&
          <Floodgate
            data={this.state.savedState.data}
            initial={this.state.savedState.initial}
            increment={this.state.savedState.increment}
            saveStateOnUnmount={this.props.floodgateSaveStateOnUnmount}
            exportState={this.cacheFloodgateState}
          >
            {({ items, loadNext, loadAll, reset, loadComplete }) => (
              <main>
                {items.map(({ name }) => <p key={name}>{name}</p>)}
                {(!loadComplete &&
                  <span>
                    <button id='load' onClick={loadNext}>
                      Load More
                    </button>
                    <button id='loadall' onClick={loadAll}>
                      Load All
                    </button>
                    <button id='reset' onClick={reset}>
                      Reset
                    </button>
                  </span>) ||
                  <p>
                    All items loaded.<br />
                    <button id='reset' onClick={reset}>
                      Reset
                    </button>
                  </p>}
              </main>
            )}
          </Floodgate>}
      </div>
    )
  }
}

// Floodgate instance
const FloodgateInstance = ({ increment = 3, initial = 3 }) => (
  <Floodgate data={theOfficeData} {...{ initial, increment }}>
    {({ items, loadNext, loadAll, reset, loadComplete }) => (
      <main>
        {items.map(({ name }) => <p key={name}>{name}</p>)}
        {(!loadComplete &&
          <span>
            <button id='load' onClick={loadNext}>
              Load More
            </button>
            <button id='loadall' onClick={loadAll}>
              Load All
            </button>
            <button id='reset' onClick={reset}>
              Reset
            </button>
          </span>) ||
          <p>
            All items loaded.<br />
            <button id='reset' onClick={reset}>
              Reset
            </button>
          </p>}
      </main>
    )}
  </Floodgate>
)

describe('Floodgate', () => {
  // simple check to make sure Floodgate renders
  it('1. Should render the Floodgate component', () => {
    const fgi = render(<FloodgateInstance />)
    expect(toJSON(fgi)).toMatchSnapshot()
  })

  // test instance has correct children
  it('2. Should render 3 `p` children and 2 `button` child', () => {
    const fgi = mount(<FloodgateInstance />)
    expect(fgi.find('p').length).toBe(3)
    expect(fgi.find('button').length).toBe(3)
    expect(toJSON(fgi)).toMatchSnapshot()
  })

  // test instance's children's text values
  it('3. Should render `p` children that have text matching [Jim Halpert,Pam Halpert,Ed Truck]', () => {
    const testTextValues = ['Jim Halpert', 'Pam Halpert', 'Ed Truck']
    const renderedParagraphTextValues = []
    const fgi = mount(<FloodgateInstance />)
    fgi.find('p').forEach(p => {
      renderedParagraphTextValues.push(p.text())
    })
    expect(renderedParagraphTextValues).toMatchObject(testTextValues)
  })

  // test instance renders non-default lengths of initial
  it('4. Should render with 4 `p` children', () => {
    const fgi = mount(<FloodgateInstance initial={4} />)
    expect(fgi.find('p').length).toBe(4)
    expect(toJSON(fgi)).toMatchSnapshot()
  })

  // test instance loads new items
  it('5. Should render with 3 `p` children and load 3 `p` children `onClick()`', () => {
    const fgi = mount(<FloodgateInstance />)
    expect(fgi.find('p').length).toBe(3)
    expect(toJSON(fgi)).toMatchSnapshot()

    // simulate click
    fgi.find('button#load').simulate('click')
    expect(fgi.find('p').length).toBe(6)
    expect(toJSON(fgi)).toMatchSnapshot()
  })
  // test instance loads different lengths of increment
  it('6. Should render with 2 `p` children and load 1 `p` children `onClick()`', () => {
    const fgi = mount(<FloodgateInstance initial={2} increment={1} />)
    const loadButton = fgi.find('button#load')
    const p = (prop = false) => (prop ? fgi.find('p')[prop] : fgi.find('p'))
    expect(p('length')).toBe(2)
    expect(toJSON(fgi)).toMatchSnapshot()

    // simulate click
    loadButton.simulate('click')
    expect(p('length')).toBe(3)
    expect(toJSON(fgi)).toMatchSnapshot()

    loopSimulation(2, () => loadButton.simulate('click'))
    expect(p('length')).toBe(5)
    expect(fgi.find('button').length).toBe(3)
    expect(toJSON(fgi)).toMatchSnapshot()

    loopSimulation(3, () => loadButton.simulate('click'))
    expect(p('length')).toBe(8)
    expect(p().last().text()).toMatch(theOfficeData[7].name)
    expect(fgi.find('button').length).toBe(3)
    expect(toJSON(fgi)).toMatchSnapshot()
  })
  it('7. Should render with 2 `p` children, load 1 `p` child, and reset state to original load', () => {
    const fgi = mount(<FloodgateInstance initial={2} increment={1} />)
    const loadButton = fgi.find('button#load')
    const resetButton = fgi.find('button#reset')
    const p = (prop = false) => (prop ? fgi.find('p')[prop] : fgi.find('p'))
    expect(p('length')).toBe(2)
    expect(p().first().text()).toMatch('Jim Halpert')
    expect(p().last().text()).toMatch('Pam Halpert')
    expect(toJSON(fgi)).toMatchSnapshot()

    loadButton.simulate('click')
    expect(p('length')).toBe(3)
    expect(toJSON(fgi)).toMatchSnapshot()

    resetButton.simulate('click')
    expect(p('length')).toBe(2)
    expect(p().first().text()).toMatch('Jim Halpert')
    expect(p().last().text()).toMatch('Pam Halpert')
    expect(fgi.find('button').length).toBe(3)
    expect(toJSON(fgi)).toMatchSnapshot()
  })

  it('8. Should render 1 `p` child, click to load all then reset', () => {
    const fgi = mount(<FloodgateInstance initial={1} increment={2} />)
    const loadButton = fgi.find('button#load')
    const loadAllButton = fgi.find('button#loadall')
    const resetButton = fgi.find('button#reset')
    const p = (prop = false) => (prop ? fgi.find('p')[prop] : fgi.find('p'))
    expect(p('length')).toBe(1)

    loadAllButton.simulate('click')
    expect(p('length')).toBe(theOfficeData.length + 1)
    expect(p().first().text()).toMatch('Jim Halpert')
    expect(p().at(theOfficeData.length - 1).text()).toMatch('Angela Schrute')
    expect(toJSON(fgi)).toMatchSnapshot()

    resetButton.simulate('click')
    expect(p('length')).toBe(1)
    expect(toJSON(fgi)).toMatchSnapshot()
  })
})

describe('Wrapped Floodgate for saveState testing', () => {
  it('1. Should render a wrapped Floodgate instance', () => {
    const wfgi = mount(<WrappedFloodgate floodgateSaveStateOnUnmount />)
    expect(toJSON(wfgi)).toMatchSnapshot()
  })
  it('2. Should load 3 items, and save the currentIndex to the WrappedFloodgate state on cWU', () => {
    const wfgi = mount(<WrappedFloodgate floodgateSaveStateOnUnmount />)
    const fgi = wfgi.find(Floodgate).instance()
    const loadBtn = wfgi.find('button#load')
    const toggleBtn = wfgi.find('button#toggleFloodgate')

    expect(fgi.state.currentIndex).toEqual(3)
    expect(wfgi.find('p')).toHaveLength(3)

    loadBtn.simulate('click')

    expect(wfgi.find('p')).toHaveLength(6)
    expect(fgi.state.currentIndex).toEqual(6)

    toggleBtn.simulate('click')
    expect(wfgi.find('p')).toHaveLength(0)
    expect(wfgi.state().showFloodgate).toBe(false)
    expect(wfgi.state('savedState')).toMatchObject({
      data: theOfficeData,
      initial: 6,
      increment: 3
    })
  })
  it('2. Should load 3 items, toggle Floodgate, load 3 more items, and persist Floodgate state through mounting/re-mounting', () => {
    const wfgi = mount(<WrappedFloodgate floodgateSaveStateOnUnmount />)
    const getFgi = () => wfgi.find(Floodgate).instance()
    const loadBtn = wfgi.find('button#load')
    const toggleBtn = wfgi.find('button#toggleFloodgate')

    expect(getFgi().state.currentIndex).toEqual(3)
    expect(wfgi.find('p')).toHaveLength(3)

    loadBtn.simulate('click')

    expect(wfgi.find('p')).toHaveLength(6)
    expect(getFgi().state.currentIndex).toEqual(6)

    toggleBtn.simulate('click')
    // wfgi.setState({ showFloodgate: false })

    expect(wfgi.find('p')).toHaveLength(0)
    expect(wfgi.state().showFloodgate).toBe(false)
    expect(wfgi.state('savedState')).toMatchObject({
      data: theOfficeData,
      initial: 6,
      increment: 3
    })

    toggleBtn.simulate('click')
    expect(wfgi.state().showFloodgate).toBe(true)
    wfgi.find('button#load').simulate('click')
    expect(getFgi().state.currentIndex).toBe(9)
  })
})
