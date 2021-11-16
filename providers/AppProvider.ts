import {ApplicationContract} from '@ioc:Adonis/Core/Application'
import {ModelPaginatorContract} from "@ioc:Adonis/Lucid/Orm";

export default class AppProvider {
    constructor(protected app: ApplicationContract) {
    }

    public register() {
        // Register your own bindings
    }

    public async boot() {
        // IoC container is ready
        const Response = this.app.container.use('Adonis/Core/Response')

        // @ts-ignore
        Response.macro('error', function (message) {
            return this.status(200).json({
                status: false,
                message: message,
                data: null
            })
        })

        // @ts-ignore
        Response.macro('success', function (data = null, message = '') {
            return this.status(200).json({
                status: true,
                message: message,
                data: data
            })
        })

        // @ts-ignore
        Response.macro('pager', function (data: ModelPaginatorContract = null) {
            const json = data.toJSON()
            return this.status(200).json({
                status: true,
                message: '',
                meta: json.meta,
                data: json.data
            })
        })
    }

    public async ready() {
        // App is ready
    }

    public async shutdown() {
        // Cleanup, since app is going down
    }
}
