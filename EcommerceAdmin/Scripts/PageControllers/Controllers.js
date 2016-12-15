
var app = angular.module('EcommerceApp');

app.controller('HomeController', function ($scope, $rootScope, $location, $http) {
    $rootScope.nullCustomer = { "Id": -1, "Name": "Merchant Selection" };
    $rootScope.selectedCustomer = $rootScope.nullCustomer;
    $rootScope.customers = [
        { "Id": 1, "Name": "Dunkin Donuts" },
        { "Id": 2, "Name": "Peets" },
        { "Id": 3, "Name": "My Supermarket" },
    ];

    $rootScope.customerSelection = function (customerId) {
        var found = $rootScope.customers.find(function (item) {
            if (item.Id === customerId)
                return item;
        });
        if (found == null) {
            $rootScope.selectedCustomer = $rootScope.nullCustomer;
        } else {
            $rootScope.selectedCustomer = found;
        }
    };

    //check if it is login or not, if not, route to Login
    $location.path("/Login");
});

app.controller('LoginController', function ($scope, $rootScope, $location, $http) {
    if ($rootScope.selectedCustomer.Id === -1) {
        $scope.loginDescription = "Please select Merchant then login";
    } else {
        $scope.loginDescription = "Login to your account";
    }

    $scope.submit = function () {
        if ($rootScope.selectedCustomer.Id === -1) {
            alert('You must select client at the top-left corner!');
            return;
        }

        //authenticate from backend
        if ($scope.userName === 'admin' && $scope.password === 'password') {
            $location.path("/Admin");
        } else {
            alert("login failed");
        }
    }
});

//global JS function
function productModify(name) {
    var modal = angular.element('#modal_product');
    var $scope = modal.scope();
    var selectedProduct = null;
    for (var i = 0; i < $scope.products.length; i++) {
        if ($scope.products[i].Name === name) {
            selectedProduct = $scope.products[i];
            break;
        }
    }
    $scope.$apply(function () {
        $scope.dlgProductTitle = "Modify Product";
        $scope.dlgProduct = selectedProduct;
    });
    modal.modal('show')
};

//global JS function
function productDelete(name) {
    var domTable = $("#prodTable");
    var $scope = angular.element(domTable).scope();
    for (var i = 0; i < $scope.products.length; i++) {
        if ($scope.products[i].Name === name) {
            $scope.$apply(function () {
                $scope.products.splice(i, 1);
                $scope.generateProductTable($scope.products);
            });
            break;
        }
    }
};

app.controller('AdminController', function ($scope, $rootScope, $location, $http, $compile, $filter) {
    $rootScope.disableSelectedMechant = true;
    $scope.dlgProductTitle = "Add Product";
    //get category from backend
    $scope.categories = [
        { "Id": 1, "Name": "Food" },
        { "Id": 2, "Name": "Beverage" },
        { "Id": 3, "Name": "Nutrition" }
    ];

    $scope.categoryChange = function () {
        //get all products in this category from backend
        $scope.products = [];
        $scope.generateProductTable($scope.products);
    };

    $scope.manageCategory = function () {
        $scope.dlgCategories = angular.copy($scope.categories);
    };

    $scope.categoriesExists = function (curName) {
        var found = false;
        for (var i = 0; i < $scope.dlgCategories.length; i++) {
            if ($scope.dlgCategories[i].Name.toLowerCase() === curName) {
                found = true;
                break;
            }
        }
        return found;
    };

    //Category management dialog functions
    $scope.dlgCategoryAdd = function () {
        if ($scope.categoryNameInput == undefined) {
            alert("Input category name!");
        }
        
        var curName = $scope.categoryNameInput.toLowerCase();
        if ($scope.categoriesExists(curName)) {
            alert($scope.categoryNameInput + " exists in the category already!");
            return;
        }
        var newCategory = { "Id": -1, "Name": curName };
        $scope.dlgCategories.push(newCategory);
    };

    $scope.dlgCategoryChange = function () {
        $scope.categoryNameInput = $scope.dlgSelectedCategory.Name;
    };

    $scope.dlgCategoryModify = function () {
        if ($scope.dlgSelectedCategory == null || $scope.dlgSelectedCategory == undefined) {
            alert("Please select the category to modify!");
            return;
        };

        var curName = $scope.categoryNameInput.toLowerCase();
        if ($scope.categoriesExists(curName)) {
            alert($scope.categoryNameInput + " exists in the category already!");
            return;
        }
        $scope.dlgSelectedCategory.Name = $scope.categoryNameInput;
    };

    $scope.dlgCategoryDelete = function () {
        if ($scope.dlgSelectedCategory == null || $scope.dlgSelectedCategory == undefined) {
            alert("Please select the category to delete!");
            return;
        };
        var index = $scope.dlgCategories.indexOf($scope.dlgSelectedCategory);
        $scope.dlgCategories.splice(index, 1);
    };

    $scope.dlgCategorySubmit = function () {
        //post $scope.dlgCategories to backend
        //then reset $scope.categories from BE
        $scope.categories = $scope.dlgCategories;
    };

    //product manage functions
    $scope.manageProducts = function () {
        $scope.dlgProductTitle = "Add Product";
        $scope.dlgProduct = {"Id": -1, "Sizes":["Small", "Medium", "Large"]};
    };

    $scope.dlgProductSubmit = function () {
        //validation
        debugger;
        if ($scope.dlgProductTitle === "Add Product") {
            $scope.products.push($scope.dlgProduct);
        }
        //submit to BE
        //regenerate table
        $scope.generateProductTable($scope.products);
    }

    $scope.generateProductTable = function (products) {
        debugger;
        //get all products in this category from backend
        var element = $('#prodTable');
        var head = '<script type="text/javascript" src="Assets/js/pages/datatables_api.js"></script>\
                <table class="table datatable-selection-single">\
						<thead>\
							<tr>\
				                <th>Name</th>\
				                <th>Description</th>\
				                <th>Size</th>\
				                <th>Price</th>\
				                <th class="text-center">Actions</th>\
				            </tr>\
						</thead>\
						<tbody>';
        var len = products.length;
        var rows = '';
        for (var i = 0; i < len; i++) {
            var row = '<tr id=prod"' + products[i].Id + '">\
				        <td>' + products[i].Name + '</td>\
				        <td>' + products[i].Description + '</td>\
				        <td>' + products[i].Sizes[0] + '</td>\
				        <td>' + products[i].Prices[0] + '</td>\
						<td class="text-center">\
							<ul class="icons-list">\
								<li class="dropdown">\
									<a href="#" class="dropdown-toggle" data-toggle="dropdown">\
										<i class="icon-menu9"></i>\
									</a>\
									<ul class="dropdown-menu dropdown-menu-right">\
										<li><a href="#" onclick="productModify(\''+ products[i].Name + '\')">Modify</a></li>\
										<li><a href="#" onclick="productDelete(\''+ products[i].Name + '\')">Delete</a></li>\
									</ul>\
								</li>\
							</ul>\
						</td>\
				    </tr>';
            rows += row;
        }
        rows += '<tbody></table>';
        var html = head.concat(rows);
        element.html(html);
        $compile(element.contents())(scope);
    };

});

