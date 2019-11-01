function getComponent() {
    return import(/* webpackChunkName: "lodash" */ 'lodash')
        .then(_ => {
            const element = document.createElement('div');
            const btn = document.createElement('button');
            const markdown = document.createElement('div');

            btn.textContent = '点击加载print.js';
            btn.onclick = e => import(/* webpackChunkName: "print" */ './print')
                .then(module => {
                    const print = module.default

                    print();
                })

            element.innerHTML = _.join(['Hello', 'Webpack', ' ']);
            element.appendChild(btn);

            import('./test.md').then(md => {
                markdown.innerHTML = md.default;

                element.appendChild(markdown);
            })

            return element;
        })
        .catch(error => 'An error occurred while loading the component' + error);
}
  
getComponent().then(component => {
    document.body.appendChild(component);
});

// if (module.hot) {
//     module.hot.accept('./print.js', function() {
//         console.log('Accepting the update printMe module');
//         printMe();
//     });
// }
