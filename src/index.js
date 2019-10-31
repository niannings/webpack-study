import { chunk } from 'lodash';
import { cube } from './math';
// import txt from './message.txt';
import md from './test.md';
import './style.css';

console.log(md);

function component() {
    var element = document.createElement('pre');
    var test = document.createElement('div');

    test.innerHTML = md;
  
    // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
    element.innerHTML = [
        'Hello World',
        '5 cube is equal to ' + cube(5)
    ].join('\n\n');

    element.append(test);

    return element;
}
  
document.body.appendChild(component());

// if (module.hot) {
//     module.hot.accept('./print.js', function() {
//         console.log('Accepting the update printMe module');
//         printMe();
//     });
// }
