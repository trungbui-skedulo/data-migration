import { DataMigration } from ".";
import { Model } from "../../app";

export class DTCSiteSetting extends DataMigration {
    records(): Model[] {
        return [];
    }

    idsMap() {
        const idsMap = new Map<string, string>();
        idsMap.set("a2q2S000001zDjYQAU", "a2q2g000000DGkgAAG");
        return idsMap;
    }
}
