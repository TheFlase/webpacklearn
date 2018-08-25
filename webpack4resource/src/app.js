import Layer from './compoments/layer/layer.js';
import './compoments/css/common.css';

const app = function app() {
    var dom = document.getElementById("app");
    var layer = new Layer();
    dom.innerHTML = layer.tpl({
        name:'john',
        arr:['apple','xiaomi','huawei']
    });
}

new app();
