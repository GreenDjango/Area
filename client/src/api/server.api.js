import axios from 'axios'

const DEFAULT_URL = 'http://localhost:8080'

class ApiServer {
    constructor() {
        this.url = DEFAULT_URL
        this.instance = axios.create({
            baseURL: this.url,
            withCredentials: true,
        })
    }

    changeUrl(url) {
        if (!url) url = DEFAULT_URL
        this.url = url
        this.instance.defaults.baseURL = this.url
    }

    // -----
    //      [ Authentification ]
    // -----
    async logIn(email, password) {
        return this.instance.post('/login', { email, password })
    }

    async signUp(email, password) {
        return this.instance.post('/signup', { email, password })
    }

    logInWithGoogle() {
        ApiServer.oauthForm(ApiServer.getGoogleConfig('googleLogin'))
    }

    addGoogleService() {
        const reg = /Authorization=([^;]*)/
        const token = reg.exec(document.cookie)[1]
        ApiServer.oauthForm(ApiServer.getGoogleConfig(`googleService;${token}`))
    }
    // -----
    //      [ Services ]
    // -----
    async enableService(name, data) {
        if (name == 'discord') {
            const token = data['token'].value
            if (token) await this.instance.post('/service/discordBot', { token: token })
        }
        const enable = data['active'].value
        if (enable != undefined) return this.instance.post('/subservice', { name: name, enable: enable })
    }

    async getServiceList() {
        return this.instance.get('/services').then(res => {
            if (res.status !== 200) throw 'Invalid services'
            const services = res.data.data
            const hideGoogleBtn = services.find(e => e.name === 'google') != undefined
            const discord = services.find(e => e.name === 'discord-bot')
            const subServices = services.find(e => e.name === 'SubServices')

            const list = {
                // Google
                calendar: {
                    active: { type: 'checkbox', name: 'Active', value: false, disabled: !hideGoogleBtn },
                    google: { type: 'google', name: 'Google', hidden: hideGoogleBtn },
                },
                youtube: {
                    active: { type: 'checkbox', name: 'Active', value: false, disabled: !hideGoogleBtn },
                    google: { type: 'google', name: 'Google', hidden: hideGoogleBtn },
                },
                google: {
                    active: { type: 'checkbox', name: 'Active', value: false, disabled: !hideGoogleBtn },
                    google: { type: 'google', name: 'Google', hidden: hideGoogleBtn },
                },
                // end
                discord: {
                    active: { type: 'checkbox', name: 'Active', value: false },
                    token: { type: 'input', name: 'Token', value: discord ? discord.access_token : '', placeholder: 'token' },
                },
                weather: {
                    active: { type: 'checkbox', name: 'Active', value: false },
                },
                translate: {
                    active: { type: 'checkbox', name: 'Active', value: false },
                },
                dealabs: {
                    active: { type: 'checkbox', name: 'Active', value: false },
                },
            }
            if (subServices) {
                const map = new Map(JSON.parse(subServices.access_token))
                for (const v in list) {
                    const target = map.get(v)
                    if (target) list[v]['active'].value = target
                }
            }
            return list
        })
    }

    // -----
    //      [ Actions ]
    // -----
    async getAction(id) {
        return this.instance.get('/action', { params: { id: id } })
    }

    async getActions() {
        return this.instance.get('/actions')
    }

    async createAction(data) {
        return this.instance.post('/action', data)
    }

    async modifyAction(id, data) {
        data.id = id
        return this.instance.put('/action', data)
    }

    async deleteAction(id) {
        return this.instance.delete('/action', { params: { id: id } })
    }

    // -----
    //      [ OAUTH ]
    // -----
    /**
     * @param  {'googleLogin'} state
     */
    static getGoogleConfig(state) {
        return {
            endPoint: 'https://accounts.google.com/o/oauth2/v2/auth',
            params: {
                client_id: 'TODO',
                redirect_uri: 'http://localhost:8080/oauth/google',
                include_granted_scopes: 'true',
                access_type: 'offline',
                response_type: 'code',
                state: state,
                scope:
                    'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/calendar.readonly',
            },
        }
    }

    static oauthForm(service) {
        const form = document.createElement('form')
        form.setAttribute('method', 'GET')
        form.setAttribute('action', service.endPoint)
        for (var p in service.params) {
            var input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', p)
            input.setAttribute('value', service.params[p])
            form.appendChild(input)
        }
        document.body.appendChild(form)
        form.submit()
    }

    // -----
    //      [ Tools ]
    // -----
    /**
     * @param  {any} err
     * @returns {string}
     */
    static errorToString(err) {
        if (err.response?.data?.message === 'email must be an email') {
            return 'Must be an valid email'
        } else if (err.response?.data?.message === "You're password not matching") {
            return err.response.data.message
        } else if (/You're email .+? not found/.test(err.response?.data?.message)) {
            return err.response.data.message
        } else if (/You're email .+? already exists/.test(err.response?.data?.message)) {
            return err.response.data.message
        } else {
            console.error(err, err.message, err.response)
            const str = err.response?.data?.message || err.message || JSON.stringify(err)
            return str
        }
    }
}

const apiServer = new ApiServer()

export { ApiServer, apiServer }
