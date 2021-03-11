import axios, { Method } from 'axios'
import addOAuthInterceptor from 'axios-oauth-1.0a'
import HttpException from '../../exceptions/HttpException'
import { DealabsRes } from '../../interfaces/dealabs.interface'

/*
 * Dealabs mobile API (https://www.dealabs.com)
 * https://www.hotukdeals.com/docs/api.html
 */

export default class DealabsService {
    private BASE_URL = 'https://www.dealabs.com/rest_api/v2/'
    private THREAD_PATH = '/thread'
    private GROUP_PATH = '/group'
    private instance = axios.create({
        baseURL: this.BASE_URL,
        headers: {
            'User-Agent': 'com.dealabs.apps.android ANDROID [v5.54.00] [28 | SM-G973F] [@4.0x]',
            'Pepper-Include-Counters': 'unread_alerts',
            'Pepper-Include-Prev-And-Next-Ids': 'true',
            'Pepper-JSON-Format': 'thread=list,group=ids,type=light,event=light,user=list,formatted_text=html,message=with_code',
            'Pepper-Hardware-Id': '5bce296a65215d0bb3b9751bb7770a1d',
        },
        withCredentials: true,
    })

    constructor() {
        addOAuthInterceptor(this.instance, {
            key: '539f008401dbb',
            secret: '539f008401e9c',
            algorithm: 'HMAC-SHA1',
        })
    }

    private async request(url: string, params?: any, data?: any, method?: Method, headers?: any) {
        if (!method) method = 'GET'
        try {
            const respond = await this.instance.request({ url, method, params, data, headers })
            return respond.data
        } catch (err) {
            console.error(err)
            throw new HttpException(500, '[DealabsAPI] - Unable to fetch data')
        }
    }

    public async getHottest(periode: 'day' | 'week' | 'month' | 'overall' = 'day', limit = 1) {
        const criteria = { tab: 'hottest_day', whereabouts: 'deals' }

        if (periode === 'week') criteria.tab = 'hottest_week'
        else if (periode === 'month') criteria.tab = 'hottest_month'
        else if (periode === 'overall') criteria.tab = 'hottest_overall'

        const params = { criteria: JSON.stringify(criteria), limit }
        await this.request(this.THREAD_PATH, params)
    }

    public async getHot(limit = 1) {
        const params = { criteria: JSON.stringify({ tab: 'hot', whereabouts: 'deals' }), limit }

        const res: DealabsRes = await this.request(this.THREAD_PATH, params)
        return res.data
    }

    public async getHotByGroup(group_id: number, limit = 1) {
        const params = { criteria: JSON.stringify({ tab: 'hot', group_id, whereabouts: 'deals' }), limit }

        await this.request(this.THREAD_PATH, params)
    }

    public async getGroupsInfo(limit = 20) {
        const params = { list: 'default', section: 'deals', limit }

        await this.request(this.GROUP_PATH, params, undefined, 'GET', { 'Pepper-JSON-Format': 'group=full,message=with_code' })
    }

    public async getThreadByID(thread_id: number) {
        await this.request(this.GROUP_PATH + `/${thread_id}`, undefined, undefined, 'GET', {
            'Pepper-JSON-Format':
                'thread=full,group=full,type=light,event=light,user=full,badge=user,thread_update=full,thread_top_comment=full,formatted_text=html,message=with_code',
        })
    }
}
