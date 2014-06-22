var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.PRODUCTS = [
  {
    title: "Flint",
    price: 99,
    description: 'Flint is a hard, sedimentary cryptocrystalline form of the mineral quartz, categorized as a variety of chert.',
    isOnSale: true,
    image: "images/products/flint.png"
  },
  {
    title: "Kindling",
    price: 249,
    description: 'Easily combustible small sticks or twigs used for starting a fire.',
    isOnSale: false,
    image: "images/products/kindling.png"
  }
]

App.CONTACTS = [
  {
    name: "Adam",
    avatar: "images/contacts/adam.png",
    about: "About Adam..."
  },
  {
    name: "Martin",
    avatar: "images/contacts/martin.png",
    about: "About Martin..."
  }
]

App.Router.map(function() {
  this.route('credits', { path: '/thanks' });
  this.route('about');
  this.resource('products');
  this.resource('product', {path: '/products/:title'});
  this.resource('contacts');
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

App.ProductsRoute = Ember.Route.extend({
  model: function() {
    return App.PRODUCTS;
  }
})

App.ProductRoute = Ember.Route.extend({
  model: function(params) {
    return App.PRODUCTS.findBy("title", params.title);
  }
})

App.ContactsRoute = Ember.Route.extend({
  model: function() {
    return App.CONTACTS;
  }
})
