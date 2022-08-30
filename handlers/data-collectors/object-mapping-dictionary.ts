import * as services from "../../services";
import { SObjectCollector } from "./index";
import { Model } from "../../app";

export class ObjectMappingDictionary extends SObjectCollector {
    execute(): Promise<Model[]> {
        return services.objectMappingDictionary.getAll();
    }
}
