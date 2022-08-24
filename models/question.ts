import { Model } from "./model";

export class Question extends Model {
    // name = "";
    question = "";
    anwser = "";
    desciption = "";
    siteId = "";
    recordTypeId = "";
    preAnwser = "";
    preQuestion = "";
    order = 0;
    required = false;
    linkId = "";
    showIf = "";
    shortQuestion = "";
    optionFormat = "";
    isActive = false;
    defaultValue = "";
    dataType = "";

    static getTableName() {
        return "sked_Question__c";
    }

    static getApiFields() {
        const fieldMap = new Map<string, string>();

        fieldMap.set("id", "Id");
        // fieldMap.set("name", "Name");
        fieldMap.set("desciption", "Description__c");
        fieldMap.set("question", "Question__c");
        fieldMap.set("anwser", "Answers__c");
        fieldMap.set("siteId", "Site_Setting__c");
        fieldMap.set("recordTypeId", "RecordTypeId");
        fieldMap.set("preAnwser", "Pre_Answers__c");
        fieldMap.set("preQuestion", "Pre_Question__c");
        fieldMap.set("order", "Order__c");
        fieldMap.set("required", "Required__c");
        fieldMap.set("linkId", "sked_Link_Id__c");
        fieldMap.set("showIf", "Show_If__c");
        fieldMap.set("shortQuestion", "Short_Question__c");
        fieldMap.set("optionFormat", "Option_Format__c");
        fieldMap.set("isActive", "Is_Active__c");
        fieldMap.set("defaultValue", "Default_Value__c");
        fieldMap.set("dataType", "Data_Type__c");

        return fieldMap;
    }
}
