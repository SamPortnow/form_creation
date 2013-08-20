$(document).ready(function()
{
//custom binding to initialize a jQuery UI dialog
ko.bindingHandlers.dialog = {
    init: function(element, valueAccessor) {
        var options = ko.utils.unwrapObservable(valueAccessor()) || {};

        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).dialog("destroy");
        });

        //dialog is moved to the bottom of the page by jQuery UI. Prevent initial pass of ko.applyBindings from hitting it
        setTimeout(function() {
            $(element).dialog(options);
        }, 0);
    }
};

//custom binding handler that opens/closes the dialog
ko.bindingHandlers.openDialog = {
    update: function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value) {
            $(element).dialog("open");
        } else {
            $(element).dialog("close");
        }
    }
}

//custom binding to initialize a jQuery UI button
ko.bindingHandlers.jqButton = {
    init: function(element, valueAccessor) {
        var options = ko.utils.unwrapObservable(valueAccessor()) || {};

        //handle disposal
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).button("destroy");
        });

        $(element).button(options);
    }
};




var Product = function(id, text, isNew) {
    this.id = ko.observable(id);
    this.text = ko.observable(text);
    this.isNew = isNew;
    this.editId = ko.observable(id);
    this.editText = ko.observable(text);

    //persist edits to real values on accept
    this.accept = function() {
        this.id(this.editId()).text(this.editText());
    }.bind(this);

    //reset to originals on cancel
    this.cancel = function() {
        this.editId(this.id()).editText(this.text());
    }.bind(this);
}

var ViewModel = function() {
    var self = this;
    this.partList = ko.observableArray([
    ]);

    this.selectedProduct = ko.observable();
    this.editProduct = function(productToEdit) {
        self.selectedProduct(productToEdit);
    };
    this.addPart = function() {
        self.selectedProduct(new Product(0, "", true));
    },
    this.removeProduct = function(product) {
        self.partList.remove(product);
    },
    this.accept = function() {
        var selected = self.selectedProduct();
        selected.accept();

        if (selected.isNew) {
             self.partList.push(new Product(
                 selected.id(), selected.text()));
            $(".part").draggable();

        }

        self.selectedProduct("");
    },
    this.cancel = function() {
        self.selectedProduct().cancel();
        self.selectedProduct("");
    }
};

ko.applyBindings(new ViewModel());

});
