var inputName = document.getElementById('inputName');
var inputSite = document.getElementById('inputSite');
var btnSubmit = document.getElementById('btnSubmit');
var tablecontent = document.getElementById('tablecontent');
var btnSetFormForUpdate = document.getElementById('btnSetFormForUpdate');
var btnDelete = document.getElementById('btnDelete');
var btnDeleteAll=document.getElementById('btnDeleteAll');
var deleteCount=document.getElementById('deleteCount');
var searchGroup=document.getElementById('searchGroup')
var searchByName=document.getElementById('searchByName')
var searchByUrl=document.getElementById('searchByUrl')
var indexOfUpdateNumber;

var bookmarkList = [];
if(localStorage.getItem('bookmarkList')){
    bookmarkList=JSON.parse(localStorage.getItem('bookmarkList'));
    displayBookMark(bookmarkList);
}
else{
    bookmarkList=[];
}

btnSubmit.onclick = function addBookmark(){
    if (!validateInputs()) {
        return;
    }

    var bookMark={
        name : inputName.value,
        url  : inputSite.value,
    }

    if (bookmarkList.some(bookmark => bookmark.url === bookMark.url)) {
        Swal.fire({
            icon: "warning",
            title: "Duplicate Bookmark",
            text: "This bookmark already exists!",
        });
        return;
    }


    bookmarkList.push(bookMark);
    localStorage.setItem('bookmarkList' , JSON.stringify(bookmarkList));
    displayBookMark(bookmarkList);
    clearInputs();

    Swal.fire({
        icon: "success",
        title: "Bookmark Added",
        text: `Successfully added "${bookMark.name}"!`,
        timer: 1500,
        showConfirmButton: false,
    });
};
function validateInputs() {
    var nameRegex = /^[a-zA-Z0-9\s]{3,50}$/;
    var urlRegex = /^(?!https:\/\/)(www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/.*)?$/;

    if (!inputName.value.trim() || !nameRegex.test(inputName.value.trim())) {
        Swal.fire({
            icon: "error",
            title: "Invalid Name",
            text: "Name must be 3-50 characters long and contain only letters, numbers, and spaces.",
        });
        return false;
    }

    if (!inputSite.value.trim() || !urlRegex.test(inputSite.value.trim())) {
        Swal.fire({
            icon: "error",
            title: "Invalid URL",
            text: "Please enter a valid URL (e.g., example.com or www.example.com).",
        });
        return false;
    }

    return true;
}



function displayBookMark( arr){
    var bookMarks = ``;
    for(var i =0 ; i<arr.length ; i++){
        bookMarks+=`
                                    <tr>
                          <td>${i+1}</td>
                          <td>${arr[i].name}</td>
                          <td>
                          <a href="https://${arr[i].url}" target="_blank" aria-label="Visit ${arr[i].name}">
                            <button class="btn btn-visit">
                              <i class="fa-solid fa-eye pe-2"></i>
                              Visit
                              </button>
                              </a>
                          </td>
                          <td>
                            <button onclick="SetFormForUpdate(${i})" class="btn btn-update">
                              <i class="fa-solid fa-pen-to-square"></i>
                              Update
                            </button>
                          </td>
                          <td>
                            <button id="btnDelete" onclick="deleteBookMark(${i})" class="btn btn-delete">
                              <i class="fa-solid fa-trash-can"></i>
                              Delete
                            </button>
                          </td>
                        </tr>
        `;
    }
    tablecontent.innerHTML= bookMarks ;
    if (bookmarkList.length > 0) {
        btnDeleteAll.classList.remove('d-none');
        deleteCount.innerHTML=bookmarkList.length;
        searchGroup.classList.remove('d-none');
    } else {
        btnDeleteAll.classList.add('d-none');
        searchGroup.classList.add('d-none');
    }
}


function clearInputs(){
    inputName.value = null;
    inputSite.value = null;
}

function SetFormForUpdate(updateNumber){
    inputName.value = bookmarkList[updateNumber].name;
    inputSite.value = bookmarkList[updateNumber].url;
    btnSetFormForUpdate.classList.remove('d-none');
    btnSubmit.classList.add('d-none');
    btnDeleteAll.classList.add('d-none');
    indexOfUpdateNumber = updateNumber;
    window.scroll({
        top:0,
        behavior:"smooth",
    })
    
}
function confirmUpdate(){
    bookmarkList[indexOfUpdateNumber].name = inputName.value;
    bookmarkList[indexOfUpdateNumber].url = inputSite.value;
    localStorage.setItem('bookmarkList', JSON.stringify(bookmarkList));
    displayBookMark(bookmarkList);
    clearInputs();
    btnSubmit.classList.remove('d-none');
    btnSetFormForUpdate.classList.add('d-none');
    btnDeleteAll.classList.remove('d-none');
}

function deleteAll(){
    Swal.fire({
        title: "Are you sure?",
        text: "This will delete all bookmarks!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete all!",
        cancelButtonText: "Cancel"
    }).then(result => {
        if (result.isConfirmed) {
            bookmarkList = [];
            localStorage.setItem("bookmarkList", JSON.stringify(bookmarkList));
            displayBookMark(bookmarkList);
            notify("All bookmarks deleted!", "warning");
        }
    });
}
function deleteBookMark(deleteNumber){
    if(btnSetFormForUpdate.classList.contains('d-none')){
        Swal.fire({
            title: "Are you sure?",
            text: "This will delete bookmark!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete !",
            cancelButtonText: "Cancel"
        }).then(result => {
            if (result.isConfirmed) {
                bookmarkList.splice(deleteNumber , 1);
                localStorage.setItem('bookmarkList' , JSON.stringify(bookmarkList));
                displayBookMark(bookmarkList);
                notify("bookmark deleted!", "warning");
            }
        });
    }else{
        Swal.fire({
            title:"You Can`t Delete During Update",
            icon:"warning",
            confirmButtonText: "Yes, I Understand",
        });
    }
}

function searchBookMarkName(){
    var searchNameArray=[];
    for(var i =0;i <bookmarkList.length; i++){
        if(bookmarkList[i].name.toLowerCase().includes(searchByName.value.toLowerCase())){
            searchNameArray.push(bookmarkList[i])
        }
    }
    displayBookMark(searchNameArray);
}
function searchBookMarkUrl(){   
    var searchUrlArray=[];
    for(var i =0;i <bookmarkList.length; i++){
        if(bookmarkList[i].url.toLowerCase().includes(searchByUrl.value.toLowerCase())){
            searchUrlArray.push(bookmarkList[i])
        }
    }
    displayBookMark(searchUrlArray);
}

