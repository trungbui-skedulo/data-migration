import { Model } from "../../app";
import { createQueue, createIdsMap } from "./create";

export type NewIdResult = {
    preId: string;
    newId: string;
};

export type MigrateParams = {
    queue: ReturnType<typeof createQueue>;
    idsMap: ReturnType<typeof createIdsMap>;
    createNewIdsFn: (mode: Model[]) => Promise<NewIdResult[]>;
};

export const migrate = async ({
    queue,
    idsMap,
    createNewIdsFn,
}: MigrateParams) => {
    while (queue.length > 0) {
        let { invalidQueue, validQueue } = validateQueue(queue, idsMap);

        if (validQueue.length == 0) {
            console.log("Migrated: failed");
            break;
        }

        let results = await createNewIdsFn(validQueue);

        for (const r of results) {
            console.log(`Migrated: ${r.preId} ====> ${r.newId}`);
            idsMap.set(r.preId, r.newId);
        }

        queue = invalidQueue;
    }

    return idsMap;
};

const validateQueue = (
    queue: ReturnType<typeof createQueue>,
    idsMap: ReturnType<typeof createIdsMap>
) => {
    let invalidQueue = createQueue();
    let validQueue = createQueue();

    while (queue.length > 0) {
        let failed = false;
        const q = queue.shift() as Model;

        for (const k of Object.keys(q)) {
            const f = k as keyof typeof q;
            if (f == "id") continue;
            if (typeof q[f] !== "string") continue;
            if (!Model.inLocking(q[f] as unknown as string)) continue;

            let idSrc = q[f] as unknown as string;
            idSrc = idSrc.replace("{!", "").replace("}", "");

            if (idsMap.get(idSrc)) {
                q[f] = idsMap.get(idSrc) as never;
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
};
