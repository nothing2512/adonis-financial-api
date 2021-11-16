declare module '@ioc:Adonis/Core/Response' {
    import {ModelPaginatorContract} from "@ioc:Adonis/Lucid/Orm";

    interface ResponseContract {
        error(message: string): this

        success(data ?: any, message ?: string): this

        pager(data: ModelPaginatorContract<any>): this
    }
}
