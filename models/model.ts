import { QueryBuilder } from "../app/query-builder";

export class Model {
    constructor() {}

    static buildQuery() {
        return QueryBuilder.build()
            .select(this.getKeys())
            .from(this.getTableName());
    }

    static fromSObject(_record: any) {
        const instance = new this();
        const km = this.getApiFields();
        for (const k of Object.keys(instance)) {
            const f = k as keyof typeof instance;
            if (km.get(k) == undefined) continue;
            instance[f] = _record[km.get(k) as string] as never;
        }

        return instance;
    }

    static toCamelCase(s: string) {
        return s.replace(/[A-Z]/, (v) => `_${v.toLowerCase()}`);
    }

    static getKeys() {
        const instance = new this();
        const apiFields = this.getApiFields();

        // return Object.keys(instance).map((k) => this.toCamelCase(k));
        return Object.keys(instance).map((k) => apiFields.get(k) ?? k);
    }

    static getTableName() {
        return "";
    }

    static getApiFields() {
        return new Map<string, string>();
    }

    static toSObject(instance: any, _force: boolean = false) {
        const sObjectMap = new Map<string, unknown>();
        const apiFields = this.getApiFields();

        for (const k of apiFields.keys()) {
            if (!instance[k] || (!_force && this.inBlocking(instance[k])))
                continue;
            const apiF = apiFields.get(k) as string;
            sObjectMap.set(apiF, instance[k]);
        }

        return Object.fromEntries(sObjectMap);
    }

    static inBlocking(value: string) {
        const pattern = /^{!.+}$/;
        return pattern.test(value);
    }

    blockField(key: string) {
        const field = key as keyof this;

        if (!this[field]) return this;

        this[field] = `{!${this[field]}}` as any;

        return this;
    }
}
