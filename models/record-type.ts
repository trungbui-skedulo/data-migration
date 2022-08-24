import { Model } from "./model";

export class RecordType extends Model {
    name = "";
    sObjectType = "";

    static getTableName() {
        return "RecordType";
    }

    static getApiFields() {
        const fieldMap = new Map<string, string>();

        fieldMap.set("id", "Id");
        fieldMap.set("name", "Name");
        fieldMap.set("sObjectType", "SobjectType");

        return fieldMap;
    }
}
