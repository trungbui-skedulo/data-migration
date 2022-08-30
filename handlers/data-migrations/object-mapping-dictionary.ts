import { DataMigrationFromJsonFile } from ".";
import * as models from "../../models";

export class ObjectMappingDictionary extends DataMigrationFromJsonFile {
    getTableName() {
        return models.ObjectMappingDictionary.getTableName();
    }

    mapRecord(r: unknown) {
        return models.ObjectMappingDictionary.fromSObject(
            models.ObjectMappingDictionary.toSObject(r, true)
        );
    }
}
