paper-date-picker
=================
Material Design date picker, compatible with *Polymer 1.0*

Provides a responsive date picker based on the material design spec. This
component aims to be a clone of the date picker introduced in Android Lollipop.

![wide picker screenshot][wide] ![narrow picker screenshot][narrow]

See the [component page](http://bendavis78.github.io/paper-date-picker/) for 
full documentation.

## Example usage:

Default picker:

```html
<paper-date-picker></paper-date-picker>
```

Setting the initial date to April 20, 2015:

```html
<paper-date-picker date="2014-04-20"></paper-date-picker>
```

If you include this element as part of `paper-dialog`, use the class
`"paper-date-picker-dialog"` on the dialog in order to give it proper styling.

```html
    <paper-action-dialog id="dialog" modal class="paper-date-picker-dialog">
      <paper-date-picker id="datePicker"></paper-date-picker>
      <div class="buttons">
        <paper-button dialog-dismiss>Cancel</paper-button>
        <paper-button dialog-confirm>OK</paper-button>
      </div>
    </paper-action-dialog>
```

## Development

### run locally 

```
npm install -g gulp
npm install
bower install
gulp serve
```
---

If you find this component useful, please show your support by donating to
[Bold Idea](http://boldidea.org). Click the button below!

[![ideaSpark campaign button][donate]](https://donorbox.org/bold-idea-make-ideaspark-possible-for-dallas-area-students)

[wide]: http://i.imgur.com/pnKuwtk.png
[narrow]: http://i.imgur.com/ExhVflG.png
[donate]: http://www.boldidea.org/donate-badge-md-1.png
