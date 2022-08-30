import { DataMigrationFromJsonFile } from ".";
import * as models from "../../models";

export class ObjectFieldMapping extends DataMigrationFromJsonFile {
    getTableName() {
        return models.ObjectFieldMapping.getTableName();
    }

    mapRecord(r: unknown) {
        return models.ObjectFieldMapping.fromSObject(
            models.ObjectFieldMapping.toSObject(r, true)
        );
    }
}
