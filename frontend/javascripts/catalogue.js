/**
 * Created by Ruslan on 06-Apr-16.
 */

'use strict';

let templateFunc = require('../templates/file-catalogue-template.hbs');

class Catalogue {
  constructor(options) {
    this._el = options.element;

    this._el.addEventListener('click', this._onFolderIcoClick.bind(this));
    this._el.addEventListener('click', this._onAddCommentClick.bind(this));
    this._el.addEventListener('click', this._onSaveCommentClick.bind(this));
  }

  renderTree() {
    this._getTreeFromServer('./', (tree) => {
      this._el.innerHTML = templateFunc({
        files: tree.children
      });
    });
  }

  _onFolderIcoClick(event) {
    if (event.target.dataset.selector !== 'folder-ico') {
      return;
    }

    let folderElement = event.target.closest('[data-selector="folder"]');
    
    let state = folderElement.dataset.state;

    if (state === 'closed') {
      this._expandFolder(folderElement);
    } else {
      this._reduceFolder(folderElement);
    }


  }

  _onAddCommentClick(event) {
    let button = event.target;
    if (button.dataset.selector !== 'add-comment-button') {
      return;
    }

    let fileElement = button.closest('[data-component="file"]');
    this._showCommentFormOn(fileElement);
  }

  _onSaveCommentClick(event) {
    let button = event.target;
    if (button.dataset.selector !== 'save-comment-button') {
      return;
    }

    let fileElement = button.closest('[data-component="file"]');
    let commentInput = fileElement.querySelector('[data-selector="comment-input"]');
    let comment = commentInput.value;

    this._sendCommentToServer(comment, fileElement);
    commentInput.classList.add('js-hidden');
    button.classList.add('js-hidden');

    this._addCommentToContainer(fileElement, comment);
  }

  _expandFolder(folderElement) {
    let folderPath = folderElement.dataset.path;

    this._getTreeFromServer(folderPath, (tree) => {
      folderElement.insertAdjacentHTML('beforeEnd', templateFunc({
        files: tree.children
      }));
      folderElement.dataset.state = 'opened';
    });
  }

  _reduceFolder(folderElement) {
    let innerFiles = folderElement.querySelectorAll('[data-component="file"]');

    [].forEach.call(innerFiles, function (fileElement) {
      folderElement.removeChild(fileElement);
    });

    folderElement.dataset.state = 'closed';
  }

  _showCommentFormOn(element) {
    let input = element.querySelector('[data-selector="comment-input"]');
    let button = element.querySelector('[data-selector="save-comment-button"]');

    input.classList.remove('js-hidden');
    button.classList.remove('js-hidden');
  }

  _sendCommentToServer(comment, fileElement) {
    var req = new XMLHttpRequest();
    req.open('POST', '/comment');
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var obj = {
      filePath: fileElement.dataset.path,
      comment: comment
    };

    req.send(JSON.stringify(obj));

    req.onreadystatechange = function () {
      if (req.readyState != 4) {
        return;
      }

      if (req.status != 200) {
        alert('ошибка: ' + (req.status ? req.statusText : 'запрос не удался'));
        return;
      }
    }.bind(this);
  }

  _getTreeFromServer(path, callback) {
    var req = new XMLHttpRequest();
    req.open('GET', '/catalogue/' + encodeURIComponent(path), true);
    req.send();

    req.onreadystatechange = () => {
      if (req.readyState != 4) {
        return;
      }

      if (req.status != 200) {
        console.log('Error: ' + (req.status ? req.statusText : 'cant get tree from server'));
        return;
      }

      callback(JSON.parse(req.responseText));
    };
  }

  _addCommentToContainer(element, comment) {
    let container = element.querySelector('[data-selector="comment-container"]');

    container.insertAdjacentHTML('beforeEnd', '- ' + comment);
  }
}

module.exports = Catalogue;