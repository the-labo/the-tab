'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'
import { clone } from 'asobj'
import { TheButton } from 'the-button'
import { TheSpin } from 'the-spin'
import TheTabStyle from './TheTabStyle'
import Draggable from 'react-draggable'
import { htmlAttributesFor, eventHandlersFor } from 'the-component-util'

/**
 * Tab for the-components
 */
class TheTab extends React.Component {
  constructor (props) {
    super(props)
    const s = this
    s.state = {
      draggingPosition: null,
      animating: false,
      bodyHeight: 'auto',
      nextIndex: props.activeIndex || 0
    }
    s.body = null
    s.contentWraps = []
    s.movingTimer = -1
    s.resizeTimer = -1
  }

  render () {
    const s = this
    const {props, state, body} = s
    const {
      draggingPosition,
      animating,
      bodyHeight,
      nextIndex
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
                             active={nextIndex === i}
              >{text}</TheTab.Button>
            ))
          }
        </div>
        <div className='the-tab-body'
             ref={(body) => { s.body = body }}
             style={{height: bodyHeight}}
        >
          <Draggable axis='x'
                     position={draggingPosition}
                     onStart={(e, data) => s.handleDragStart(e, data)}
                     onDrag={(e, data) => s.handleDragDrag(e, data)}
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
              {
                React.Children.map(children, (child, i) => (
                  <div key={i}
                       ref={(contentWrap) => {s.contentWraps[i] = contentWrap}}
                       className={c('the-tab-content-wrap', {
                         'the-tab-content-wrap-active': i === activeIndex
                       })}
                       style={{width: `${Math.ceil(100 / count)}%`}}
                  >
                    {child}
                  </div>
                ))
              }
            </div>
          </Draggable>
        </div>
      </div>
    )
  }

  componentDidMount () {
    const s = this
    s.resize(s.props.activeIndex)

    s.resizeTimer = setInterval(() => s.resize(s.state.nextIndex), 300)
  }

  componentWillReceiveProps (nextProps) {
    const s = this
    const {props} = s

    const nextIndex = nextProps.activeIndex
    const updateNextIndex = (nextIndex === null) || (props.activeIndex !== nextIndex)
    if (updateNextIndex) {
      s.setState({nextIndex})
      s.resize(nextIndex)
    }
  }

  componentWillUnmount () {
    const s = this
    clearInterval(s.resizeTimer)
    clearTimeout(s.movingTimer)
  }

  resize (activeIndex) {
    const s = this
    const contentWrap = s.contentWraps[activeIndex]
    const bodyHeight = contentWrap && contentWrap.offsetHeight
    const needsUpdateState = bodyHeight && (bodyHeight !== s.state.bodyHeight)
    if (needsUpdateState) {
      s.setState({bodyHeight})
    }
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
      nextIndex: s.props.activeIndex,
      draggingPosition: null,
      animating: false
    })
  }

  handleDragDrag (e, data) {
    const s = this
    const {body} = s
    if (!body) {
      return
    }
    const {activeIndex} = s.props
    const {x} = data
    const amount = s.moveAmountFor(x)
    const nextIndex = activeIndex + amount
    if (s.state.nextIndex !== nextIndex) {
      s.resize(nextIndex)
      s.setState({nextIndex})
    }
  }

  handleDragStop (e, data) {
    const s = this
    const {body} = s
    if (!body) {
      return
    }
    const {x} = data
    const amount = s.moveAmountFor(x)
    const {activeIndex, onChange} = s.props
    const toLeft = amount < 0
    if (toLeft) {
      s.moveTo(body.offsetWidth, () =>
        onChange({activeIndex: activeIndex - 1})
      )
      return
    }
    const toRight = amount > 0
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

  moveAmountFor (x) {
    const s = this
    const {body} = s
    const threshold = Math.min(80, body.offsetWidth / 2)
    const {buttons, activeIndex} = s.props
    const count = buttons.length
    const toLeft = (threshold < x) && (0 < activeIndex)
    if (toLeft) {
      return -1
    }
    const toRight = x < (threshold * -1) && (activeIndex < count - 1)
    if (toRight) {
      return 1
    }
    return 0
  }

  static Button (props) {
    const {className, children, active} = props
    const buttonProps = clone(props, {without: ['className', 'active']})
    return (
      <TheButton {...buttonProps}
                 className={c('the-tab-button', className, {
                   'the-tab-button-active': active
                 })}
      >
        {active && (<span className='the-tab-button-active-bar'/>)}
        {children}
      </TheButton>
    )
  }

  static Content (props) {
    const {className, children, spinning} = props
    return (
      <div {...htmlAttributesFor(props, {except: ['className', 'spinning']})}
           {...eventHandlersFor(props, {except: []})}
           className={c('the-tab-content', className)}
      >
        {
          spinning && (
            <TheSpin enabled
                     cover
                     className='the-tab-content-spin'
            />
          )
        }

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
