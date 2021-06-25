import 'src/index.css';
function test() {
  var element = document.createElement('div');
  element.innerHTML = 'Hello Word11';
  return element;
}

document.body.appendChild(test());