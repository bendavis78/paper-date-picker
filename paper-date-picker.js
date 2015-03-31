(function() {
  var CALENDAR = 0
  var YEARLIST = 1

  Polymer("paper-date-picker", {
    publish: {
      responsiveWidth: '600px',
      locale: null,
      minYear: null,
      maxYear: null,
      narrow: {type: 'boolean', value: false, reflect: true},
      isTouch: {type: 'boolean', value: false, reflect: true}
    },
    ready: function() {
      this.today = this.$.calendar.today;
      this.isTouch = 'ontouchstart' in window;
      this.narrow = false;
      this.localeChanged();
      this.headingDate = this.value ? this.value : new Date();
      this.years = this.$.calendar.years;
    },
    tapHeadingDay: function() {
      this.$.calendar.scrollToDate(this.headingDate);
      if (this.$.pages.selected !== CALENDAR) {
        this.selectPage(CALENDAR);
      }
    },
    tapHeadingMonth: function() {
      this.tapHeadingDay();
    },
    tapHeadingYear: function() {
      var year = this.headingDate.getFullYear();
      this.scrollToYear(year);
      if (this.$.pages.selected !== YEARLIST) {
        this.$.yearSelector.selected = year.toString();
        this.selectPage(YEARLIST);
      }
    },
    selectPage: function(page, callback) {
      this.$.pages.selected = page;
    },
    scrollToYear: function(year) {
      this.async(function() {
        var el = this.$.yearList.querySelector('.year[label="' + year + '"]')
        this.$.yearList.scrollTop = el.offsetTop - 94;
      });
    },
    yearSelected: function(e, detail) {
      var year = parseInt(detail.item.getAttribute('label'));
      var headingDate = new Date(this.headingDate)
      if (year !== headingDate.getFullYear()) {
        this.async(function() {
          headingDate.setFullYear(year);
          this.headingDate = headingDate;
        });
        this.$.calendar.populate(year);
        this.async(function() {
          this.$.calendar.scrollToDate(this.headingDate);
          this.selectPage(CALENDAR)
        });
      }
    },
    dateSelected: function(e, detail) {
      this.value = detail.date;
    },
    valueChanged: function(oldValue, newValue) {
      if (newValue) {
        this.headingDate = newValue;
      } else {
        this.headingDate = this.today;
      }
    },
    // attributes that propagate to paper-calendar
    localeChanged: function() {
      moment.locale(this.locale);
      this.$.calendar.locale = this.locale;
    },
    minYearChanged: function() {
      this.$.calendar.minYear = this.minYear;
    },
    maxYearChanged: function() {
      this.$.calendar.maxYear = this.maxYear;
    },
  });
})();
