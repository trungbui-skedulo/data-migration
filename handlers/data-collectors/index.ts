import { Model } from "../../app";
import fs from "fs";

export class SObjectCollector {
    static newInstance() {
        return new this();
    }

    execute() {
        return Promise.resolve(new Array<Model>());
    }
}

export class CollectorQueue {
    collectors: SObjectCollector[] = [];

    static newInstance() {
        return new this();
    }

    pushCollector(c: SObjectCollector) {
        this.collectors.push(c);

        return this;
    }

    async execute() {
        const results = await Promise.all(
            this.collectors.map((c) => c.execute())
        );
        const records = new Array<Model>();

        for (const recs of results) {
            for (const rec of recs) {
                records.push(rec);
            }
        }

        const recordsMapByType = this.groupRecords(records);
        this.save(recordsMapByType);
    }

    save(recordsMapByType: Map<string, Model[]>) {
        const dataPath = (process.env.DATA_PATH ?? "") as string;
        for (const type of recordsMapByType.keys()) {
            const pathToSave = [dataPath, `${type}.json`].join("/");
            fs.writeFile(
                pathToSave,
                JSON.stringify(recordsMapByType.get(type)),
                (err) => {
                    if (err) console.log(`Collect Error: ${type}`);
                }
            );
        }
    }

    groupRecords(records: Model[]) {
        const groups = new Map<string, Model[]>();

        for (const r of records) {
            const g = groups.get(r.getTableName()) ?? [];
            g.push(r);
            groups.set(r.getTableName(), g);
        }

        return groups;
    }
}

export * from "./question-collector";
export * from "./object-mapping";
export * from "./object-field-mapping";
export * from "./object-mapping-dictionary";
