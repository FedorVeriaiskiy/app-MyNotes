function removeAvailClass(obj, remClassName) {
    if (obj.hasClass(remClassName)) {
        obj.removeClass(remClassName);
    }
    obj.css('left', '');
    obj.css('top', '');
    obj.css('width', '');
    obj.css('height', '');

}

var noteViews = {
    showLoginAlert: function (data) {
        $('.user-login-status').text(data);
    },
    clearInputs: function (login_id, pwd_id) {
        login_id.prop('value', '');
        pwd_id.prop('value', '');
    },
    initAuthorizationWorkspace: function () {
        $('.notes-block').css('display', 'none');
        $('.user-title').text('');
        $('.login-block').css('display', 'block');
    },

    initNotesWorkspace: function (user_name) {
        $('.login-block').css('display', 'none');
        $('.notes-block').css('display', 'block');
        var intro_phrase = "Hello, " + user_name + "!";
        $('.user-title').append(intro_phrase);
    },
    clearNotesWorkspace: function () {
        $('.notes-editing-area').html('');
        $('.notes-list-area').find('.note-list-mode').remove('');
    },
    createNote: {
        showNoteForm: function () {
            $('#note-title-text').css('display', 'block');
            $('.btn-create-note').css('display', 'block');
            $('.btn-enter-note').css('display', 'none');
            return false;
        },

        showNoteObject: function (elemTitle) {
            this.title = elemTitle;
            var elem = $('<div />');
            elem.addClass('note-list-mode');
            elem.prop('draggable', 'true');

            var noteTitle = $('<div />');
            noteTitle.addClass('note-title');
            noteTitle.text(this.title);
            elem.append(noteTitle);

            $('.notes-list-area').append(elem);
            $('.btn-enter-note').css('display', 'block');
            $('.btn-create-note').css('display', 'none');

            var deleteBtn = $('<div />');
            deleteBtn.addClass('delete-button');
            elem.append(deleteBtn);
        }
    },

    moveNote: {
        setListMode: function () {
            removeAvailClass($(dragObject.elem), 'note-drag-mode');
            removeAvailClass($(dragObject.elem), 'note-edit-mode');
            $(dragObject.elem).css('z-index', '1');
            $(dragObject.elem).addClass('note-list-mode');
            $('.notes-list-area').append($(dragObject.elem));
        },

        setEditMode: function () {
            removeAvailClass($(dragObject.elem), 'note-drag-mode');
            removeAvailClass($(dragObject.elem), 'note-list-mode');
            $(dragObject.elem).addClass('note-edit-mode');
            $(dragObject.elem).css('z-index', noteZIndex);
            ++noteZIndex;

            var noteText = $('<textarea />');
            noteText.addClass('note-text');
            $(dragObject.elem).append(noteText);

            var saveButton = $('<button />');
            saveButton.addClass('btn-save-note');
            $(dragObject.elem).append(saveButton);

            $('.notes-editing-area').append($(dragObject.elem));
        },

        setDragMode: function () {
            if ($(dragObject.elem).hasClass('note-edit-mode')) {
                $(dragObject.elem).css('z-index', '999');
            }

            movePosLeft = $(dragObject.elem).width() - DRAG_MODE_WIDTH;

            removeAvailClass($(dragObject.elem), 'note-list-mode');
            if ($(dragObject.elem).hasClass('note-edit-mode')) {
                removeAvailClass($(dragObject.elem), 'note-edit-mode');
                $(dragObject.elem).find('textarea').remove();
                $(dragObject.elem).find('.resize-handle-se').remove();
                $(dragObject.elem).find('.resize-handle-s').remove();
                $(dragObject.elem).find('.resize-handle-e').remove();
            }

            $(dragObject.elem).addClass('note-drag-mode');
            $('body').append($(dragObject.elem));
        },

        setTopLayer: function (ev) {
            $(ev.target).css('z-index', noteZIndex);
            ++noteZIndex;
        }
    },
    resizeNote: {
        addResizeHandles: function (elem) {
            elem.append(
                '<div class="resize-handle-s" /><div class="resize-handle-e" />' +
                    '<div class="resize-handle-se" />'
            );
        },
        setStyle: function (elem, style_type, style_value) {
            elem.css(style_type, style_value);
        },
        setTextarea: function (elem, curWidth, curHeight) {
            elem.find('textarea').css({'width': curWidth, 'height': curHeight});
        }
    },
    getNoteData: {
        getNoteContent: function (elem) {
            console.log('correct');
            var noteContent = elem.find('.note-text').val();
            return noteContent;
        },
        setNoteContent: function (elem, note_content) {
            elem.find('.note-text').val(note_content);
        }
    }
}