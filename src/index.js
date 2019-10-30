import _ from 'lodash';
import './style.css';
import xw from './xw.jpg';

function component() {
    var element = document.createElement('div');
  
    // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');

    const img = new Image();
    img.src = xw;

    element.appendChild(img);
  
    return element;
}
  
document.body.appendChild(component());
