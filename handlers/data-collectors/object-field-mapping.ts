import * as services from "../../services";
import { SObjectCollector } from "./index";
import { Model } from "../../app";

export class ObjectFieldMapping extends SObjectCollector {
    execute(): Promise<Model[]> {
        return services.objectFieldMapping.getAll();
    }
}
