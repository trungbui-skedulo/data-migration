import { Model } from "../app/model";

export class ObjectMappingDictionary extends Model {
    key = "";
    mappingToObject = "";
    value = "";

    getTableName() {
        return "sked_Object_Mapping_Dictionary__c";
    }

    getApiFields() {
        const fieldMap = new Map<string, string>();

        fieldMap.set("id", "Id");
        fieldMap.set("key", "sked_Key__c");
        fieldMap.set("mappingToObject", "sked_Mapping_To_Object__c");
        fieldMap.set("value", "sked_Value__c");

        return fieldMap;
    }
}
