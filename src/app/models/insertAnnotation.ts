import { InsertPoint } from './insertPoint';

export class InsertAnnotation {
    idimage: number;
    object: string;
    points: InsertPoint[];

    constructor(idimage: number, object: string, points: InsertPoint[]) {
        this.idimage = idimage;
        this.object = object;
        this.points = points;
    }
}