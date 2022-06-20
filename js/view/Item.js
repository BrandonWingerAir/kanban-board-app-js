import KanbanAPI from "../kanbanAPI.js";
import GridLocation from './GridLocation.js';

export default class Item {
    constructor(id, content) {
        const gridLocationBelow = GridLocation.createGridLocation();

        this.elements = {};
        this.elements.root = Item.createRoot();
        this.elements.input = this.elements.root.querySelector(".kanban__item-input");

        this.elements.root.dataset.id = id;
        this.elements.input.textContent = content;
        this.content = content;

        this.elements.root.appendChild(gridLocationBelow);

        const onBlur = () => {
            const newContent = this.elements.input.textContent.trim();
            
            if (newContent == this.content) {
                return;
            }

            this.content = newContent;

            KanbanAPI.updateItem(id, {
                content: this.content
            });
        };
        
        this.elements.root.addEventListener("click", () => {
            const el = this.elements.input;
            const selection = window.getSelection();
            const range = document.createRange();
            selection.removeAllRanges();
            range.selectNodeContents(el);
            range.collapse(false);
            selection.addRange(range);
            el.focus();
        });

        this.elements.input.addEventListener("keypress", e => {
            var keycode = e.charCode || e.keyCode;

            if (keycode === 13) {
                e.preventDefault();
                this.elements.input.blur();
            }
        });

        this.elements.input.addEventListener("blur", onBlur);

        this.elements.root.addEventListener("dblclick", () => {
            let confirmModal = document.getElementById("confirm");
            
            if (!confirmModal.classList.contains("modal-open")) {
                confirmModal.classList.add("modal-open");
            }
                        
            document
                .getElementById("modal-confirm")
                .addEventListener("click", () => {
                    KanbanAPI.deleteItem(id);
                
                    this.elements.input.removeEventListener("blur", onBlur);
                    this.elements.root.parentElement.removeChild(this.elements.root);
                    
                    let confirmModal = document.getElementById("confirm");
                    confirmModal.classList.remove("modal-open");
                });
        });

        this.elements.root.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", id);
        });

        this.elements.input.addEventListener("drop", e => {
            e.preventDefault();
        });
    }

    static createRoot() {
        const range = document.createRange();

        range.selectNode(document.body);

        return range.createContextualFragment(`
            <div class="kanban__item" draggable="true">
                <div class="kanban__item-input" contenteditable></div>
            </div>
        `).children[0];
    }
}