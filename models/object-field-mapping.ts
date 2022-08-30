import { Model } from "../app/model";

export class ObjectFieldMapping extends Model {
    order = 0;
    filterCondition = "";
    isActive = false;
    lookupObject = "";
    sourceObject = "";
    lookupReferenceField = "";
    lookupTargetField = "";
    mappingType = "";
    objectMapping = "";
    sourceField = "";
    syncMethod = "";
    targetField = "";

    getTableName() {
        return "sked_Object_Field_Mapping__c";
    }

    getApiFields() {
        const fieldMap = new Map<string, string>();

        fieldMap.set("id", "Id");
        fieldMap.set("order", "Order__c");
        fieldMap.set("defaultValue", "sked_Default_Value__c");
        fieldMap.set("isActive", "sked_Is_Active__c");
        fieldMap.set("lookupObject", "sked_Lookup_Object__c");
        fieldMap.set("lookupReferenceField", "sked_Lookup_Reference_Field__c");
        fieldMap.set("lookupTargetField", "sked_Lookup_Target_Field__c");
        fieldMap.set("mappingType", "sked_Mapping_Type__c");
        fieldMap.set("objectMapping", "sked_Object_Mapping__c");
        fieldMap.set("sourceField", "sked_Source_Field__c");
        fieldMap.set("syncMethod", "sked_Sync_Method__c");
        fieldMap.set("targetField", "sked_Target_Field__c");

        return fieldMap;
    }
}
