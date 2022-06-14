// import KanbanAPI from "./KanbanAPI.js";

// Insert
// KanbanAPI.insertItem(2, "New Task");

// Update
// KanbanAPI.updateItem(101, {
//     columnId: 3,
//     position: 0,
//     content: "Updated Task"
// });

// Delete
// KanbanAPI.deleteItem(101);

import Kanban from './view/Kanban.js';

new Kanban(
    document.querySelector(".kanban")
);