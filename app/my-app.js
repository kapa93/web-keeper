angular.module('myApp', [])

.controller('MainCtrl', ['$scope', function($scope) {

    $scope.categories = [
      {"id": 0, "name": "Title Loans"},
    ];

    $scope.bookmarks = [];

    //for( item in localStorage ) {
    //    // Parse the JSON string and add to to contacts array
    //    var newItem = JSON.parse( localStorage[item] );
    //    $scope.bookmarks.push( newItem );
    //}

    var ref = firebase.database().ref("bookmarks/");

    var storage = firebase.storage();

    var storageRef = storage.ref();

    var database = firebase.database();

    $scope.populateShit = function() {
        ref.once('value').then(function(data) {
            for (item in data.val()) {
                var newItem = {
                    id: (data.val()[item].id),
                    title: (data.val()[item].title),
                    url: (data.val()[item].url),
                    host: (data.val()[item].host),
                    user: (data.val()[item].user),
                    password: (data.val()[item].password),
                }
                $scope.bookmarks.push(newItem);
            }
        }), function (error) {
            console.log("Error: " + error.code);
        };
    }

    $scope.currentCategory = null;

    // ---------------------------------------------

    function setCurrentCategory(category) {
        $scope.currentCategory = category;

        cancelCreating();
        cancelEditing();
    }

    function isCurrentCategory(category) {
        return $scope.currentCategory !== null && category.name === $scope.currentCategory.name;
    }

    $scope.setCurrentCategory = setCurrentCategory;
    $scope.isCurrentCategory = isCurrentCategory;

    // ---------------------------------------------

    function randomPassword(length) {
        var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
        var pass = "";
        var length = 10;
        for (var x = 0; x < length; x++) {
            var i = Math.floor(Math.random() * chars.length);
            pass += chars.charAt(i);
        }
        return pass;
    }

    $scope.generate = function() {
        $scope.newBookmark.password = randomPassword(myform.length.value);
    }

    $scope.generateEdit = function() {
        $scope.editedBookmark.password = randomPassword(myform.length.value);
    }

    // ----------------------------------------------------
    // CRUD
    // ----------------------------------------------------

    function resetCreateForm() {
        $scope.newBookmark = {
            title: '',
            url: '',
            host: '',
            user: '',
            password: '',
            category: $scope.currentCategory.name
        }
    }

    // ---------------------------------------------

    function createBookmark(bookmark) {
        bookmark.id = $scope.bookmarks.length;

        //localStorage.setItem( 'item' + bookmark.id, JSON.stringify(bookmark)) ;

        firebase.database().ref('bookmarks/' + bookmark.id).set({
            id: bookmark.id,
            title: $scope.newBookmark.title,
            url: $scope.newBookmark.url,
            host: $scope.newBookmark.host,
            user: $scope.newBookmark.user,
            password: $scope.newBookmark.password
        });

        $scope.bookmarks.push(bookmark);

        resetCreateForm();
        $scope.isCreating = false;
    }

    $scope.createBookmark = createBookmark;

    // ---------------------------------------------

    $scope.editedBookmark = null;

    function setEditedBookmark(bookmark) {
        $scope.editedBookmark = angular.copy(bookmark);
    }

    // ---------------------------------------------

    function updateBookmark(bookmark) {
        var index = _.findIndex($scope.bookmarks, function (b) {
            return b.id == bookmark.id;
        });

        localStorage.setItem( 'item' + bookmark.id, JSON.stringify(bookmark) );

        $scope.bookmarks[index] = bookmark;

        firebase.database().ref('bookmarks/' + bookmark.id).update({
            id: bookmark.id,
            title: $scope.editedBookmark.title,
            url: $scope.editedBookmark.url,
            host: $scope.editedBookmark.host,
            user: $scope.editedBookmark.user,
            password: $scope.editedBookmark.password
        });

        $scope.editedBookmark = null;
        $scope.isEditing = false;
    }

    // ---------------------------------------------

    function isSelectedBookmark(bookmarkId) {
        return $scope.editedBookmark !== null && $scope.editedBookmark.id === bookmarkId;
    }

    $scope.setEditedBookmark = setEditedBookmark;
    $scope.updateBookmark = updateBookmark;
    $scope.isSelectedBookmark = isSelectedBookmark;

    // ---------------------------------------------

    function deleteBookmark(bookmark, item) {
        var index = _.findIndex($scope.bookmarks, function (b) {
            return b.id == bookmark.id;
            });

        localStorage.removeItem( 'item' + bookmark.id );
        // Remove item from the contacts array
        $scope.bookmarks.splice( index, 1 );

        $scope.bookmarks[index] = bookmark;

        firebase.database().ref('bookmarks/' + bookmark.id).remove();

        _.remove($scope.bookmarks, function(b) {
            return b.id == bookmark.id;
        });
    }

    $scope.onItemDelete = function(item) {
        $scope.bookmarks.splice($scope.bookmarks.indexOf(item), 1);
    }

    $scope.deleteBookmark = deleteBookmark;

    // ----------------------------------------------------
    // Creating and editing states.
    // ----------------------------------------------------

    $scope.isCreating = false;
    $scope.isEditing = false;
    $scope.isViewing = false;

    function startCreating() {
        $scope.isCreating = true;
        $scope.isEditing = false;
        $scope.isViewing = false;

        resetCreateForm();
    }

    function cancelCreating() {
        $scope.isCreating = false;
    }

    function startEditing() {
        $scope.isCreating = false;
        $scope.isViewing = false;
        $scope.isEditing = true;
    }

    function startEditing() {
        $scope.isCreating = false;
        $scope.isViewing = false;
        $scope.isEditing = true;
    }

    function startViewing() {
        $scope.isCreating = false;
        $scope.isEditing = false;
        $scope.isViewing = true;
    }

    function cancelEditing() {
        $scope.isEditing = false;
        $scope.editedBookmark = null;
        $scope.isViewing = false;
    }

    function shouldShowCreating() {
        return $scope.currentCategory && !$scope.isEditing && !$scope.isViewing;
    }

    function shouldShowEditing() {
        return $scope.isEditing && !$scope.isCreating && !$scope.isViewing;
    }

    function shouldShowInfo() {
        return $scope.isViewing && !$scope.isEditing && !$scope.isCreating;
    }

    $scope.startCreating = startCreating;
    $scope.cancelCreating = cancelCreating;
    $scope.startEditing = startEditing;
    $scope.cancelEditing = cancelEditing;
    $scope.startViewing = startViewing;
    $scope.shouldShowCreating = shouldShowCreating;
    $scope.shouldShowEditing = shouldShowEditing;
    $scope.shouldShowInfo = shouldShowInfo;

    $scope.bookmarks = []; 

}])
;
