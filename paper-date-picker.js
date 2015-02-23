Polymer("paper-date-picker", {
  once: function(obj, eventName, callback) {
    var doCallback = function() {
      callback.apply(obj, arguments);
      obj.removeEventListener(eventName, doCallback);
    };
    obj.addEventListener(eventName, doCallback);
  },
  publish: {
    locale: '',
    showHeading: true,
    narrow: {type: 'boolean', value: false, reflect: true},
  },
  observe: {
    '$.calendarList._viewportSize': '_setCalendarReady',
    '$.yearList._viewportSize': '_setYearListReady',
  },
  localeChanged: function() {
    moment.locale(this.locale);
  },
  dateClicked: function(e) {
    var element = e.originalTarget ? e.originalTarget : e.toElement;
  },
  ready: function() {
    this.days = [];
    this.months = [];
    this.years = [];
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.narrow = false;
    this.weekdays = moment.weekdays();
    this.monthNames = moment.months();
    this.isTouch = 'ontouchstart' in window;
    this.localeChanged();
    this.startYear = 1900;
    this.endYear = 2100;
    this.populateCalendar();
    this.headingDate = this.value ? this.value : new Date();
    this.scrollToDate(this.headingDate);

    // track page transitions
    this.$.pages.addEventListener('core-animated-pages-transition-prepare', function() {
      this._pageTransitioning = true;
    });
    this.$.pages.addEventListener('core-animated-pages-transition-end', function() {
      this._pageTransitioning = false;
    });
  },
  populateCalendar: function() {
    var year, month, days, day, date = new Date();
    var thisYear = this.today.getFullYear();
    var thisMonth = this.today.getMonth();
    var thisDay = this.today.getDate();

    for (year=this.startYear; year<=this.endYear; year++) {
      date.setYear(year);
      for (month=0; month<12; month++) {
        days = [];
        day = 1;
        date.setMonth(month);
        date.setDate(1);
        
        // add "padding" days
        for (d=0; d<date.getDay(); d++) {
          days.push({day: null});
        }

        // add actual days 
        while (date.getMonth() == month) {
          days.push({
            year: year,
            month: month,
            day: day,
            isToday: year == thisYear && month == thisMonth && day == thisDay
          });
          date.setDate(++day);
        }
        monthData = {
          year: year,
          month: month,
          days: days
        };
        this.months.push(monthData);
        this.days.push(days);
      }
      this.years.push({year: year});
    }
  },
  getMonthIdx: function(year, month) {
    var yearDiff = (year - this.months[0].year);
    var monthDiff = (month - this.months[0].month);
    return (yearDiff * 12) + monthDiff;
  },
  tapHeadingDay: function() {
    if (this.$.pages.selected !== 0) {
      this.selectPage(0, function() {
        this.scrollToDate(this.headingDate);
      }.bind(this));
    } else {
      this.scrollToDate(this.headingDate);
    }
  },
  tapHeadingMonth: function() {
    this.tapHeadingDay();
  },
  tapHeadingYear: function() {
    var year = this.headingDate.getFullYear();
    this.scrollYearList(year);
    this.selectPage(1);
  },
  selectPage: function(page, callback) {
    if (this._pageTransitioning) return;
    if (callback) {
      this.once(this.$.pages, 'core-animated-pages-transition-end', callback);
    }
    this.$.pages.selected = page;
  },
  scrollToMonth: function(year, month) {
    var idx = this.getMonthIdx(year, month);
    var cal = this.$.calendarList;
    if (!this._calendarReady) {
      this.addEventListener('calendar-ready', function() {
        cal.scrollToGroup(idx);
      });
    } else {
      cal.scrollToGroup(idx);
    }
  },
  scrollToDate: function(date) {
    if (!date) {
      date = this.value;
    }
    this.scrollToMonth(date.getFullYear(), date.getMonth());
  },
  scrollYearList: function(year, cb) {
    var idx = year - this.startYear;
    if (!this._yearListReady) {
      this.addEventListener('year-list-ready', function() {
        this.$.yearList.scrollToItem(idx);
        this.$.yearList.scrollTop -= 94;
        if(cb) cb();
      }.bind(this));
    } else {
      this.$.yearList.scrollToItem(idx);
      this.$.yearList.scrollTop -= 94;
      if(cb) cb();
    }
  },
  _setCalendarReady: function() {
    if (!this._calendarReady) {
      this._calendarReady = true;
      this.fire('calendar-ready');
    }
  },
  _setYearListReady: function() {
    if (!this._yearListReady) {
      this._yearListReady = true;
      this.fire('year-list-ready');
    }
  },
  selectedDateChanged: function() {
    console.log(arguments);
    var d = this.selectedDate;
    this.value = new Date(d.year, d.month, d.day);
  },
  selectedYearChanged: function(oldValue, newValue) {
    console.log('year changed');
    this.scrollToMonth(this.selectedYear.year, this.headingDate.getMonth());
    if (!oldValue) return;
    if (this.$.pages.selected == 1) {
      this.selectPage(0);
    }
  },
  headingDateChanged: function() {
    if (!this.selectedYear) {
      var idx = this.headingDate.getFullYear() - this.startYear;
      if (!this._yearListReady) {
        this.addEventListener('year-list-ready', function() {
          this.$.yearList.selectItem(idx);
        });
      } else {
        this.$.yearList.selectItem(idx);
      }
    }
  },
  valueChanged: function() {
    console.log('valueChanged: ', this.value);
    this.headingDate = this.value;
    var year = this.value.getFullYear();
    var month = this.value.getMonth();
    var idx = this.getMonthIdx(year, month);
    var monthStart = (new Date(year, month, 1)).getDay();
    var day = this.days[idx][monthStart + this.value.getDate() - 1];
    if (!this._calendarReady) {
      this.addEventListener('calendar-ready', function() {
        this.$.calendarList.$.selection.select(day);
      });
    } else {
      this.$.calendarList.$.selection.select(day);
    }
  },
});

PolymerExpressions.prototype.dateFormat = function(date, format) {
  if (!date) return '';
  return moment(date).format(format);
};
