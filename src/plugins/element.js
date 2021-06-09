import Vue from 'vue'
import {
    Aside,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Container,
    Form,
    FormItem,
    Header,
    Input,
    Main,
    Menu,
    MenuItem,
    MenuItemGroup,
    Message,
    Submenu
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.prototype.$message = Message
