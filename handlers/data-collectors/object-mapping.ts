import * as services from "../../services";
import { SObjectCollector } from "./index";
import { Model } from "../../app";

export class ObjectMapping extends SObjectCollector {
    execute(): Promise<Model[]> {
        return services.objectMapping.getAll();
    }
}
