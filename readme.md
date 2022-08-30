# Environment
- Source org
    - File: .env.src
    - Variables:
        - DATA_PATH: scr path to store data from src org
        - SF_INSTANCE_TOKEN: set for calling API to Salesforce via connected app
        - INSTANCE: instance url of src org
- Destination org
    - File: .env.dst
    - Variables:
        - DATA_PATH: scr path to get data stored
        - SF_INSTANCE_TOKEN: set for calling API to Salesforce via connected app
        - INSTANCE: instance url of dst org

Note: Reference env files with .example suffix to make your own env files

# Getting started
1. Stable on:
    - Node v14.18.2
2. Install dependencies
> yarn install
3. Retrieve data from src org
> yarn run retrieve
4. Push data stored to dst org
> yarn run push

# Customize
## Model
Be used to describe sobject shape.\
Example:
```
import { Model } from "../app/model";

export class RecordType extends Model {
    name = "";
    sObjectType = "";

    getTableName() {
        return "RecordType";
    }

    getApiFields() {
        const fieldMap = new Map<string, string>();

        fieldMap.set("id", "Id");
        fieldMap.set("name", "Name");
        fieldMap.set("sObjectType", "SobjectType");

        return fieldMap;
    }
}
```
## Data Collector
Be used to collect data from a model to store data locally, you can create a service layer or other methods in the collector to implement other logics. Example:

```
import * as services from "../../services";
import { SObjectCollector } from "./index";
import { Model } from "../../app";

export class QuestionCollector extends SObjectCollector {
    execute(): Promise<Model[]> {
        return services.question.getBySiteSettingName("scarlet_dtc");
    }
}

```

A data collector need a `CollectorQueue` to be executed, you can update those code in `retrieve.ts`:

```
import dotenv from "dotenv";
import * as handlers from "./handlers";

dotenv.config({
    path: "./.env.src",
});

const questionCollector =
    handlers.dataCollectors.QuestionCollector.newInstance();

handlers.dataCollectors.CollectorQueue.newInstance()
    .pushCollector(questionCollector)
    .execute();

```

## Data Migration

Be used to migrate data from local to dst org, you can create a service layer or other methods in the migration to implement other logics. Example:

```
import { DataMigration } from ".";
import { Model } from "../../app";

export class RecordType extends DataMigration {
    records(): Model[] {
        return [];
    }

    idsMap() {
        const idsMap = new Map<string, string>();

        idsMap.set("0122S0000006HVmQAM", "0122S0000006HVmQAM");
        idsMap.set("0122S0000006HVnQAM", "0122S0000006HVnQAM");
        idsMap.set("0122S0000006HVoQAM", "0122S0000006HVoQAM");
        idsMap.set("0122S000000NSXWQA4", "0122S000000NSXWQA4");
        idsMap.set("0122S000000gVZYQA2", "0122S000000gVZYQA2");

        return idsMap;
    }
}

```

The `idsMap` is used to mapping a reference value from a src org to a dst org. In case the those ids are not existed, you can return a set of records from a src org with reference values blocked in the `records` function

A `DataMigration` need a `MigrationQueue` to be executed, you can update those code in `push.ts`:

```
import * as handlers from "./handlers";
import * as app from "./app";
import dotenv from "dotenv";
import { NewIdResult } from "./handlers/data-migrations";
import { MassInsertedResult } from "./app/sf-api";

dotenv.config({
    path: "./.env.dst",
});

const insertRecords = (qs: app.Model[]) => {...};

const recordType = handlers.dataMigrations.RecordType.newInstance();

handlers.dataMigrations.MigrationQueue.newInstance()
    .pushMigration(recordType)
    .createNewIdsFn(insertRecords)
    .excute();

```