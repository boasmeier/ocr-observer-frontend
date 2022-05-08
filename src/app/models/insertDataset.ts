export class InsertDataset {
    idtask: number;
    name: string;
    description: string;

    constructor(idtask: number, name: string, description: string) {
        this.idtask = idtask;
        this.name = name;
        this.description = description;
    }
}