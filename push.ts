import * as models from "./models";
import * as app from "./app";
import dotenv from "dotenv";
import * as services from "./services";
import fs from "fs";

dotenv.config({
    path: "./.env.dst",
});

const questions: models.Question[] = JSON.parse(
    fs.readFileSync("./data/src/questions.json", {
        encoding: "utf8",
        flag: "r",
    })
).map((r: unknown) =>
    models.Question.fromSObject(models.Question.toSObject(r, true))
);

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

services.recordType
    .getRecordTypeBySObject("sked_Question__c")
    .then((rs) => {
        const rtIdMap = new Map<string, string>();
        for (const r of rs) {
            const srcRt = rtsByName.get(r.name) as models.RecordType;
            if (!srcRt) continue;
            rtIdMap.set(srcRt.id, r.id);
        }

        return rtIdMap;
    })
    .then((idMap) => {
        let failedCount = 0;
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

                if (idMap.get(idSrc)) {
                    q[f] = idMap.get(idSrc) as any;
                    continue;
                }

                failed = true;
                break;
            }

            if (!failed) {
                q.id = Date.now().toString();
                successRecs.push(q as never);
                continue;
            }

            failedCount += 1;
            questions.push(q);

            if (failedCount == questions.length) {
                console.log("======= Fail =====");
                break;
            }
        }

        console.log(successRecs);
    });

// services.question.getBySiteSettingName("scarlet_dtc").then((questions) => {
//     fs.writeFileSync("data.json", JSON.stringify(questions));
// });
