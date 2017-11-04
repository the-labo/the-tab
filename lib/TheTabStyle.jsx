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
    backgroundColor = ThemeValues.backgroundColor,
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
      overflowX: 'auto',
      boxSizing: 'border-box',
      padding: '0 0 24px',
      marginBottom: '-24px',
      flexWrap: 'nowrap'
    },
    '.the-tab-body': {
      position: 'relative',
      width: '100%',
      overflowX: 'hidden',
      boxSizing: 'border-box',
      border: `1px solid ${lightBorderColor}`,
      backgroundColor,
      transition: 'height 300ms',
      zIndex: 2
    },
    '.the-tab-body-inner': {
      display: 'flex',
      position: 'relative',
      boxSizing: 'border-box',
      alignItems: 'flex-start',
      marginTop: '-1px',
      '&.the-tab-body-inner-animating': {
        transition: 'transform 300ms'
      },
      '&.react-draggable-dragging': {
        transition: 'none'
      }
    },
    '.the-tab-content-wrap': {
      width: '100%',
      flexShrink: 0
    },
    '.the-tab-content': {
      width: '100%',
      border: `1px solid ${lightBorderColor}`,
      marginRight: '-1px',
      padding: '8px',
      transition: 'height 300ms',
      boxSizing: 'border-box',
      borderTop: 'none',
      borderBottom: 'none',
      position: 'relative',
      '&:first-child': {
        borderLeft: 'none'
      },
      '&:last-child': {
        borderRight: 'none'
      }
    },
    '.the-tab-button': {
      fontSize: 'small',
      padding: '12px 4px',
      width: '100%',
      backgroundColor,
      margin: '0',
      color: lightTextColor,
      position: 'relative',
      minHeight: '24px',
      lineHeight: '1em',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipses',
      border: 'none',
      borderRadius: 0,
      boxShadow: 'none',
      '&:hover': {
        boxShadow: 'none',
        color: textColor
      },
      '&:active': {
        boxShadow: 'none'
      },
      '&.the-tab-button-active': {
        color: dominantColor,
        opacity: 1,
        cursor: 'default',
        overflow: 'visible'
      },
      '.the-tab-button-active-bar': {
        position: 'absolute',
        left: 0,
        bottom: 0,
        zIndex: 2,
        right: 0,
        height: '2px',
        display: 'block',
        background: dominantColor,
        transition: 'transform 100ms'
      }
    }
  })
}

export default TheTabStyle
