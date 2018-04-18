import Vue from 'vue'
import App from './app.vue'

import './assets/style/main.styl'
import './assets/style/footer.styl'

const root = document.createElement('div');
document.body.appendChild(root);
new Vue({
    render: (h) => h(App)
}).$mount(root)