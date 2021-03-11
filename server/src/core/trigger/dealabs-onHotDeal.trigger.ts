import ATrigger from '../../interfaces/trigger.interface'
import { socketIN, properties, taskList, ATask } from '../../interfaces/task.abstract'
import DealabsService from '../wrapper/dealabs.service'

// ? IN
// pattern
// voteMin
// ? Out
// title
// vote
// category
// uploadDate
// price

const REFRESH_RATE = 1000 * 60 * 5

export default class DealabsOnHotDealTask extends ATrigger {
    res = new Map<string, any>()
    intervalObj: NodeJS.Timeout
    service: DealabsService
    lastUpdateCheck: number

    constructor(id: number, data: properties, input: socketIN[]) {
        super(id, taskList.DEALABS_ON_HOT_DEAL, data, input)
        this.service = new DealabsService()
    }

    public async _run(): Promise<properties> {
        return this.res
    }

    public init(callback: (trigger: ATask) => Promise<void>) {
        const pattern = this.data.get('pattern') || ''
        const voteMin = this.data.get('voteMin') || 0

        this.lastUpdateCheck = Math.floor(Date.now() / 1000)

        this.intervalObj = setInterval(async () => {
            const regex = new RegExp(pattern)
            const deals = await this.service.getHot(10)
            for (const deal of deals) {
                if (deal.hot_date >= this.lastUpdateCheck && regex.test(deal.title) && deal.temperature_rating >= voteMin) {
                    const task = new DealabsOnHotDealTask(this.id, this.data, this.input)
                    task.res.set('title', deal.title)
                    task.res.set('vote', deal.temperature_rating)
                    task.res.set('category', deal.group_display_summary)
                    task.res.set('uploadDate', new Date(deal.submitted * 1000).toUTCString())
                    task.res.set('price', deal.price || 0)
                    this.lastExecuted = new Date()
                    callback(task)
                }
            }
            this.lastUpdateCheck = Math.floor(Date.now() / 1000)
        }, REFRESH_RATE)
    }

    public stop() {
        clearInterval(this.intervalObj)
    }
}
