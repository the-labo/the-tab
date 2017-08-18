'use strict'

import React from 'react'
import { TheTab, TheTabStyle } from 'the-tab'
import { TheButtonStyle } from 'the-button'
import { TheSpinStyle } from 'the-spin'

class ExampleComponent extends React.PureComponent {
  constructor (props) {
    super(props)
    const s = this
    s.state = {
      activeIndex: 1
    }
  }

  render () {
    const s = this
    return (
      <div>
        <TheButtonStyle/>
        <TheSpinStyle/>
        <TheTabStyle/>
        <TheTab activeIndex={s.state.activeIndex}
                onChange={({activeIndex}) => s.setState({activeIndex})}
                buttons={['Tab01', 'Tab02', 'Tab03']}
        >
          <TheTab.Content style={{height: '100px'}}> This is Content 01 </TheTab.Content>
          <TheTab.Content style={{height: '300px'}}> This is Content 02 </TheTab.Content>
          <TheTab.Content spinning> This is Content 03 </TheTab.Content>
        </TheTab>
      </div>

    )
  }
}

export default ExampleComponent
