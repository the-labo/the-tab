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
    this.state = {
      animating: false,
      bodyHeight: 'auto',
      nextIndex: props.activeIndex || 0,
      movingRate: 0,
      translateX: 0
    }
    this.header = null
    this.body = null
    this.buttons = {}
    this.contentWraps = []
    this.movingTimer = -1
    this.resizeTimer = -1
    this.touchedScroll = null
    this.touchPoint = null
    this.touchMoveCount = 0
    this.touchHandlers = {
      'touchstart': this.handleTouchStart.bind(this),
      'touchmove': this.handleTouchMove.bind(this),
      'touchend': this.handleTouchEnd.bind(this)
    }

  }

  render () {
    const {props, state, body} = this
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
             role='tablist'
             ref={(header) => { this.header = header }}>
          {
            buttons.map((text, i) => (
              <TheTab.Button key={i}
                             role='tab'
                             onClick={() => onChange({activeIndex: i})}
                             active={nextIndex === i}
                             movingRate={activeIndex === i ? movingRate : 0}
              >{text}</TheTab.Button>
            ))
          }
        </div>
        <div className='the-tab-body'
             ref={(body) => { this.body = body }}
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
               ref={(inner) => { this.inner = inner }}

          >
            {
              React.Children.map(children, (child, i) => (
                <div key={i}
                     ref={(contentWrap) => {this.contentWraps[i] = contentWrap}}
                     role='tabpanel'
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
    this.resize(this.props.activeIndex)
    this.resizeTimer = setInterval(() => this.resize(this.state.nextIndex), 300)

    for (const [event, handler] of Object.entries(this.touchHandlers)) {
      this.inner.addEventListener(event, handler)
    }
  }

  componentWillReceiveProps (nextProps) {
    const {props} = this
    const nextIndex = nextProps.activeIndex
    const updateNextIndex = (nextIndex === null) || (props.activeIndex !== nextIndex)
    if (updateNextIndex) {
      this.setState({nextIndex})
      this.resize(nextIndex)
    }
  }

  componentWillUnmount () {
    clearInterval(this.resizeTimer)
    clearTimeout(this.movingTimer)

    for (const [event, handler] of Object.entries(this.touchHandlers)) {
      this.inner.removeEventListener(event, handler)
    }
  }

  resize (activeIndex) {
    const contentWrap = this.contentWraps[activeIndex]
    const bodyHeight = contentWrap && contentWrap.offsetHeight
    const needsUpdateState = bodyHeight && (bodyHeight !== this.state.bodyHeight)
    if (needsUpdateState) {
      this.setState({bodyHeight})
    }
  }

  getBounds () {
    const {activeIndex, buttons} = this.props
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
    const {header} = this
    this.touchedScroll = sourceElementScrollFor(e)
    this.touchPoint = pointFromTouchEvent(e)
    this.touchMoveCount = 0
    clearTimeout(this.movingTimer)
    this.setState({
      nextIndex: this.props.activeIndex,
      animating: false
    })
    this.buttons = [
      ...header.querySelectorAll('.the-tab-button')
    ]
  }

  handleTouchMove (e) {
    const touchedScroll = sourceElementScrollFor(e)
    const scrolled = this.touchedScroll.left !== touchedScroll.left
    if (scrolled) {
      return
    }
    this.touchedScroll = touchedScroll
    const isFirstMove = this.touchMoveCount === 0
    this.touchMoveCount++
    if (isFirstMove) {
      return
    }

    const point = pointFromTouchEvent(e)
    if (!this.touchPoint) {
      this.touchPoint = point
      return
    }
    const vx = point.x - this.touchPoint.x
    const vy = point.y - this.touchPoint.y
    const avy = Math.abs(vy)
    const avx = Math.abs(vx)
    let isHorizontal = avy < 20 && avy < avx
    if (isHorizontal) {
      const {activeIndex} = this.props
      const translateX = this.state.translateX + vx
      this.setState({translateX})

      const amount = this.movingAmountFor(translateX)
      const nextIndex = activeIndex + amount

      if (this.state.nextIndex !== nextIndex) {
        this.resize(nextIndex)
        this.setState({nextIndex})
      }

      const movingRate = this.movingRateFor(translateX)
      if (this.state.movingRate !== movingRate) {
        this.setState({movingRate})
      }
    }
    this.touchPoint = point
  }

  handleTouchEnd (e) {
    const {body} = this
    const {translateX} = this.state
    const amount = this.movingAmountFor(translateX)
    const {activeIndex, onChange} = this.props
    const toLeft = amount < 0
    if (toLeft) {
      this.moveTo(body.offsetWidth, () =>
        onChange({activeIndex: activeIndex - 1})
      )
      return
    }
    const toRight = amount > 0
    if (toRight) {
      this.moveTo(body.offsetWidth * -1, () =>
        onChange({activeIndex: activeIndex + 1})
      )
      return
    }
    this.moveTo(0)
    this.touchPoint = null
    this.touchedScroll = null
  }

  moveTo (x, callback) {
    this.setState({animating: true})
    clearTimeout(this.movingTimer)
    this.setState({
      movingRate: 0,
      translateX: x
    })
    this.movingTimer = setTimeout(() => {
      this.setState({
        animating: false,
        translateX: 0
      })
      callback && callback()
    }, 300)
  }

  movingAmountFor (x) {
    const {body} = this
    const threshold = Math.min(80, body.offsetWidth / 2)
    const {buttons, activeIndex} = this.props
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
    const {body} = this
    return chopcal.floor(x / body.offsetWidth, 0.001)
  }

  scrollHeader (amount) {
    if (this.headerScrolling) {
      return
    }
    this.headerScrolling = true
    setTimeout(() => {
      this.header.scrollLeft += amount
      this.headerScrolling = false
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
