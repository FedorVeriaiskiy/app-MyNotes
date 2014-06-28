// controller functions

function fUserAuthorize() {
    var user_login = $('#login-val').prop('value');
    var user_pwd = $('#pwd-val').prop('value');

    if ((user_login == '') || (user_pwd == '')) {
        noteViews.showLoginAlert(User.loginAlerts.emptyField);
        noteViews.clearInputs($('#login-val'), $('#pwd-val'));
        return false;
    }

    var jqxhr = $.post("storage/server-authorize-user.php", {user_login: user_login, user_pwd: user_pwd}, function (data) {
        var dataCallback = data.split('/');
        if (dataCallback[1] == 1) {
            User.isLogged = true;
        }
        noteViews.showLoginAlert(dataCallback[0]);
        noteViews.clearInputs($('#login-val'), $('#pwd-val'));

        if (!User.isLogged) {
            return false;
        }

        curUser = new User(user_login);
        noteViews.initNotesWorkspace(curUser.userLogin);

        var jqxhr = $.post("storage/server-load-notes.php", {user_login: user_login}, function (data) {
            var res = data.split('\n');
            for (var i = 0; i < (res.length - 1); i++) {
                var curNoteData = res[i].split('/');
                noteViews.createNote.showNoteObject(curNoteData[0]);
				
				curUser.editNoteTitle(curNoteData[0]);
                curUser.editNoteContent(curNoteData[0], curNoteData[1]);
                $(document).c_drag_note();

            }
        });
    });
    return false;
}

function fUserLogout() {
    if (window.confirm("Log out?")) {
        User.isLogged = false;
        noteViews.initAuthorizationWorkspace();
    }
    return false;
}


function fUserSignout() {
    if (window.confirm("Sign out?")) {
        var jqxhr = $.post("storage/server-signout-user.php", {user_login: curUser.userLogin}, function () {
            User.isLogged = false;
            noteViews.clearNotesWorkspace();
            noteViews.initAuthorizationWorkspace();
        });
        return false;
    }
}


function serverManageNote(noteTitle, noteContent) {
    var jqxhr = $.post("storage/server-manage-note.php", {user_login: curUser.userLogin, note_title: noteTitle, note_content: noteContent}, function () {
        alert("Note successfully saved");
    });
}
function serverDeleteNote(noteTitle, noteContent) {
    var jqxhr = $.post("storage/server-delete-note.php", {user_login: curUser.userLogin, note_title: noteTitle}, function () {
        alert("Note deleted");
    });
}


function fUserLogout(user_login) {
    if (confirm('Logout?')) {
        User.isLogged = false;
        noteViews.clearNotesWorkspace();
        noteViews.initAuthorizationWorkspace();
    }

}

function fEnterNoteName(e) {
    $('#note-title-text').focus();
    var inputTitle = $('#note-title-text').prop('value');

    if (inputTitle.length && curUser.checkNoteTitle(inputTitle)) {
        curUser.editNoteTitle(inputTitle);
        noteViews.createNote.showNoteObject(inputTitle);
        $('#note-title-text').prop('value', '').css('display', 'none');
        $(document).c_drag_note();
    }
}
function fSaveNote(el, ev) {
    var curNoteTitle = $(ev.target).parent().find('.note-title').text(),
        curNoteContent = $(ev.target).parent().find('textarea').val();
    serverManageNote(curNoteTitle, curNoteContent);
    return false;
}

function fDeleteNote(targetElem) {
    var curNoteTitle = targetElem.parent().find('.note-title').text();
    serverDeleteNote(curNoteTitle);
    return false;
}


// drag-n-drop functions

var movePosLeft,   // horizontal delta for moving a note
    noteZIndex = 1,
    dragObject = {};

function fStartDragNote(el, ev) {
$(ev.target).stopPropogation(); /// check in Opera
    if (!$(ev.target).prop('draggable')) return;
  
    var noteCoords = getCoords($(ev.target));
    if (ev.pageY > (noteCoords.top + NOTE_DRAG_CATCH_HEIGHT)) return;

    dragObject.elem = ev.target;
    dragObject.downX = ev.pageX;
    dragObject.downY = ev.pageY;

    curUser.cur_note_title = $(ev.target).find('.note-title').text();
    return false;
}

