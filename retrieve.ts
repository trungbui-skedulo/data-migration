import dotenv from "dotenv";
import * as handlers from "./handlers";
import fs from "fs";

dotenv.config({
    path: "./.env.src",
});

const questionCollector =
    handlers.dataCollectors.QuestionCollector.newInstance();

handlers.dataCollectors.CollectorQueue.newInstance()
    .pushCollector(questionCollector)
    .execute();
