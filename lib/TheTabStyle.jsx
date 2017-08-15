'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import c from 'classnames'
import TheStyle from 'the-style'
import { asStyleData } from 'the-component-util'

/** Style for TheTab */
const TheTabStyle = ({id, className, options}) => (
  <TheStyle {...{id}}
            className={c('the-tab-style', className)}
            styles={TheTabStyle.data(options)}
  />
)

TheTabStyle.displayName = 'TheTabStyle'
TheTabStyle.propTypes = {
  /** Style options */
  options: PropTypes.object
}

TheTabStyle.defaultProps = {
  options: {}
}

TheTabStyle.data = (options) => {
  const {ThemeValues} = TheStyle
  const {
    dominantColor = ThemeValues.dominantColor,
    lightTextColor = ThemeValues.lightTextColor,
    lightBorderColor = ThemeValues.lightBorderColor
  } = options
  return asStyleData('.the-tab', {
    '&': {},
    '.the-tab-header': {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      overflow: 'auto',
      marginBottom: '-1px'
    },
    '.the-tab-body': {
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box',
      border: `1px solid ${lightBorderColor}`
    },
    '.the-tab-body-inner': {
      display: 'flex',
      position: 'relative',
      boxSizing: 'border-box',
      marginLeft: '-1px',
      '&.the-tab-body-inner-animating': {
        transition: 'transform 300ms'
      },
      '&.react-draggable-dragging': {
        transition: 'none'
      }
    },
    '.the-content-content': {
      width: '100%',
      border: `1px solid ${lightBorderColor}`,
      marginRight: '-1px',
      padding: '8px',
      boxSizing: 'border-box'
    },
    '.the-tab-button': {
      fontSize: 'smaller',
      background: 'white',
      padding: '4px 8px',
      borderRadius: '8px 8px 0 0',
      backgroundColor: 'transparent',
      margin: '0 -1px 0 0',
      color: lightTextColor,
      position: 'relative',
      borderColor: lightBorderColor,
      '&.the-tab-button-active': {
        backgroundColor: dominantColor,
        borderColor: dominantColor,
        color: 'white',
        zIndex: 4
      }
    }
  })
}

export default TheTabStyle
