// 主文件的作用 一般是整合操作

import { Store,install } from './store'

import { mapState,mapGetters,mapMutations,mapActions } from './helpers'

export default {
    Store,
    install,
    mapState,
    mapGetters,
    mapMutations,
    mapActions
}

export {
    Store,
    install,
    mapState,
    mapGetters,
    mapMutations,
    mapActions
}