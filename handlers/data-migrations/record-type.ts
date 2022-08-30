import { DataMigration } from ".";
import { Model } from "../../app";

export class RecordType extends DataMigration {
    records(): Model[] {
        return [];
    }

    idsMap() {
        const idsMap = new Map<string, string>();

        idsMap.set("0122S0000006HVmQAM", "0122S0000006HVmQAM");
        idsMap.set("0122S0000006HVnQAM", "0122S0000006HVnQAM");
        idsMap.set("0122S0000006HVoQAM", "0122S0000006HVoQAM");
        idsMap.set("0122S000000NSXWQA4", "0122S000000NSXWQA4");
        idsMap.set("0122S000000gVZYQA2", "0122S000000gVZYQA2");

        return idsMap;
    }
}
