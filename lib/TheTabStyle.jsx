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
    textColor = ThemeValues.textColor,
    lightBackgroundColor = ThemeValues.lightBackgroundColor,
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
      marginBottom: '-1px',
      boxSizing: 'border-box',
      padding: '0',
    },
    '.the-tab-body': {
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box',
      border: `1px solid ${lightBorderColor}`,
      background: 'white'
    },
    '.the-tab-body-inner': {
      display: 'flex',
      position: 'relative',
      boxSizing: 'border-box',
      marginLeft: '-1px',
      marginTop: '-1px',
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
      fontSize: 'small',
      padding: '8px 16px',
      backgroundColor: lightBackgroundColor,
      borderRadius: '0',
      margin: '0',
      color: lightTextColor,
      position: 'relative',
      borderColor: lightBorderColor,
      borderBottom: 'none',
      minHeight: '24px',
      lineHeight: '1em',
      cursor: 'pointer',
      '&:hover': {
        color: textColor
      },
      '&:active': {
        boxShadow: 'none',
        opacity: 0.8
      },
      '&.the-tab-button-active': {
        borderColor: lightBorderColor,
        background: 'white',
        color: textColor,
        opacity: 1,
        zIndex: 4,
        cursor: 'default'
      },
      '.the-tab-button-active-bar': {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 2,
        right: 0,
        height: '2px',
        display: 'block',
        background: dominantColor
      }
    }
  })
}

export default TheTabStyle
