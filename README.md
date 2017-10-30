the-tab
==========

<!---
This file is generated by ape-tmpl. Do not update manually.
--->

<!-- Badge Start -->
<a name="badges"></a>

[![Build Status][bd_travis_shield_url]][bd_travis_url]
[![npm Version][bd_npm_shield_url]][bd_npm_url]
[![JS Standard][bd_standard_shield_url]][bd_standard_url]

[bd_repo_url]: https://github.com/the-labo/the-tab
[bd_travis_url]: http://travis-ci.org/the-labo/the-tab
[bd_travis_shield_url]: http://img.shields.io/travis/the-labo/the-tab.svg?style=flat
[bd_travis_com_url]: http://travis-ci.com/the-labo/the-tab
[bd_travis_com_shield_url]: https://api.travis-ci.com/the-labo/the-tab.svg?token=
[bd_license_url]: https://github.com/the-labo/the-tab/blob/master/LICENSE
[bd_codeclimate_url]: http://codeclimate.com/github/the-labo/the-tab
[bd_codeclimate_shield_url]: http://img.shields.io/codeclimate/github/the-labo/the-tab.svg?style=flat
[bd_codeclimate_coverage_shield_url]: http://img.shields.io/codeclimate/coverage/github/the-labo/the-tab.svg?style=flat
[bd_gemnasium_url]: https://gemnasium.com/the-labo/the-tab
[bd_gemnasium_shield_url]: https://gemnasium.com/the-labo/the-tab.svg
[bd_npm_url]: http://www.npmjs.org/package/the-tab
[bd_npm_shield_url]: http://img.shields.io/npm/v/the-tab.svg?style=flat
[bd_standard_url]: http://standardjs.com/
[bd_standard_shield_url]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg

<!-- Badge End -->


<!-- Description Start -->
<a name="description"></a>

Tab for the-components

<!-- Description End -->


<!-- Overview Start -->
<a name="overview"></a>



<!-- Overview End -->


<!-- Sections Start -->
<a name="sections"></a>

<!-- Section from "doc/guides/01.Installation.md.hbs" Start -->

<a name="section-doc-guides-01-installation-md"></a>

Installation
-----

```bash
$ npm install the-tab --save
```


<!-- Section from "doc/guides/01.Installation.md.hbs" End -->

<!-- Section from "doc/guides/02.Usage.md.hbs" Start -->

<a name="section-doc-guides-02-usage-md"></a>

Usage
---------

[Live Demo](https://the-labo.github.io/the-tab/doc/demo/index.html#/) is hosted on GitHub Page

```javascript
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
          <TheTab.Content style={{height: '300px'}}>
            This is Content 02
            <br/>
            <a href="http://example.com">With some link</a>
          </TheTab.Content>
          <TheTab.Content spinning>
            This is Content 03

          </TheTab.Content>
        </TheTab>
      </div>

    )
  }
}

export default ExampleComponent

```


<!-- Section from "doc/guides/02.Usage.md.hbs" End -->

<!-- Section from "doc/guides/03.Components.md.hbs" Start -->

<a name="section-doc-guides-03-components-md"></a>

Components
-----------

### TheTab

Tab for the-components

**Props**

| Name | Type | Description | Default |
| --- | --- | ---- | ---- |
| `activeIndex` | number  | Active tab index | `0` |
| `buttons` | arrayOf node | Tab buttons | `[]` |
| `onChange` | func  | Change handler | `() => {}` |

### TheTabStyle

Style for TheTab

**Props**

| Name | Type | Description | Default |
| --- | --- | ---- | ---- |
| `options` | object  | Style options | `{}` |



<!-- Section from "doc/guides/03.Components.md.hbs" End -->


<!-- Sections Start -->


<!-- LICENSE Start -->
<a name="license"></a>

License
-------
This software is released under the [MIT License](https://github.com/the-labo/the-tab/blob/master/LICENSE).

<!-- LICENSE End -->


<!-- Links Start -->
<a name="links"></a>

Links
------

+ [THE Labo][t_h_e_labo_url]

[t_h_e_labo_url]: https://github.com/the-labo

<!-- Links End -->
