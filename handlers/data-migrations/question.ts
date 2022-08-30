import { DataMigrationFromJsonFile } from ".";
import * as models from "../../models";

export class Question extends DataMigrationFromJsonFile {
    getTableName() {
        return models.Question.getTableName();
    }

    mapRecord(r: unknown) {
        return models.Question.fromSObject(models.Question.toSObject(r, true));
    }
}
