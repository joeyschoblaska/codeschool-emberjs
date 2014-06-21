var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.Router.map(function() {
  this.route('credits', { path: '/thanks' });
  this.route('about');
});

App.IndexController = Ember.Controller.extend({
  productsCount: 6,
  logo: 'images/logo-small.png',
  time: function() {
    return (new Date()).toDateString();
  }.property()
});

App.AboutController = Ember.Controller.extend({
  contactName: "Joey Schoblaska",
  avatar: "images/avatar.png",
  open: function() {
    return ((new Date()).getDay() === 0) ? "closed" : "open";
  }.property()
});
