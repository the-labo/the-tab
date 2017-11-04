'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'
import { clone } from 'asobj'
import { TheButton } from 'the-button'
import { TheSpin } from 'the-spin'
import TheTabStyle from './TheTabStyle'
import chopcal from 'chopcal'
import { htmlAttributesFor, eventHandlersFor } from 'the-component-util'

const pointFromTouchEvent = (e) => {
  const [touch] = e.changedTouches || []
  if (!touch) {
    return null
  }
  const {clientX: x, clientY: y} = touch
  return {x, y}
}

const sourceElementScrollFor = (e) => {
  let target = e.target || e.srcElement
  let left = 0
  let top = 0
  while (target) {
    left += target.scrollLeft
    top += target.scrollTop
    target = target.parentElement
  }
  return {left, top}
}

/**
 * Tab for the-components
 */
class TheTab extends React.Component {
  constructor (props) {
    super(props)
    const s = this
    s.state = {
      animating: false,
      bodyHeight: 'auto',
      nextIndex: props.activeIndex || 0,
      movingRate: 0,
      translateX: 0
    }
    s.header = null
    s.body = null
    s.buttons = {}
    s.contentWraps = []
    s.movingTimer = -1
    s.resizeTimer = -1
    s.touchedScroll = null
    s.touchPoint = null
    s.touchMoveCount = 0
    s.touchHandlers = {
      'touchstart': s.handleTouchStart.bind(s),
      'touchmove': s.handleTouchMove.bind(s),
      'touchend': s.handleTouchEnd.bind(s)
    }

  }

  render () {
    const s = this
    const {props, state, body} = s
    const {
      animating,
      bodyHeight,
      nextIndex,
      movingRate,
      translateX
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
        <div className='the-tab-header'
             ref={(header) => { s.header = header }}>
          {
            buttons.map((text, i) => (
              <TheTab.Button key={i}
                             onClick={() => onChange({activeIndex: i})}
                             active={nextIndex === i}
                             movingRate={activeIndex === i ? movingRate : 0}
              >{text}</TheTab.Button>
            ))
          }
        </div>
        <div className='the-tab-body'
             ref={(body) => { s.body = body }}
             style={{height: bodyHeight}}
        >
          <div className={c('the-tab-body-inner', {
            'the-tab-body-inner-animating': animating,
          })}
               style={{
                 left: `${activeIndex * -100}%`,
                 width: `${count * 100}%`,
                 transform: `translateX(${translateX}px)`
               }}
               ref={(inner) => { s.inner = inner }}

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
        </div>
      </div>
    )
  }

  componentDidMount () {
    const s = this
    s.resize(s.props.activeIndex)
    s.resizeTimer = setInterval(() => s.resize(s.state.nextIndex), 300)

    for (const [event, handler] of Object.entries(s.touchHandlers)) {
      s.inner.addEventListener(event, handler)
    }
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

    for (const [event, handler] of Object.entries(s.touchHandlers)) {
      s.inner.removeEventListener(event, handler)
    }
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

  handleTouchStart (e) {
    const s = this
    const {header} = s
    s.touchedScroll = sourceElementScrollFor(e)
    s.touchPoint = pointFromTouchEvent(e)
    s.touchMoveCount = 0
    clearTimeout(s.movingTimer)
    s.setState({
      nextIndex: s.props.activeIndex,
      animating: false
    })
    s.buttons = [
      ...header.querySelectorAll('.the-tab-button')
    ]
  }

  handleTouchMove (e) {
    const s = this
    const {header, buttons} = s
    const touchedScroll = sourceElementScrollFor(e)
    const scrolled = s.touchedScroll.left !== touchedScroll.left
    if (scrolled) {
      return
    }
    s.touchedScroll = touchedScroll
    const isFirstMove = s.touchMoveCount === 0
    s.touchMoveCount++
    if (isFirstMove) {
      return
    }

    const point = pointFromTouchEvent(e)
    if (!s.touchPoint) {
      s.touchPoint = point
      return
    }
    const vx = point.x - s.touchPoint.x
    const vy = point.y - s.touchPoint.y
    const avy = Math.abs(vy)
    const avx = Math.abs(vx)
    let isHorizontal = avy < 20 && avy < avx
    if (isHorizontal) {
      const {activeIndex} = s.props
      const translateX = s.state.translateX + vx
      s.setState({translateX})

      const amount = s.movingAmountFor(translateX)
      const nextIndex = activeIndex + amount

      if (s.state.nextIndex !== nextIndex) {
        s.resize(nextIndex)
        s.setState({nextIndex})
      }

      const movingRate = s.movingRateFor(translateX)
      if (s.state.movingRate !== movingRate) {
        s.setState({movingRate})
      }
    }
    s.touchPoint = point
  }

  handleTouchEnd (e) {
    const s = this
    const {body} = s
    const {translateX} = s.state
    const amount = s.movingAmountFor(translateX)
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
    s.touchPoint = null
    s.touchedScroll = null
  }

  moveTo (x, callback) {
    const s = this
    const {header} = s
    s.setState({animating: true})
    clearTimeout(s.movingTimer)
    s.setState({
      movingRate: 0,
      translateX: x
    })
    s.movingTimer = setTimeout(() => {
      s.setState({
        animating: false,
        translateX: 0
      })
      callback && callback()
    }, 300)
  }

  movingAmountFor (x) {
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

  movingRateFor (x) {
    const s = this
    const {body} = s
    return chopcal.floor(x / body.offsetWidth, 0.001)
  }

  scrollHeader (amount) {
    const s = this
    if (s.headerScrolling) {
      return
    }
    s.headerScrolling = true
    setTimeout(() => {
      s.header.scrollLeft += amount
      s.headerScrolling = false
    }, 10)
  }

  static Button (props) {
    const {className, children, active, movingRate} = props
    const buttonProps = clone(props, {without: ['className', 'active']})
    return (
      <TheButton {...buttonProps}
                 className={c('the-tab-button', className, {
                   'the-tab-button-active': active
                 })}
      >
        {active && (
          <span className='the-tab-button-active-bar'
                style={active && {transform: `translateX(${movingRate * -100}%)`}}
          />
        )}
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
