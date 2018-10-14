import Vue from 'vue'
import Router from 'vue-router'
import Code from '@/components/Code'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'code',
      component: Code
    }
  ]
})
