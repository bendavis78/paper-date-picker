PolymerExpressions.prototype.dateFormat = function(date, format) {
  if (!date) return '';
  return moment(date).format(format);
};
