export default class KanbanAPI {
    // Get Items
    static getItems(columnId) {
        const column = read().find(column => column.id == columnId);
        
        if (!column) {
            return [];
        }
        
        return column.items;
    }
    
    // Create Item
    static insertItem(columnId, content) {
        const data = read();
        const column = data.find(column => column.id == columnId);

        const item = {
            id: Math.floor(Math.random() * 1000000),
            content
        }

        if (!column) {
            throw new Error("Column does not exist");
        }

        column.items.push(item);
        save(data);

        return item;
    }

    // Update Item
    static updateItem(itemId, newProps) {
        const data = read();

        const [item, currentColumn] = (() => {
            for (const column of data) {
                const item = column.items.find(item => item.id == itemId);

                if (item) {
                    return [item, column];
                }
            }
        })();

        if (!item) {
            throw new Error("Item not found.");
        }

        item.content = newProps.content === undefined ? item.content : newProps.content;

        // Column & Row
        if (newProps.columnId !== undefined && newProps.position !== undefined) {
            const targetColumn = data.find(column => column.id == newProps.columnId);
            
            if (!targetColumn) {
                throw new Error ("Target column not found.");
            }

            currentColumn.items.splice(currentColumn.items.indexOf(item), 1);
            targetColumn.items.splice(newProps.position, 0, item);
        }

        save(data);
    }

    static deleteItem(itemId) {
        const data = read();

        for (const column of data) {
            const item = column.items.find(item => item.id == itemId);

            if (item) {
                column.items.splice(column.items.indexOf(item), 1);
            }
        }

        save(data);
    }
}

// Default Items
function read() {
    const json = localStorage.getItem("kanban-data");

    if (!json) {
        return [
            {
                id: 1,
                items: [{ "id": 123, "content": "Task 1" }]
            },
            {
                id: 2,
                items: [{ "id": 456, "content": "Task 2" }]
            },
            {
                id: 3,
                items: [
                    { "id": 789, "content": "Task 3" },
                    { "id": 101, "content": "Task 4" }
                ]
            }
        ]
    }

    return JSON.parse(json);
}

// Save Items
function save(data) {
    localStorage.setItem("kanban-data", JSON.stringify(data));
}