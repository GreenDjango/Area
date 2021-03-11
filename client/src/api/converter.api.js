export default class Converter {
    static dateConvert(date) {
        const formatter = Intl.DateTimeFormat('en', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            // year: 'numeric',
            hour12: false,
        })
        const parsed = formatter.format(date)
        return `${parsed}`
    }

    static treat(name, json) {
        const data = json
        const res = {}

        if (!data) return
        res.name = name
        res.updated = new Date().toISOString()
        res.rowData = JSON.stringify(json)
        res.nodes = []

        for (const k in data.nodes) {
            const v = data.nodes[k]
            const node = {}
            node.id = v.id
            node.type = Converter.getType(v.name)[0]
            if (Converter.getType(v.name)[1]) node.isTrigger = true

            // Data
            for (const k2 in v.data) {
                if (!node.data) node.data = []
                node.data.push([k2, v.data[k2]])
            }
            // Input
            for (const k2 in v.inputs) {
                const v2 = v.inputs[k2]
                if (!v2.connections || v2.connections.length == 0) continue
                if (!node.input) node.input = []

                const elem = {
                    property: k2,
                    nodeId: v2.connections[0].node,
                    targetProperty: v2.connections[0].output,
                }
                node.input.push(elem)
            }
            res.nodes.push(node)
        }
        return res
    }

    static getType(name) {
        switch (name) {
            case 'DiscordOnMsg':
                return [3, true]
            case 'Transalte':
                return [1, false]
            case 'DiscordSendMsg':
                return [4, false]
            case 'Weather':
                return [5, false]
            case 'TimeOnTimer':
                return [6, true]
            case 'DiscordFindChannelId':
                return [7, false]
            case 'YoutubeEditVideo':
                return [8, false]
            case 'CalendarCommingEvent':
                return [9, false]
            case 'DealabsOnHotDeal':
                return [10, true]
            case 'String':
                return [11, false]
            case 'Number':
                return [12, false]
            case 'AddNum':
                return [13, false]
            case 'AddStr':
                return [14, false]
            case 'TimeOnEvent':
                return [15, true]
            case 'TimeOnEndCooldown':
                return [16, true]
        }
    }
}
