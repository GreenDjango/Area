import { About } from '../interfaces/about.interface'

const aboutModel: About = {
    client: { host: '127.0.0.1' },
    server: {
        current_time: 0,
        services: [
            {
                name: 'common',
                reactions: [
                    { name: 'number', description: 'return a number' },
                    { name: 'string', description: 'return a string' },
                    { name: 'addString', description: 'concatenate 2 strings' },
                    { name: 'numberString', description: 'addition 2 number' },
                ],
            },
            {
                name: 'timer',
                actions: [
                    { name: 'onTimer', description: 'on each x sec' },
                    { name: 'onEndCooldown', description: 'on end cooldown' },
                    { name: 'onEvent', description: 'on datetime' },
                ],
            },
            {
                name: 'discord',
                actions: [{ name: 'onMessage', description: 'on msg discord' }],
                reactions: [
                    { name: 'findChannelID', description: 'find channel id' },
                    { name: 'sendMsg', description: 'send a msg discord' },
                ],
            },
            {
                name: 'translate',
                reactions: [{ name: 'translate', description: 'translate text' }],
            },
            {
                name: 'youtube',
                reactions: [{ name: 'editVideo', description: 'Edit youtube video' }],
            },
            {
                name: 'calendar',
                reactions: [{ name: 'getCommingEvent', description: 'get the first comming event' }],
            },
            {
                name: 'dealabs',
                actions: [{ name: 'onHotDeal', description: 'on hot deal dealabs' }],
            },
            {
                name: 'weather',
                reactions: [{ name: 'getWeather', description: 'get weather of target city' }],
            },
        ],
    },
}

export default aboutModel
