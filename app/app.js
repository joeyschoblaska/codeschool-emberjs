var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});

App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Router.map(function() {
  this.route('credits', { path: '/thanks' });
  this.resource('products', function() {
    this.resource('product', {path: '/:product_id'});
    this.route('onsale');
    this.route("deals");
  });
  this.resource('contacts', function() {
    this.resource('contact', {path: '/:contact_id'});
  });
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll("product");
  }
});

App.IndexController = Ember.ArrayController.extend({
  productsCount: Ember.computed.alias("length"),
  logo: 'images/logo-small.png',
  time: function() {
    return (new Date()).toDateString();
  }.property(),
  onSale: function() {
    return this.filterBy("isOnSale").slice(0,3);
  }.property("@each.isOnSale")
});

App.ContactsIndexController = Ember.ObjectController.extend({
  contactName: Ember.computed.alias("name"),
  avatar: "images/avatar.png",
  open: function() {
    return ((new Date()).getDay() === 0) ? "closed" : "open";
  }.property()
});

App.ContactsIndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find("contact", 1);
  }
});

App.ProductsController = Ember.ArrayController.extend({
  sortProperties: ["title"]
});

App.ProductsRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll("product");
  }
});

App.ProductsIndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.findAll("product");
  }
});

App.ProductsDealsRoute = Ember.Route.extend({
  model: function(){
    return this.modelFor("products").filter(function(product){
      return product.get("price") < 500;
    });
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

App.ContactsController = Ember.ArrayController.extend({
  sortProperties: ["name"]
})

App.Product = DS.Model.extend({
  title: DS.attr("string"),
  price: DS.attr("number"),
  description: DS.attr("string"),
  isOnSale: DS.attr("boolean"),
  image: DS.attr("string"),
  reviews: DS.hasMany("review", {async: true}),
  crafter: DS.belongsTo("contact", {async: true}),
  ratings: DS.attr(),
  rating: function(){
    return this.get('ratings').reduce(function(previousValue, rating) {
      return previousValue + rating;
    }, 0) / this.get('ratings').length;
  }.property('ratings.@each')
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
    reviews: [100,101],
    ratings: [2,1,3,3]
  },
  {
    id: 2,
    crafter: 2,
    title: "Kindling",
    price: 249,
    description: 'Easily combustible small sticks or twigs used for starting a fire.',
    isOnSale: false,
    image: "images/products/kindling.png",
    ratings: [2,1,3,3]
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

App.ProductsOnsaleRoute = Ember.Route.extend({
  model: function() {
    // get model from ProductsController
    return this.modelFor("products").filterBy("isOnSale");
  }
});

App.ProductDetailsComponent = Ember.Component.extend({
  reviewsCount: Ember.computed.alias("product.reviews.length"),
  hasReviews: function() {
    return this.get("reviewsCount") > 0;
  }.property("reviewsCount")
});

App.ContactDetailsComponent = Ember.Component.extend({
  productsCount: Ember.computed.alias("contact.products.length"),
  isProductive: function(){
    return this.get("productsCount") > 3
  }.property("productsCount")
})

App.ProductView = Ember.View.extend({
  classNames: ["row"],
  classNameBindings: ["isOnSale"],
  isOnSale: Ember.computed.alias("controller.isOnSale")
})

App.ReviewsController = Ember.ArrayController.extend({
  sortProperties: ["reviewedAt"],
  sortAscending: false
})

App.ProductController = Ember.ObjectController.extend({
  review: function() {
    return this.store.createRecord("review", {
      product: this.get("model"),
      text: ""
    });
  }.property("model"),
  ratings: [1, 2, 3, 4, 5],
  selectedRating: 5,
  isNotReviewed: Ember.computed.alias("review.isNew"),
  actions: {
    createReview: function() {
      var controller = this;
      controller.get("review").set("reviewedAt", new Date());
      controller.get("review").save().then(function(review) {
        controller.get("model.reviews").addObject(review);
      });
    },
    createRating: function() {
      var product = this.get('model'),
      selectedRating = this.get('selectedRating');
      product.get('ratings').addObject(selectedRating);
      product.save();
    }
  }
})
