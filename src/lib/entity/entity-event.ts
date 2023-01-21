export class EntityEvent {
    type;
    path;
    value;

    constructor(type, path, value) {
        this.type = type;
        this.path = path;
        this.value = value;
    }
}