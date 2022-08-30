import * as handlers from "./handlers";
import * as models from "./models";
import * as app from "./app";
import dotenv from "dotenv";
import * as services from "./services";
import fs from "fs";
import { NewIdResult } from "./handlers/queue-migration";
import { MassInsertedResult } from "./app/sf-api";

dotenv.config({
    path: "./.env.dst",
});

const getQuestions = () => {
    const questions: models.Question[] = JSON.parse(
        fs.readFileSync(`./data/src/${models.Question.getTableName()}.json`, {
            encoding: "utf8",
            flag: "r",
        })
    ).map((r: models.Question) =>
        models.Question.fromSObject(models.Question.toSObject(r, true))
    );

    return questions;
};

const getRecordTypeIdsMap = () => {
    const recordTypes: models.RecordType[] = JSON.parse(
        fs.readFileSync("./data/src/record-types.json", {
            encoding: "utf8",
            flag: "r",
        })
    ).map((r: models.RecordType) =>
        models.RecordType.fromSObject(models.RecordType.toSObject(r, true))
    );

    const rtsByName = new Map<string, models.RecordType>();

    for (const rt of recordTypes) {
        rtsByName.set(rt.name, rt);
    }

    return services.recordType
        .getRecordTypeBySObject("sked_Question__c")
        .then((rs) => {
            const rtIdMap = new Map<string, string>();
            for (const r of rs) {
                const srcRt = rtsByName.get(r.name) as models.RecordType;
                if (!srcRt) continue;
                rtIdMap.set(srcRt.id, r.id);
            }

            return rtIdMap;
        });
};

const insertRecords = (qs: app.Model[]) => {
    // return new Promise<NewIdResult[]>((res, rej) => {
    //     setTimeout(() => {
    //         res(
    //             qs.map((q) => ({
    //                 preId: q.unlockField("id").id,
    //                 newId: Date.now().toString(),
    //             }))
    //         );
    //     }, 1000);
    // });

    const sobjsMapByName = new Map<string, unknown[]>();
    const executions: ReturnType<typeof app.SfApi.massInsert>[] = [];
    qs.forEach((q) => {
        const sobjs: Array<unknown> =
            sobjsMapByName.get(q.getTableName()) ?? [];
        const sobj = q.toSObject();

        sobj["attributes"] = {
            type: q.getTableName(),
            referenceId: q.unlockField("id").id,
        };
        sobjs.push(sobj);
        sobjsMapByName.set(q.getTableName(), sobjs);
    });

    for (const oName of sobjsMapByName.keys()) {
        const recs = sobjsMapByName.get(oName);
        executions.push(app.SfApi.massInsert(oName, recs));
    }

    return Promise.all(executions).then((responses) => {
        const successResults: NewIdResult[] = [];
        responses.forEach((response) => {
            const successResponse = response as MassInsertedResult;
            if (!successResponse) return [];
            successResponse.results.forEach((rec) => {
                successResults.push({ preId: rec.referenceId, newId: rec.id });
            });
        });

        return successResults;
    });

    // return app.SfApi.massInsert(q.)
};

const main = async () => {
    const queue = getQuestions();

    const idsMap = await getRecordTypeIdsMap();

    idsMap.set("a2q2S000001zDjYQAU", "a2q2g000000DGkgAAG");

    handlers.queueMigration.migrate({
        queue,
        idsMap,
        createNewIdsFn: insertRecords,
    });
};

main();
