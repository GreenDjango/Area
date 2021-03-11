import axios from 'axios'
import { ATask, socketIN, properties, taskList } from '../../interfaces/task.abstract'
import queryString from 'query-string'

// ? IN
// text
// src
// dest
// ? Out
// translated
export default class TranslateTask extends ATask {
    constructor(id: number, data: properties, input: socketIN[]) {
        super(id, taskList.TRANSLATE, data, input)
    }

    private static async translateText(text: string, src: string, dest: string) {
        return axios
            .get(
                queryString.stringifyUrl({
                    url: 'https://api.mymemory.translated.net/get',
                    query: {
                        q: text,
                        langpair: `${src}|${dest}`,
                    },
                })
            )
            .then((res) => {
                return res.data.responseData.translatedText
            })
    }

    public async _run(dep: properties): Promise<properties> {
        const text = dep.get('text') || this.data.get('text')
        const langSrc = dep.get('src') || this.data.get('src')
        const langDest = dep.get('dest') || this.data.get('dest')
        if (!text || !langSrc || !langDest) throw '[Translate-Task] - Invalid arg'
        const translated = await TranslateTask.translateText(text, langSrc, langDest)
        return new Map<string, any>([['translation', translated]])
    }
}
