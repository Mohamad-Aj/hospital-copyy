const notesContainer = document.getElementById("app");
const addNoteButton = document.querySelector(".add-note");


getNotes().forEach(note => {
    const noteElemnt = createNoteElement(note.id,note.content);
    notesContainer.insertBefore(noteElemnt,addNoteButton);
});

addNoteButton.addEventListener("click",()=>addNote());

function getNotes(){
    return JSON.parse(localStorage.getItem("sticky-notes") || "[]");
}

function saveNotes(notes){
    localStorage.setItem("sticky-notes",JSON.stringify(notes));
}

function createNoteElement(id,content){
    const element = document.createElement("textarea");
    element.classList.add("note");
    element.value = content;
    element.placeholder = "Write Here";

    element.addEventListener("change",()=>{
        updateNote(id,element.value);
    });

    element.addEventListener("dblclick", ()=>{
        const doDelete = confirm("Are you sure you want to delete this note?");
        if(doDelete){
            deleteNote(id,element);
        }
    });
    return element;
}

function addNote(){
    const notes= getNotes();
    const noteObject = {
        id: Math.floor(Math.random()* 1000),
        content: ""
    };

    const noteElemnt = createNoteElement(noteObject.id,noteObject.content);
    notesContainer.insertBefore(noteElemnt, addNoteButton);
    notes.push(noteObject);
    saveNotes(notes);

}

function updateNote(id, newContent){
    const notes = getNotes();
    const targetNote = notes.filter(note => note.id == id)[0];
    targetNote.content = newContent;
    saveNotes(notes);
}

function deleteNote(id,element){
    const notes1 = getNotes().filter(note => note.id != id);
    saveNotes(notes1);
    notesContainer.removeChild(element);
}