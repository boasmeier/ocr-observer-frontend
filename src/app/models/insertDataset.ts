import { InsertDimension } from './insertDimension';

export class InsertDataset {
    name: string;
    description: string;
    dimension: InsertDimension;

    constructor(name: string, description: string, dimension: InsertDimension) {
        this.name = name;
        this.description = description;
        this.dimension = dimension;
    }
}