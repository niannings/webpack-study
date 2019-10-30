import { chunk } from 'lodash';
import { cube } from './math';

function component() {
    var element = document.createElement('pre');
  
    // Lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
    element.innerHTML = [
        'Hello World',
        '5 cube is equal to ' + cube(5)
    ].join('\n\n');

    return element;
}
  
document.body.appendChild(component());

// if (module.hot) {
//     module.hot.accept('./print.js', function() {
//         console.log('Accepting the update printMe module');
//         printMe();
//     });
// }
