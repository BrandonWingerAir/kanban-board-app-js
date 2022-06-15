import KanbanAPI from '../kanbanAPI.js';

export default class GridLocation {
    static createGridLocation() {
        const range = document.createRange();

        range.selectNode(document.body);

        const gridLocation = range.createContextualFragment(`
            <div class="kanban__dropzone"></div>
        `).children[0];

        gridLocation.addEventListener("dragover", e => {
            e.preventDefault();
            gridLocation.classList.add("kanban__dropzone--active");
        });
        
        gridLocation.addEventListener("dragleave", () => {
            gridLocation.classList.remove("kanban__dropzone--active");
        });

        gridLocation.addEventListener("drop", e => {
            e.preventDefault();
            gridLocation.classList.remove("kanban__dropzone--active");

            const columnElement = gridLocation.closest(".kanban__column");
            const columnId = Number(columnElement.dataset.id);

            const gridLocationInColumn = Array.from(columnElement.querySelectorAll(".kanban__dropzone"));
            const gridIndex = gridLocationInColumn.indexOf(gridLocation);

            const itemId = e.dataTransfer.getData("text/plain");
            const itemAbove = document.querySelector(`[data-id="${itemId}"]`);

            const insertBelow = gridLocation.parentElement.classList.contains("kanban__item") ? gridLocation.parentElement : gridLocation;

            if (itemAbove.contains(gridLocation)) {
                return;
            }

            insertBelow.after(itemAbove)

            KanbanAPI.updateItem(itemId, {
                columnId,
                position: gridIndex
            });
        });
        
        return gridLocation;
    }
}