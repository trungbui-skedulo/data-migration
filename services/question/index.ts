import * as models from "../../models";
import * as app from "../../app";

export const getBySiteSettingName = (name: string) => {
    const q = models.Question.buildQuery()
        .where(`Site_Setting__r.Name = '${name}'`)
        .query();

    return app.SfApi.query(q).then((data) => {
        return data.records.map((r: unknown) =>
            models.Question.fromSObject(r)
                .lockField("name")
                .lockField("id")
                .lockField("siteId")
                .lockField("recordTypeId")
                .lockField("preQuestion")
        );
    }) as Promise<models.Question[]>;
};
