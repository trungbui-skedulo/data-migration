import { DataMigration } from ".";
import { Model } from "../../app";
import fs from "fs";

interface DataMigrationFromJsonFileInterface {
    getTableName(): string;

    mapRecord(r: any): Model;
}

export class DataMigrationFromJsonFile
    extends DataMigration
    implements DataMigrationFromJsonFileInterface
{
    getTableName(): string {
        throw new Error(
            `${this.constructor.name} Migration From Json File did not implemented getTableName method.`
        );
    }

    mapRecord(r: unknown): Model {
        throw new Error(
            `${this.constructor.name} Migration From Json File did not implemented mapRecord method.`
        );
    }

    idsMap(): Map<string, string> {
        return new Map<string, string>();
    }

    records() {
        const dataPath = (process.env.DATA_PATH ?? "") as string;
        const records: Model[] = JSON.parse(
            fs.readFileSync(
                [dataPath, `${this.getTableName()}.json`].join("/"),
                {
                    encoding: "utf8",
                    flag: "r",
                }
            )
        ).map((r: unknown) => this.mapRecord(r));

        return records;
    }
}
