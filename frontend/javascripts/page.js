/**
 * Created by Ruslan on 06-Apr-16.
 */

'use strict';

let Catalogue = require('./catalogue');

class Page{
  constructor(options){
    this._el = options.element;
    this._catalogue = new Catalogue({
      element: this._el.querySelector('[data-component="catalogue"]')
    });

    this._catalogue.renderTree();
  }
}

module.exports = Page;