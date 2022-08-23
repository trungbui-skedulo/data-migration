import { Model } from "./model";

export class Question extends Model {
    id = "";
    // name = "";
    question = "";
    anwser = "";
    desciption = "";
    // siteId = "";
    recordTypeId = "";

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
        // fieldMap.set("siteId", "Site_Setting__c");
        fieldMap.set("recordTypeId", "RecordTypeId");

        return fieldMap;
    }
}
