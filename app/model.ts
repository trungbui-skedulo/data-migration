import { Constant, QueryBuilder } from ".";

export class Model {
    id = "";

    constructor() {}

    static buildQuery() {
        return QueryBuilder.build()
            .select(this.getKeys())
            .from(this.getTableName());
    }

    static newInstance() {
        return new this();
    }

    fromSObject(_record: any) {
        const km = this.getApiFields();
        for (const k of Object.keys(this)) {
            const f = k as keyof typeof this;
            if (km.get(k) == undefined) continue;
            this[f] = _record[km.get(k) as string] as never;
        }

        return this;
    }

    static fromSObject(_record: any) {
        return this.newInstance().fromSObject(_record);
    }

    static toCamelCase(s: string) {
        return s.replace(/[A-Z]/, (v) => `_${v.toLowerCase()}`);
    }

    getKeys() {
        const apiFields = this.getApiFields();

        return Object.keys(this)
            .filter((k) => apiFields.get(k))
            .map((k) => apiFields.get(k) as string);
    }

    static getKeys() {
        return this.newInstance().getKeys();
    }

    getTableName() {
        return "";
    }

    static getTableName() {
        return this.newInstance().getTableName();
    }

    getApiFields() {
        return new Map<string, string>();
    }

    static getApiFields() {
        return this.newInstance().getApiFields();
    }

    toSObject(_force: boolean = false) {
        const sObjectMap = new Map<string, unknown>();
        const apiFields = this.getApiFields();

        for (const k of apiFields.keys()) {
            const f = k as keyof typeof this;
            if (
                this[f] == undefined ||
                (!_force && this.inLocking(f as string))
            )
                continue;
            const apiF = apiFields.get(k) as string;
            sObjectMap.set(apiF, this[f]);
        }

        return Object.fromEntries(sObjectMap);
    }

    static toSObject(instance: any, _force: boolean = false) {
        const sObjectMap = new Map<string, unknown>();
        const apiFields = this.getApiFields();

        for (const k of apiFields.keys()) {
            if (
                instance[k] == undefined ||
                (!_force && this.inLocking(instance[k]))
            )
                continue;
            const apiF = apiFields.get(k) as string;
            sObjectMap.set(apiF, instance[k]);
        }

        return Object.fromEntries(sObjectMap);
    }

    inLocking(key: string) {
        const field = key as keyof typeof this;
        const pattern = Constant.VALUE_IN_LOCKING_PATTERN;
        const value = this[field] as unknown as string;
        return pattern.test(value);
    }

    static inLocking(value: string) {
        const pattern = Constant.VALUE_IN_LOCKING_PATTERN;
        return pattern.test(value);
    }

    lockField(key: string) {
        const field = key as keyof this;

        if (this[field] == undefined) return this;

        this[field] = `{!${this[field]}}` as any;

        return this;
    }

    unlockField(key: string) {
        const field = key as keyof this;
        const value = this[field] as unknown as string;
        this[field] = value.replace("{!", "").replace("}", "") as any;

        return this;
    }
}
