angular.module('myApp', [

])

.controller('MainCtrl', function($scope) {
    $scope.categories = [
      {"id": 0, "name": "Development"},
      {"id": 1, "name": "Social Networks"},
      {"id": 2, "name": "Educational"},
      {"id": 3, "name": "Humor"}
    ];

    $scope.bookmarks = [
        {"id": 0, "title": "Portfolio", "url": "http://kacpermyslinski.com", "category": "Development" },
        {"id": 1, "title": "LinkedIn", "url": "https://www.linkedin.com/in/kacpermyslinski", "category": "Social Networks" },
        {"id": 2, "title": "Facebook", "url": "https://www.facebook.com/kacper.myslinski", "category": "Social Networks" },
        {"id": 3, "title": "Mozilla Developer Network", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript", "category": "Educational" },
        {"id": 4, "title": "Imugr", "url": "http://imgur.com/", "category": "Humor" },
        {"id": 5, "title": "Quora", "url": "https://www.quora.com/", "category": "Social Networks" },
        {"id": 6, "title": "AngularJS Docs", "url": "https://docs.angularjs.org/guide", "category": "Educational" },
        {"id": 7, "title": "xkcd", "url": "http://xkcd.com/303/", "category": "Humor" }
    ];

    $scope.currentCategory = null;

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

    // ----------------------------------------------------
    // CRUD
    // ----------------------------------------------------

    function resetCreateForm() {
        $scope.newBookmark = {
            title: '',
            url: '',
            category: $scope.currentCategory.name
        }
    }

    function createBookmark(bookmark) {
        bookmark.id = $scope.bookmarks.length;
        $scope.bookmarks.push(bookmark);

        resetCreateForm();
    }

    $scope.createBookmark = createBookmark;

    $scope.editedBookmark = null;

    function setEditedBookmark(bookmark) {
        $scope.editedBookmark = angular.copy(bookmark);
    }

    function updateBookmark(bookmark) {
        var index = _.findIndex($scope.bookmarks, function (b) {
            return b.id == bookmark.id;
        });
        $scope.bookmarks[index] = bookmark;

        $scope.editedBookmark = null;
        $scope.isEditing = false;
    }

    function isSelectedBookmark(bookmarkId) {
        return $scope.editedBookmark !== null && $scope.editedBookmark.id === bookmarkId;
    }

    $scope.setEditedBookmark = setEditedBookmark;
    $scope.updateBookmark = updateBookmark;
    $scope.isSelectedBookmark = isSelectedBookmark;

    function deleteBookmark(bookmark) {
        _.remove($scope.bookmarks, function(b) {
            return b.id == bookmark.id;
        });
    }

    $scope.deleteBookmark = deleteBookmark;

    // ----------------------------------------------------
    // Creating and editing states.
    // ----------------------------------------------------

    $scope.isCreating = false;
    $scope.isEditing = false;

    function startCreating() {
        $scope.isCreating = true;
        $scope.isEditing = false;

        resetCreateForm();
    }

    function cancelCreating() {
        $scope.isCreating = false;
    }

    function startEditing() {
        $scope.isCreating = false;
        $scope.isEditing = true;
    }

    function cancelEditing() {
        $scope.isEditing = false;
        $scope.editedBookmark = null;
    }

    function shouldShowCreating() {
        return $scope.currentCategory && !$scope.isEditing;
    }

    function shouldShowEditing() {
        return $scope.isEditing && !$scope.isCreating;
    }

    $scope.startCreating = startCreating;
    $scope.cancelCreating = cancelCreating;
    $scope.startEditing = startEditing;
    $scope.cancelEditing = cancelEditing;
    $scope.shouldShowCreating = shouldShowCreating;
    $scope.shouldShowEditing = shouldShowEditing;
})
;