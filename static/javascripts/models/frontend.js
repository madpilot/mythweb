var Frontend = Backbone.Model.extend({});
var Frontends = Backbone.Collection.extend({
  url: '/frontends.json',
  model: Frontend
});
