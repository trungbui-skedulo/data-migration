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

const insertQuestion = (q: models.Question) => {
    return app.SfApi.insert(
        models.Question.getTableName(),
        models.Question.toSObject(q)
    );
};

const main = async () => {
    const questions = getQuestions();

    const idsMap = await getRecordTypeIdsMap();

    idsMap.set("a2q2S000001zDjYQAU", "a2q2h000000G3arAAC");

    let failedCount = 0;
    let srcId = "";
    let successRecs: models.Question[] = [];

    while (questions.length > 0) {
        let failed = false;
        const q = questions.shift() as models.Question;

        for (const k of Object.keys(q)) {
            const f = k as keyof typeof q;
            if (f == "id") continue;
            if (typeof q[f] !== "string") continue;
            if (!models.Model.inBlocking(q[f] as string)) continue;

            let idSrc = q[f] as string;
            idSrc = idSrc.replace("{!", "").replace("}", "");

            if (idsMap.get(idSrc)) {
                q[f] = idsMap.get(idSrc) as never;
                continue;
            }

            failed = true;
            break;
        }

        if (!failed) {
            const res = await insertQuestion(q);

            failedCount = 0;
            srcId = q.id.replace("{!", "").replace("}", "");
            q.id = res.id;
            idsMap.set(srcId, q.id);
            successRecs.push(models.Question.toSObject(q) as never);
            continue;
        }

        failedCount += 1;
        questions.push(q);

        if (failedCount >= questions.length) {
            console.log("======= Fail =====");
            break;
        }
    }

    console.log(successRecs);
};

main();
