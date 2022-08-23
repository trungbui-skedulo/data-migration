import * as models from "../../models";
import * as app from "../../app";

export const getBySiteSettingName = (name: string) => {
    const q = models.Question.buildQuery()
        .where(
            `Site_Setting__r.Name = '${name}' AND RecordType.Name = 'Screening'`
        )
        .query();

    console.log(q);

    return app.SfApi.query(q).then((data) => {
        return data.records.map((r: unknown) =>
            models.Question.fromSObject(r)
                .blockField("name")
                .blockField("id")
                .blockField("siteId")
                .blockField("recordTypeId")
                .blockField("preQuestion")
        );
    });
};
