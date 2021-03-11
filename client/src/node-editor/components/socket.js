import Rete from 'rete'

const NumSocket = new Rete.Socket('Number')
const StrSocket = new Rete.Socket('String')
const TriggerSocket = new Rete.Socket('Trigger')

NumSocket.combineWith(StrSocket)

export { NumSocket, StrSocket, TriggerSocket }
