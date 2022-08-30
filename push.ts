import * as handlers from "./handlers";
import * as app from "./app";
import dotenv from "dotenv";
import { NewIdResult } from "./handlers/data-migrations";
import { MassInsertedResult } from "./app/sf-api";

dotenv.config({
    path: "./.env.dst",
});

const insertRecords = (qs: app.Model[]) =>
    new Promise<NewIdResult[]>((res, rej) => {
        setTimeout(() => {
            res(
                qs.map((q) => ({
                    preId: q.unlockField("id").id,
                    newId: Date.now().toString(),
                }))
            );
        }, 1500);
    });

// const insertRecords = (qs: app.Model[]) => {
//     const sobjsMapByName = new Map<string, unknown[]>();
//     const executions: ReturnType<typeof app.SfApi.massInsert>[] = [];

//     qs.forEach((q) => {
//         const sobjs: Array<unknown> =
//             sobjsMapByName.get(q.getTableName()) ?? [];
//         const sobj = q.toSObject();
//         sobj["attributes"] = {
//             type: q.getTableName(),
//             referenceId: q.unlockField("id").id,
//         };
//         sobjs.push(sobj);
//         sobjsMapByName.set(q.getTableName(), sobjs);
//     });

//     for (const oName of sobjsMapByName.keys()) {
//         const recs = sobjsMapByName.get(oName);
//         executions.push(app.SfApi.massInsert(oName, recs));
//     }

//     return Promise.all(executions).then((responses) => {
//         const successResults: NewIdResult[] = [];
//         responses.forEach((response) => {
//             const successResponse = response as MassInsertedResult;
//             if (!successResponse) return [];
//             successResponse.results.forEach((rec) => {
//                 successResults.push({ preId: rec.referenceId, newId: rec.id });
//             });
//         });
//         return successResults;
//     });
// };

const questionMigration = handlers.dataMigrations.Question.newInstance();
const dtcSiteSetting = handlers.dataMigrations.DTCSiteSetting.newInstance();
const recordType = handlers.dataMigrations.RecordType.newInstance();
const objectMappingigration =
    handlers.dataMigrations.ObjectMapping.newInstance();

handlers.dataMigrations.MigrationQueue.newInstance()
    .pushMigration(questionMigration)
    .pushMigration(objectMappingigration)
    .pushMigration(dtcSiteSetting)
    .pushMigration(recordType)
    .createNewIdsFn(insertRecords)
    .excute();
