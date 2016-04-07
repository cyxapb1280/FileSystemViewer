/**
 * Created by Ruslan on 06-Apr-16.
 */
class Catalogue {
  constructor(options) {
    this._el = options.element;
    this._tree = null;

    this._el.addEventListener('click', this._onFolderClick.bind(this));
    this._el.addEventListener('click', this._onAddCommentClick.bind(this));
    this._el.addEventListener('click', this._onSaveCommentClick.bind(this));
  }

  renderTree(tree) {
    this._tree = tree;

    for (let i in tree.children) {
      this._createAndShowFile(tree.children[i], this._el);
    }
  }

  _onFolderClick(event) {
    let folderElement = event.target;
    if (folderElement.dataset.selector !== 'folder') {
      return;
    }

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
    this._addCommentFormTo(fileElement);
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
    commentInput.remove();
    button.remove();

    fileElement.innerHTML += comment + '<br>';
  }

  _expandFolder(folderElement) {
    let folderPath = folderElement.dataset.path;
    let folder = this._findFolderInTree(folderPath);
    for (let i in folder.children) {
      this._createAndShowFile(folder.children[i], folderElement);
    }
    folderElement.dataset.state = 'opened';

  }

  _reduceFolder(folderElement) {
    let innerFiles = folderElement.querySelectorAll('[data-component="file"]');

    [].forEach.call(innerFiles, function (fileElement) {
      folderElement.removeChild(fileElement);
    });

    folderElement.dataset.state = 'closed';
  }

  _createAndShowFile(file, container) {
    let fileElement = document.createElement('div');
    fileElement.setAttribute('data-component', 'file');
    fileElement.setAttribute('data-path', file.path);
    fileElement.classList.add('file-container');

    this._addCommentButtonTo(fileElement);

    fileElement.innerHTML += 'Path: ' + file.path + '<br>' +
                              'Name: ' + file.name + '<br>' +
                              'Type: ' + file.type + '<br>';

    if (file.type === 'folder') {
      fileElement.innerHTML += 'Content: ' + file.children.length + 'files<br>';
      fileElement.setAttribute('data-selector', 'folder');
      fileElement.setAttribute('data-path', file.path);
      fileElement.setAttribute('data-state', 'closed');
    }

    this._addCommentsTo(fileElement);
    container.appendChild(fileElement);
  }

  _findFolderInTree(path, root) {
    root = root || this._tree;
    let currFiles = root.children;
    for (let i = 0; i < currFiles.length; i++) {
      if (currFiles[i].path === path) {
        return currFiles[i];
      }

      if (currFiles[i].type === 'folder') {
        let result = this._findFolderInTree(path, currFiles[i]);
        if (result) {
          return result;
        }
      }
    }
  }

  _addCommentButtonTo(element) {
    let button = document.createElement('button');
    button.innerHTML = 'Add comment';
    button.classList.add('add-comment-button');
    button.setAttribute('data-selector', 'add-comment-button');
    element.appendChild(button);
  }

  _addCommentFormTo(element) {
    let input = document.createElement('input');
    let button = document.createElement('button');

    input.setAttribute('data-selector', 'comment-input');
    element.appendChild(input);

    button.innerHTML = 'Save';
    button.setAttribute('data-selector', 'save-comment-button');
    element.appendChild(button);
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

  _addCommentsTo(element) {
    let path = element.dataset.path;
    let req = new XMLHttpRequest();


    req.open('GET', '/comments/' + encodeURIComponent(path), true);
    req.send();

    req.onreadystatechange = function () {
      if (req.readyState != 4){
        return;
      }

      if (req.status != 200) {
        console.log( 'Error: ' + (req.status ? req.statusText : 'cant get tree from server') );
        return;
      }

      this._showComments(JSON.parse(req.responseText), element);
    }.bind(this);
  }

  _showComments(comments, element){
    element.innerHTML += 'Comments: <br>';
    comments.forEach(function (comment) {
      element.innerHTML += comment.comment + '<br>';
    });
  }
}