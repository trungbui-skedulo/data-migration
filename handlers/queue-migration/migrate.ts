import { Model } from "../../app";
import { createQueue, createIdsMap } from "./create";

type MigrateParams = {
    queue: ReturnType<typeof createQueue>;
    idsMap: ReturnType<typeof createIdsMap>;
    createNewIdFn: (mode: Model) => Promise<string>;
};

export const migrate = async ({
    queue,
    idsMap,
    createNewIdFn,
}: MigrateParams) => {
    let failedCount = 0;
    let srcId = "";

    while (queue.length > 0) {
        let failed = false;
        const q = queue.shift() as Model;

        for (const k of Object.keys(q)) {
            const f = k as keyof typeof q;
            if (f == "id") continue;
            if (typeof q[f] !== "string") continue;
            if (!Model.inBlocking(q[f] as unknown as string)) continue;

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
            const id = await createNewIdFn(q);

            failedCount = 0;
            srcId = q.id.replace("{!", "").replace("}", "");
            q.id = id;
            idsMap.set(srcId, q.id);

            console.log(`Migrated: ${srcId} ==> ${q.id}`);
            continue;
        }

        failedCount += 1;
        queue.push(q);

        if (failedCount >= queue.length) {
            console.log("======= Fail =====");
            break;
        }
    }

    return idsMap;
};
