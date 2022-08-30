import { DataMigrationFromJsonFile } from ".";
import * as models from "../../models";

export class ObjectMapping extends DataMigrationFromJsonFile {
    getTableName() {
        return models.ObjectMapping.getTableName();
    }

    mapRecord(r: unknown) {
        return models.ObjectMapping.fromSObject(
            models.ObjectMapping.toSObject(r, true)
        );
    }
}
