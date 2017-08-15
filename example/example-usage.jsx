'use strict'

import React from 'react'
import { TheTab, TheTabStyle } from 'the-tab'
import { TheButtonStyle } from 'the-button'

class ExampleComponent extends React.PureComponent {
  constructor (props) {
    super(props)
    const s = this
    s.state = {
      activeIndex: 2
    }
  }

  render () {
    const s = this
    return (
      <div>
        <TheButtonStyle/>
        <TheTabStyle/>
        <TheTab activeIndex={s.state.activeIndex}
                onChange={({activeIndex}) => s.setState({activeIndex})}
                buttons={['Tab01', 'Tab02', 'Tab03']}
        >
          <TheTab.Content> This is Content 01 </TheTab.Content>
          <TheTab.Content> This is Content 02 </TheTab.Content>
          <TheTab.Content> This is Content 03 </TheTab.Content>
        </TheTab>
      </div>

    )
  }
}

export default ExampleComponent
