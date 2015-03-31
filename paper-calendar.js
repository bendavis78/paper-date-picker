(function() {
  Polymer("paper-calendar", {
    observe: {
      '$.calendarList.offsetHeight': 'calendarListReady'
    },
    once: function(obj, eventName, callback) {
      var doCallback = function() {
        callback.apply(obj, arguments);
        obj.removeEventListener(eventName, doCallback);
      };
      obj.addEventListener(eventName, doCallback);
    },
    publish: {
      locale: null,
      minYear: null,
      maxYear: null,
      initialMonth: null,
      isTouch: {type: 'boolean', value: false, reflect: true}
    },
    localeChanged: function() {
      moment.locale(this.locale);
    },
    ready: function() {
      this.selectedDate = null;
      this.isTouch = 'ontouchstart' in window;
      this.months = [];
      this.years = [];
      this.today = new Date();
      this._physicalYears = [];
      this.initialDate = this.initialDate ? this.initialDate : this.today;
      this.today.setHours(0, 0, 0, 0);
      this.weekdays = moment.weekdays();
      this.monthNames = moment.months();
      this.localeChanged();
      this.startYear = this.startYear ? this.startYear : 1900;
      this.endYear = this.endYear ? this.endYear : 2100;
      for (var y=this.startYear; y<=this.endYear; y++) {
        this.years.push(y);
      }
      this.async(function() {
        this.populate(this.initialDate.getFullYear());
      });
      this.scrollToDate(this.initialDate);
    },
    /* TODO: figure out a user-friendly way to auto-populate years
     * It takes more time on mobile, so there should be some indication that a
     * year is loading. One idea is to make it so that when the user scrolls to
     * the bottom, an indicator appears showing that the content for that year is
     * loading. We'd need extra logic to handle scrolling and removal of years
     * that are hidden from view.
    loadMoreUpper: function() {
    },
    loadMoreLower: function() {
    }
    */
    populate: function(year) {
      // this currently replaces the 
      this.months = [];
      var month, days, day, date = new Date();
      var thisYear = this.today.getFullYear();
      var thisMonth = this.today.getMonth();
      var thisDay = this.today.getDate();

      date.setYear(year);
      for (month=0; month<12; month++) {
        // days are split into weeks
        days = [[]];
        day = 1;
        date.setMonth(month);
        date.setDate(1);
        
        // add "padding" days
        for (d=0; d<date.getDay(); d++) {
          days[0].push({day: null});
        }

        // add actual days 
        while (date.getMonth() == month) {
          if (d % 7 == 0) {
            // start new week
            days.push([]);
          }
          days[days.length-1].push({
            name: year + '-' + (month+1) + '-' + day,
            year: year,
            month: month,
            day: day,
            isToday: year == thisYear && month == thisMonth && day == thisDay
          });
          date.setDate(++day);
          d++;
        }
        monthData = {
          year: year,
          month: month,
          days: days,
          domReady: false
        };
        this.months.push(monthData);
      }
    },
    getMonthIdx: function(year, month) {
      var yearDiff = (year - this.months[0].year);
      var monthDiff = (month - this.months[0].month);
      return (yearDiff * 12) + monthDiff;
    },
    scrollToMonth: function(year, month) {
      this.once(this, 'calendar-list-ready', function() {
        var el = this.querySelector(':host /deep/ .month-' + year + '-' + month);
        this.$.calendarList.scrollTop = el.offsetTop;
      });
    },
    scrollToDate: function(date) {
      if (!date) {
        date = this.initialDate;
      }
      this.scrollToMonth(date.getFullYear(), date.getMonth());
    },
    dateSelected: function(event, detail) {
      var dateStr = detail.item.getAttribute('label');
      this.selectedDate = new Date(dateStr);
      this.fire('date-select', {date: this.selectedDate}, this);
      this.scrollToDate(this.selectedDate);
    },
    calendarListReady: function() {
      this.fire('calendar-list-ready');
    },
    _getDayName: function(date) {
      return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    },
  });
})();
