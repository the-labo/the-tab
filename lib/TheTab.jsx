'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'
import { clone } from 'asobj'
import { TheButton, TheButtonGroup } from 'the-button'
import TheTabStyle from './TheTabStyle'
import Draggable from 'react-draggable'
import { htmlAttributesFor, eventHandlersFor } from 'the-component-util'

/**
 * Tab for the-components
 */
class TheTab extends React.PureComponent {
  constructor (props) {
    super(props)
    const s = this
    s.state = {
      draggingPosition: null,
      animating: false
    }
    s.body = null
    s.movingTimer = -1
  }

  render () {
    const s = this
    const {props, state, body} = s
    const {
      draggingPosition,
      animating
    } = state
    const {
      className,
      children,
      buttons,
      activeIndex,
      onChange
    } = props
    const count = buttons.length
    return (
      <div {...htmlAttributesFor(props, {except: ['className']})}
           {...eventHandlersFor(props, {except: []})}
           className={c('the-tab', className)}
      >
        <div className='the-tab-header'>
          {
            buttons.map((text, i) => (
              <TheTab.Button key={i}
                             onClick={() => onChange({activeIndex: i})}
                             active={activeIndex === i}
              >{text}</TheTab.Button>
            ))
          }
        </div>
        <div className='the-tab-body'
             ref={(body) => {s.body = body}}
        >
          <Draggable axis='x'
                     position={draggingPosition}
                     onStart={(e, data) => s.handleDragStart(e, data)}
                     onStop={(e, data) => s.handleDragStop(e, data)}
                     bounds={s.getBounds()}
          >
            <div className={c('the-tab-body-inner', {
              'the-tab-body-inner-animating': animating,
            })}
                 style={{
                   left: `${activeIndex * -100}%`,
                   width: `${count * 100}%`
                 }}
            >
              {children}
            </div>
          </Draggable>
        </div>
      </div>
    )
  }

  componentWillReceiveProps () {

  }

  getBounds () {
    const s = this
    const {activeIndex, buttons} = s.props
    const bounds = {top: 0, bottom: 0}
    if (activeIndex === 0) {
      bounds.right = 20
    }
    if (activeIndex === buttons.length - 1) {
      bounds.left = -20
    }
    return bounds
  }

  handleDragStart (e) {
    const s = this
    clearTimeout(s.movingTimer)
    s.setState({
      draggingPosition: null,
      animating: false
    })
  }

  handleDragStop (e, data) {
    const s = this
    const {body} = s
    if (!body) {
      return
    }
    const {x} = data
    const threshold = Math.min(80, body.offsetWidth / 2)
    const {buttons, activeIndex, onChange} = s.props
    const count = buttons.length
    const toLeft = (threshold < x) && (0 < activeIndex)
    if (toLeft) {
      s.moveTo(body.offsetWidth, () =>
        onChange({activeIndex: activeIndex - 1})
      )
      return
    }
    const toRight = x < (threshold * -1) && (activeIndex < count - 1)
    if (toRight) {
      s.moveTo(body.offsetWidth * -1, () =>
        onChange({activeIndex: activeIndex + 1})
      )
      return
    }
    s.moveTo(0)
  }

  moveTo (x, callback) {
    const s = this
    s.setState({animating: true})
    clearTimeout(s.movingTimer)
    s.setState({draggingPosition: {x, y: 0}})
    s.movingTimer = setTimeout(() => {
      s.setState({
        animating: false,
        draggingPosition: {x: 0, y: 0}
      })
      callback && callback()
    }, 300)
  }

  static Button (props) {
    const {className, children, active} = props
    const buttonProps = clone(props, {without: ['className', 'active']})
    return (
      <TheButton {...buttonProps}
                 className={c('the-tab-button', className, {
                   'the-tab-button-active': active
                 })}
      >{children}</TheButton>
    )
  }

  static Content (props) {
    const {className, children} = props
    return (
      <div {...htmlAttributesFor(props, {except: ['className']})}
           {...eventHandlersFor(props, {except: []})}
           className={c('the-content-content', className)}
      >
        {children}
      </div>
    )
  }

}

TheTab.Style = TheTabStyle

TheTab.propTypes = {
  /** Active tab index */
  activeIndex: PropTypes.number.isRequired,
  /** Tab buttons */
  buttons: PropTypes.arrayOf(PropTypes.node),
  /** Change handler */
  onChange: PropTypes.func
}

TheTab.defaultProps = {
  activeIndex: 0,
  buttons: [],
  onChange: () => {}
}

TheTab.displayName = 'TheTab'

export default TheTab
