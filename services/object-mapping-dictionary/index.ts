import * as models from "../../models";
import * as app from "../../app";

export const getAll = () => {
    const q = models.ObjectMappingDictionary.buildQuery().query();

    return app.SfApi.query(q).then((data) => {
        return data.records.map((r: unknown) =>
            models.ObjectMappingDictionary.fromSObject(r)
                .lockField("id")
                .lockField("mappingToObject")
        );
    }) as Promise<models.ObjectMappingDictionary[]>;
};
