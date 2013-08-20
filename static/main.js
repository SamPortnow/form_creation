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




var Part = function(id, text, width, height, fontSize, isNew) {

    this.id = ko.observable(id);
    this.text = ko.observable(text);
    this.width = ko.observable(width);
    this.height = ko.observable(height);
    this.fontSize = ko.observable(fontSize);
    this.isNew = isNew;

    this.editId = ko.observable(id);
    this.editText = ko.observable(text);
    this.editWidth = ko.observable(width);
    this.editHeight = ko.observable(height);
    this.editFontSize = ko.observable(fontSize);

    //persist edits to real values on accept
    this.accept = function() {
        this.id(this.editId()).
            text(this.editText()).
            width(this.editWidth()).
            height(this.editHeight()).
            fontSize(this.editFontSize());
    }.bind(this);

    //reset to originals on cancel
    this.cancel = function() {
        this.editId(this.id()).
            editText(this.text()).
            editWidth(this.width()).
            editHeight(this.height());
    }.bind(this);
}

var ViewModel = function() {
    var self = this;
    this.partList = ko.observableArray([
    ]);

    this.selectedPart = ko.observable();
    this.editPart = function(PartToEdit) {
        self.selectedPart(PartToEdit);
    };
    this.addPart = function() {
        self.selectedPart(new Part("", "", "", "", "", true));
    },
    this.removePart = function(Part) {
        self.partList.remove(Part);
    },
    this.accept = function() {
        var selected = self.selectedPart();
        selected.accept();

        if (selected.isNew) {
             self.partList.push(new Part(
                 selected.id(), selected.text(), selected.width(), selected.height(), selected.fontSize()));
            $(".part").draggable();

        }

        self.selectedPart("");
    },
    this.cancel = function() {
        self.selectedPart().cancel();
        self.selectedPart("");
    }
};

ko.applyBindings(new ViewModel());

});
