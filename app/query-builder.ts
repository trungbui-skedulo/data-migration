export class QueryBuilder {
    private statement: string;
    private fields: Array<string>;
    private table: string;
    private orderByField: string;
    private limitNum: number;
    private offsetNum: number;
    private whereStatement: string;
    constructor() {
        this.fields = [];
        this.table = "";
        this.whereStatement = "";
        this.orderByField = "";
        this.limitNum = 0;
        this.offsetNum = 0;
        this.statement =
            "SELECT {fields} FROM {table} WHERE {whereStatement} ORDER BY {orderByField} LIMIT {limitNum} OFFSET {offsetNum}";
    }

    static build() {
        return new QueryBuilder();
    }

    select(fields: Array<string>) {
        this.fields = fields;

        return this;
    }

    from(table: string) {
        this.table = table;

        return this;
    }

    orderBy(orderByField: string) {
        this.orderByField = orderByField;

        return this;
    }

    where(whereStatement: string) {
        this.whereStatement = whereStatement;

        return this;
    }

    offset(offsetNum: number) {
        this.offsetNum = offsetNum;

        return this;
    }

    limit(limitNum: number) {
        this.limitNum = limitNum;

        return this;
    }

    query() {
        const results: Array<Map<String, unknown>> = [];

        this.statement = this.statement.replace(
            "{fields}",
            this.fields.join(", ")
        );
        this.statement = this.statement.replace("{table}", this.table);

        if (this.whereStatement) {
            this.statement = this.statement.replace(
                "{whereStatement}",
                this.whereStatement
            );
        } else {
            this.statement = this.statement.replace(
                " WHERE {whereStatement}",
                ""
            );
        }

        if (this.orderByField) {
            this.statement = this.statement.replace(
                "{orderByField}",
                this.orderByField
            );
        } else {
            this.statement = this.statement.replace(
                " ORDER BY {orderByField}",
                ""
            );
        }

        if (this.limitNum) {
            this.statement = this.statement.replace(
                "{limitNum}",
                String(this.limitNum)
            );
        } else {
            this.statement = this.statement.replace(" LIMIT {limitNum}", "");
        }

        if (this.offsetNum) {
            this.statement = this.statement.replace(
                "{offsetNum}",
                String(this.offsetNum)
            );
        } else {
            this.statement = this.statement.replace(" OFFSET {offsetNum}", "");
        }

        return this.statement;

        // for (const r of db.query(this.statement)) {
        //     const map_result: Map<string, unknown> = new Map<string, unknown>();

        //     for (let i = 0; i < r.length; i++) {
        //         map_result.set(this.fields[i], r[i]);
        //     }

        //     results.push(map_result);
        // }

        // return results;
    }
}
