import { Schema, model, Document } from 'mongoose'
import { actionManager } from '../core/actionManager'
import { ActionModelSchema, IAction } from './action.model'
import { IOAuthCredentials, OAuthCredentialsModelSchema } from './oauthCredentials.model'

// [Interface]
export interface IUser extends Document {
    email: string
    password: string
    loginWithService: boolean
    services: IOAuthCredentials[]
    actions: IAction[]
}

// [Schema]
const UserModelSchema = new Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    loginWithService: { type: Boolean, required: true },
    services: [OAuthCredentialsModelSchema],
    actions: [ActionModelSchema],
})

// [Model]
const UserModel = model<IUser>('UserModel', UserModelSchema)

// [Db method]
export async function addServiceToUser(user: IUser, service: IOAuthCredentials): Promise<IUser> {
    const target = user.services.find((item) => item.name == service.name)
    if (target) {
        Object.assign(target, { access_token: service.access_token })
        if (target.expires_in) Object.assign(target, { expires_in: service.expires_in })
        return user.save()
    }
    user.services.push(service)
    return user.save()
}

export async function createUser(email: string, password: string, useService = false): Promise<IUser> {
    const user = new UserModel({ email: email, password: password, loginWithService: useService, services: [] })
    return user.save()
}

export async function getUser(email: string, useService = false): Promise<IUser> {
    return UserModel.findOne({ email: email, loginWithService: useService })
}

// server.get('/usersList', function(req, res) {
//     User.find({}, function(err, users) {
//       var userMap = {};

//       users.forEach(function(user) {
//         userMap[user._id] = user;
//       });

//       res.send(userMap);
//     });
//   });

export function startTaskUsers() {
    UserModel.find({}, function (err, users) {
        users.forEach((u) => actionManager.syncUserAction(u))
    })
}

export async function getUserById(id: string): Promise<IUser> {
    return UserModel.findById(id)
}
