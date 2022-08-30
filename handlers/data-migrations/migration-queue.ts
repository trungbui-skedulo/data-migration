import * as app from "../../app";

const createQueue = () => new Array<app.Model>();

const createIdsMap = () => new Map<string, string>();

export type NewIdResult = {
    preId: string;
    newId: string;
};

interface DataMigrationInterface {
    records(): app.Model[];
    idsMap(): Map<string, string>;
}

export class DataMigration implements DataMigrationInterface {
    records(): app.Model[] {
        throw new Error("Method not implemented.");
    }
    idsMap(): Map<string, string> {
        throw new Error("Method not implemented.");
    }
    static newInstance() {
        return new this();
    }
}

export class MigrationQueue {
    queue = createQueue();
    idsMap = createIdsMap();
    private _createNewIdsFn: (model: app.Model[]) => Promise<NewIdResult[]>;

    constructor() {
        this._createNewIdsFn = (model) => Promise.resolve([]);
    }

    static newInstance() {
        return new this();
    }

    public createNewIdsFn(
        value: (mode: app.Model[]) => Promise<NewIdResult[]>
    ) {
        this._createNewIdsFn = value;

        return this;
    }

    pushMigration(dataMigration: DataMigration) {
        for (const r of dataMigration.records()) {
            this.queue.push(r);
        }

        const idsMap = dataMigration.idsMap();

        for (const key of idsMap.keys()) {
            this.idsMap.set(key, idsMap.get(key) as string);
        }

        return this;
    }

    async excute() {
        while (this.queue.length > 0) {
            let { invalidQueue, validQueue } = this.validateQueue();

            if (validQueue.length == 0) {
                console.log("Migrated: failed");
                break;
            }

            let results = await this._createNewIdsFn(validQueue);

            for (const r of results) {
                console.log(`Migrated: ${r.preId} ====> ${r.newId}`);
                this.idsMap.set(r.preId, r.newId);
            }

            this.queue = invalidQueue;
        }

        return this;
    }

    validateQueue() {
        let invalidQueue = createQueue();
        let validQueue = createQueue();

        while (this.queue.length > 0) {
            let failed = false;
            const q = this.queue.shift() as app.Model;

            for (const k of Object.keys(q)) {
                const f = k as keyof typeof q;
                if (f == "id") continue;
                if (typeof q[f] !== "string") continue;
                if (!app.Model.inLocking(q[f] as unknown as string)) continue;

                let idSrc = q[f] as unknown as string;
                idSrc = idSrc.replace("{!", "").replace("}", "");

                if (this.idsMap.get(idSrc)) {
                    q[f] = this.idsMap.get(idSrc) as never;
                    continue;
                }

                failed = true;
                break;
            }

            if (!failed) {
                validQueue.push(q);
                continue;
            }

            invalidQueue.push(q);
        }

        return { invalidQueue, validQueue };
    }
}
