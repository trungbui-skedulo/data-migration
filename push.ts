import * as handlers from "./handlers";
import * as models from "./models";
import * as app from "./app";
import dotenv from "dotenv";
import * as services from "./services";
import fs from "fs";

dotenv.config({
    path: "./.env.dst",
});

const getQuestions = () => {
    const questions: models.Question[] = JSON.parse(
        fs.readFileSync("./data/src/questions.json", {
            encoding: "utf8",
            flag: "r",
        })
    ).map((r: unknown) =>
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
    ).map((r: unknown) =>
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

const insertQuestion = (q: models.Model) => {
    return Promise.resolve(Date.now().toString());
    // return app.SfApi.insert(
    //     models.Question.getTableName(),
    //     models.Question.toSObject(q)
    // ).then((r) => r.id as string);
};

const main = async () => {
    const queue = getQuestions();

    const idsMap = await getRecordTypeIdsMap();

    idsMap.set("a2q2S000001zDjYQAU", "a2q2h000000G3arAAC");

    handlers.queueMigration.migrate({
        queue,
        idsMap,
        createNewIdFn: insertQuestion,
    });
};

main();