function fMoveNote(el, ev) {
    if (!dragObject.elem) return;
    if (!dragObject.avatar) {
        var moveX = ev.pageX - dragObject.downX;
        var moveY = ev.pageY - dragObject.downY;
        if (Math.abs(moveX) < 5 && Math.abs(moveY) < 5) return;

        dragObject.avatar = createAvatar(ev);
        if (!dragObject.avatar) {
            dragObject = {};
            return;
        }

        var coords = getCoords(dragObject.avatar);
        dragObject.shiftX = dragObject.downX - coords.left;
        dragObject.shiftY = dragObject.downY - coords.top;
        startDrag(el, ev);  // start drag
    }

    if (dragObject.shiftX > DRAG_MODE_WIDTH) {
        var avatarLeft = ev.pageX - DRAG_MODE_WIDTH / 2 + 'px';
    } else {
        var avatarLeft = ev.pageX - dragObject.shiftX + 'px';
    }

    var avatarTop = ev.pageY - dragObject.shiftY + 'px';
    dragObject.avatar.css('left', avatarLeft);
    dragObject.avatar.css('top', avatarTop);
    return false;
}

function fFinishDragNote(el, ev) {
    if (dragObject.avatar) {
        finishDrag(el, ev);
    }
    dragObject = {};
}

function createAvatar() {
    var avatar = $(dragObject.elem);
    if (avatar.hasClass('note-edit-mode')) {
        var cur_content = noteViews.getNoteData.getNoteContent(avatar);
        curUser.editNoteContent(curUser.cur_note_title, cur_content);
    }

    avatar.listMode = noteViews.moveNote.setListMode;
    avatar.editMode = noteViews.moveNote.setEditMode;
    return avatar;
}

function startDrag() {
    noteViews.moveNote.setDragMode();
}

function finishDrag(el, ev) {
    var dropElem = findDroppable(ev);
    if (!dropElem) {
        onDragCancel();
    } else {
        if (dropElem.hasClass('notes-editing-area')) {
            onDragEditEnd(dropElem, event);
        }
        if (dropElem.hasClass('notes-list-area')) {
            onDragListEnd(dropElem);
        }
    }
}

function onDragCancel() {
    var avatar = dragObject.avatar;
    avatar.listMode();
}

function adjustTextarea(elem) {
    var curWidth = elem.width() - TEXT_NOTE_DELTA_WIDTH,
        curHeight = elem.height() - TEXT_NOTE_DELTA_HEIGHT;
    noteViews.resizeNote.setTextarea(elem, curWidth, curHeight);
}

function onDragEditEnd(dropElem, ev) {
    var avatar = dragObject.avatar;
    var curEvent = ev || window.event;     //make with jquery!!!
    if (curEvent.stopImmediatePropagation) {
        curEvent.stopImmediatePropagation();
    } else {
        curEvent.canselBubble = false;
    }
    avatar.editMode();
    $('.btn-save-note').c_save_note();

    var saved_content_value = curUser.readNoteContent(curUser.cur_note_title);
    noteViews.getNoteData.setNoteContent(avatar, saved_content_value);

    adjustTextarea($(avatar));
    setNotesCascade();
    $('.note-edit-mode').c_drag_edit_end();
    $('.delete-button').c_delete_note();
    resizeable($(avatar));
}

function onDragListEnd() {
    var avatar = dragObject.avatar;
    avatar.listMode();
}


/* other functions */

function getCoords(elem) {   // make with jquery
    var top = elem.offset().top + elem.scrollTop();
    var left = elem.offset().left + elem.scrollLeft();
    return { top: Math.round(top), left: Math.round(left) };
}

function findDroppable(ev) {
    var elem = getElementUnderClientXY(dragObject.avatar, ev.clientX, ev.clientY);
    while ((elem.html() != $(document).html()) && elem.attr('droppable') == null) {
        elem = elem.parent();
    }
    return  $(elem).html() == $(document).html() ? null : elem;
}

