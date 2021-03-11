enum taskList {
    TRANSLATE = 1,
    FAKE,
    DISCORD_ON_MSG,
    DISCORD_SEND_MSG,
    METEO,
    TIMER,
    DISCORD_FIND_CHANNEL_ID,
    YOUTUBE_EDIT_TITLE_DESC,
    CALENDAR_COMMING_EVENT,
    DEALABS_ON_HOT_DEAL,
    STRING,
    NUMBER,
    ADD_NUMBER,
    ADD_STRING,
    EVENT,
    COOLDOWN,
}

type properties = Map<string, any>
type socketIN = { property: string; nodeId: number; targetProperty: string }

abstract class ATask {
    id: number
    name: taskList
    // Static Var
    data: properties
    // Link
    input: socketIN[]
    // cache
    alreadyRunned: boolean
    cache: properties

    abstract _run(depedencies: properties): Promise<properties>

    constructor(id: number, name: taskList, data: properties, input: socketIN[]) {
        this.id = id
        this.name = name
        this.data = data
        this.input = input
        this.alreadyRunned = false
        this.cache = new Map<string, any>()
    }

    async runWithCache(depedencies: properties) {
        if (!this.alreadyRunned) this.cache = await this._run(depedencies)
        return this.cache
    }

    async runWithProperties(getTask: (taskID: number) => ATask | undefined) {
        const dep = new Map<string, any>()
        if (this.input) {
            for (const s of this.input) {
                const task = getTask(s.nodeId)
                if (task) {
                    await task.runWithProperties(getTask)
                    task.cache.forEach((v, k) => {
                        if (k === s.targetProperty) dep.set(s.property, v)
                    })
                }
            }
        }
        await this.runWithCache(dep)
    }
}

export { ATask, taskList, socketIN, properties }
