import { ATask, socketIN, properties, taskList } from '../../interfaces/task.abstract'
import { IUser } from '../../models/users.model'
import GoogleYoutubeService from '../wrapper/g.youtube.service'

// ? IN
// url
// title
// description
export default class YoutubeUpdateVideoTask extends ATask {
    private _user: IUser

    constructor(id: number, data: properties, input: socketIN[], user: IUser) {
        super(id, taskList.YOUTUBE_EDIT_TITLE_DESC, data, input)
        this._user = user
    }

    public async _run(dep: properties): Promise<properties> {
        const url = dep.get('url') || this.data.get('url')
        const title = dep.get('title') || this.data.get('title')
        const description = dep.get('desc') || this.data.get('desc')

        if (!url || (!title && !description)) throw '[GoogleVideo-Task] - Invalid inputs'
        const myregexp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/
        const tmpId = url.match(myregexp)

        if (!tmpId && tmpId[7].length !== 11) throw '[GoogleVideo-Task] - Invalid arg'
        const urlID: string = tmpId[7]
        const youtubeAPI = GoogleYoutubeService.getYoutubeClient(this._user)
        const res = await youtubeAPI.videos.list({ id: [urlID], part: ['snippet'] })
        const categoryID = res.data.items.shift().snippet.categoryId
        await youtubeAPI.videos.update({
            requestBody: {
                id: urlID,
                snippet: { categoryId: categoryID, title: title, description: description },
            },
            part: ['snippet'],
        })
        return new Map<string, any>([])
    }
}
