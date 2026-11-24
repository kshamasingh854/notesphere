const form=document.querySelector("#note-form");
const idField=document.querySelector("#note-id");
const titleField=document.querySelector("#title");
const contentField=document.querySelector("#content");
const notesContainer=document.querySelector("#notes");
const emptyMessage=document.querySelector("#empty");
const message=document.querySelector("#message");
const formHeading=document.querySelector("#form-heading");
const saveButton=document.querySelector("#save-button");
const cancelButton=document.querySelector("#cancel-button");

async function request(url,options={}){
  const response=await fetch(url,{headers:{"Content-Type":"application/json",...(options.headers||{})},...options});
  if(!response.ok){const body=await response.json().catch(()=>({}));throw new Error(body.message||`Request failed (${response.status})`);}
  return response.status===204?null:response.json();
}
function showMessage(text){message.textContent=text;}
function resetForm(){form.reset();idField.value="";formHeading.textContent="Create a note";saveButton.textContent="Save note";cancelButton.classList.add("hidden");}
function button(text,className,onClick){const b=document.createElement("button");b.type="button";b.textContent=text;b.className=className;b.addEventListener("click",onClick);return b;}

function renderNotes(notes){
  notesContainer.replaceChildren();
  emptyMessage.classList.toggle("hidden",notes.length!==0);
  for(const note of notes){
    const card=document.createElement("article");card.className="note-card";
    const title=document.createElement("h3");title.textContent=note.title;
    const content=document.createElement("p");content.textContent=note.content;
    const actions=document.createElement("div");actions.className="note-actions";
    actions.append(
      button("Edit","secondary",()=>{idField.value=note.id;titleField.value=note.title;contentField.value=note.content;formHeading.textContent="Edit note";saveButton.textContent="Update note";cancelButton.classList.remove("hidden");titleField.focus();}),
      button("Delete","danger",async()=>{if(!confirm(`Delete "${note.title}"?`))return;try{await request(`/api/notes/${note.id}`,{method:"DELETE"});await loadNotes();showMessage("Note deleted.");}catch(e){showMessage(e.message);}})
    );
    card.append(title,content,actions);notesContainer.append(card);
  }
}
async function loadNotes(){try{renderNotes(await request("/api/notes"));}catch(e){showMessage(e.message);}}
form.addEventListener("submit",async event=>{
  event.preventDefault();
  const id=idField.value;
  const payload={title:titleField.value.trim(),content:contentField.value.trim()};
  try{
    await request(id?`/api/notes/${id}`:"/api/notes",{method:id?"PUT":"POST",body:JSON.stringify(payload)});
    resetForm();await loadNotes();showMessage(id?"Note updated.":"Note saved.");
  }catch(e){showMessage(e.message);}
});
cancelButton.addEventListener("click",resetForm);
document.querySelector("#refresh-button").addEventListener("click",loadNotes);
loadNotes();
