/**
 * Created by Ruslan on 06-Apr-16.
 */
class Page{
  constructor(options){
    this._el = options.element;
    this._catalogue = new Catalogue({
      element: this._el.querySelector('[data-component="catalogue"]')
    });

    this._getCatalogueTreeFromServer();
  }
  
  _getCatalogueTreeFromServer(){
    var req = new XMLHttpRequest();
    req.open('GET', '/catalogue', true);
    req.send();

    req.onreadystatechange = function () {
      if (req.readyState != 4){
        return;
      }

      if (req.status != 200) {
        console.log( 'Error: ' + (req.status ? req.statusText : 'cant get tree from server') );
        return;
      }

      this._catalogue.renderTree(JSON.parse(req.responseText));
    }.bind(this);
  }
}