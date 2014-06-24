var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Router.map(function() {
  this.route('credits', { path: '/thanks' });
  this.resource('products', function() {
    this.resource('product', {path: '/:product_id'});
  });
  this.resource('contacts', function() {
    this.resource('contact', {path: '/:contact_id'});
  });
});

App.IndexController = Ember.Controller.extend({
  productsCount: 6,
  logo: 'images/logo-small.png',
  time: function() {
    return (new Date()).toDateString();
  }.property()
});

App.ContactsIndexController = Ember.Controller.extend({
  contactName: "Joey Schoblaska",
  avatar: "images/avatar.png",
  open: function() {
    return ((new Date()).getDay() === 0) ? "closed" : "open";
  }.property()
});

App.ProductsRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll("product");
  }
});

// Ember automatically does this as long as we adhere to naming conventions
// App.ProductRoute = Ember.Route.extend({
//   model: function(params) {
//     return this.store.find("product", params.product_id);
//   }
// });

App.ContactsRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll("contact");
  }
});

App.Product = DS.Model.extend({
  title: DS.attr("string"),
  price: DS.attr("number"),
  description: DS.attr("string"),
  isOnSale: DS.attr("boolean"),
  image: DS.attr("string"),
  reviews: DS.hasMany("review", {async: true}),
  crafter: DS.belongsTo("contact", {async: true})
});

App.Product.FIXTURES = [
  {
    id: 1,
    crafter: 1,
    title: "Flint",
    price: 99,
    description: 'Flint is a hard, sedimentary cryptocrystalline form of the mineral quartz, categorized as a variety of chert.',
    isOnSale: true,
    image: "images/products/flint.png",
    reviews: [100,101]
  },
  {
    id: 2,
    crafter: 2,
    title: "Kindling",
    price: 249,
    description: 'Easily combustible small sticks or twigs used for starting a fire.',
    isOnSale: false,
    image: "images/products/kindling.png"
  }
]

App.Contact = DS.Model.extend({
  name: DS.attr("string"),
  avatar: DS.attr("string"),
  about: DS.attr("string"),
  products: DS.hasMany("product", {async: true})
});

App.Contact.FIXTURES = [
  {
    id: 1,
    name: "Adam",
    avatar: "images/contacts/adam.png",
    about: "About Adam...",
    products: [1]
  },
  {
    id: 2,
    name: "Martin",
    avatar: "images/contacts/martin.png",
    about: "About Martin...",
    products: [2]
  }
]

App.Review = DS.Model.extend({
  text: DS.attr("string"),
  reviewedAt: DS.attr("date"),
  product: DS.belongsTo("product")
});

App.Review.FIXTURES = [
  {
    id: 100,
    product: 1,
    text: "Revieewwweeewww!!!"
  },
  {
    id: 101,
    product: 2,
    text: "Another Revieewwweeewww!!!"
  }
]
