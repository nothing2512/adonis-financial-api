import ExcelJs from 'exceljs'
import {LucidModel} from "@ioc:Adonis/Lucid/Orm";
import Application from "@ioc:Adonis/Core/Application";
import { v4 as uuidv4 } from 'uuid';
import * as fs from "fs";

export default class Reporter {
    static async make<M extends LucidModel>(model: InstanceType<M>[]) {
        const filename = `${uuidv4()}.xlsx`
        const workbook = new ExcelJs.Workbook()
        const sheet = workbook.addWorksheet('Sheet 1')

        if (model.length > 0) {
            const json = model[0].toJSON()
            sheet.addRow([
                '#',
                ...Object.keys(json)
            ])
        }

        let i = 0;
        for (let x of model) {
            const json = x.toJSON()
            sheet.addRow([
                ++i,
                ...Object.keys(json).map(key => json[key])
            ])
        }

        if (!fs.existsSync(Application.tmpPath(`reports`)))
            fs.mkdirSync(Application.tmpPath(`reports`))
        await workbook.xlsx.writeFile(Application.tmpPath(`reports/${filename}`))

        return Application.tmpPath(`reports/${filename}`)
    }
}
