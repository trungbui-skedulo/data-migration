import { Model } from "../app/model";

export class ObjectMapping extends Model {
    customMapper = "";
    filterCondition = "";
    isActive = false;
    sourceObject = "";
    targetIdentifyField = "";
    targetObject = "";

    getTableName() {
        return "sked_Object_Mapping__c";
    }

    getApiFields() {
        const fieldMap = new Map<string, string>();

        fieldMap.set("id", "Id");
        fieldMap.set("customMapper", "sked_Custom_Mapper__c");
        fieldMap.set("filterCondition", "sked_Filter_Condition__c");
        fieldMap.set("isActive", "sked_Is_Active__c");
        fieldMap.set("sourceObject", "sked_Source_Object__c");
        fieldMap.set("targetIdentifyField", "sked_Target_Identify_Field__c");
        fieldMap.set("targetObject", "sked_Target_Object__c");

        return fieldMap;
    }
}
