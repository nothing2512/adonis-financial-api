/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Application from "@ioc:Adonis/Core/Application";
import {string} from '@ioc:Adonis/Core/Helpers'

function crud(prefix, controller?, additionalRoute?: () => void) {
    prefix = string.pluralize(prefix)
    if (controller === null || controller === undefined) controller = string.pascalCase(prefix)

    Route.group(() => {

        if (additionalRoute) additionalRoute()

        Route.get('/', `${controller}Controller.index`)
        Route.get('/:id', `${controller}Controller.show`)
        Route.post('/', `${controller}Controller.store`)
        Route.post('/:id/edit', `${controller}Controller.update`)
        Route.post('/:id/delete', `${controller}Controller.destroy`)

    }).prefix(prefix).middleware('auth')
}

Route.group(() => {
    Route.post('/login', 'AuthController.login')
    Route.post('/register', 'AuthController.register')
    Route.any('/logout', 'AuthController.logout').middleware('auth')
}).prefix('auth')

Route.get('/attachments/:directory/:file', async ({params, response}) => {
    return response.download(Application.tmpPath(`uploads/${params.directory}/${params.file}`));
})

crud('saving')
crud('budget')
crud('transaction')
crud('debt', null, () => {
    Route.post('/:id/done', 'DebtsController.done')
    Route.post('/:id/undo', 'DebtsController.undo')
})
crud('debt/user', 'DebtUsers')
crud('category', null, () => {
    Route.get('/all', 'CategoriesController.all')
})

Route.group(() => {
    Route.get('/budgets', 'ReportsController.budgets')
    Route.get('/debts', 'ReportsController.debts')
    Route.get('/transactions', 'ReportsController.transactions')
}).prefix('report').middleware('qsAuth')

Route.group(() => {
    Route.get('/counter', 'StatisticsController.counter')
    Route.get('/transactions', 'StatisticsController.transactions')
}).prefix('statistic').middleware('auth')

Route.get('/', async ({response}) => {
    // @ts-ignore
    return response.status(200).json({
        name: 'Financial Api',
        version: 'v1.0.0',
        version_code: '1.0.0',
        description: 'Authentication is needed to access api'
    });
})

