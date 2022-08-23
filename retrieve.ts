import * as models from "./models";
import * as app from "./app";
import dotenv from "dotenv";
import * as services from "./services";
import fs from "fs";

dotenv.config({
    path: "./.env.src",
});

services.recordType
    .getRecordTypeBySObject("sked_Question__c")
    .then((recordTypes) => {
        console.log(recordTypes);

        fs.writeFileSync(
            "data/src/record-types.json",
            JSON.stringify(recordTypes)
        );
    });

services.question.getBySiteSettingName("scarlet_dtc").then((questions) => {
    console.log(questions);

    fs.writeFileSync("data/src/questions.json", JSON.stringify(questions));
});