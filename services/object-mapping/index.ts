import * as models from "../../models";
import * as app from "../../app";

export const getAll = () => {
    const q = models.ObjectMapping.buildQuery().query();

    return app.SfApi.query(q).then((data) => {
        return data.records.map((r: unknown) =>
            models.ObjectMapping.fromSObject(r).lockField("id")
        );
    }) as Promise<models.ObjectMapping[]>;
};
