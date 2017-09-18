paper-date-picker
=================

**NOTE:** in bower, this package is `polymer-paper-date-picker`

Material Design date picker, compatible with *Polymer 1.0*

Provides a responsive date picker based on the material design spec. This
component aims to be a clone of the date picker introduced in Android Lollipop.

![wide picker screenshot][wide] ![narrow picker screenshot][narrow]

See the [component page](http://bendavis78.github.io/paper-date-picker/) for 
full documentation.

## Examples:

Default picker:

```html
<paper-date-picker></paper-date-picker>
```

Setting the initial date to April 20, 2015:
```html
<paper-date-picker date="April 20, 2015"></paper-date-picker>
```

You may also specify a minimum and/or maximum date allowed in this picker using
the same date notation:
```html
<paper-date-picker min-date="April 1, 2015" max-date="June 30, 2015"></paper-date-picker>
```

If you include this element as part of `paper-dialog`, use the class
`"paper-date-picker-dialog"` on the dialog element in order to give it proper
styling:
```html
<paper-dialog id="dialog" class="paper-date-picker-dialog" modal
  on-iron-overlay-closed="dismissDialog">
  <paper-date-picker id="picker" date="[[date]]"></paper-date-picker>
  <div class="buttons">
    <paper-button dialog-dismiss>Cancel</paper-button>
    <paper-button dialog-confirm>OK</paper-button>
  </div>
</paper-dialog>
```

# Reporting Bugs

When filing a bug report, please provide an example of how to repoduce using
plunker, jsbin, jsfiddle, etc. You can use the following plunker as a starting
point: http://plnkr.co/edit/9c787GHiBzX7zI5x6gsX

# Contributing

Pull requests are welcome and greatly appreciated. However, in order to speed
up the review process, pull requests will not be merged if they include
multiple unrelated changes (eg: "Fix for XYZ and other tweaks"). Also, don't
include "opinionated" changes that aren't necessary for the feature or bugfix.

When submitting a PR for a bugfix, please reference the issue number in the
commit message. For example: "Fixes issue #123".


---

If you find this component useful, please show your support by donating to
[Bold Idea](http://boldidea.org). Click the button below!

[![Donate to Bold Idea][donate]](https://boldidea.org/donate)

[wide]: http://i.imgur.com/I0SjSWf.png
[narrow]: http://i.imgur.com/SsrLJDo.png
[donate]: http://boldidea.org/static/donate-badge-md-1.png
