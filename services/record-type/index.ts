import * as app from "../../app";
import * as models from "../../models";

export const getRecordTypeBySObject: (
    sObjectName: string
) => Promise<models.RecordType[]> = (sObjectName) => {
    const query = models.RecordType.buildQuery()
        .where(`SobjectType = '${sObjectName}'`)
        .query();
    return app.SfApi.query(query).then((res) =>
        res.records.map(
            (r: unknown) =>
                models.RecordType.fromSObject(r) as models.RecordType
        )
    );
};
