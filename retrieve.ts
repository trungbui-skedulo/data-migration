import dotenv from "dotenv";
import * as handlers from "./handlers";
import fs from "fs";

dotenv.config({
    path: "./.env.src",
});

const questionCollector =
    handlers.dataCollectors.QuestionCollector.newInstance();

const objectMappingCollector =
    handlers.dataCollectors.ObjectMapping.newInstance();
const objectFieldMappingCollector =
    handlers.dataCollectors.ObjectFieldMapping.newInstance();

handlers.dataCollectors.CollectorQueue.newInstance()
    .pushCollector(questionCollector)
    .pushCollector(objectMappingCollector)
    .pushCollector(objectFieldMappingCollector)
    .execute();
