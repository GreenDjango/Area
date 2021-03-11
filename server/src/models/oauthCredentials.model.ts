import { Schema, model, Document } from 'mongoose'

// [Interface]
export interface IOAuthCredentials extends Document {
    name: string
    access_token: string
    refresh_token?: string
    expires_in?: Date
}

// [Schema]
export const OAuthCredentialsModelSchema = new Schema({
    name: { type: String, required: true },
    access_token: { type: String, required: true },
    refresh_token: { type: String },
    expires_in: { type: Date },
})

// [Model]
export const OAuthCredentialsModel = model<IOAuthCredentials>('OAuthCredentialsModel', OAuthCredentialsModelSchema)

// [Db methods]