function getElementUnderClientXY(elem, clientX, clientY) {   // delete
    var display = elem.css('display') || '';
    elem.css('display', 'none');
    var target = document.elementFromPoint(clientX, clientY);
    target = $(target);
    elem.css('display', display);
    return target;
}

function editNoteHandler(el, ev) {
    noteViews.moveNote.setTopLayer(ev);
    stopPropogate(ev);
}

function deleteNoteHandler(el, ev) {
    var res = confirm('Delete this note?');
    if (res) {
        deleteNote(el, ev);
    } else {
        return false;
    }
}

function deleteNote(el, ev) {
    var targetElem = $(ev.target);
    fDeleteNote(targetElem);
    stopPropogate(ev);
    targetElem.parent().remove();
    setNotesCascade();
    return false;
}

function setNotesCascade() {
    var notePos = 15,
        i = 0;
    var noteEditMode = $('.note-edit-mode');
    while (noteEditMode.eq(i).hasClass('note-edit-mode')) {
        noteEditMode.eq(i).css('left', notePos + 'px');
        noteEditMode.eq(i).css('top', notePos + 'px');
        notePos += 15;
        i++;
    }
    return false;
}

function resizeable(elem) {
    var newWidth, newHeight, resizeType;

    noteViews.resizeNote.addResizeHandles(elem);
    elem.on('mousedown', onMouseDown);

    function onMouseDown(e) {
        var className = e.target.className;
        if (className.indexOf('resize-handle-') == 0) {
            resizeType = className.slice("resize-handle-".length);
            startResize();
        }
    }


    function startResize() {
        $(document).on('mousemove.resizeable', onDocumentMouseMove);
        $(document).on('mouseup.resizeable', onDocumentMouseUp);
    }

    function onDocumentMouseMove(e) {
        var offset = elem.offset();
        if ((e.pageX < ($(window).width() - 10)) && (e.pageY < ($(window).height() - 10))) {
            if (~resizeType.indexOf('s')) {
                newHeight = e.pageY - offset.top;
                console.log(newHeight);
                if (newHeight < MIN_NOTE_HEIGHT) {
                    newHeight = MIN_NOTE_HEIGHT;
                }
                noteViews.resizeNote.setStyle(elem, 'height', newHeight);
            }
            if (~resizeType.indexOf('e')) {
                newWidth = e.pageX - offset.left;

                if (newWidth < MIN_NOTE_WIDTH) {
                    newWidth = MIN_NOTE_WIDTH;
                }
                noteViews.resizeNote.setStyle(elem, 'width', newWidth);
            }
        }
        adjustTextarea(elem);
    }

    function onDocumentMouseUp() {
        endResize();
    }

    function endResize() {
        $(document).off('.resizeable');
    }
}

function stopPropogate(curEvent) {
    if (curEvent.stopImmediatePropagation) {
        curEvent.stopImmediatePropagation();
    } else {
        curEvent.canselBubble = false;
    }
}


// Controllers

$.Controller("cUserAuth", {
    'click': fUserAuthorize
});

$.Controller("cUserLogout", {
    'click': fUserLogout
});
$.Controller("cUserSignout", {
    'click': fUserSignout
});


$.Controller("cEnterNewNote", {
    'click': function () {
        noteViews.createNote.showNoteForm();
        $(window).on('keypress', function (e) {
            if (e.keyCode == 13) {
                fEnterNoteName();
                return;
            }
        });
    }
});

$.Controller("cAddNewNote", {
    'click': fEnterNoteName
});


$.Controller("cDragNote", {
    'mousedown': fStartDragNote,
    'mousemove': fMoveNote,
    'mouseup': fFinishDragNote
});


$.Controller("cDragEditEnd", {
    'click': editNoteHandler
});

$.Controller("cSaveNote", {
    'click': fSaveNote
});

$.Controller("cDeleteNote", {
    'click': deleteNoteHandler
});


// controller calls	

$('#send-login-data').c_user_auth();
$('.btn-logout').c_user_logout();
$('.btn-signout').c_user_signout();

$('.btn-enter-note').c_enter_new_note();
$('.btn-create-note').c_add_new_note();

