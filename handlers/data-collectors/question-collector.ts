import * as services from "../../services";
import { SObjectCollector } from "./index";
import { Model } from "../../app";

export class QuestionCollector extends SObjectCollector {
    execute(): Promise<Model[]> {
        return services.question.getBySiteSettingName("scarlet_dtc");
    }
}
