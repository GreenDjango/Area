import { Schema, model, Document } from 'mongoose'

// [Interface]
declare enum status {
    DISABLE = 1,
    RUN,
    ERROR,
}

export type actionStatus = keyof typeof status

export interface IAction extends Document {
    name: string
    tasksJson: string[]
    updated: Date
    enable: boolean
    rowData: string
}

// [Schema]
export const ActionModelSchema = new Schema({
    name: { type: String, required: true },
    tasksJson: [String],
    updated: Date,
    enable: Boolean,
    rowData: String,
})

// [Model]
export const ActionModel = model<IAction>('ActionModelSchema', ActionModelSchema)

// [Db method]
