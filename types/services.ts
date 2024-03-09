import { ExtMaterial, ExtNewMaterial, NewProfile, Profile } from "./materials"
import { PriceListItem, Results, User } from "./server"
import { NewTemplate, Template } from "./templates"
interface IUserAbstractService {
    getUsers: () => Promise<Results>
    getTokens: () => Promise<Results>
    addToken: ({ token, userName, time }: { token: string, userName: string, time: number }) => Promise<Results>
    deleteToken: (token: string) => Promise<Results>
    clearAllTokens: () => Promise<Results>
    registerUser: (user: User) => Promise<Results>
    deleteUser: (user: User) => Promise<Results>
}
interface IMaterialAbstractService {
    getExtMaterials: () => Promise<Results>
    addExtMaterial: ({ }: ExtMaterial) => Promise<Results>
    updateExtMaterial: ({ }: ExtNewMaterial) => Promise<Results>
    deleteExtMaterial: (name: string, base: string) => Promise<Results>
    getProfiles: () => Promise<Results>
    addProfile: ({ }: Profile) => Promise<Results>
    deleteProfile: (name: string, type: string) => Promise<Results>
    updateProfile: ({ }: NewProfile) => Promise<Results>
}
interface ITemplateAbstractService {
    getTemplates: (table: string) => Promise<Results>
    addTemplate: (table: string, { }: Template) => Promise<Results>
    deleteTemplate: (table: string, name: string) => Promise<Results>
    updateTemplate: (table: string, { }: NewTemplate) => Promise<Results>
}
interface IPriceAbstractService {
    getPriceList: () => Promise<Results>
    updatePriceList: (item: PriceListItem) => Promise<Results>
}


export interface IMaterialServiceProvider extends IMaterialAbstractService {
    dbFile: string
}
export interface IMaterialService extends IMaterialAbstractService {
    provider: IMaterialServiceProvider
}
export interface ITemplateServiceProvider extends ITemplateAbstractService {
    dbFile: string
}
export interface ITemplateService extends ITemplateAbstractService {
    provider: ITemplateServiceProvider
}
export interface IUserServiceProvider extends IUserAbstractService {
    dbFile: string
}
export interface IUserService extends IUserAbstractService {
    provider: IUserServiceProvider
}

export interface IPriceServiceProvider extends IPriceAbstractService {
    dbFile: string
}
export interface IPriceService extends IPriceAbstractService {
    provider: IPriceServiceProvider
}