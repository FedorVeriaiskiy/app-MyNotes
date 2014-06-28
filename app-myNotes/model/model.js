$.Model('User', {
    userPersonData: [],
    userNoteTitles: [],
    userNoteContent: [],
    isLogged: false,
    loginAlerts: {
        emptyField: "Not all fields are filled"
    }
}, {
    init: function (user_login) {
        this.userLogin = user_login;
        User.userNoteTitles[this.userLogin] = [];
    },
    checkNoteTitle: function (inputTitle) {
        var titlesArr = User.userNoteTitles[this.userLogin];
        for (var i = 0; i < titlesArr.length; i++) {
            if (titlesArr[i] == inputTitle) return false;
        }
        return true;
    },
    editNoteTitle: function (note_title) {
        User.userNoteTitles[this.userLogin].push(note_title);
    },
    editNoteContent: function (note_title, note_content) {
        var noteContentKey = this.userLogin + note_title + '';
        User.userNoteContent[noteContentKey] = note_content;
    },
    readNoteContent: function (note_title) {
        var noteContentKey = this.userLogin + note_title + '';
        return User.userNoteContent[noteContentKey];
    }
});				