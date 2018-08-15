import React from 'react'
import { action as MetaAction, AppLoader } from 'mk-meta-engine'
import config from './config'
import { history } from 'mk-utils'
import { getInitState } from './data'

class action {
    constructor(option) {
        this.metaAction = option.metaAction
        this.config = config.current
    }

    onInit = ({ component, injections }) => {
        this.component = component
        this.injections = injections
        const initState = getInitState(),
            defaultAppName = initState.data.currentAppName,
            currentAppName = history.getChildApp('mk-sys-root') || defaultAppName

        initState.data.currentAppName = currentAppName
        injections.reduce('init', { initState })

        history.listen('mk-sys-root', this.listen)
        this.onRedirect({ appName: history.getChildApp('mk-sys-root') || defaultAppName })
    }

    listen = (childApp, location, action) => {
        const defaultAppName = getInitState().data.currentAppName
        const currentAppName = this.metaAction.gf('data.currentAppName') || defaultAppName
        const targetAppName = childApp || defaultAppName
        if (targetAppName == currentAppName) {
            return
        }
        this.injections.reduce('redirect', targetAppName)
    }

    onRedirect = ({ appName }) => {
        history.pushChildApp('mk-sys-root', appName)
    }

    componentWillUnmount = () => {
        history.unlisten('mk-sys-root', this.listen)
    }
}

export default function creator(option) {
    const metaAction = new MetaAction(option),
        o = new action({ ...option, metaAction }),
        ret = { ...metaAction, ...o }

    metaAction.config({ metaHandlers: ret })

    return ret
}